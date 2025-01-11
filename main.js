const Player = (name, marker) => {
    return {name, marker};
}

const stas = Player("Stas", "O");
const kate = Player("Kate", "X");

const GameBoard = (() => {
    const gameBoard = Array(9).fill(null); 

    const placeMarker = (index, marker) => {
        if (!gameBoard[index]) gameBoard[index] = marker;
    }

    const reset = () => {
        gameBoard.fill(null);
    }

    const getBoard = () => {
        return [...gameBoard];
    }

    return { placeMarker, reset, getBoard };
})();

const GameController = (() => {
    // private variables
    let player1, player2;
    let currentPlayer;

    const startGame = (name1, marker1, name2, marker2) => {
        player1 = Player(name1, marker1);
        player2 = Player(name2, marker2);
        currentPlayer = player1;
        console.log(`It's ${currentPlayer.name}'s turn`);
    };

    const switchTurn = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        console.log(`It's ${currentPlayer.name}'s turn`);
    };

    const playTurn = (index) => {
        GameBoard.placeMarker(index, currentPlayer.marker);
        if (checkWinner()) {
            console.log(`${currentPlayer} wins!`);
            return;
        }
        switchTurn();
    };

    const checkWinner = () => {
        const board = GameBoard.getBoard();
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        return winPatterns.some((pattern) =>
            pattern.every((index) => board[index] === currentPlayer.marker)
        );
    };

    // public API (returned at the end)
    return {startGame, playTurn}; // expose public methods
})();