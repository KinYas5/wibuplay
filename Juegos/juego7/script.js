const board = document.getElementById('board');
const winnerMessage = document.getElementById('winner-message');
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];

// Create cells for the board
for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', () => cellClick(i));
    board.appendChild(cell);
}

// Handle cell clicks
function cellClick(index) {
    if (gameBoard[index] === '' && !checkWinner()) {
        gameBoard[index] = currentPlayer;
        render();
        if (checkWinner()) {
            showWinnerMessage();
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}

// Render the game board
function render() {
    gameBoard.forEach((symbol, index) => {
        const cell = board.querySelector(`[data-index="${index}"]`);
        if (symbol === 'X') {
            cell.style.backgroundImage = 'url("images/x.png")';
        } else if (symbol === 'O') {
            cell.style.backgroundImage = 'url("images/o.png")';
        } else {
            cell.style.backgroundImage = '';
            cell.textContent = '';
        }
    });
}

// Show the winner message
function showWinnerMessage() {
    const winner = checkWinner();
    if (winner) {
        winnerMessage.textContent = winner === '¡Empate!' ? winner : `${winner} ha ganado!`;
        winnerMessage.classList.remove('hidden');
        board.classList.add('disabled');
    }
}

// Check for a winner
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]              // Diagonals
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return gameBoard[a];
        }
    }

    if (!gameBoard.includes('')) {
        return '¡Empate!';
    }

    return null;
}

// Reset the game
function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    render();
    winnerMessage.classList.add('hidden');
    board.classList.remove('disabled');
}
