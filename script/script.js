let words = [];
let currentWord = '';
let currentRow = 0;
let gameEnded = false;
let timerInterval;
let timeRemaining = 60;
let timerStarted = false;


const board = document.getElementById('board');
const message = document.getElementById('message');
const submitButton = document.getElementById('submit-guess');
const newWordButton = document.getElementById('new-word');
const revealWordButton = document.getElementById('reveal-word');
const correctSound = document.getElementById('correct-sound');
const incorrectSound = document.getElementById('incorrect-sound');
const guessSound = document.getElementById('guess-sound');
const backgroundMusic = document.getElementById('background-music');
const musicOn = document.getElementById('music-on');
const musicOff = document.getElementById('music-off');
const timerDisplay = document.getElementById('timer');
const hourglass = document.getElementById('hourglass');


let musicPlaying = true;

musicOn.addEventListener('click', toggleMusic);
musicOff.addEventListener('click', toggleMusic);

function toggleMusic() {
    if (musicPlaying) {
        backgroundMusic.pause();
        musicOn.style.display = 'none';
        musicOff.style.display = 'inline';
    } else {
        backgroundMusic.play();
        musicOn.style.display = 'inline';
        musicOff.style.display = 'none';
    }
    musicPlaying = !musicPlaying;
}

fetch('./words/words.txt')
    .then(response => response.text())
    .then(text => {
        words = text.split('\n').map(word => word.trim()).filter(word => word.length === 5);
        startGame();
    })
    .catch(error => {
        console.error('Error loading words:', error);
    });

    function startGame() {
        clearInterval(timerInterval);
        timeRemaining = 60;
        timerDisplay.textContent = `დრო: ${timeRemaining} წმ`;
        hourglass.src = './img/hourglass_static.png'; // Set to static image initially
    
        currentWord = words[Math.floor(Math.random() * words.length)];
        message.textContent = '';
        currentRow = 0;
        currentCellIndex = 0; // Reset currentCellIndex to 0
        gameEnded = false;
        board.innerHTML = '';
        board.style.gridTemplateColumns = `repeat(${currentWord.length}, 60px)`;
        timerStarted = false; // Reset timerStarted flag
    
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < currentWord.length; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                board.appendChild(cell);
            }
        }
    
        submitButton.disabled = false;
        keyboardEnabled = true; // Enable the keyboard
        console.log(currentWord);
    }
    
    

    function startTimer() {
        if (!timerStarted) {
            hourglass.src = './img/hourglass.gif'; // Change to GIF when timer starts
            timerInterval = setInterval(() => {
                if (timeRemaining > 0) {
                    timeRemaining--;
                    timerDisplay.textContent = `დრო: ${timeRemaining} წმ`;
                } else {
                    clearInterval(timerInterval);
                    gameEnded = true;
                    message.textContent = `დრო გავიდა, სიტყვა იყო: ${currentWord}`;
                    incorrectSound.play();
                    submitButton.disabled = true;
                    hourglass.src = './img/hourglass_static.png';
                }
            }, 1000);
            timerStarted = true; // Mark timer as started
        }
    }
    
    

function stopSound(sound) {
    sound.pause();
    sound.currentTime = 0;
}


newWordButton.addEventListener('click', () => {
    startGame();
});



function confettiEffect() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

function getCurrentGuess() {
    const cells = document.querySelectorAll('#board .cell');
    const startIndex = currentRow * currentWord.length;
    const endIndex = startIndex + currentWord.length;
    const currentRowCells = Array.from(cells).slice(startIndex, endIndex);
    return currentRowCells.map(cell => cell.textContent).join('');
}


document.getElementById('redirect-button').addEventListener('click', function() {
    window.open('https://viskonti-manga.netlify.app/', '_blank'); // Opens the link in a new tab
});

