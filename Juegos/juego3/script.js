document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');

    const scale = 20;
    const rows = canvas.height / scale;
    const columns = canvas.width / scale;

    let snake;
    let fruit;
    let gameInterval;

// Añade esta parte al método setup() para dibujar la cuadrícula
function setup() {
    snake = new Snake();
    fruit = new Fruit();
    fruit.pickLocation();

    gameInterval = window.setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fruit.draw();
        snake.update();
        snake.draw();
        drawGrid(); // Llama a la función para dibujar la cuadrícula
        if (snake.eat(fruit)) {
            fruit.pickLocation();
        }

        snake.checkCollision();
        document.querySelector('.score').innerText = snake.total;
    }, 250);
}

// Añade esta función para dibujar la cuadrícula
function drawGrid() {
    ctx.beginPath();
    for (let i = 0; i <= canvas.width; i += scale) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
    }
    for (let j = 0; j <= canvas.height; j += scale) {
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
    }
    ctx.strokeStyle = "#333";
    ctx.stroke();
}


    function startGame() {
        setup();
    
        window.addEventListener('keydown', (evt) => {
            const key = evt.key.toLowerCase();
            if (['w', 'a', 's', 'd'].includes(key)) {
                evt.preventDefault(); // Evita el comportamiento predeterminado del navegador para las teclas WASD
                const direction = key === 'w' ? 'up' :
                                  key === 'a' ? 'left' :
                                  key === 's' ? 'down' :
                                  key === 'd' ? 'right' : '';
                snake.changeDirection(direction);
            }
        });
    }
    

    document.getElementById('start-button').addEventListener('click', startGame);

    class Snake {
        constructor() {
            this.body = [new Block(10 * scale, 10 * scale)]; // Inicializa la serpiente en la posición (10, 10) de la cuadrícula
            this.direction = 'right';
            this.total = 0;
            this.grow = false; // Agregamos una bandera para controlar el crecimiento
        }

        update() {
            const direction = this.direction;
            const head = this.body[this.body.length - 1];

            let x = head.x;
            let y = head.y;

            if (direction === 'right') x += scale;
            if (direction === 'left') x -= scale;
            if (direction === 'up') y -= scale;
            if (direction === 'down') y += scale;

            const newHead = new Block(x, y);

            if (this.detectCollision(newHead)) {
                clearInterval(gameInterval);
                alert('Game Over! Your score: ' + this.total);
                return;
            }

            this.body.push(newHead);

            if (this.body.length > this.total) {
                this.body.shift();
            }
        }

        draw() {
            this.body.forEach(block => {
                block.draw();
            });
        }

        eat(fruit) {
            const head = this.body[this.body.length - 1];
            if (head.x === fruit.x && head.y === fruit.y) {
                this.total++;
                return true;
            }
            return false;
        }

        checkCollision() {
            const head = this.body[this.body.length - 1];
            if (head.x >= canvas.width || head.x < 0 || head.y >= canvas.height || head.y < 0) {
                clearInterval(gameInterval);
                const gameOverMessage = document.getElementById('game-over-message');
                const scoreDisplay = document.querySelector('.score');
                scoreDisplay.innerText = this.total;
                gameOverMessage.classList.remove('hidden'); // Muestra el mensaje de Game Over
            }
        }

        changeDirection(direction) {
            if (direction === 'left' && this.direction !== 'right') {
                this.direction = direction;
            }
            if (direction === 'right' && this.direction !== 'left') {
                this.direction = direction;
            }
            if (direction === 'up' && this.direction !== 'down') {
                this.direction = direction;
            }
            if (direction === 'down' && this.direction !== 'up') {
                this.direction = direction;
            }
        }

        detectCollision(head) {
            for (let i = 0; i < this.body.length; i++) {
                if (head.x === this.body[i].x && head.y === this.body[i].y) {
                    return true;
                }
            }
            return false;
        }
    }

    class Block {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        draw() {
            ctx.fillStyle = 'white';
            ctx.fillRect(this.x, this.y, scale, scale);
        }
    }

    class Fruit {
        constructor() {
            this.x = 0;
            this.y = 0;
        }
    
        pickLocation() {
            this.x = Math.floor(Math.random() * columns) * scale; // Genera un número aleatorio de columnas
            this.y = Math.floor(Math.random() * rows) * scale; // Genera un número aleatorio de filas
    
            // Verifica que la ubicación generada esté dentro del área jugable
            while (this.isInSnake()) {
                this.x = Math.floor(Math.random() * columns) * scale;
                this.y = Math.floor(Math.random() * rows) * scale;
            }
        }
    
        isInSnake() {
            for (let i = 0; i < snake.body.length; i++) {
                if (this.x === snake.body[i].x && this.y === snake.body[i].y) {
                    return true;
                }
            }
            return false;
        }
    
        draw() {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y, scale, scale);
        }
    }
    
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

