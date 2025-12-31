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
import { useWizardStory } from "./hooks/useWizardStory";
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
  const wizardStory = useWizardStory(screenState.selectedStory);

  useEffect(() => {
    const requestFullscreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => { });
      }
      document.removeEventListener('click', requestFullscreen);
    };
    document.addEventListener('click', requestFullscreen);
    return () => document.removeEventListener('click', requestFullscreen);
  }, []);

  // Select the appropriate story hook based on selected story type
  const activeStory = screenState.selectedStory?.id === 'wizard' ? wizardStory : spaceStory;

  const handleStorySelect = (story) => {
    selectStory(story);
    handlers.startFirstBlink();
  };

  const handleRestart = () => {
    activeStory.resetStory();
    reset();
  };

  const handleBackToMenu = () => {
    activeStory.resetStory();
    reset();
  };

  const handleLogout = () => {
    activeStory.resetStory();
    reset();
    logout();
  };

  useEffect(() => {
    if (screenState.selectedStory) {
      audio.changeStory(screenState.selectedStory.id);
    }
  }, [screenState.selectedStory]);

  useEffect(() => {
    if (screenState.selectedStory && !activeStory.currentScene && !activeStory.isLoading) {
      activeStory.startNewStory();
    }
  }, [screenState.selectedStory, activeStory.currentScene, activeStory.isLoading, activeStory]);

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

  if (screenState.selectedStory && (activeStory.isLoading && !activeStory.currentScene)) {
    return <LoadingScreen />;
  }

  if (activeStory.error) {
    return <ErrorScreen error={activeStory.error} onRetry={reset} />;
  }

  // Game over check for space (oxygen=0)
  const isSpaceGameOver = screenState.selectedStory?.id === 'space' && activeStory.currentOxygen === 0;

  if (screenState.selectedStory && isSpaceGameOver) {
    return <GameOver onRestart={handleRestart} onBackToMenu={handleBackToMenu} />;
  }

  return (
    <>
      <Cursor />
      <div className="rotate-device-overlay">
        <div className="rotate-icon">📱</div>
        <p>Oyunu oynamak için lütfen telefonunuzu yatay konuma çevirin</p>
      </div>
      <div style={{ display: screenState.showSelector ? 'block' : 'none' }}>
        <StorySelector onSelectStory={handleStorySelect} user={user} onLogout={handleLogout} />
      </div>
      {screenState.selectedStory && activeStory.currentScene && (
        <div style={{ display: screenState.showIntro ? 'block' : 'none' }}>
          <StoryIntro
            scene={activeStory.currentScene}
            selectedStory={screenState.selectedStory}
          />
        </div>
      )}
      {screenState.selectedStory && activeStory.currentScene && (
        <div style={{ display: screenState.showGame ? 'block' : 'none' }}>
          <GameScreen
            scene={activeStory.currentScene}
            isLoading={activeStory.isLoading}
            selectedStory={screenState.selectedStory}
            onSettingsClick={() => setIsSettingsOpen(true)}
            onChoiceSelect={activeStory.makeChoice}
            onActionSubmit={activeStory.submitAction}
            onBackToMenu={handleBackToMenu}
            currentOxygen={activeStory.currentOxygen}
            currentProgress={activeStory.currentProgress}
            maxProgress={activeStory.maxProgress}
            currentQuest={activeStory.currentQuest}
            introScene={activeStory.introScene}
            showChoices={activeStory.showChoices}
            showInput={activeStory.showInput}
            showNarrative={activeStory.showNarrative}
            currentNarrative={activeStory.currentNarrative}
            onNarrativeComplete={activeStory.completeNarrative}
            storyHistory={activeStory.storyHistory}
          />
        </div>
      )}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onLogout={handleLogout}
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

