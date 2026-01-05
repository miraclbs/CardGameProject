import { useState } from "react";
import Cursor from "./Cursor";
import SettingsButton from "./SettingsButton";
import ChoiceCard from "./ChoiceCard";
import FreeInputCard from "./FreeInputCard";
import StoryModal from "./StoryModal";
import NarrativeScreen from "./NarrativeScreen";
import "../styles/StoryButton.css";

export default function GameScreen({
    scene,
    isLoading,
    selectedStory,
    onSettingsClick,
    onChoiceSelect,
    onActionSubmit,
    onBackToMenu,
    currentOxygen,
    currentProgress,
    maxProgress,
    currentQuest,
    introScene,
    showChoices = true,
    showInput = false,
    showNarrative = false,
    currentNarrative = "",
    onNarrativeComplete,
    storyHistory = []
}) {
    const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
    const appStyle = selectedStory?.backgroundImg
        ? {
            backgroundImage: `url(${selectedStory.backgroundImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
        }
        : {};

    const isWizard = selectedStory?.id === 'wizard';
    const isSpace = selectedStory?.id === 'space';

    return (
        <>
            <Cursor />
            <div className="app" style={appStyle}>
                <div className="top-left-buttons">
                    <img
                        src="/img/home.png"
                        alt="Ana Menü"
                        className="menu-icon"
                        onClick={onBackToMenu}
                        title="Ana Menüye Dön"
                    />
                    <img
                        src="/img/story.png"
                        alt="Hikaye Özeti"
                        className="menu-icon"
                        onClick={() => setIsStoryModalOpen(true)}
                        title="Hikaye Özeti"
                    />
                </div>
                <SettingsButton onSettingsClick={onSettingsClick} />

                {/* Space: Oxygen Tank */}
                {isSpace && currentOxygen !== null && (
                    <div className="oxygen-tank-container">
                        <div className="oxygen-tank">
                            <div
                                className="oxygen-fill"
                                style={{
                                    height: `${currentOxygen}%`
                                }}
                            />
                            <span className="oxygen-percentage">%{currentOxygen}</span>
                        </div>
                    </div>
                )}

                {/* Wizard: Quest Progress Bar */}
                {isWizard && currentProgress !== undefined && maxProgress && (
                    <div className="quest-progress-container">
                        <div className="quest-info">
                            <span className="quest-icon">⚔️</span>
                            <span className="quest-text">{currentQuest}</span>
                        </div>
                        <div className="quest-progress-bar">
                            <div
                                className="quest-progress-fill"
                                style={{ width: `${(currentProgress / maxProgress) * 100}%` }}
                            />
                            <span className="quest-progress-text">{currentProgress}/{maxProgress}</span>
                        </div>
                    </div>
                )}

                <div className={`story-info ${isLoading ? 'hidden' : ''}`}>
                    <h1>{scene.name}</h1>
                    <p className="description">{scene.description}</p>
                </div>

                {/* Space: Choice Cards */}
                {isSpace && (
                    <div className={`card-wrapper ${showChoices ? 'show' : 'hide-cards'}`}>
                        {showChoices && scene.choices && scene.choices.map((choice, index) => (
                            <ChoiceCard
                                key={index}
                                text={choice.text}
                                impact={choice.impact}
                                onSelect={() => onChoiceSelect(choice.text)}
                                isLoading={isLoading}
                                cardImage={selectedStory?.img}
                            />
                        ))}
                    </div>
                )}

                {/* Wizard: Free Input Card */}
                {isWizard && showInput && !scene.isEnding && (
                    <div className="input-wrapper">
                        <FreeInputCard
                            onSubmit={onActionSubmit}
                            isLoading={isLoading}
                            hint={scene.hint}
                        />
                    </div>
                )}

                {/* Wizard: Ending Screen */}
                {isWizard && scene.isEnding && (
                    <div className="ending-message">
                        <span className="ending-icon">{scene.victory ? '🏆' : '💀'}</span>
                    </div>
                )}
            </div>
            <StoryModal
                isOpen={isStoryModalOpen}
                onClose={() => setIsStoryModalOpen(false)}
                introScene={introScene}
                storyHistory={storyHistory}
                currentScene={scene}
            />
            {showNarrative && (
                <NarrativeScreen
                    narrative={currentNarrative}
                    onComplete={onNarrativeComplete}
                    isLoading={isLoading}
                />
            )}
        </>
    );
}
