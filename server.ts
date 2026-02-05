import express from 'express';
import ViteExpress from 'vite-express';
import { createGame, GameState, getWinner, makeMove } from './src/tic-tac-toe.ts'; // Import game logic functions

export const app = express();      // create express app
app.use(express.json())     // middleware to parse JSON bodies

export let games = new Map<string, GameState>()     // Map of all existing game states
let gameState = createGame();   // create initial game state

// Endpoint to get start a new game
app.get('/game', (req, res) => {
  res.json(gameState);  // return initial game state
});

// Endpoint to make a move
app.post('/move', (req, res) => {
    const position = parseInt(req.body.position)    // get position from request body and convert to an integer
    gameState = makeMove(gameState, position)       // update game state by making the move
    const winner = getWinner(gameState)         // check for winner after the move

    res.json({gameState, winner})   // return updated game state and winner (if any)
})

app.post('/reset', (req, res) => {
    gameState = createGame()    // reset game state to initial state
    res.json(gameState)     // return reset game state
})

const PORT: number = 3001;
ViteExpress.listen(app, 3001, () => console.log("Server is listening..."));