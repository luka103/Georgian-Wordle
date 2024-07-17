let words = [];
let currentWord = '';
let currentRow = 0;
let gameEnded = false;
let timerInterval;
let timeRemaining = 60;

const board = document.getElementById('board');
const input = document.getElementById('guess-input');
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
    hourglass.src = './img/hourglass.gif';

    currentWord = words[Math.floor(Math.random() * words.length)];
    message.textContent = '';
    input.value = '';
    input.maxLength = currentWord.length;
    currentRow = 0;
    gameEnded = false;
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${currentWord.length}, 60px)`;

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < currentWord.length; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            board.appendChild(cell);
        }
    }

    submitButton.disabled = false;
    startTimer();
}

function startTimer() {
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
}

function stopSound(sound) {
    sound.pause();
    sound.currentTime = 0;
}

submitButton.addEventListener('click', () => {
    if (gameEnded) return;

    const guess = input.value.trim().toLowerCase();

    if (guess.length !== currentWord.length) {
        message.textContent = `სიტყვა უნდა იყოს ${currentWord.length} ასოიანი`;
        incorrectSound.play();
        return;
    }

    if (!words.includes(guess)) {
        message.textContent = 'შეყვანილი სიტყვა არ არსებობს';
        incorrectSound.play();
        return;
    }

    const guessArray = guess.split('');
    const currentWordArray = currentWord.split('');
    let letterCounts = {};

    for (let i = 0; i < currentWordArray.length; i++) {
        letterCounts[currentWordArray[i]] = (letterCounts[currentWordArray[i]] || 0) + 1;
    }

    let correctLetters = 0;

    for (let i = 0; i < guessArray.length; i++) {
        const cell = board.children[currentRow * currentWord.length + i];
        cell.textContent = guessArray[i];

        if (guessArray[i] === currentWord[i]) {
            cell.classList.add('correct');
            letterCounts[guessArray[i]]--;
            correctLetters++;
        }
    }

    for (let i = 0; i < guessArray.length; i++) {
        const cell = board.children[currentRow * currentWord.length + i];

        if (!cell.classList.contains('correct')) {
            if (currentWordArray.includes(guessArray[i]) && letterCounts[guessArray[i]] > 0) {
                cell.classList.add('present');
                letterCounts[guessArray[i]]--;
            } else {
                cell.classList.add('absent');
            }
        }
    }

    guessSound.play();

    if (guess === currentWord) {
        message.textContent = 'გილოცავთ! თქვენ გამოიცანით';
        stopSound(guessSound);
        correctSound.play();
        confettiEffect();
        submitButton.disabled = true;
        gameEnded = true;
        clearInterval(timerInterval);
        hourglass.src = './img/hourglass_static.png';
    } else {
        message.textContent = '';
        if (currentRow < 5) {
            currentRow++;
        } else {
            message.textContent = `წააგეთ! სიტყვა იყო ${currentWord}`;
            incorrectSound.play();
            gameEnded = true;
            clearInterval(timerInterval);
            hourglass.src = './img/hourglass_static.png';
        }
    }

    input.value = '';
});

newWordButton.addEventListener('click', () => {
    startGame();
});

revealWordButton.addEventListener('click', () => {
    message.textContent = `სიტყვა იყო: ${currentWord}`;
});

function confettiEffect() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}
