const georgianKeyboardLayout = [
    ["ქ", "წ", "ე", "რ", "ტ", "ყ", "უ", "ი", "ო", "პ"],
    ["ა", "ს", "დ", "ფ", "გ", "ჰ", "ჯ", "კ", "ლ"],
    ["ზ", "ხ", "ც", "ვ", "ბ", "ნ", "მ"],
    ["⇨", "ჭ", "ღ", "თ", "შ", "ჟ", "ძ", "ჩ", "⌫"]
];

let currentCellIndex = 0; 
let keyboardEnabled = true; 

function createGeorgianKeyboard() {
    const keyboardContainer = document.getElementById('georgian-keyboard');

    georgianKeyboardLayout.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('keyboard-row');
        row.forEach(key => {
            const keyButton = document.createElement('button');
            keyButton.textContent = key;
            keyButton.classList.add('keyboard-key');
            keyButton.setAttribute('data-key', key);
            keyButton.addEventListener('click', () => handleKeyboardClick(key));
            rowDiv.appendChild(keyButton);
        });
        keyboardContainer.appendChild(rowDiv);
    });
}


function handleKeyboardClick(key) {
    if (!keyboardEnabled) return;

    if (key === '⌫') {
        handleDelete();
    } else if (key === '⇨') {
        handleSubmit();
    } else {
        handleLetterInput(key);
    }
}

function handleLetterInput(letter) {
    if (!keyboardEnabled) return; 

    const cells = document.querySelectorAll('#board .cell');
    const startIndex = currentRow * currentWord.length;
    const endIndex = startIndex + currentWord.length;

    if (currentCellIndex < currentWord.length && currentCellIndex >= 0) {
        const cell = cells[startIndex + currentCellIndex];
        cell.textContent = letter;
        currentCellIndex++;
    }

    if (!timerStarted) {
        startTimer(); 
    }
}

function handleDelete() {
    if (!keyboardEnabled) return; 

    const cells = document.querySelectorAll('#board .cell');
    const startIndex = currentRow * currentWord.length;

    if (currentCellIndex > 0) {
        currentCellIndex--;
        const cell = cells[startIndex + currentCellIndex];
        cell.textContent = '';
    }

    if (!timerStarted) {
        startTimer(); 
    }
}


function handleSubmit() {
    if (gameEnded) return;

    const guess = getCurrentGuess();

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
        const keyButton = document.querySelector(`.keyboard-key[data-key="${guessArray[i]}"]`);
        cell.textContent = guessArray[i];

        if (guessArray[i] === currentWord[i]) {
            cell.classList.add('correct');
            if (keyButton) {
                keyButton.classList.remove('present', 'absent'); 
                keyButton.classList.add('correct');
            }
            letterCounts[guessArray[i]]--;
            correctLetters++;
        }
    }

    for (let i = 0; i < guessArray.length; i++) {
        const cell = board.children[currentRow * currentWord.length + i];
        const keyButton = document.querySelector(`.keyboard-key[data-key="${guessArray[i]}"]`);

        if (!cell.classList.contains('correct')) {
            if (currentWordArray.includes(guessArray[i]) && letterCounts[guessArray[i]] > 0) {
                cell.classList.add('present');
                if (keyButton && !keyButton.classList.contains('correct')) {
                    keyButton.classList.remove('absent'); 
                    keyButton.classList.add('present');
                }
                letterCounts[guessArray[i]]--;
            } else {
                cell.classList.add('absent');
                if (keyButton && !keyButton.classList.contains('correct')) {
                    keyButton.classList.add('absent');
                }
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
        keyboardEnabled = false; 
    } else {
        message.textContent = '';
        if (currentRow < 5) {
            currentRow++;
            currentCellIndex = 0; 
        } else {
            message.textContent = `წააგეთ! სიტყვა იყო ${currentWord}`;
            incorrectSound.play();
            gameEnded = true;
            clearInterval(timerInterval);
            hourglass.src = './img/hourglass_static.png';
            keyboardEnabled = false; 
        }
    }
}




function handleRealKeyboardPress(event) {
    if (!keyboardEnabled) return; 

    const key = event.key.toLowerCase();
    const georgianKeys = georgianKeyboardLayout.flat().map(k => k.toLowerCase());

    if (georgianKeys.includes(key)) {
        handleLetterInput(key);
    } else if (key === 'backspace') {
        handleDelete();
    } else if (key === 'enter') {
        handleSubmit();
    }
}


document.addEventListener('keydown', handleRealKeyboardPress);

createGeorgianKeyboard();
