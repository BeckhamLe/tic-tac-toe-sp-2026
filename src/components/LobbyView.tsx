import gameServices from '../services/game.ts'
import { useState, useEffect } from "react";

interface LobbyViewProps {
    onSelectGame: (gameId: string) => void
}

const LobbyView = ({ onSelectGame }: LobbyViewProps) => {
    const [idsList, setIdsList] = useState<string[]>([])

    useEffect(() => {
        gameServices.getAllGames().then((list) => {
            setIdsList(list.allKeys)
        }) 
    }, [])

    const handleCreateGame = () => {
        gameServices.createGame().then((returnedId) => {
            onSelectGame(returnedId.newGameId)
        })
    }

    const handleChooseGame = (id:string) => {
        onSelectGame(id)
    }

    return (
        <div>
            <h1>Play Tic-Tac-Toe</h1>
            <div>
                <ul>
                    {idsList.map((id) => (
                        <li key={id} onClick={() => handleChooseGame(id)}>{id}</li>
                    ))}
                </ul>
            </div>
            <button onClick={handleCreateGame}>Create Game</button>
        </div>
    )
}

export default LobbyView