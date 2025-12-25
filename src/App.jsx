import { useState, useEffect } from "react";
import "./styles/App.css";
import Cursor from "./components/Cursor";
import SettingsModal from "./components/SettingsModal";
import StorySelector from "./components/StorySelector";
import LoadingScreen from "./components/LoadingScreen";
import ErrorScreen from "./components/ErrorScreen";
import GameScreen from "./components/GameScreen";
import GameOver from "./components/GameOver";
import StoryIntro from "./components/StoryIntro";
import BlinkTransition from "./components/BlinkTransition";
import Login from "./components/Login";
import { useSpaceStory } from "./hooks/useSpaceStory";
import { useScreenTransition } from "./hooks/useScreenTransition";
import { useBlinkTransition } from "./hooks/useBlinkTransition";
import { useAuth } from "./hooks/useAuth";
import audio from "./utils/audioManager";

export default function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user, isLoggedIn, logout, isLoading: authLoading } = useAuth();
  const { screenState, selectStory, showIntro, showGameScreen, reset } = useScreenTransition();
  const { blinkState, handlers } = useBlinkTransition({
    onFirstMidpoint: () => {
      showIntro();
    },
    onSecondMidpoint: showGameScreen
  });
  const spaceStory = useSpaceStory(screenState.selectedStory);

  const handleStorySelect = (story) => {
    selectStory(story);
    handlers.startFirstBlink();
  };

  const handleRestart = () => {
    spaceStory.resetStory();
    reset();
  };

  useEffect(() => {
    if (screenState.selectedStory) {
      audio.changeStory(screenState.selectedStory.id);
    }
  }, [screenState.selectedStory]);

  useEffect(() => {
    if (screenState.selectedStory && !spaceStory.currentScene && !spaceStory.isLoading) {
      spaceStory.startNewStory();
    }
  }, [screenState.selectedStory, spaceStory.currentScene, spaceStory.isLoading, spaceStory]);

  if (authLoading) {
    return (
      <div className="auth-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <Cursor />
        <Login />
      </>
    );
  }

  if (screenState.selectedStory && (spaceStory.isLoading && !spaceStory.currentScene)) {
    return <LoadingScreen />;
  }

  if (spaceStory.error) {
    return <ErrorScreen error={spaceStory.error} onRetry={reset} />;
  }

  if (screenState.selectedStory && spaceStory.currentOxygen === 0) {
    return <GameOver onRestart={handleRestart} />;
  }

  return (
    <>
      <Cursor />
      <div className="rotate-device-overlay">
        <div className="rotate-icon">📱</div>
        <p>Oyunu oynamak için lütfen telefonunuzu yatay konuma çevirin</p>
      </div>
      <div style={{ display: screenState.showSelector ? 'block' : 'none' }}>
        <StorySelector onSelectStory={handleStorySelect} />
      </div>
      {screenState.selectedStory && spaceStory.currentScene && (
        <div style={{ display: screenState.showIntro ? 'block' : 'none' }}>
          <StoryIntro
            scene={spaceStory.currentScene}
            selectedStory={screenState.selectedStory}
          />
        </div>
      )}
      {screenState.selectedStory && spaceStory.currentScene && (
        <div style={{ display: screenState.showGame ? 'block' : 'none' }}>
          <GameScreen
            scene={spaceStory.currentScene}
            isLoading={spaceStory.isLoading}
            selectedStory={screenState.selectedStory}
            onSettingsClick={() => setIsSettingsOpen(true)}
            onChoiceSelect={spaceStory.makeChoice}
            currentOxygen={spaceStory.currentOxygen}
            introScene={spaceStory.introScene}
            showChoices={spaceStory.showChoices}
            showNarrative={spaceStory.showNarrative}
            currentNarrative={spaceStory.currentNarrative}
            onNarrativeComplete={spaceStory.completeNarrative}
            storyHistory={spaceStory.storyHistory}
          />
        </div>
      )}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onLogout={logout}
      />
      {blinkState.showFirstBlink && (
        <BlinkTransition
          key="first-blink"
          onMidpoint={handlers.onFirstMidpoint}
          onComplete={handlers.onFirstComplete}
          speed="normal"
        />
      )}
      {blinkState.showSecondBlink && (
        <BlinkTransition
          key="second-blink"
          onMidpoint={handlers.onSecondMidpoint}
          onComplete={handlers.onSecondComplete}
          speed="normal"
        />
      )}
    </>
  );
}

