document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('board');
    const restartButton = document.getElementById('restart');
    const difficultyButtons = document.querySelectorAll('#difficulty-menu button');
    const messageElement = document.getElementById('message');
    const backButton = document.getElementById('backButton');
    const extremeButton = document.getElementById('extreme');

    extremeButton.addEventListener('click', function() {
        document.body.style.zoom = "80%";
    });

    difficultyButtons.forEach(button => {
        button.addEventListener('click', function() {
            document.body.style.zoom = "100%";
        });
    });
    
    let size = 10; // Tamaño del tablero (por defecto)
    let numMines = 15; // Número de minas (por defecto)
    let mineLocations = [];
    let openedCells = 0;
    

    createBoard();
    placeMines();

    function createBoard() {
        board.innerHTML = '';
        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell', 'unopened');
            cell.dataset.index = i;
            cell.addEventListener('click', function(event) {
                openCell(i);
            });
            cell.addEventListener('contextmenu', function(event) {
                event.preventDefault(); // Evitar que aparezca el menú contextual
                toggleFlag(cell);
            });
            board.appendChild(cell);
        }
    }

    function placeMines() {
        let minesPlaced = 0;
        while (minesPlaced < numMines) {
            const randomIndex = Math.floor(Math.random() * (size * size));
            if (!mineLocations.includes(randomIndex)) {
                mineLocations.push(randomIndex);
                minesPlaced++;
            }
        }
    }

    function gameWon() {
        const message = '¡Has ganado!';
        showMessage(message, 'win-message'); // Llama a showMessage() con el mensaje y la clase de victoria
        disableBoard(); // Deshabilita el tablero después de ganar
    } 

    function showMessage(message, color) {
        messageElement.textContent = message;
        messageElement.style.color = color; // Establece el color del texto
        messageElement.style.display = 'block';
    }       

    function openCell(index) {
        const cell = board.children[index];
        if (cell.classList.contains('opened')) return;
    
        if (mineLocations.includes(index)) {
            cell.classList.add('mine');
            gameOver();
        } else {
            const numNearbyMines = countNearbyMines(index);
            cell.textContent = numNearbyMines > 0 ? numNearbyMines : '';
            cell.classList.remove('unopened');
            cell.classList.add('opened');
            openedCells++;
    
            if (openedCells === size * size - numMines) {
                gameWon(); // Llama a gameWon() cuando se abren todas las celdas sin minas
            }
        }
    }
    
    function countNearbyMines(index) {
        let count = 0;
        const adjacentIndices = getAdjacentIndices(index);
        for (const adjacentIndex of adjacentIndices) {
            if (mineLocations.includes(adjacentIndex)) {
                count++;
            }
        }
        return count;
    }

    function getAdjacentIndices(index) {
        const adjacentIndices = [];
        const row = Math.floor(index / size);
        const col = index % size;

        for (let i = Math.max(0, row - 1); i <= Math.min(row + 1, size - 1); i++) {
            for (let j = Math.max(0, col - 1); j <= Math.min(col + 1, size - 1); j++) {
                adjacentIndices.push(i * size + j);
            }
        }

        return adjacentIndices;
    }

    function gameOver() {
        revealAllMines();
        const emptyCells = countEmptyCells();
        const message = `¡Has perdido! Te quedaban ${emptyCells} huecos vacíos.`;
        showMessage(message, 'lose-message'); // Llama a showMessage() con el mensaje y la clase de derrota
        disableBoard();
    }    
    
    function countEmptyCells() {
        let count = 0;
        for (const cell of board.children) {
            if (!cell.classList.contains('opened') && !cell.classList.contains('mine')) {
                count++;
            }
        }
        return count;
    }
    
    function revealAllMines() {
        for (const mineIndex of mineLocations) {
            const cell = board.children[mineIndex];
            if (!cell.classList.contains('flag')) { // Evitar que se revele una bandera
                cell.textContent = '💣';
                cell.classList.add('unopened', 'mine');
            }
        }
    }
    
    function showMessage(message, messageClass) {
        messageElement.textContent = message;
        messageElement.className = `message ${messageClass}`; // Establece la clase del mensaje
        messageElement.style.display = 'block';
    }
    

    function disableBoard() {
        for (const cell of board.children) {
            cell.removeEventListener('click', openCell);
            cell.removeEventListener('contextmenu', toggleFlag);
        }
    }

    function toggleFlag(cell) {
        cell.classList.toggle('flag'); // Agregar o quitar la clase 'flag' para mostrar o quitar la bandera
    }

    restartButton.addEventListener('click', function() {
        resetGame();
    });

    function resetGame() {
        mineLocations = [];
        openedCells = 0;
        createBoard();
        placeMines();
        messageElement.style.display = 'none'; // Ocultar el mensaje al reiniciar
    }

    // Agregar eventos para cambiar la dificultad del juego
    difficultyButtons.forEach(option => {
        option.addEventListener('click', function() {
            const level = this.id;
            if (level === 'easy') {
                size = 6; // Cambia el tamaño del tablero a 6x6
                numMines = 1;
            } else if (level === 'normal') {
                size = 10; // Tamaño predeterminado 10x10
                numMines = 15;
            } else if (level === 'hard') {
                size = 16; // Tamaño predeterminado 12x12
                numMines = 50;
            } else if (level === 'extreme') {
                size = 20; // Tamaño predeterminado 12x12
                numMines = 80;
            }

            resetGame();
            adjustBoardSize(); // Llama a la función para ajustar el tamaño del tablero
        });
    });
    
    function adjustBoardSize() {
        // Ajusta el tamaño del tablero en función del nivel seleccionado
        const board = document.getElementById('board');
        board.style.gridTemplateColumns = `repeat(${size}, 40px)`;
        board.style.gridTemplateRows = `repeat(${size}, 40px)`;
    }

    backButton.addEventListener('click', function() {
        backButton.style.animation = 'expandCircle 1s forwards';
        setTimeout(function() {
            window.location.href = '/';
        }, 1000); // Redirecciona después de completar la animación
    });
});
