import "../styles/SettingsButton.css";
import audio from "../utils/audioManager";

export default function SettingsButton({ onSettingsClick }) {
    const settingsClick = () => {
        audio.play("settings");
        onSettingsClick();
    }

    return (
        <img
            src="/img/settings-btn.png"
            alt="Ayarlar"
            className="settings-icon"
            onClick={settingsClick}
        />
    );
}