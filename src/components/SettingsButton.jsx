import "../styles/SettingsButton.css";
import audio from "../utils/audioManager";

function SettingsButton({ onSettingsClick }) {

    const settingsClick = () => {
        audio.play("settings");
        onSettingsClick();
    }


    return (
        <div>
            <button
                className="settings-button"
                onClick={settingsClick}
            >

            </button>
        </div>
    )
}

export default SettingsButton