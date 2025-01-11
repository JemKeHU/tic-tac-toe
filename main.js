const Player = (name, marker) => {
    return { name, marker };
};

const stas = Player("Stas", "O");
const kate = Player("Kate", "X");

const GameBoard = (() => {
    const gameBoard = Array(9).fill(null);

    const placeMarker = (index, marker) => {
        if (gameBoard[index] === null) {
            gameBoard[index] = marker;
            return true; // Marker placed successfully
        }
        return false; // Spot is already taken
    };

    const reset = () => {
        gameBoard.fill(null);
    };

    const getBoard = () => [...gameBoard]; // Added this to get the board state

    const displayBoard = () => {
        console.log(`
        ${gameBoard[0] || " "} | ${gameBoard[1] || " "} | ${gameBoard[2] || " "}
        ---------
        ${gameBoard[3] || " "} | ${gameBoard[4] || " "} | ${gameBoard[5] || " "}
        ---------
        ${gameBoard[6] || " "} | ${gameBoard[7] || " "} | ${gameBoard[8] || " "}
        `);
    };

    return { placeMarker, reset, displayBoard, getBoard }; // Expose getBoard here
})();

const GameController = (() => {
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
        const isValidMove = GameBoard.placeMarker(index, currentPlayer.marker);

        if (!isValidMove) {
            console.log("Invalid move! Try again.");
            return false; // Game continues
        }

        GameBoard.displayBoard();

        if (checkWinner()) {
            console.log(`${currentPlayer.name} wins!`);
            return true; // Game over
        }

        if (isBoardFull()) {
            console.log("It's a draw!");
            return true; // Game over
        }

        switchTurn();
        return false; // Game continues
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

    const isBoardFull = () => {
        return GameBoard.getBoard().every((cell) => cell !== null);
    };

    return { startGame, playTurn, currentPlayer: () => currentPlayer }; // Expose currentPlayer as a getter
})();

const launchGame = () => {
    const name1 = prompt("Enter player 1's name:");
    const marker1 = prompt("Enter player 1's marker 'O' or 'X':");
    const name2 = prompt("Enter player 2's name:");
    const marker2 = prompt("Enter player 2's marker 'O' or 'X':");

    GameController.startGame(name1, marker1, name2, marker2);

    let gameOver = false;
    while (!gameOver) {
        const index = parseInt(
            prompt(`${GameController.currentPlayer().name}, enter a position (0-8):`),
            10
        );
        if (isNaN(index) || index < 0 || index > 8) {
            console.log("Invalid input! Enter between 0 and 8.");
            continue;
        }

        gameOver = GameController.playTurn(index);
    }

    console.log("Game over! Refresh the page to play again.");
};

launchGame();
