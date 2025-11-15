import { useCardTilt } from "../hooks/useCardTilt";
import "../styles/ChoiceCard.css";

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

    return (
        <div
            className="card-container"
            onClick={onSelect}
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
                        className="card-image"
                        style={{ display: showAnim ? "block" : "none" }}
                    />
                    <div className="card-text" ref={labelEl}>{text}</div>
                </div>
            </div>
        </div>
    );
}