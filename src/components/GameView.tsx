import { type GameState } from "../tic-tac-toe.ts"; // Import GameState type for gameboard cells
import gameServices from '../services/game.ts'
import { useState, useEffect } from "react";
import './GameView.css'  // Import CSS for app styling

interface GameViewProps {
    gameId: string
    onBack: () => void
}

const GameView = ({gameId, onBack}: GameViewProps) => {
    const [gameState, setGameState] = useState<GameState | null>(null)    // game state
    const [gameWinner, setGameWinner] = useState(null)                  // game winner state

    // Checks for winner or draw after every move (gameState change)
    useEffect(() => {
        // If game state doesn't exist yet
        if(!gameState){
        // use services to send a request and return back response in json format
        gameServices.getGame(gameId).then((currGameState) => {
            setGameState(currGameState.gameState)  // update game state to initial game state returned from server
        })
        } else if(gameWinner === null && !gameState.board.includes(null)){  // check for draw (if no winner and no nulls left on board)
            resetGame()
            alert("Draw")
        } else if(gameWinner){                      // check for winner
            resetGame()
            alert(`Winner is ${gameWinner}`)
        }
    }, [gameState])   // watches game state for changes

    // Set up Web Socket
    // runs once and then web socket and its event handlers exist in memory to be called upon when server sends message
    useEffect(() => {
        const ws = new WebSocket("ws://localhost:3001")     // establish WebSocket connection

        // When websocket is open send message to server of game id selected
        ws.onopen = () => {
            ws.send(JSON.stringify({gameId: gameId}))
        }

        // Updates the game state if server sends a message with updated game state
        // .onmessage = property you assign a function to that runs on the event when the server sends data to frontend
        ws.onmessage = (event) => {
            const updatedGameState = JSON.parse(event.data)     // convert the event.data from string -> usable JS object
            setGameState(updatedGameState.gameState)        // sets game state to updated version sent from server
        }

        // function given to React that will run it when component gets unmounted from screen
        return () => {
            ws.close()  // close the websocket
        }

    }, [])
    
    // Prevents game from crashing
    if(gameState === null) {
        return(<p>loading</p>)  // does an early return of displaying loading screen to prevent gameState from being null on first render
    }

    // Handles a player's move when they click on a cell
    const handleClick = (position: number) => {
        // Call the move service to make a move at the specified position
        gameServices.move(gameState.id, position).then((response) => {
            setGameState(response.gameState)  // update game state to new game state returned from server
            setGameWinner(response.winner)    // update game winner
        })
    }

    // Resets the game to its initial state
    const resetGame = () => {
        gameServices.reset(gameState.id).then((newGame) => {
            setGameState(newGame.gameState)
            setGameWinner(null)
        })
    }
    
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
            <button onClick={() => onBack()}>Back</button>
        </div>
    )
}   

export default GameView