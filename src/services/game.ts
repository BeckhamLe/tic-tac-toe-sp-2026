import axios from 'axios'
const baseUrl = 'http://localhost:3001'

// Request to create a new game state
const createGame = () => {
    const request = axios.post(`${baseUrl}/create`)
    return request.then((response) => response.data)
}

// Request to get an existing game state
const getGame = (gameId: string) => {
    const request = axios.get(`${baseUrl}/games/${gameId}`)
    return request.then((response) => response.data)    // returns data of game state associated with id
}

// Request to get an array of all game ids
const getAllGames = () => {
    const request = axios.get(`${baseUrl}/games`)
    return request.then((response) => response.data)
}

// Request to post move to game
const move = (gameId: string, position: number) => {
    const request = axios.post(`${baseUrl}/move/${gameId}`, {position})   // pass position in body of post request so no weird errors occur
    return request.then((response) => response.data)    // returns data of updated game state and winner (if any)
}

// Request to reset state of game currently selected
const reset = (gameId: string) => {
    const request = axios.post(`${baseUrl}/reset/${gameId}`)
    return request.then((response) => response.data)    // returns data of reset game state
}

export default { createGame, getGame, getAllGames, move, reset }