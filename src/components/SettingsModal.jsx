import { useState } from "react";
import "../styles/SettingsModal.css";
import audio from "../utils/audioManager";

export default function SettingsModal({ isOpen, onClose, user, onLogout }) {
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

    const handleLogout = () => {
        audio.playSfx();
        onClose();
        onLogout();
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
                    <div className="account-section">
                        <div className="account-info">
                            <span className="account-icon">👤</span>
                            <span className="account-name">{user?.displayName || user?.email}</span>
                        </div>
                        <button className="logout-btn" onClick={handleLogout}>
                            Çıkış Yap
                        </button>
                    </div>

                    <div className="settings-divider"></div>

                    <div className="settings-row">
                        <span>Müzik</span>
                        <label className="settings-switch">
                            <input
                                type="checkbox"
                                checked={music}
                                onChange={(e) => toggleMusic(e.target.checked)}
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
                                onChange={(e) => toggleSfx(e.target.checked)}
                            />
                            <span className="settings-slider" />
                        </label>
                    </div>


                </div>
            </div>
        </div>
    );
}