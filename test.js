const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Merhaba, sunucu çalışıyor!');
});

app.listen(3000, () => console.log('Test sunucusu 3000 portunda çalışıyor'));