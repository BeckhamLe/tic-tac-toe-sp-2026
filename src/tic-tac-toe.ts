export type Player = "X" | "O";

export type Cell = Player | null;

// Board is a 3x3 grid, represented as a 9-element array.
// Indices map to positions:
//  0 | 1 | 2
//  ---------
//  3 | 4 | 5
//  ---------
//  6 | 7 | 8
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];

export type GameState = {
  board: Board;
  currentPlayer: Player;
  id: string;
};

export function createGame(): GameState {
  const unique_id = crypto.randomUUID()

  return {
    board: [null, null, null, null, null, null, null, null, null],
    currentPlayer: "X",
    id: unique_id
  };
}

export function resetGame(state: GameState): GameState {
  return {
    board: [null, null, null, null, null, null, null, null, null],
    currentPlayer: "X",
    id: state.id
  };
}

export function makeMove(state: GameState, position: number): GameState {
  if(getWinner(state) === "X" || getWinner(state) === "O") throw new Error("Game is already over")
  if(!Number.isInteger(position)) throw new Error("Position must be an integer")
  if(position < 0) throw new Error("Position must be between 0 and 8")
  if(position > 8) throw new Error("Position must be between 0 and 8")
  if(state.board[position] != null) throw new Error("Position is already occupied")

  // Create a new game state to avoid mutating the original state
  let newState: GameState = {
    board: [...state.board],
    currentPlayer: state.currentPlayer,
    id: state.id
  };

  newState.board[position] = newState.currentPlayer // Place the current player's mark on the board for new game state

  // Switch to the other player
  if(newState.currentPlayer === "X") {
    newState.currentPlayer = "O"
  } else {
    newState.currentPlayer = "X"
  }
  
  return newState
}

export function getWinner(state: GameState): Player | null {
  let winner: Player | null = null
  const board = state.board
  
  // Winning Top Row
  if(board[0] != null && board[1] != null && board[2] != null){
    if(board[0] === "X" && board[1] === "X" && board[2] === "X"){
      winner = "X"
    }
    if(board[0] === "O" && board[1] === "O" && board[2] === "O"){
      winner = "O"
    }
  }

  // Winning Middle Row
  if(board[3] != null && board[4] != null && board[5] != null){
    if(board[3] === "X" && board[4] === "X" && board[5] === "X"){
      winner = "X"
    }
    if(board[3] === "O" && board[4] === "O" && board[5] === "O"){
      winner = "O"
    }
  }

  // Winning Bottom Row
  if(board[6] != null && board[7] != null && board[8] != null){
    if(board[6] === "X" && board[7] === "X" && board[8] === "X"){
      winner = "X"
    }
    if(board[6] === "O" && board[7] === "O" && board[8] === "O"){
      winner = "O"
    }
  }

  // Winning Left Column
  if(board[0] != null && board[3] != null && board[6] != null){
    if(board[0] === "X" && board[3] === "X" && board[6] === "X"){
      winner = "X"
    }
    if(board[0] === "O" && board[3] === "O" && board[6] === "O"){
      winner = "O"
    }
  }

  // Winning Middle Column
  if(board[1] != null && board[4] != null && board[7] != null){
    if(board[1] === "X" && board[4] === "X" && board[7] === "X"){
      winner = "X"
    }
    if(board[1] === "O" && board[4] === "O" && board[7] === "O"){
      winner = "O"
    }
  }

  // Winning Right Column
  if(board[2] != null && board[5] != null && board[8] != null){
    if(board[2] === "X" && board[5] === "X" && board[8] === "X"){
      winner = "X"
    }
    if(board[2] === "O" && board[5] === "O" && board[8] === "O"){
      winner = "O"
    }
  }

  // Winning Main Diagonal
  if(board[0] != null && board[4] != null && board[8] != null){
    if(board[0] === "X" && board[4] === "X" && board[8] === "X"){
      winner = "X"
    }
    if(board[0] === "O" && board[4] === "O" && board[8] === "O"){
      winner = "O"
    }
  }

  // Winning Anti-Diagonal
  if(board[2] != null && board[4] != null && board[6] != null){
    if(board[2] === "X" && board[4] === "X" && board[6] === "X"){
      winner = "X"
    }
    if(board[2] === "O" && board[4] === "O" && board[6] === "O"){
      winner = "O"
    }
  }

  return winner;
}
