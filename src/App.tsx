import { useState, useEffect } from "react";
import { createGame, makeMove, getWinner } from "./tic-tac-toe";
import './App.css'

function App() {
  let [gameState, setGameState] = useState(getInitialGame())

  // Checks for winner or draw after every move (gameState change)
  useEffect(() => {
    if(getWinner(gameState) != null){
      alert(`Winner is ${getWinner(gameState)}`)
    } else if(getWinner(gameState) === null && !gameState.board.includes(null)){  // check for draw (if no winner and no nulls left on board)
      alert("Draw")
    }
  }, [gameState])

  const handleClick = (position: number) => {
    const newGameState = makeMove(gameState, position)
    setGameState(newGameState)
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
    </div>
  );
}

function getInitialGame() {
  let initialGameState = createGame()
  return initialGameState
}

export default App;
