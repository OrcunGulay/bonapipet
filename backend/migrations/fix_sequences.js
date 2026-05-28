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

const tablesConfig = [
  { table: 'altsayfa', idCol: 'id' },
  { table: 'ayarlar', idCol: 'id' },
  { table: 'degerler', idCol: 'id' },
  { table: 'fotokategori', idCol: 'id' },
  { table: 'fotolar', idCol: 'id' },
  { table: 'haber', idCol: 'id' },
  { table: 'hizmetlerimiz', idCol: 'id' },
  { table: 'referanslar', idCol: 'id' },
  { table: 'sayfa', idCol: 'id' },
  { table: 'sayfalar', idCol: 'id' },
  { table: 'smtp', idCol: 'id' },
  { table: 'sosyal', idCol: 'id' },
  { table: 'urun', idCol: 'id' },
  { table: 'videolar', idCol: 'id' },
  { table: 'yonetici', idCol: 'adminkodu' }
];

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('🔄 Starting sequence fix migration...');

    for (const config of tablesConfig) {
      const seqName = `"${config.table}_${config.idCol}_seq"`;
      const tableName = `"${config.table}"`;
      const colName = `"${config.idCol}"`;

      console.log(`   Fixing sequence for ${tableName}.${colName}...`);
      
      // 1. Create sequence if not exists
      await client.query(`CREATE SEQUENCE IF NOT EXISTS ${seqName}`);
      
      // 2. Set default value on the column to nextval
      await client.query(`ALTER TABLE ${tableName} ALTER COLUMN ${colName} SET DEFAULT nextval('${seqName}')`);
      
      // 3. Update the sequence starting value to the current max ID
      const maxRes = await client.query(`SELECT COALESCE(MAX(${colName}), 0) AS max_val FROM ${tableName}`);
      const maxVal = parseInt(maxRes.rows[0].max_val);
      
      // If maxVal exists, set the sequence value to it so the next nextval() gets maxVal + 1
      if (maxVal > 0) {
        await client.query(`SELECT setval('${seqName}', ${maxVal})`);
      } else {
        await client.query(`SELECT setval('${seqName}', 1, false)`);
      }
    }

    await client.query('COMMIT');
    console.log('🎉 Sequences successfully configured for all tables!');
    process.exit(0);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to fix sequences:', err);
    process.exit(1);
  } finally {
    client.release();
  }
}

main();
