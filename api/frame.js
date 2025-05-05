module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    console.log('Frame fonksiyonu çağrıldı, yanıt hazırlanıyor...');
    if (req.method === 'OPTIONS') {
      console.log('OPTIONS isteği alındı');
      return res.status(200).end();
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
          <h1>Minesweeper Frame</h1>
        </body>
      </html>
    `;
    console.log('HTML içeriği hazırladı, gönderiliyor:', htmlContent);
    res.status(200).send(htmlContent);
  };