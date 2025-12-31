import { useState } from "react";
import Cursor from "./Cursor";
import SettingsButton from "./SettingsButton";
import SettingsModal from "./SettingsModal";
import "../styles/GameOver.css";

export default function GameOver({ onRestart, onBackToMenu }) {
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
                    <div className="game-over-buttons">
                        <img
                            src="/img/again.png"
                            alt="Tekrar Oyna"
                            onClick={onRestart}
                            className="game-over-icon"
                        />
                        <img
                            src="/img/home.png"
                            alt="Ana Menü"
                            onClick={onBackToMenu}
                            className="game-over-icon"
                        />
                    </div>
                </div>
            </div>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </>
    );
}