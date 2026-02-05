import axios from 'axios'
const baseUrl = 'http://localhost:3001'

// Request to get initial game
const getGame = () => {
    const request = axios.get(`${baseUrl}/game`)
    return request.then((response) => response.data)
}

// Request to post move to game
const move = (position: number) => {
    const request = axios.post(`${baseUrl}/move`, {position})
    return request.then((response) => response.data)
}

const reset = () => {
    const request = axios.post(`${baseUrl}/reset`)
    return request.then((response) => response.data)
}

export default { getGame, move, reset }