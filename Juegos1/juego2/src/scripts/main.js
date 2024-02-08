// main.js
document.addEventListener('DOMContentLoaded', function () {
    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'game-container',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                enableBody: true
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    var game = new Phaser.Game(config);
    var score = 0;
    var ballSpeedMultiplier = 1;
    var maxSpeedIncreases = 5; // Límite de incrementos de velocidad
    var speedIncreases = 0;
    var lastSpeedIncreaseScore = 0;
    var gameOverText;
    var restartButton;
    var ballOutOfBounds = false;
    var pauseButton;
    var isGamePaused = false;

    function preload() {
        this.load.image('paddle', 'assets/paddle.png');
        this.load.image('ball', 'assets/ball.png');
        this.load.image('background', 'assets/background.png');
        this.load.image('pause_button', 'assets/pause_button.png'); // Ajusta el nombre y la ruta según tu archivo
    }

    function create() {
        // Configurar el fondo
        this.add.image(400, 300, 'background').setScale(2.2);

        // Configurar la pala
        this.paddle = this.physics.add.sprite(400, 500, 'paddle').setCollideWorldBounds(true).setImmovable(true);
        this.paddle.setScale(0.5);

        // Configurar la pelota
        this.ball = this.physics.add.sprite(400, 300, 'ball').setCollideWorldBounds(true).setBounce(1, 1);
        this.ball.setScale(0.1);

        this.physics.world.setBoundsCollision(true, true, true, false);

        this.physics.add.collider(this.paddle, this.ball, paddleHitBall, null, this);

        // Agregar controles del jugador
        this.input.on('pointermove', function (pointer) {
            if (!isGamePaused) {
                var paddleX = Phaser.Math.Clamp(pointer.x, 52, 748);
                this.paddle.x = paddleX;
            }
        }, this);

        // Agregar texto para mostrar la puntuación con tamaño ajustado
        this.scoreText = this.add.text(16, 16, 'Puntuación: 0', { fontSize: '24px', fill: '#fff' });

        // Configurar velocidad inicial de la pelota
        this.ball.setVelocity(200, 200);

        // Configurar el botón de pausa con un emoticono y ajustar la escala
        pauseButton = this.add.image(750, 50, 'pause_button').setInteractive();
        pauseButton.setScale(0.2); // Ajusta la escala según tus necesidades
        pauseButton.on('pointerdown', togglePause, this);
        this.input.keyboard.on('keydown-SPACE', function (event) {
            if (event.repeat) return; // Evitar repeticiones al mantener presionada la tecla
            togglePause.call(this);
        }, this);
    }

    function update() {
        this.scoreText.setText('Puntuación: ' + score);

        // Verificar si la pelota toca el suelo
        if (this.ball.y > 600 && !ballOutOfBounds) {
            ballOutOfBounds = true;
            gameOver();
        }
    }

    function paddleHitBall(paddle, ball) {
        score += 1; // Incrementar la puntuación en 1 punto

        // Verificar si la puntuación es 5 puntos más que la última vez que se incrementó la velocidad
        if (score >= lastSpeedIncreaseScore + 1 && speedIncreases < maxSpeedIncreases) {
            // Incrementar la velocidad en un 10% cada 5 puntos
            ballSpeedMultiplier += 0.05;
            speedIncreases++;
            lastSpeedIncreaseScore = score;
        }

        // Actualizar la velocidad de la bola basándonos en el multiplicador
        var newVelocityX = this.ball.body.velocity.x * ballSpeedMultiplier;
        var newVelocityY = this.ball.body.velocity.y * ballSpeedMultiplier;
        this.ball.setVelocity(newVelocityX, newVelocityY);
    }

    function togglePause() {
        isGamePaused = !isGamePaused;

        if (isGamePaused) {
            // Pausar el juego
            this.physics.pause();
        } else {
            // Reanudar el juego
            this.physics.resume();
        }
    }

    function gameOver() {
        // Pausar el juego
        this.physics.pause();

        // Mostrar el mensaje y el botón de reinicio
        gameOverText = this.add.text(250, 250, '¡Has perdido!', { fontSize: '48px', fill: '#fff' });
        restartButton = this.add.text(300, 350, 'Reiniciar', { fontSize: '32px', fill: '#fff' });
        restartButton.setInteractive();
        restartButton.on('pointerdown', restartGame, this);
    }

    function restartGame() {
        // Restablecer variables y elementos del juego
        score = 0;
        ballSpeedMultiplier = 1;
        speedIncreases = 0;
        lastSpeedIncreaseScore = 0;
        ballOutOfBounds = false;
        isGamePaused = false;

        // Eliminar el mensaje y el botón de reinicio
        gameOverText.destroy();
        restartButton.destroy();

        // Reiniciar la posición de la pelota y habilitar la pala
        this.ball.setPosition(400, 300);
        this.paddle.setImmovable(false);

        // Configurar velocidad inicial de la pelota
        this.ball.setVelocity(200, 200);

        // Reanudar el juego
        this.physics.resume();
    }
});
