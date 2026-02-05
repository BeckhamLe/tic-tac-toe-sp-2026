import axios from 'axios'
const baseUrl = 'http://localhost:3001'

// Request to get initial game
const getGame = () => {
    const request = axios.get(`${baseUrl}/game`)
    return request.then((response) => response.data)    // returns data of initial game state
}

// Request to post move to game
const move = (position: number) => {
    const request = axios.post(`${baseUrl}/move`, {position})   // pass position in body of post request so no weird errors occur
    return request.then((response) => response.data)    // returns data of updated game state and winner (if any)
}

const reset = () => {
    const request = axios.post(`${baseUrl}/reset`)
    return request.then((response) => response.data)    // returns data of reset game state
}

export default { getGame, move, reset }