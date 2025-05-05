const { getGameState, startNewGame, revealSquare, flagSquare } = require('./gameState');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  console.log('Game fonksiyonu çağrıldı, yanıt hazırlanıyor...');

  if (req.method === 'OPTIONS') {
    console.log('OPTIONS isteği alındı');
    return res.status(200).end();
  }

  // Kullanıcı kimliğini al (şimdilik sabit bir değer kullanıyoruz)
  const userId = req.headers['x-user-id'] || 'default-user';

  // Buton tıklamalarını ve kullanıcı girdisini işle
  if (req.method === 'POST' && req.body && req.body.untrustedData) {
    const { buttonIndex, inputText } = req.body.untrustedData;
    console.log('POST isteği alındı:', { userId, buttonIndex, inputText });

    if (buttonIndex === 3) {
      // "New Game" butonu
      startNewGame(userId);
    } else if (inputText) {
      // Kullanıcı girdisi: "x,y" formatında koordinat
      const [x, y] = inputText.split(',').map(coord => parseInt(coord.trim()));
      if (!isNaN(x) && !isNaN(y)) {
        if (buttonIndex === 1) {
          // "Open Square" butonu
          revealSquare(userId, x, y);
        } else if (buttonIndex === 2) {
          // "Flag Square" butonu
          flagSquare(userId, x, y);
        }
      }
    }
  }

  // Oyun durumuna göre mesaj hazırla
  const gameState = getGameState(userId);
  let message = 'Minesweeper Game';
  if (gameState.gameOver) {
    message = gameState.won ? 'You Won!' : 'Game Over!';
  }

  const imageUrl = 'https://picsum.photos/600/600';
  const htmlContent = `
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
      <body>
        <h1>${message}</h1>
      </body>
    </html>
  `;
  console.log('HTML içeriği hazırladı, gönderiliyor:', htmlContent);
  res.status(200).send(htmlContent);
};