import { useState } from "react";
import "./styles/App.css";
import ChoiceCard from "./components/ChoiceCard";
import MagicCursor from "./components/MagicCursor";
import locations from "./data/locations.json";
import SettingsButton from "./components/SettingsButton";
import SettingsModal from "./components/SettingsModal";

export default function App() {
  const [activeScene, setActiveScene] = useState("PLAYER_ROOM");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const scene = locations[activeScene];
  return (
    <>
      <MagicCursor />
      <div className="app">
        <SettingsButton onSettingsClick={() => setIsSettingsOpen(true)} />
        <h1>{scene.name}</h1>
        <p>{scene.description}</p>
        <div className="card-wrapper">
          {scene.choices.map((choice, index) => (
            <ChoiceCard
              key={index}
              text={choice.text}
              onSelect={() => setActiveScene(choice.next)}
            />
          ))}
        </div>
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
