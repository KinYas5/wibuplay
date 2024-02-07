const wordElement = document.getElementById('word');
const wrongLettersElement = document.getElementById('wrong-letters');
const popup = document.getElementById('popup-container');
const message = document.getElementById('final-message');
const playButton = document.getElementById('play-button');

const words = ['silla', 'mesa', 'sofa', 'lampara', 'cama', 'cuadro', 'televisor', 'planta', 'libro', 'telefono'];

let selectedWord = words[Math.floor(Math.random() * words.length)];

const correctLetters = [];
const wrongLetters = [];

// Show hidden word
function displayWord() {
  wordElement.innerHTML = `
    ${selectedWord
      .split('')
      .map(
        letter => `
          <span class="letter">
            ${correctLetters.includes(letter) ? letter : ''}
          </span>
        `
      )
      .join('')}
  `;

  const innerWord = wordElement.innerText.replace(/\n/g, '');

  if (innerWord === selectedWord) {
    message.innerText = '¡Felicidades! ¡Has ganado! 😃';
    popup.style.display = 'flex';
  }
}

// Update the wrong letters
function updateWrongLettersElement() {
  wrongLettersElement.innerHTML = `
    ${wrongLetters.length > 0 ? '<p>Letras incorrectas:</p>' : ''}
    ${wrongLetters.map(letter => `<span class="wrong-letter">${letter}</span>`).join('')}
  `;

  // Display parts
  document.querySelectorAll('.figure-part').forEach((part, index) => {
    const errors = wrongLetters.length;

    if (index < errors) {
      part.style.display = 'block';
    } else {
      part.style.display = 'none';
    }
  });

  // Check if lost
  if (wrongLetters.length === 6) {
    message.innerText = `Lamentablemente perdiste. La palabra era: ${selectedWord}`;
    popup.style.display = 'flex';
  }
}

// Show notification
function showNotification() {
  const notification = document.getElementById('notification-container');
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}

// Keydown letter press
window.addEventListener('keydown', e => {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      const letter = e.key.toUpperCase(); // Convertir la letra a mayúscula
  
      if (!correctLetters.includes(letter)) {
        if (selectedWord.includes(letter)) {
          correctLetters.push(letter);
          displayWord();
        } else {
          if (!wrongLetters.includes(letter)) {
            wrongLetters.push(letter);
            updateWrongLettersElement();
          }
        }
      } else {
        showNotification();
      }
    }
  });
  
  
// Play again button click
playButton.addEventListener('click', () => {
  // Empty arrays
  correctLetters.splice(0);
  wrongLetters.splice(0);

  selectedWord = words[Math.floor(Math.random() * words.length)];

  displayWord();

  updateWrongLettersElement();

  popup.style.display = 'none';
});

displayWord();
