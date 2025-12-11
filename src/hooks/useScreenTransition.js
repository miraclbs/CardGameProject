import { useState } from 'react';

export function useScreenTransition() {
    const [selectedStory, setSelectedStory] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showStoryIntro, setShowStoryIntro] = useState(false);
    const [showGame, setShowGame] = useState(false);

    const selectStory = (story) => {
        setIsTransitioning(story);
    };

    const showIntro = () => {
        setSelectedStory(isTransitioning);
        setShowStoryIntro(true);
        setIsTransitioning(false);
    };

    const showGameScreen = () => {
        setShowStoryIntro(false);
        setShowGame(true);
    };

    const reset = () => {
        setSelectedStory(null);
        setShowStoryIntro(false);
        setShowGame(false);
        setIsTransitioning(false);
    };

    const screenState = {
        selectedStory,
        showSelector: !selectedStory && !showStoryIntro,
        showIntro: showStoryIntro && !showGame,
        showGame: showGame,
    };

    return {
        screenState,
        selectStory,
        showIntro,
        showGameScreen,
        reset,
    };
}
