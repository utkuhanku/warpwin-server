module.exports = (req, res) => {
    // CORS başlıklarını ekle
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  
    // Minimal test: hemen bir yanıt döndür
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