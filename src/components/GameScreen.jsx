import { useState } from "react";
import Cursor from "./Cursor";
import SettingsButton from "./SettingsButton";
import ChoiceCard from "./ChoiceCard";
import StoryModal from "./StoryModal";
import NarrativeScreen from "./NarrativeScreen";
import "../styles/StoryButton.css";

export default function GameScreen({
    scene,
    isLoading,
    selectedStory,
    onSettingsClick,
    onChoiceSelect,
    currentOxygen,
    introScene,
    showChoices = true,
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

    return (
        <>
            <Cursor />
            <div className="app" style={appStyle}>
                <div className="top-left-buttons">
                    <button
                        className="story-button"
                        onClick={() => setIsStoryModalOpen(true)}
                        title="Hikaye Özeti"
                    >
                        📖
                    </button>
                </div>
                <SettingsButton onSettingsClick={onSettingsClick} />
                {selectedStory?.id === 'space' && currentOxygen !== null && (
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

                <div className={`story-info ${isLoading ? 'hidden' : ''}`}>
                    <h1>{scene.name}</h1>
                    <p className="description">{scene.description}</p>
                    {scene.narrative && <p className="narrative">{scene.narrative}</p>}
                </div>

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
