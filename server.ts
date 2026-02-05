import express from 'express';
import ViteExpress from 'vite-express';
import { createGame, getWinner, makeMove } from './src/tic-tac-toe.ts';

const app = express();
app.use(express.json())

let gameState = createGame();   // create initial game state

// Endpoint to get start a new game
app.get('/game', (req, res) => {
  res.json(gameState);  // return initial game state
});

// Endpoint to make a move
app.post('/move', (req, res) => {
    const position = parseInt(req.body.position)
    gameState = makeMove(gameState, position)
    const winner = getWinner(gameState)

    res.json({gameState, winner})
})

app.post('/reset', (req, res) => {
    gameState = createGame()
    res.json(gameState)
})

const PORT: number = 3001;
ViteExpress.listen(app, 3001, () => console.log("Server is listening..."));