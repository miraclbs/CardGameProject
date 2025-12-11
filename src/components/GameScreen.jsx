import { useState } from "react";
import Cursor from "./Cursor";
import SettingsButton from "./SettingsButton";
import ChoiceCard from "./ChoiceCard";
import StoryModal from "./StoryModal";
import NarrativeScreen from "./NarrativeScreen";

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
    onNarrativeComplete
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

    const storyButtonStyle = {
        position: 'fixed',
        top: '20px',
        left: '20px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: 'rgba(26, 26, 46, 0.8)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        fontSize: '1.5rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    return (
        <>
            <Cursor />
            <div className="app" style={appStyle}>
                <button
                    style={storyButtonStyle}
                    onClick={() => setIsStoryModalOpen(true)}
                    title="Başlangıç Hikayesi"
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.backgroundColor = 'rgba(26, 26, 46, 0.95)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.backgroundColor = 'rgba(26, 26, 46, 0.8)';
                    }}
                >
                    📖
                </button>
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
                storyContent={introScene}
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
