import { useState } from "react";
import LobbyView from "./components/LobbyView.tsx";
import GameView from "./components/GameView.tsx";

function App() {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)    // game id state; also used as flag for determining lobby or game view

  // TODO: display the gameState, and call `makeMove` when a player clicks a button
  return (
    selectedGameId === null
      ? <LobbyView onSelectGame={(gameId: string) => setSelectedGameId(gameId)} />
      : <GameView gameId={selectedGameId} onBack={() => setSelectedGameId(null)} />
  );
}

export default App;
