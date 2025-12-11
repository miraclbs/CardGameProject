import { useEffect, useState } from "react";
import "../styles/StorySelector.css";
import { getAllLevels } from "../levels";
import ChoiceCard from "./ChoiceCard";
import SettingsButton from "./SettingsButton";
import SettingsModal from "./SettingsModal";
import audio from "../utils/audioManager";

export default function StorySelector({ onSelectStory }) {
    const [stories, setStories] = useState([]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        const levels = getAllLevels();
        setStories(levels);
    }, []);

    const handleSelectStory = (story) => {
        if (story.locked) {
            audio.playLockedCardSound();
            return;
        }
        audio.playCardSound();
        onSelectStory(story);
    };

    return (
        <div className="story-selector-container">
            <SettingsButton onSettingsClick={() => setIsSettingsOpen(true)} />
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            <div className="story-selector-content">
                <h1 className="story-selector-title">Bir Macera Seç</h1>
                <p className="story-selector-subtitle">
                    Hangi hikayeyi deneyimlemek istiyorsun?
                </p>

                <div className="stories-grid">
                    {stories.map((story) => (
                        <div
                            key={story.id}
                            className="story-card-wrapper no-scale"
                            style={story.locked ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                        >
                            <ChoiceCard
                                text={story.name}
                                impact={story.description}
                                onSelect={() => handleSelectStory(story)}
                                isLoading={story.locked}
                                cardImage={story.locked ? story.lockedImg : story.img}
                                lockImage={story.lockedImg}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
