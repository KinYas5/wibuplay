// Definición de variables
const wordElement = document.getElementById('word-container');
const wrongLettersElement = document.getElementById('wrong-letters');
const attemptsElement = document.getElementById('attempts');
const letterInput = document.getElementById('letter-input');
const checkButton = document.getElementById('check-button');
const restartButton = document.getElementById('restart-button');

let selectedWord;
let correctLetters = [];
let wrongLetters = [];
let attempts = 6;

// Palabras para el juego
const words = ['casa', 'perro', 'gato', 'coche', 'mesa', 'silla', 'ordenador'];

// Inicializar el juego
function init() {
    selectedWord = words[Math.floor(Math.random() * words.length)];
    displayWord();
}

// Mostrar la palabra oculta
function displayWord() {
    wordElement.innerHTML = '';
    selectedWord.split('').forEach(letter => {
        const span = document.createElement('span');
        span.textContent = correctLetters.includes(letter) ? letter : '_';
        wordElement.appendChild(span);
    });
}

// Mostrar letras incorrectas
function displayWrongLetters() {
    wrongLettersElement.innerHTML = wrongLetters.join(', ');
}

// Comprobar si la letra ingresada está en la palabra
function checkLetter(letter) {
    if (selectedWord.includes(letter)) {
        if (!correctLetters.includes(letter)) {
            correctLetters.push(letter);
            displayWord();
        }
    } else {
        if (!wrongLetters.includes(letter)) {
            wrongLetters.push(letter);
            attempts--;
            displayWrongLetters();
            attemptsElement.textContent = attempts;
        }
    }
    checkGameStatus();
}

// Comprobar estado del juego
function checkGameStatus() {
    if (correctLetters.length === selectedWord.length) {
        alert('¡Felicidades! ¡Has ganado!');
        restartGame();
    }
    if (attempts === 0) {
        alert(`¡Lamentablemente perdiste! La palabra era: ${selectedWord}`);
        restartGame();
    }
}

// Reiniciar el juego
function restartGame() {
    correctLetters = [];
    wrongLetters = [];
    attempts = 6;
    attemptsElement.textContent = attempts;
    displayWord();
    displayWrongLetters();
}

// Evento al hacer clic en "Comprobar letra"
checkButton.addEventListener('click', () => {
    const letter = letterInput.value.toLowerCase();
    if (letter && letter.match(/[a-z]/)) {
        checkLetter(letter);
        letterInput.value = '';
    } else {
        alert('Por favor, ingresa una letra válida.');
    }
});

// Evento al hacer clic en "Reiniciar juego"
restartButton.addEventListener('click', restartGame);

// Inicializar el juego al cargar la página
init();
