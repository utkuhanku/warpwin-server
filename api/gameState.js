// Kullanıcı bazlı oyun durumu (in-memory)
const gameStates = new Map();

function getGameState(userId) {
  if (!gameStates.has(userId)) {
    const initialState = {
      board: [],
      width: 5,
      height: 5,
      mines: 5,
      revealed: new Set(), // Açılan kareler
      flagged: new Set(), // Bayrak konulan kareler
      gameOver: false,
      won: false
    };
    gameStates.set(userId, initialState);
  }
  return gameStates.get(userId);
}

// Tahtayı başlatma fonksiyonu
function startNewGame(userId) {
  const gameState = getGameState(userId);
  gameState.board = Array(gameState.height).fill().map(() => Array(gameState.width).fill(0));
  gameState.revealed = new Set();
  gameState.flagged = new Set();
  gameState.gameOver = false;
  gameState.won = false;

  // Mayınları rastgele yerleştir
  let minesPlaced = 0;
  while (minesPlaced < gameState.mines) {
    const x = Math.floor(Math.random() * gameState.width);
    const y = Math.floor(Math.random() * gameState.height);
    if (gameState.board[y][x] !== -1) {
      gameState.board[y][x] = -1; // -1 mayını temsil eder
      minesPlaced++;
    }
  }

  // Komşu karelerdeki mayın sayısını hesapla
  for (let y = 0; y < gameState.height; y++) {
    for (let x = 0; x < gameState.width; x++) {
      if (gameState.board[y][x] === -1) continue;
      let mineCount = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < gameState.height && nx >= 0 && nx < gameState.width && gameState.board[ny][nx] === -1) {
            mineCount++;
          }
        }
      }
      gameState.board[y][x] = mineCount;
    }
  }
}

// Kare açma fonksiyonu
function revealSquare(userId, x, y) {
  const gameState = getGameState(userId);
  if (x < 0 || x >= gameState.width || y < 0 || y >= gameState.height) return;
  if (gameState.revealed.has(`${x},${y}`) || gameState.flagged.has(`${x},${y}`)) return;

  gameState.revealed.add(`${x},${y}`);
  if (gameState.board[y][x] === -1) {
    gameState.gameOver = true;
    return;
  }

  // Eğer karede sayı yoksa, komşu kareleri otomatik aç
  if (gameState.board[y][x] === 0) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        revealSquare(userId, x + dx, y + dy);
      }
    }
  }

  // Kazanma kontrolü
  const totalNonMines = gameState.width * gameState.height - gameState.mines;
  if (gameState.revealed.size === totalNonMines) {
    gameState.won = true;
    gameState.gameOver = true;
  }
}

// Bayrak koyma fonksiyonu
function flagSquare(userId, x, y) {
  const gameState = getGameState(userId);
  if (x < 0 || x >= gameState.width || y < 0 || y >= gameState.height) return;
  if (gameState.revealed.has(`${x},${y}`)) return;

  const key = `${x},${y}`;
  if (gameState.flagged.has(key)) {
    gameState.flagged.delete(key);
  } else {
    gameState.flagged.add(key);
  }
}

module.exports = {
  getGameState,
  startNewGame,
  revealSquare,
  flagSquare
};