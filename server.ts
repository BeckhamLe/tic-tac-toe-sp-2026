import express from 'express';
import ViteExpress from 'vite-express';
import { createGame, GameState, getWinner, makeMove, resetGame } from './src/tic-tac-toe.ts'; // Import game logic functions
import { WebSocketServer, WebSocket as WSWebSocket } from 'ws';     // import WebSocketServer to listen for the creation of websockets and WebSocket with renaming so no conflicts with WebSocket on browser side

export const app = express();      // create express app
app.use(express.json())     // middleware to parse JSON bodies

// Map of all existing game states
export let allGames = new Map<string, GameState>()
// Map of game ids and set of clients interested in the one they selected
const subscriptions = new Map<string, Set<WSWebSocket>>()

// Endpoint to create new game state
app.post('/create', (req, res) => {
    const newGameState = createGame()   // create a new game state
    allGames.set(newGameState.id, newGameState)    // add it to the map of games and have it's ID be its key in map
    res.json({newGameId: newGameState.id});  // return new game state id
});

// Endpoint to get list of UUIDs of all existing game states
app.get('/games', (req, res) => {
    const allKeys = Array.from(allGames.keys())     // get iterator of all keys in map then convert it to an array
    res.json({ allKeys })   // return array of all keys in an object and set to property named after itself
})

// Endpoint to find requested game state using game id and return it
app.get('/games/:id', (req, res) => {
    const gameId = req.params.id        // get the game state id in the endpoint url

    // Check if game id requested exists
    if(allGames.has(gameId)){
        const foundGameState = allGames.get(gameId)           // use gameId to find the specific game state in map of games
        
        // check if game at key in map is null or not
        if(foundGameState != null) {                    
            res.json({gameState: foundGameState})   // if not, then return game state
        } else{
            res.status(404).json({error: `Game State at id: ${gameId} is null`})
        }
    } else {
        res.status(404).json({error: `Game State requested using id: ${gameId} doesn't exist`})
    }
})

// Endpoint to make a move
app.post('/move/:id', (req, res) => {
    const position = parseInt(req.body.position)    // get position from request body and convert to an integer
    const gameId = req.params.id                // get the game state id in the endpoint url
    
    // Checks if game id requested exists
    if(allGames.has(gameId)) {
        const currGameState = allGames.get(gameId)           // use gameId to find the specific game state in map of games
        if(currGameState != null) {
            const newGameState = makeMove(currGameState, position)  // run makeMove to update the requested game state with the player's move and set new game state here
            allGames.set(gameId, newGameState)                 // update the game state at requested key to new game state in map
            
            const winner = getWinner(newGameState)              // check for winner after move with new game state
            res.json({gameState: newGameState, winner})                          // return new updated game state of the requested game state and winner (if any)

            const subscribers = subscriptions.get(gameId)   // get the set of ws at the game id 
            // Loop through all clients to send broadcast message of updated game state in string format
            subscribers?.forEach((client) => {
                client.send(JSON.stringify({ gameState: newGameState }))
            })
        } else{
            res.status(404).json({error: `Game State at id: ${gameId} is null`})
        }
    } else {
        res.status(404).json({error: `Game State requested using id: ${gameId} doesn't exist`})
    }
})

// Endpoint to reset a game state
app.post('/reset/:id', (req, res) => {
    const gameId = req.params.id

    // Check if map has requested game state
    if(allGames.has(gameId)) {
        const currGameState = allGames.get(gameId)           // use gameId to find the specific game state in map of games
        // check if game at key in map is null or not
        if(currGameState != null) {
            const freshGameState = resetGame(currGameState)     // reset the given game state
            allGames.set(freshGameState.id, freshGameState)
            res.json({gameState: freshGameState})           // return new blank game state with same game id given in request

            const subscribers = subscriptions.get(gameId)   // get the set of ws at the game id 
            // Loop through all clients to send broadcast message of updated game state in string format
            subscribers?.forEach((client) => {
                client.send(JSON.stringify({ gameState: freshGameState }))
            })
        } else{
            res.status(404).json({error: `Game State at id: ${gameId} is null`})
        }
    } else {
        res.status(404).json({error: `Game State requested using id: ${gameId} doesn't exist`})
    }
})

const PORT = parseInt(process.env.PORT || "3001");
const server = ViteExpress.listen(app, 3001, () => console.log("Server is listening..."));
const wss = new WebSocketServer({ server })     // allows web socket server to listen on the same port as http server so that frontend doesn't have to connect to two different ports

// When Client establishes websocket connection 
wss.on("connection", (ws) => {      // server creates ws under the hood when the connection is made
    let subscribedGameId = ""           // game id to pass to event listener that watches when client closes web socket
    
    // when the server receives a message from frontend
    ws.on("message", (data) => {
        const message = JSON.parse(data.toString())     // converts data sent from frontend from Buffer -> string -> usable JS object EX: const message would hold this {gameId: "abc-123"}
        subscribedGameId = message.gameId     // update current game id 

        // check if a Set already exists for the game id that the client wants to subscribe to
        if(!subscriptions.has(message.gameId)){
            subscriptions.set(message.gameId, new Set())    // if not, then create new Set for that game id in map
        }
        subscriptions.get(message.gameId)?.add(ws)      //find the set at the game id given from client and add their websocket to the set in the map
    })
    
    // When websocket of client closes
    ws.on("close", () => {
        subscriptions.get(subscribedGameId)?.delete(ws)     // delete it from the set of the game id it was recently residing in
    })
})