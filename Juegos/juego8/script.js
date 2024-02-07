// Obtener el canvas y el contexto
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Definir variables del juego
let playerX = 50;
let playerY = canvas.height - 100;
let playerWidth = 50;
let playerHeight = 50;
let playerSpeed = 5;

// Función principal del juego
function gameLoop() {
    // Borrar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar al jugador
    ctx.fillStyle = 'blue';
    ctx.fillRect(playerX, playerY, playerWidth, playerHeight);

    // Actualizar la posición del jugador
    movePlayer();

    // Llamar al gameLoop de nuevo
    requestAnimationFrame(gameLoop);
}

// Función para mover al jugador
function movePlayer() {
    // Mover el jugador hacia la derecha
    if (keysPressed['ArrowRight'] && playerX < canvas.width - playerWidth) {
        playerX += playerSpeed;
    }
    // Mover el jugador hacia la izquierda
    if (keysPressed['ArrowLeft'] && playerX > 0) {
        playerX -= playerSpeed;
    }
}

// Manejo de teclas
const keysPressed = {};
document.addEventListener('keydown', function(event) {
    keysPressed[event.key] = true;
});
document.addEventListener('keyup', function(event) {
    delete keysPressed[event.key];
});

// Iniciar el bucle del juego
gameLoop();
