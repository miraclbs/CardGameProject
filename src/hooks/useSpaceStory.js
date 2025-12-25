import { useState, useCallback } from "react";
import { generateNextScene } from "../utils/openaiAPI";
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

            const selectedChoice = currentScene.choices.find(c => c.text === choiceText);
            if (!selectedChoice) {
                throw new Error("Secim bulunamadi");
            }

            const oxygenChange = selectedChoice.oxygenChange || 0;

            setCurrentNarrative(selectedChoice.resultNarrative);
            setShowNarrative(true);

            const newOxygen = calculateOxygenChange(currentOxygen, oxygenChange);

            if (isGameOver(newOxygen)) {
                setCurrentOxygen(0);

                const historyEntry = createHistoryEntry(currentScene, selectedChoice, oxygenBefore, 0);
                setStoryHistory([...storyHistory, historyEntry]);

                setTimeout(() => {
                    setShowNarrative(false);
                    setCurrentScene(SPACE_GAME_OVER_SCENE);
                    setIsLoading(false);
                }, 5000);
                return;
            }

            const systemPrompt = buildSpaceSystemPrompt();
            const userPrompt = buildSpaceUserPrompt(selectedChoice, newOxygen, storyHistory);

            const nextScene = await generateNextScene(
                storyHistory,
                choiceText,
                { ...story, id: 'space', systemPrompt, userPrompt },
                newOxygen,
                null
            );

            if (!validateSpaceScene(nextScene)) {
                throw new Error("AI yaniti eksik alanlar iceriyor");
            }

            setNextSceneData({ scene: nextScene, oxygen: newOxygen });

            const historyEntry = createHistoryEntry(currentScene, selectedChoice, oxygenBefore, newOxygen);
            setStoryHistory([...storyHistory, historyEntry]);

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
            setShowChoices(true);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }

        setIsLoading(false);
    };

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
