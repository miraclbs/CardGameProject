import { useCardTilt } from "../hooks/useCardTilt";
import { useEffect } from "react";
import "../styles/ChoiceCard.css";
import audio from "../utils/audioManager";

export default function ChoiceCard({
    text,
    impact,
    onSelect,
    isLoading = false,
    cardImage = null
}) {
    const { wrapperEl, labelEl, cardEl, onMove, onExit } = useCardTilt();

    useEffect(() => {
        if (isLoading) {
            audio.playLockedCardSound();
            onExit();
        }
    }, [isLoading]);

    const handleClick = () => {
        if (isLoading) return;

        audio.playCardSound();
        onExit();
        onSelect();
    };

    return (
        <div
            className="card-container"
            onClick={handleClick}
            onMouseMove={onMove}
            onMouseLeave={onExit}
        >
            <div className="card-tilt" ref={wrapperEl}>
                <div className="card" ref={cardEl}>
                    <img src={cardImage} alt="card" className="card-image" />

                    {!isLoading && (
                        <div className="card-text" ref={labelEl}>
                            <span className="choice-text">{text}</span>
                            {impact && <span className="choice-impact">{impact}</span>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
