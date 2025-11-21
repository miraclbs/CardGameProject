import { useState } from "react";
import "../styles/SettingsModal.css";
import audio from "../utils/audioManager";

export default function SettingsModal({ isOpen, onClose }) {
    if (!isOpen) return null;


    const [music, setMusic] = useState(audio.musicOn);
    const [sfx, setSfx] = useState(audio.sfxOn);
    const toggleMusic = (value) => {
        setMusic(value);
        audio.musicOn = value;

        value ? audio.playMusic() : audio.stopMusic();
        audio.playSfx();
    };

    const toggleSfx = (value) => {
        setSfx(value);
        audio.sfxOn = value;
        audio.playSfx();
    };
    return (
        <div className="settings-backdrop" onClick={onClose}>
            <div
                className="settings-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="settings-close" onClick={() => {
                    audio.playSfx();
                    onClose();
                }}>
                    ✕
                </button>

                <h2>Ayarlar</h2>

                <div className="settings-content">
                    <div className="settings-row">
                        <span>Müzik</span>
                        <label className="settings-switch">
                            <input
                                type="checkbox"
                                checked={music}
                                onChange={(e) => {

                                    toggleMusic(e.target.checked)
                                }}
                            />
                            <span className="settings-slider" />
                        </label>
                    </div>

                    <div className="settings-row">
                        <span>Efektler</span>
                        <label className="settings-switch">
                            <input
                                type="checkbox"
                                checked={sfx}
                                onChange={(e) => {

                                    toggleSfx(e.target.checked)
                                }}
                            />
                            <span className="settings-slider" />
                        </label>
                    </div>

                    <p className="settings-hint">
                        * Müzik ve ses efektleri kontrol et
                    </p>
                </div>
            </div>
        </div>
    );
}