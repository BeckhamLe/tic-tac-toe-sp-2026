import { useState, useEffect } from "react";
import { createGame, makeMove, getWinner, type GameState } from "./tic-tac-toe";
import gameServices from './services/game.ts'
import './App.css'

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
    } else if(gameState && gameWinner != null){
      if(gameWinner != null){
        alert(`Winner is ${gameWinner}`)
      } else if(gameWinner === null && !gameState.board.includes(null)){  // check for draw (if no winner and no nulls left on board)
        alert("Draw")
      }
    }
  }, [gameState])

  if(!gameState){
    return (
      <p>Loading</p>
    )
  }

  const handleClick = (position: number) => {
    gameServices.move(position).then((response) => {
      setGameState(response.gameState)
      setGameWinner(response.winner)
    })
  }

  const resetGame = () => {
    gameServices.reset().then((newGame) => {
      setGameState(newGame)  // update game state to initial game state returned from server
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

function getInitialGame() {
  let initialGameState = createGame()
  return initialGameState
}

export default App;
