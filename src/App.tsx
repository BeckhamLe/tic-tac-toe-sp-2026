import { useState, useEffect } from "react";
import { createGame, makeMove, getWinner } from "./tic-tac-toe";
import './App.css'

function App() {
  let [gameState, setGameState] = useState(getInitialGame())

  useEffect(() => {
    if(getWinner(gameState) != null){
      alert(`Winner is ${getWinner(gameState)}`)
    } else if(getWinner(gameState) === null && !gameState.board.includes(null)){
      alert("Draw")
    }
  }, [gameState])

  const handleClick = (position: number) => {
    const newGameState = makeMove(gameState, position)
    setGameState(newGameState)
  }

  // TODO: display the gameState, and call `makeMove` when a player clicks a button
  return (
    <>
      <div> Current Player: {gameState.currentPlayer}</div>
      <table>
        <tbody>
          <tr>
            <td onClick={() => handleClick(0)}>{gameState.board[0]}</td>
            <td onClick={() => handleClick(1)}>{gameState.board[1]}</td>
            <td onClick={() => handleClick(2)}>{gameState.board[2]}</td>
          </tr>
          <tr>
            <td onClick={() => handleClick(3)}>{gameState.board[3]}</td>
            <td onClick={() => handleClick(4)}>{gameState.board[4]}</td>
            <td onClick={() => handleClick(5)}>{gameState.board[5]}</td>
          </tr>
          <tr>
            <td onClick={() => handleClick(6)}>{gameState.board[6]}</td>
            <td onClick={() => handleClick(7)}>{gameState.board[7]}</td>
            <td onClick={() => handleClick(8)}>{gameState.board[8]}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function getInitialGame() {
  let initialGameState = createGame()
  return initialGameState
}

export default App;
