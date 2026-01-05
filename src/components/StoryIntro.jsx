import { useEffect, useState } from 'react';
import '../styles/StoryIntro.css';

export default function StoryIntro({ scene, selectedStory, onContinue }) {
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        setTimeout(() => setFadeIn(true), 100);
    }, []);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                if (onContinue) {
                    onContinue();
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [onContinue]);

    const appStyle = selectedStory?.backgroundImg
        ? {
            backgroundImage: `url(${selectedStory.backgroundImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
        }
        : {};

    return (
        <div className="story-intro-container" style={appStyle}>
            <div className={`story-intro-content ${fadeIn ? 'fade-in' : ''}`}>
                <h1 className="story-intro-title">{scene.name}</h1>
                <p className="story-intro-description">{scene.description}</p>
                {scene.narrative && (
                    <p className="story-intro-narrative">{scene.narrative}</p>
                )}
                <div className="story-intro-hint">
                    <span>Devam etmek için SPACE veya ENTER tuşuna basın</span>
                </div>
            </div>
        </div>
    );
}