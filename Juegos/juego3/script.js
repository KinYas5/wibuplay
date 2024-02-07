document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const menu = document.getElementById('menu');
    const startButton = document.getElementById('start-button');
    const appleElement = document.getElementById('apple');

    let snake = [];
    let applePos = {x: 0, y: 0};
    let direction = null;
    let interval;
    let lastRenderTime = 0;
    const speed = 10; // Velocidad en frames por segundo
    let changingDirection = false;
    let gameStarted = false;

    const render = (time) => {
        interval = requestAnimationFrame(render);
        const secondsSinceLastRender = (time - lastRenderTime) / 1000;

        if (!gameStarted) return; // No renderizar si el juego no ha comenzado
        if (secondsSinceLastRender < 1 / speed) return;

        lastRenderTime = time;
        moveSnake();
    };

    const startGame = () => {
        interval = requestAnimationFrame(render);
        menu.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        gameStarted = true;
        direction = null; // Resetear la dirección al iniciar el juego
        snake = [{x: 200, y: 200}]; // Reiniciar la serpiente en una posición segura
        placeApple(); // Colocar la manzana al inicio del juego
    };

    const stopGame = () => {
        cancelAnimationFrame(interval);
        alert('Game Over!');
        location.reload(); // Recargar la página para reiniciar el juego
    };

    const placeApple = () => {
        applePos.x = Math.floor(Math.random() * 20) * 20;
        applePos.y = Math.floor(Math.random() * 20) * 20;
        appleElement.style.left = applePos.x + 'px';
        appleElement.style.top = applePos.y + 'px';
    };

    const moveSnake = () => {
        const snakeHead = {...snake[0]};
        changingDirection = false;

        switch (direction) {
            case 'right':
                snakeHead.x += 20;
                break;
            case 'left':
                snakeHead.x -= 20;
                break;
            case 'up':
                snakeHead.y -= 20;
                break;
            case 'down':
                snakeHead.y += 20;
                break;
        }

        // Colisión con las paredes: atravesar las paredes
        if (snakeHead.x >= 400) {
            snakeHead.x = 0;
        } else if (snakeHead.x < 0) {
            snakeHead.x = 380;
        }

        if (snakeHead.y >= 400) {
            snakeHead.y = 0;
        } else if (snakeHead.y < 0) {
            snakeHead.y = 380;
        }

        // Colisión con la manzana
        if (snakeHead.x === applePos.x && snakeHead.y === applePos.y) {
            placeApple();
            // Aumentar la longitud de la serpiente
            snake.push({...snake[snake.length - 1]});
        } else {
            snake.pop();
        }

        // Verificar colisión con el cuerpo de la serpiente
        if (checkCollision(snakeHead)) {
            stopGame();
            return;
        }

        snake.unshift(snakeHead);
        renderSnake();
    };

    const checkCollision = (snakeHead) => {
        return snake.slice(1).some(segment => segment.x === snakeHead.x && segment.y === snakeHead.y);
    };

    const renderSnake = () => {
        const snakeBody = document.querySelectorAll('.snake-body');
        snakeBody.forEach(segment => segment.remove());

        snake.forEach((segment, index) => {
            const newSegment = document.createElement('div');
            newSegment.className = 'snake-body';
            newSegment.style.left = segment.x + 'px';
            newSegment.style.top = segment.y + 'px';

            if (index === 0) {
                newSegment.id = 'snake-head';
            }

            gameContainer.appendChild(newSegment);
        });
    };

    document.addEventListener('keydown', (e) => {
        if (!gameStarted) {
            startGame(); // Comenzar el juego cuando se presiona cualquier tecla
            return;
        }

        if (changingDirection) return;
        changingDirection = true;

        switch (e.key) {
            case 'ArrowUp':
                if (direction !== 'down') {
                    direction = 'up';
                }
                break;
            case 'ArrowDown':
                if (direction !== 'up') {
                    direction = 'down';
                }
                break;
            case 'ArrowLeft':
                if (direction !== 'right') {
                    direction = 'left';
                }
                break;
            case 'ArrowRight':
                if (direction !== 'left') {
                    direction = 'right';
                }
                break;
        }
    });

    startButton.addEventListener('click', startGame);
});
