import { useState } from "react";
import Cursor from "./Cursor";
import SettingsButton from "./SettingsButton";
import SettingsModal from "./SettingsModal";
import "../styles/GameOver.css";

export default function GameOver({ onRestart }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <>
            <Cursor />
            <div className="game-over-container">
                <SettingsButton onSettingsClick={() => setIsSettingsOpen(true)} />

                <div className="game-over-content">
                    <h1 className="game-over-title">
                        GAME OVER
                    </h1>
                    <span
                        onClick={onRestart}
                        className="restart-text"
                    >
                        Tekrar Oyna
                    </span>
                </div>
            </div>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </>
    );
}