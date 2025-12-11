import { useState, useCallback } from "react";
import { generateNextScene } from "../utils/deepseekAPI";
import {
    SPACE_INTRO_SCENE,
    SPACE_GAME_OVER_SCENE,
    buildSpaceSystemPrompt,
    buildSpaceUserPrompt,
    calculateOxygenChange,
    isGameOver,
    createHistoryEntry,
    validateSpaceScene
} from "../utils/spaceStoryManager";

export function useSpaceStory(story) {
    const [currentScene, setCurrentScene] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentOxygen, setCurrentOxygen] = useState(SPACE_INTRO_SCENE.oxygen);
    const [storyHistory, setStoryHistory] = useState([]);
    const [introScene, setIntroScene] = useState(null);
    const [showChoices, setShowChoices] = useState(false);
    const [showNarrative, setShowNarrative] = useState(false);
    const [currentNarrative, setCurrentNarrative] = useState("");
    const [nextSceneData, setNextSceneData] = useState(null);

    const makeChoice = async (choiceText) => {
        setIsLoading(true);
        setError(null);
        setShowChoices(false);

        try {
            const oxygenBefore = currentOxygen;

            // Find selected choice to get all its data
            const selectedChoice = currentScene.choices.find(c => c.text === choiceText);
            if (!selectedChoice) {
                throw new Error("Secim bulunamadi");
            }

            const oxygenChange = selectedChoice.oxygenChange || 0;

            // Show result narrative first
            setCurrentNarrative(selectedChoice.resultNarrative);
            setShowNarrative(true);

            // Calculate new oxygen
            const newOxygen = calculateOxygenChange(currentOxygen, oxygenChange);

            // Check for game over
            if (isGameOver(newOxygen)) {
                setCurrentOxygen(0);

                // Add to history
                const historyEntry = createHistoryEntry(currentScene, selectedChoice, oxygenBefore, 0);
                setStoryHistory([...storyHistory, historyEntry]);

                // After narrative, show game over
                setTimeout(() => {
                    setShowNarrative(false);
                    setCurrentScene(SPACE_GAME_OVER_SCENE);
                    setIsLoading(false);
                }, 5000);
                return;
            }

            // Generate next scene from AI (in background while showing narrative)
            const systemPrompt = buildSpaceSystemPrompt();
            const userPrompt = buildSpaceUserPrompt(selectedChoice, newOxygen, storyHistory);

            const nextScene = await generateNextScene(
                storyHistory,
                choiceText,
                { ...story, id: 'space', systemPrompt, userPrompt },
                newOxygen,
                null
            );

            // Validate scene has all required fields
            if (!validateSpaceScene(nextScene)) {
                throw new Error("AI yaniti eksik alanlar iceriyor");
            }

            // Store next scene data
            setNextSceneData({ scene: nextScene, oxygen: newOxygen });

            // Add to history
            const historyEntry = createHistoryEntry(currentScene, selectedChoice, oxygenBefore, newOxygen);
            setStoryHistory([...storyHistory, historyEntry]);

            // AI isteği tamamlandı, loading'i kapat
            setIsLoading(false);

        } catch (err) {
            setError(err.message);
            setShowNarrative(false);
            setIsLoading(false);
        }
    };

    const completeNarrative = useCallback(() => {
        setShowNarrative(false);

        if (nextSceneData) {
            setCurrentOxygen(nextSceneData.oxygen);
            setCurrentScene(nextSceneData.scene);
            setNextSceneData(null);
            setShowChoices(true);
        }

        setIsLoading(false);
    }, [nextSceneData, showNarrative]);

    const startNewStory = async () => {
        setIsLoading(true);
        setError(null);

        try {
            setIntroScene(SPACE_INTRO_SCENE);
            setCurrentScene(SPACE_INTRO_SCENE);
            setCurrentOxygen(SPACE_INTRO_SCENE.oxygen);
            setStoryHistory([]);
            setShowChoices(true); // Kartları hemen göster (ikinci göz kırpmadan sonra görünecek)
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }

        setIsLoading(false);
    };

    // Tüm state'i sıfırla (Game Over'dan restart için)
    const resetStory = () => {
        setCurrentScene(null);
        setCurrentOxygen(SPACE_INTRO_SCENE.oxygen);
        setStoryHistory([]);
        setIntroScene(null);
        setShowChoices(false);
        setShowNarrative(false);
        setCurrentNarrative("");
        setNextSceneData(null);
        setIsLoading(false);
        setError(null);
    };

    return {
        currentScene,
        isLoading,
        error,
        makeChoice,
        startNewStory,
        resetStory,
        currentOxygen,
        storyHistory,
        introScene,
        showChoices,
        showNarrative,
        currentNarrative,
        completeNarrative
    };
}
