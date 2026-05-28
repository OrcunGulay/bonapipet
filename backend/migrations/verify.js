const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 5432,
});

async function main() {
  const tables = [
    'ayarlar', 'smtp', 'yonetici', 'fotokategori', 'hizmetlerimiz',
    'fotolar', 'sayfa', 'haber', 'urun', 'degerler', 'referanslar',
    'sayfalar', 'sosyal', 'videolar'
  ];

  console.log('--- Database Table Verification ---');
  for (const table of tables) {
    try {
      const res = await pool.query(`SELECT COUNT(*) FROM "${table}"`);
      console.log(`✅ Table "${table}": ${res.rows[0].count} rows`);
    } catch (err) {
      console.error(`❌ Table "${table}" error:`, err.message);
    }
  }
  pool.end();
}

main();
