import "../styles/SettingsButton.css";
import audio from "../utils/audioManager";

export default function SettingsButton({ onSettingsClick }) {
    const settingsClick = () => {
        audio.play("settings");
        onSettingsClick();
    }

    return (
        <button className="settings-button" onClick={settingsClick}></button>
    );
}