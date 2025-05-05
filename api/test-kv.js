const { kv } = require('@vercel/kv');

module.exports = async (req, res) => {
  try {
    // Test verisi yaz
    await kv.set('test-key', 'test-value');
    console.log('Test verisi yazıldı: test-key = test-value');

    // Test verisini oku
    const value = await kv.get('test-key');
    console.log('Test verisi okundu:', value);

    res.status(200).json({ message: 'KV Test Successful', value });
  } catch (error) {
    console.error('KV Test Error:', error);
    res.status(500).json({ message: 'KV Test Failed', error: error.message });
  }
};