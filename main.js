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

    return { placeMarker, reset, getBoard }; // Expose getBoard here
})();

const GameController = (() => {
    let player1, player2;
    let currentPlayer;

    const startGame = (name1, marker1, name2, marker2) => {
        player1 = Player(name1, marker1);
        player2 = Player(name2, marker2);
        currentPlayer = player1;
        alert(`It's ${currentPlayer.name}'s turn`);
    };

    const switchTurn = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        alert(`It's ${currentPlayer.name}'s turn`);
    };

    const playTurn = (index) => {
        const isValidMove = GameBoard.placeMarker(index, currentPlayer.marker);

        if (!isValidMove) {
            alert("Invalid move! Try again.");
            return false; // Game continues
        }

        if (checkWinner()) {
            alert(`${currentPlayer.name} wins!`);
            return true; // Game over
        }

        if (isBoardFull()) {
            alert("It's a draw!");
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

// New code

const gameInterface = document.querySelector("#game-board");

const createGrid = () => {
    for (let i = 0; i < 9; i++) {
        const innerButton = document.createElement("button");
        innerButton.setAttribute("class", "game-button");
        innerButton.setAttribute("data-index", i);
        innerButton.textContent = "";
        gameInterface.appendChild(innerButton);
    }
};

const startUI = () => {
    const name1 = prompt("Enter player 1's name:");
    const marker1 = prompt("Choose player 1's marker (X or O):");
    const name2 = prompt("Enter player 2's name:");
    const marker2 = marker1 === "X" ? "O" : "X";

    GameController.startGame(name1, marker1, name2, marker2);
    createGrid();
    setupEventListeners();
};

const setupEventListeners = () => {
    const buttons = document.querySelectorAll(".game-button");

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const index = parseInt(button.getAttribute("data-index"), 10);

            const gameOver = GameController.playTurn(index);
            const board = GameBoard.getBoard();
            button.textContent = board[index];

            button.disabled = true;

            if (gameOver) {
                buttons.forEach((btn) => (btn.disabled = true));
                alert("Game over! Refresh to play again.");
            }
        });
    });
};

const resetButton = document.querySelector(".reset-button");

const resetGame = () => {
    GameBoard.reset();
    const buttons = document.querySelectorAll(".game-button");

    buttons.forEach((button) => {
        button.textContent = "";
        button.disabled = false;
    });

    GameController.startGame("Player1", "X", "Player2", "O");
    alert("Game has been reset!");
};

resetButton.addEventListener("click", resetGame);

document.addEventListener("DOMContentLoaded", startUI);
