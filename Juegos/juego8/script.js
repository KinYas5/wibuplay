document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('sudoku-board');
    const newGameButton = document.getElementById('new-game-button');

    let sudokuGrid = [];

    // Función para generar un tablero de Sudoku vacío
    function generateSudokuBoard() {
        for (let i = 0; i < 9; i++) {
            sudokuGrid[i] = [];
            for (let j = 0; j < 9; j++) {
                sudokuGrid[i][j] = 0; // Inicializa todas las celdas con 0 (vacías)
            }
        }
    }

    // Función para mostrar el tablero de Sudoku en el HTML
    function renderSudokuBoard() {
        board.innerHTML = ''; // Limpiar el tablero antes de renderizarlo nuevamente

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('input');
                cell.type = 'text';
                cell.maxLength = 1;
                cell.value = sudokuGrid[i][j] === 0 ? '' : sudokuGrid[i][j]; // Mostrar los números del tablero
                cell.className = 'sudoku-cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('input', handleCellInput);
                board.appendChild(cell);
            }
        }
    }

    // Función para manejar la entrada del jugador en las celdas del Sudoku
    function handleCellInput(event) {
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);
        const value = parseInt(event.target.value);

        // Validar la entrada del jugador
        if (isNaN(value) || value < 1 || value > 9) {
            sudokuGrid[row][col] = 0; // Si la entrada es inválida, establecer la celda como vacía
            event.target.value = ''; // Limpiar el valor de la celda en el HTML
        } else {
            sudokuGrid[row][col] = value; // Actualizar el valor de la celda en el tablero
        }
    }

    // Función para generar un nuevo juego de Sudoku
    function newGame() {
        generateSudokuBoard();
        renderSudokuBoard();
    }

    // Evento click del botón "Nuevo Juego"
    newGameButton.addEventListener('click', newGame);

    // Iniciar un nuevo juego al cargar la página
    newGame();
});
