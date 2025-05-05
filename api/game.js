// Oyun durumu (8x8 tahta)
let gameState = {
    board: Array(8).fill().map(() => Array(8).fill({ opened: false, flagged: false, mine: false })),
    score: 0,
    gameOver: false
  };
  
  // Yeni oyun başlat: Mayınları rastgele yerleştir
  function startNewGame() {
    gameState.board = Array(8).fill().map(() => Array(8).fill({ opened: false, flagged: false, mine: false }));
    let mines = 10; // 10 mayın
    while (mines > 0) {
      const x = Math.floor(Math.random() * 8);
      const y = Math.floor(Math.random() * 8);
      if (!gameState.board[x][y].mine) {
        gameState.board[x][y].mine = true;
        mines--;
      }
    }
    gameState.score = 0;
    gameState.gameOver = false;
  }
  
  // Vercel sunucusuz fonksiyonu
  module.exports = (req, res) => {
    // CORS başlıklarını ekle
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  
    const { untrustedData } = req.body || {};
    const buttonIndex = untrustedData?.buttonIndex;
    const inputText = untrustedData?.inputText || '';
  
    if (buttonIndex === 3) {
      // Yeni oyun
      startNewGame();
    } else if (inputText) {
      // Koordinatları al (ör. "2,3")
      const [x, y] = inputText.split(',').map(Number);
      if (x >= 0 && x < 8 && y >= 0 && y < 8) {
        if (buttonIndex === 1) {
          // Kareyi aç
          if (gameState.board[x][y].mine) {
            gameState.gameOver = true;
          } else {
            gameState.board[x][y].opened = true;
            gameState.score += 10;
          }
        } else if (buttonIndex === 2) {
          // Bayrak koy
          gameState.board[x][y].flagged = !gameState.board[x][y].flagged;
        }
      }
    }
  
    // Geçici olarak sabit bir placeholder görsel kullanıyoruz
    const imageUrl = 'https://via.placeholder.com/600x600.png?text=Minesweeper+Board';
    res.status(200).send(`
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${imageUrl}" />
          <meta property="fc:frame:button:1" content="Open Square" />
          <meta property="fc:frame:button:2" content="Flag Square" />
          <meta property="fc:frame:button:3" content="New Game" />
          <meta property="fc:frame:input:text" content="Enter square (e.g., 2,3)" />
          <meta property="fc:frame:post_url" content="https://warpwin-server.vercel.app/api/game" />
        </head>
      </html>
    `);
  };