import { useState } from "react";
import LobbyView from "./components/LobbyView.tsx";
import GameView from "./components/GameView.tsx";

function App() {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)    // game id state; also used as flag for determining lobby or game view

  /*
  // Checks for winner or draw after every move (gameState change)
  useEffect(() => {
    // If game state doesn't exist yet
    if(!gameState){
      // use services to send a request and return back response in json format
      gameServices.createGame().then((initialGameState) => {
        setGameState(initialGameState)  // update game state to initial game state returned from server
      })
    } else if(gameWinner === null && !gameState.board.includes(null)){  // check for draw (if no winner and no nulls left on board)
      alert("Draw")
    } else if(gameWinner){                      // check for winner
      alert(`Winner is ${gameWinner}`)
    }
  }, [gameState])   // watches game state for changes

  // If game state is not yet loaded, show loading message
  if(!gameState){
    return (
      <p>Loading</p>
    )
  }
  */
  // TODO: display the gameState, and call `makeMove` when a player clicks a button
  return (
    selectedGameId === null
      ? <LobbyView onSelectGame={(gameId: string) => setSelectedGameId(gameId)} />
      : <GameView gameId={selectedGameId} onBack={() => setSelectedGameId(null)} />
  );
}

export default App;
