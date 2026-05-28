const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

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
  const hashedPassword = await bcrypt.hash('admin', 12);
  try {
    await pool.query(
      'UPDATE yonetici SET admin_adi = $1, admin_sifresi = $2 WHERE adminkodu = 1',
      ['admin', hashedPassword]
    );
    console.log('✅ Admin password has been successfully reset to "admin"');
  } catch (err) {
    console.error('❌ Failed to reset admin password:', err);
  } finally {
    pool.end();
  }
}

main();
