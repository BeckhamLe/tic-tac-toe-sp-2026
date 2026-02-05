import { describe, it, expect } from "vitest";
import request from 'supertest';
import {app, games} from './server.ts';

describe ('POST /create', () => {
    it('should create a new game and return it with an id', async() => {
        const response = await request(app)
            .post('/create')
            .expect(200)
        
        expect(response.body.gameState).toBeDefined()   // check if new game state exists in response
        expect(response.body.gameState.id).toBeDefined()    // check if game state has unique id assigned
    })
})

describe ('GET /games', () => {
    it('should return list of uuids of all existing game states', async() => {
        const response = await request(app)
            .get('/games')
            .expect(200)
        
            expect(response.body.gamesKeys).toBeDefined()   // check if list of games keys exists in the response
            expect(Array.isArray(response.body.gamesKeys)).toBe(true)   // check if list of games keys is an array
    })
})

describe ('GET /games/:id', () => {
    it('should return the correct game state associated with the uuid requested', async() => {
        // First, create a game to get a real ID
        const createResponse = await request(app)
            .post('/create')
            .expect(200)
        
        const gameId = createResponse.body.gameState.id
        
        // Now fetch game by its ID
        const response = await request(app)
            .get(`/games/${gameId}`)
            .expect(200)
        
        expect(response.body.gameState).toBeDefined()   // check if game state retrieved exists in response
        expect(response.body.gameState.id).toBe(gameId)    // Want to check if game state id in response is same as the one requested
    })
})

describe ('POST /move/:id', () => {
    it('should update game state and return it when player makes a move on their game', async() => {
        // First, create a game
        const createResponse = await request(app)
            .post('/create')
            .expect(200)

        const gameId = createResponse.body.gameState.id
        
        // Make a move on the game
        const response = await request(app)
            .post(`/move/${gameId}`)
            .send({ position: 0 })
            .expect(200)

        expect(response.body.gameState).toBeDefined()   // check if game state retrieved exists in response
        expect(response.body.gameState.id).toBe(gameId)    // check if game state id in response is same as the one requested
        expect(response.body.gameState.board[0]).toBe("X")  // check if move made to game state is correct
    })
})