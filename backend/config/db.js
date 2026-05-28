const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 5432,
});

// Bağlantıyı test et
(async () => {
  try {
    const client = await pool.connect();
    console.log('✅  PostgreSQL veritabanına başarıyla bağlanıldı.');
    client.release();
  } catch (err) {
    console.error('❌  PostgreSQL bağlantı hatası:', err.message);
  }
})();

module.exports = {
  execute: async (text, params) => {
    const result = await pool.query(text, params);
    // MySQL2 [rows, fields] array destructuring formatını simüle et
    return [result.rows, result.fields];
  },
  pool
};
