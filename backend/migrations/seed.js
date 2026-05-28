const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 5432,
});

async function runSQLFile(filePath) {
  console.log(`Running SQL file: ${filePath}`);
  const sql = fs.readFileSync(filePath, 'utf8');
  
  // Split statements by semicolon, being careful not to split inside quotes/functions
  // A simpler way with pg pool is to execute the whole block if it doesn't contain variables or complex blocks,
  // but pg client.query() supports multiple statements separated by semicolon.
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log(`Successfully executed ${filePath}`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`Error executing ${filePath}:`, err);
    throw err;
  } finally {
    client.release();
  }
}

async function main() {
  try {
    // 1. Run pg_converted.sql
    const pgConvertedPath = path.join(__dirname, '../pg_converted.sql');
    await runSQLFile(pgConvertedPath);

    // 2. Run drop_not_nulls.sql
    const dropNotNullsPath = path.join(__dirname, '../drop_not_nulls.sql');
    if (fs.existsSync(dropNotNullsPath)) {
      await runSQLFile(dropNotNullsPath);
    }

    console.log('🎉 Database migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

main();
