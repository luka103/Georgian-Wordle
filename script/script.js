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
const timerDisplay = document.getElementById('timer');
const hourglass = document.getElementById('hourglass');
const audioPlayer = document.getElementById('audio-player');
const songList = document.getElementById('song-list');
const muteIcon = document.getElementById('mute-icon');
const playlistToggle = document.getElementById('playlist-toggle');
const arrowIcon = document.getElementById('arrow-icon');
let currentSongIndex = 0; // Keep track of the current song index

playlistToggle.addEventListener('click', () => {
    if (songList.style.display === 'none' || songList.style.display === '') {
        songList.style.display = 'block';
        arrowIcon.textContent = '▲'; // Change to up arrow
    } else {
        songList.style.display = 'none';
        arrowIcon.textContent = '▼'; // Change to down arrow
    }
});

songList.addEventListener('click', (event) => {
    if (event.target && event.target.matches('div[data-song]')) {
        const song = event.target.getAttribute('data-song');
        if (song) {
            playSong(song);
            currentSongIndex = Array.from(songList.children).indexOf(event.target); // Update the current song index
            songList.style.display = 'none'; // Hide the dropdown after selection
            arrowIcon.textContent = '▼'; // Change to down arrow
        }
    }
});

muteIcon.addEventListener('click', () => {
    if (audioPlayer.muted) {
        audioPlayer.muted = false;
        muteIcon.src = './img/music-on.svg'; // Replace with the path to your unmute icon
    } else {
        audioPlayer.muted = true;
        muteIcon.src = './img/music-off.png'; // Replace with the path to your mute icon
    }
});

audioPlayer.addEventListener('ended', () => {
    currentSongIndex = (currentSongIndex + 1) % songList.children.length; // Loop to the next song
    const nextSongElement = songList.children[currentSongIndex];
    const nextSong = nextSongElement.getAttribute('data-song');
    if (nextSong) {
        playSong(nextSong);
    }
});

function playSong(song) {
    audioPlayer.src = song;
    audioPlayer.play();
}

// Optionally, start with a selected song if desired
if (songList.querySelector('div[data-song]')) {
    playSong(songList.querySelector('div[data-song]').getAttribute('data-song'));
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
        hourglass.src = './img/hourglass_static.png'; 
    
        currentWord = words[Math.floor(Math.random() * words.length)];
        message.textContent = '';
        currentRow = 0;
        currentCellIndex = 0; 
        gameEnded = false;
        board.innerHTML = '';
        board.style.gridTemplateColumns = `repeat(${currentWord.length}, 60px)`;
        timerStarted = false; 
    
        const keyButtons = document.querySelectorAll('.keyboard-key');
        keyButtons.forEach(button => {
            button.classList.remove('correct', 'present', 'absent');
        });
    
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < currentWord.length; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                board.appendChild(cell);
            }
        }
    
        submitButton.disabled = false;
        keyboardEnabled = true; 
        console.log(currentWord);
    }

    function startTimer() {
        if (!timerStarted) {
            hourglass.src = './img/hourglass.gif'; 
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
                    keyboardEnabled = false;
                }
            }, 1000);
            timerStarted = true; 
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


// document.getElementById('redirect-button').addEventListener('click', function() {
//     window.open('https://viskonti-manga.netlify.app/', '_blank'); 
// });

