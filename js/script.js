
const SYMBOLS_COUNT = {
    '💎': 2,
    '🧨': 4,
    '💲': 6,
    '🐎': 8
};

const SYMBOL_VALUES = {
    '💎': 5,
    '🧨': 4,
    '💲': 3,
    '🐎': 2
};

const ROWS = 3;
const COLS = 3;

let balance = 0;

const deposit = () => {
    const depositAmount = parseFloat(document.getElementById("depositAmount").value);
    if (isNaN(depositAmount) || depositAmount <= 0) {
        alert("Invalid deposit amount, try again.");
    } else {
        balance += depositAmount;
        updateBalanceDisplay();
    }
};

const getNumberofLines = () => {
    const lines = parseFloat(document.getElementById("betLines").value);
    if (isNaN(lines) || lines > 3 || lines < 1) {
        alert("Invalid number of lines, try again.");
        return null;
    }
    return lines;
};

const getBet = (lines) => {
    const bet = parseFloat(document.getElementById("betAmount").value);
    if (isNaN(bet) || bet <= 0 || bet > balance / lines) {
        alert("Invalid bet, try again.");
        return null;
    }
    return bet;
};

const spin = () => {
    const symbols = [];

    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

const printRows = (rows) => {
    for (let i = 0; i < rows.length; i++) {
        const reelElement = document.getElementById(`reel${i + 1}`);
        reelElement.innerHTML = ''; // Clear previous symbols
        const symbolContainer = document.createElement('div');
        symbolContainer.classList.add('symbol-container');
        rows[i].forEach(symbol => {
            const symbolElement = document.createElement('div');
            symbolElement.classList.add('symbol');
            symbolElement.innerText = symbol;
            symbolContainer.appendChild(symbolElement);
        });
        reelElement.appendChild(symbolContainer);
    }
};

const startSpinAnimation = () => {
    const reels = document.querySelectorAll('.symbol-container');
    reels.forEach(reel => {
        reel.style.top = '-300%'; // Change this value if needed to ensure it scrolls past 3 symbols
    });
};

const stopSpinAnimation = (reels) => {
    reels.forEach((reel, i) => {
        const symbolContainer = reel.querySelector('.symbol-container');
        symbolContainer.style.top = '0';
    });
};

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol !== symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }

    return winnings;
};

const updateBalanceDisplay = () => {
    document.getElementById("balanceDisplay").innerText = `Balance: Rs.${balance}`;
};

const updateWinningsDisplay = (winnings) => {
    document.getElementById("winningsDisplay").innerText = `Winnings: Rs.${winnings}`;
};

const updateResultMessage = (message) => {
    document.getElementById("resultMessage").innerText = message;
};

const game = () => {
    const lines = getNumberofLines();
    if (lines === null) return;
    const bet = getBet(lines);
    if (bet === null) return;

    balance -= bet * lines;
    updateBalanceDisplay();
    const reels = spin();
    const rows = transpose(reels);

    printRows(rows);
    startSpinAnimation();

    setTimeout(() => {
        stopSpinAnimation(document.querySelectorAll('.reel'));
        const winnings = getWinnings(rows, bet, lines);
        balance += winnings;
        updateBalanceDisplay();
        updateWinningsDisplay(winnings);

        if (winnings > 0) {
            updateResultMessage(`You won Rs.${winnings}!`);
        } else {
            updateResultMessage("You didn't win this time. Try again!");
        }
    }, 100); // Stop spinning after 2 seconds
};

document.getElementById("depositButton").addEventListener("click", deposit);
document.getElementById("betButton").addEventListener("click", game);
document.getElementById("spinButton").addEventListener("click", game);

updateBalanceDisplay();
updateWinningsDisplay(0);
