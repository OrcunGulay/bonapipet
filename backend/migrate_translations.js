require('dotenv').config();
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const { translateObject, SUPPORTED_FOREIGN_LANGS } = require('./utils/translator');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

function slugify(text) {
  if (!text) return '';
  const map = { ş:'s',ı:'i',ğ:'g',ü:'u',ö:'o',ç:'c',Ş:'s',İ:'i',Ğ:'g',Ü:'u',Ö:'o',Ç:'c' };
  return text.split('').map(c=>map[c]||c).join('').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}

async function run() {
  try {
    console.log('--- Migration Started ---');
    
    // 1. Delete all non-TR records
    await pool.query("DELETE FROM hizmetlerimiz WHERE dil != 'tr'");
    await pool.query("DELETE FROM haber WHERE dil != 'tr'");
    await pool.query("DELETE FROM sayfa WHERE dil != 'tr'");
    console.log('Non-TR records deleted.');

    // 2. Fetch TR records
    const { rows: trProducts } = await pool.query("SELECT * FROM hizmetlerimiz WHERE dil = 'tr'");
    const { rows: trNews } = await pool.query("SELECT * FROM haber WHERE dil = 'tr'");
    const { rows: trPages } = await pool.query("SELECT * FROM sayfa WHERE dil = 'tr'");
    
    console.log(`Found ${trProducts.length} Products, ${trNews.length} News, ${trPages.length} Pages.`);

    // --- Migrate Products ---
    console.log('Processing Products...');
    for (const product of trProducts) {
      const groupId = product.group_id || uuidv4();
      if (!product.group_id) {
        await pool.query('UPDATE hizmetlerimiz SET group_id = $1 WHERE id = $2', [groupId, product.id]);
      }
      
      for (const lang of SUPPORTED_FOREIGN_LANGS) {
        const translated = await translateObject({
          no: product.no || '',
          aciklama: product.aciklama || '',
          meta: product.meta || '',
          keyword: product.keyword || ''
        }, lang);
        
        const seo = slugify(translated.no);
        
        await pool.query(
          'INSERT INTO hizmetlerimiz (no, seo, aciklama, meta, keyword, tarih, resim, kategori, dil, group_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
          [translated.no, seo, translated.aciklama, translated.meta, translated.keyword, product.tarih, product.resim, product.kategori, lang, groupId]
        );
      }
      console.log(`Product "${product.no}" translated.`);
    }

    // --- Migrate News ---
    console.log('Processing News...');
    for (const news of trNews) {
      const groupId = news.group_id || uuidv4();
      if (!news.group_id) {
        await pool.query('UPDATE haber SET group_id = $1 WHERE id = $2', [groupId, news.id]);
      }
      
      for (const lang of SUPPORTED_FOREIGN_LANGS) {
        const translated = await translateObject({
          no: news.no || '',
          aciklama: news.aciklama || '',
          meta: news.meta || '',
          keyword: news.keyword || ''
        }, lang);
        
        const seo = slugify(translated.no);
        
        await pool.query(
          'INSERT INTO haber (no, seo, aciklama, meta, keyword, tarih, resim, dil, group_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
          [translated.no, seo, translated.aciklama, translated.meta, translated.keyword, news.tarih, news.resim, lang, groupId]
        );
      }
      console.log(`News "${news.no}" translated.`);
    }

    // --- Migrate Pages ---
    console.log('Processing Pages...');
    for (const page of trPages) {
      const groupId = page.group_id || uuidv4();
      if (!page.group_id) {
        await pool.query('UPDATE sayfa SET group_id = $1 WHERE id = $2', [groupId, page.id]);
      }
      
      for (const lang of SUPPORTED_FOREIGN_LANGS) {
        const translated = await translateObject({
          no: page.no || '',
          aciklama: page.aciklama || '',
          meta: page.meta || '',
          keyword: page.keyword || ''
        }, lang);
        
        const seo = slugify(translated.no);
        
        await pool.query(
          'INSERT INTO sayfa (no, seo, aciklama, meta, keyword, resim, dil, group_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
          [translated.no, seo, translated.aciklama, translated.meta, translated.keyword, page.resim, lang, groupId]
        );
      }
      console.log(`Page "${page.no}" translated.`);
    }

    console.log('--- Migration Completed Successfully ---');

  } catch (err) {
    console.error('Migration Error:', err);
  } finally {
    pool.end();
  }
}

run();
