require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

const PHOTOS_DIR = path.join(__dirname, '..', 'fotoğraflar');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

async function run() {
  try {
    // 1. Update hizmetlerimiz table
    console.log('Updating hizmetlerimiz.kategori = hizmetlerimiz.seo ...');
    await pool.query('UPDATE hizmetlerimiz SET kategori = seo');
    console.log('Update complete.');

    // 2. Read photos
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const files = fs.readdirSync(PHOTOS_DIR).filter(f => !f.startsWith('.'));
    let insertedCount = 0;

    for (const file of files) {
      const lowerName = file.normalize('NFC').toLowerCase();
      let categorySeo = 'duz-pipet'; // default fallback

      // Rule-based matching (longest matches first)
      if (lowerName.includes('jelatin') && lowerName.includes('körüklü') && lowerName.includes('frozen')) {
        categorySeo = 'jelatinli-koruklu-frozen-pipet';
      } else if (lowerName.includes('kağıtlı') && lowerName.includes('körüklü') && lowerName.includes('frozen')) {
        categorySeo = 'kagitli-koruklu-frozen-pipet';
      } else if (lowerName.includes('jelatin') && lowerName.includes('körüklü')) {
        categorySeo = 'jelatinli-koruklu-pipet';
      } else if (lowerName.includes('frozen') && lowerName.includes('kağıtlı')) {
        categorySeo = 'frozen-kagitli-pipet';
      } else if (lowerName.includes('frozen') && lowerName.includes('körüklü')) {
        categorySeo = 'frozen-koruklu-pipet';
      } else if (lowerName.includes('frozen') && lowerName.includes('düz')) {
        categorySeo = 'frozen-duz-pipet';
      } else if ((lowerName.includes('düz') || lowerName.includes('duz')) && lowerName.includes('jelatin')) {
        categorySeo = 'duz-jelatinli-pipet';
      } else if ((lowerName.includes('düz') || lowerName.includes('duz')) && lowerName.includes('kağıtlı')) {
        categorySeo = 'duz-kagitli-pipet';
      } else if (lowerName.includes('körüklü') || lowerName.includes('koruklu')) {
        categorySeo = 'koruklu-pipet';
      } else if (lowerName.includes('artistik')) {
        categorySeo = 'artistik-pipet';
      } else if (lowerName.includes('baskılı') || lowerName.includes('baskili')) {
        categorySeo = 'baskili-pipet';
      } else if (lowerName.includes('düz') || lowerName.includes('duz')) {
        categorySeo = 'duz-pipet';
      } else if (lowerName.includes('jelatin')) { // just jelatinli without körüklü or düz? default to düz jelatinli
        categorySeo = 'duz-jelatinli-pipet';
      }

      // Copy file with new name
      const ext = path.extname(file);
      const newFileName = `${categorySeo}_${Date.now()}_${Math.floor(Math.random() * 1000)}${ext}`;
      const srcPath = path.join(PHOTOS_DIR, file);
      const destPath = path.join(UPLOADS_DIR, newFileName);

      fs.copyFileSync(srcPath, destPath);

      // Insert into db
      await pool.query(
        'INSERT INTO fotolar (kategori, buyuk, kucuk) VALUES ($1, $2, $3)',
        [categorySeo, newFileName, newFileName]
      );
      
      console.log(`Processed ${file} -> ${categorySeo} (${newFileName})`);
      insertedCount++;
    }

    console.log(`\nSuccess! Processed ${insertedCount} photos.`);

  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    pool.end();
  }
}

run();
