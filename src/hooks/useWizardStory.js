import { useState, useCallback } from "react";
import { generateNextScene } from "../utils/openaiAPI";
import {
    WIZARD_INTRO_SCENE,
    WIZARD_VICTORY_SCENE,
    WIZARD_DEFEAT_SCENE,
    buildWizardSystemPrompt,
    buildWizardUserPrompt,
    calculateProgress,
    isVictory,
    isDefeat,
    createWizardHistoryEntry,
    validateWizardResponse
} from "../utils/wizardStoryManager";

export function useWizardStory(story) {
    const [currentScene, setCurrentScene] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentProgress, setCurrentProgress] = useState(0);
    const [maxProgress] = useState(WIZARD_INTRO_SCENE.maxProgress || 10);
    const [storyHistory, setStoryHistory] = useState([]);
    const [introScene, setIntroScene] = useState(null);
    const [showInput, setShowInput] = useState(true);
    const [currentNarrative, setCurrentNarrative] = useState("");
    const [showNarrative, setShowNarrative] = useState(false);
    const [currentQuest] = useState(WIZARD_INTRO_SCENE.quest);

    const submitAction = async (playerAction) => {
        if (!playerAction || playerAction.trim() === "") {
            return;
        }

        setIsLoading(true);
        setError(null);
        setShowInput(false);

        try {
            const progressBefore = currentProgress;

            const systemPrompt = buildWizardSystemPrompt(currentProgress, maxProgress);
            const userPrompt = buildWizardUserPrompt(playerAction, storyHistory);

            const response = await generateNextScene(
                storyHistory,
                playerAction,
                { ...story, id: 'wizard', systemPrompt, userPrompt },
                currentProgress,
                null
            );

            if (!validateWizardResponse(response)) {
                throw new Error("AI yanıtı geçersiz format içeriyor");
            }

            const newProgress = calculateProgress(currentProgress, response.progress);

            setCurrentNarrative(response.narrative);
            setShowNarrative(true);

            if (isVictory(newProgress, maxProgress)) {
                const historyEntry = createWizardHistoryEntry(
                    playerAction, response.narrative, progressBefore, maxProgress
                );
                setStoryHistory([...storyHistory, historyEntry]);
                setCurrentProgress(maxProgress);

                setTimeout(() => {
                    setShowNarrative(false);
                    setCurrentScene(WIZARD_VICTORY_SCENE);
                    setShowInput(false);
                    setIsLoading(false);
                }, 4000);
                return;
            }

            if (isDefeat(newProgress)) {
                const historyEntry = createWizardHistoryEntry(
                    playerAction, response.narrative, progressBefore, 0
                );
                setStoryHistory([...storyHistory, historyEntry]);
                setCurrentProgress(0);

                setTimeout(() => {
                    setShowNarrative(false);
                    setCurrentScene(WIZARD_DEFEAT_SCENE);
                    setShowInput(false);
                    setIsLoading(false);
                }, 4000);
                return;
            }

            const historyEntry = createWizardHistoryEntry(
                playerAction, response.narrative, progressBefore, newProgress
            );
            setStoryHistory([...storyHistory, historyEntry]);
            setCurrentProgress(newProgress);

            const newScene = {
                ...currentScene,
                name: currentScene.name,
                description: response.situation,
                narrative: response.narrative,
                hint: response.hint || null
            };

            setTimeout(() => {
                setShowNarrative(false);
                setCurrentScene(newScene);
                setShowInput(true);
                setIsLoading(false);
            }, 3000);

        } catch (err) {
            setError(err.message);
            setShowNarrative(false);
            setShowInput(true);
            setIsLoading(false);
        }
    };

    const completeNarrative = useCallback(() => {
        setShowNarrative(false);
        setShowInput(true);
        setIsLoading(false);
    }, []);

    const startNewStory = async () => {
        setIsLoading(true);
        setError(null);

        try {
            setIntroScene(WIZARD_INTRO_SCENE);
            setCurrentScene(WIZARD_INTRO_SCENE);
            setCurrentProgress(WIZARD_INTRO_SCENE.progress || 0);
            setStoryHistory([]);
            setShowInput(true);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }

        setIsLoading(false);
    };

    const resetStory = () => {
        setCurrentScene(null);
        setCurrentProgress(0);
        setStoryHistory([]);
        setIntroScene(null);
        setShowInput(true);
        setShowNarrative(false);
        setCurrentNarrative("");
        setIsLoading(false);
        setError(null);
    };

    return {
        currentScene,
        isLoading,
        error,
        submitAction,
        startNewStory,
        resetStory,
        currentProgress,
        maxProgress,
        currentQuest,
        storyHistory,
        introScene,
        showInput,
        showNarrative,
        currentNarrative,
        completeNarrative,
        showChoices: showInput,
        makeChoice: submitAction,
        currentOxygen: null,
        currentAge: null,
        currentHealth: null
    };
}
