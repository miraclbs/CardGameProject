
import { useState } from "react";
import "./styles/app.css";
import ChoiceCard from "./components/ChoiceCard";
import MagicCursor from "./components/MagicCursor";
import locations from "./data/locations.json";

export default function App() {

  const [activeScene, setActiveScene] = useState("PLAYER_ROOM");

  const scene = locations[activeScene];

  return (
    <>
      <MagicCursor />
      <div className="app">
        <h1>{scene.name}</h1>
        <p>{scene.description}</p>
        <div className="card-wrapper">
          {scene.choices.map((choice, index) => (
            <ChoiceCard
              key={index}
              text={choice.text}
              onSelect={() => setActiveScene(choice.next)}
            />

          )
          )}

        </div>
      </div>
    </>
  );
}
