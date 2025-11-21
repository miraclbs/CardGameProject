import { useRef } from "react";
import { useCardTilt } from "../hooks/useCardTilt";
import "../styles/ChoiceCard.css";
import audio from "../utils/audioManager";

export default function ChoiceCard({ text, onSelect }) {
    const {
        wrapperEl,
        labelEl,
        cardEl,
        animEl,
        showAnim,
        onMove,
        onEnter,
        onExit
    } = useCardTilt();


    const cardClick = () => {
        audio.playCardSound();
        onSelect();
    }

    return (
        <div
            className="card-container"
            onClick={cardClick}
            onMouseMove={onMove}
            onMouseEnter={onEnter}
            onMouseLeave={onExit}
        >
            <div className="card-tilt" ref={wrapperEl}>
                <div className="card" ref={cardEl}>
                    <img
                        src="/img/moon.jpg"
                        alt="card"
                        className="card-image"
                        style={{ display: showAnim ? "none" : "block" }}
                    />
                    <video
                        ref={animEl}
                        src="/anim/moonAnim1080.mp4"
                        loop
                        muted
                        preload="auto"
                        className="card-image"
                        style={{ display: showAnim ? "block" : "none" }}
                    />
                    <div className="card-text" ref={labelEl}>{text}</div>
                </div>
            </div>
        </div>
    );
}