import { useState, useEffect } from "react";
import { type GameState } from "./tic-tac-toe"; // Import GameState type for gameboard cells
import gameServices from './services/game.ts'   // Import game services to interact with backend API
import './App.css'  // Import CSS for appstyling

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [gameWinner, setGameWinner] = useState(null) 

  // Checks for winner or draw after every move (gameState change)
  useEffect(() => {
    // If game state doesn't exist yet
    if(!gameState){
      // use services to send a request and return back response in json format
      gameServices.getGame().then((initialGameState) => {
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

  // Handles a player's move when they click on a cell
  const handleClick = (position: number) => {
    // Call the move service to make a move at the specified position
    gameServices.move(position).then((response) => {
      setGameState(response.gameState)  // update game state to new game state returned from server
      setGameWinner(response.winner)    // update game winner
    })
  }

  // Resets the game to its initial state
  const resetGame = () => {
    gameServices.reset().then((newGame) => {
      setGameState(newGame)
      setGameWinner(null)
    })
  }

  // TODO: display the gameState, and call `makeMove` when a player clicks a button
  return (
    <div className="object_app">
      <p className="subheading_app">Current Player: {gameState.currentPlayer}</p>
      <table>
        <tbody>
          <tr id="top_row">
            <td onClick={() => handleClick(0)}>{gameState.board[0]}</td>
            <td className="middle_column" onClick={() => handleClick(1)}>{gameState.board[1]}</td>
            <td onClick={() => handleClick(2)}>{gameState.board[2]}</td>
          </tr>
          <tr id="middle_row">
            <td onClick={() => handleClick(3)}>{gameState.board[3]}</td>
            <td className="middle_column" onClick={() => handleClick(4)}>{gameState.board[4]}</td>
            <td onClick={() => handleClick(5)}>{gameState.board[5]}</td>
          </tr>
          <tr id="bottom_row">
            <td onClick={() => handleClick(6)}>{gameState.board[6]}</td>
            <td className="middle_column" onClick={() => handleClick(7)}>{gameState.board[7]}</td>
            <td onClick={() => handleClick(8)}>{gameState.board[8]}</td>
          </tr>
        </tbody>
      </table>
      <button onClick={resetGame}>Reset</button>
    </div>
  );
}

export default App;
