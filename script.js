// Game variables
let rows = 10, cols = 10, minesCount = 10;
let board = [];
let revealedCount = 0;
let gameOver = false;
let flagsPlaced = 0;

// Difficulty settings
const difficulties = {
    easy: { rows: 8, cols: 8, mines: 10 },
    normal: { rows: 12, cols: 12, mines: 20 },
    hard: { rows: 16, cols: 16, mines: 40 }
};

// Start the game
function startGame(difficulty = "easy") {
    const { rows: r, cols: c, mines: m } = difficulties[difficulty];
    rows = r; cols = c; minesCount = m;
    revealedCount = 0;
    flagsPlaced = 0;
    gameOver = false;

    document.getElementById("board").innerHTML = "";
    board = [];
    createBoard();
    placeMines();
    calculateNumbers();
}

// Create board tiles
function createBoard() {
    const boardEl = document.getElementById("board");
    boardEl.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.dataset.row = r;
            tile.dataset.col = c;
            tile.addEventListener("click", () => revealTile(r, c));
            tile.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                toggleFlag(r, c);
            });
            boardEl.appendChild(tile);
            row.push({ mine: false, revealed: false, flagged: false, number: 0, element: tile });
        }
        board.push(row);
    }
}

// Place mines randomly
function placeMines() {
    let placed = 0;
    while (placed < minesCount) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        if (!board[r][c].mine) {
            board[r][c].mine = true;
            placed++;
        }
    }
}

// Calculate numbers
function calculateNumbers() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].mine) continue;
            let minesAround = 0;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    let nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) {
                        minesAround++;
                    }
                }
            }
            board[r][c].number = minesAround;
        }
    }
}

// Reveal a tile
function revealTile(r, c) {
    const tile = board[r][c];
    if (tile.revealed || tile.flagged || gameOver) return;

    tile.revealed = true;
    tile.element.classList.add("revealed");

    if (tile.mine) {
        tile.element.textContent = "💥";
        gameOver = true;
        setTimeout(() => alert("💣 Game Over!"), 100);
        return;
    }

    revealedCount++;
    if (tile.number > 0) {
        tile.element.textContent = tile.number;
    } else {
        tile.element.textContent = "";
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                let nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    revealTile(nr, nc);
                }
            }
        }
    }

    checkWin();
}

// Toggle flag
function toggleFlag(r, c) {
    const tile = board[r][c];
    if (tile.revealed || gameOver) return;

    tile.flagged = !tile.flagged;
    if (tile.flagged) {
        tile.element.textContent = "🇦🇫";
        flagsPlaced++;
    } else {
        tile.element.textContent = "";
        flagsPlaced--;
    }
}

// Check win
function checkWin() {
    if (revealedCount === rows * cols - minesCount) {
        gameOver = true;
        setTimeout(() => alert("🎉 You Win!"), 100);
    }
}

// Change difficulty
document.getElementById("difficulty").addEventListener("change", (e) => {
    startGame(e.target.value);
});

// Restart button
document.getElementById("restart").addEventListener("click", () => {
    startGame(document.getElementById("difficulty").value);
});

// Start default game
startGame();
