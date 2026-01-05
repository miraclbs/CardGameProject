import { useState } from "react";
import { useCardTilt } from "../hooks/useCardTilt";
import audio from "../utils/audioManager";
import "../styles/FreeInputCard.css";

export default function FreeInputCard({ onSubmit, isLoading, hint }) {
    const [inputText, setInputText] = useState("");
    const { wrapperEl, cardEl, onMove, onExit } = useCardTilt();

    const handleSubmit = () => {
        if (inputText.trim() && !isLoading) {
            audio.play("card");
            onSubmit(inputText.trim());
            setInputText("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="input-card-wrapper">
            <div className="card-container input-card-container" onMouseMove={onMove} onMouseLeave={onExit}>
                <div className="card-tilt" ref={wrapperEl}>
                    <div className="card" ref={cardEl}>
                        <img src="/img/moon-card.png" alt="card" className="card-image" />
                        <div className="card-input-overlay">
                            <div className="input-prompt">
                                <span className="prompt-text">Ne yapıyorsun?</span>
                            </div>
                            <textarea
                                className="action-input"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Aksiyonunu yaz..."
                                disabled={isLoading}
                                rows={2}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <button className="submit-action-btn" onClick={handleSubmit} disabled={isLoading || !inputText.trim()}>
                {isLoading ? "..." : "Do it!"}
            </button>
            {hint && (
                <div className="hint-text">
                    <span className="hint-icon">💡</span>
                    {hint}
                </div>
            )}
        </div>
    );
}
