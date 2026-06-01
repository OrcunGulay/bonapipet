require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const { optimizeExistingFile, createThumbnail, UPLOADS_DIR } = require('./utils/imageProcessor');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

async function run() {
  try {
    const files = fs.readdirSync(UPLOADS_DIR).filter(f => !f.startsWith('.') && (f.endsWith('.jpg') || f.endsWith('.JPG') || f.endsWith('.png') || f.endsWith('.PNG') || f.endsWith('.webp') || f.endsWith('.WEBP')));
    
    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;
    let processedCount = 0;

    console.log(`Bulunan resim sayısı: ${files.length}`);
    
    for (const file of files) {
      if (file.includes('_thumb.')) continue; // Daha önce üretilen thumb'ları atla
      
      const filePath = path.join(UPLOADS_DIR, file);
      
      try {
        const stats = fs.statSync(filePath);
        totalOriginalSize += stats.size;
        
        // 1. Orijinal dosyayı optimize et (yerine yaz)
        const { optimizedSize } = await optimizeExistingFile(filePath);
        totalOptimizedSize += optimizedSize;
        
        // 2. Thumbnail oluştur
        const ext = path.extname(file);
        const basename = path.basename(file, ext);
        const thumbName = `${basename}_thumb${ext}`;
        const thumbPath = path.join(UPLOADS_DIR, thumbName);
        
        await createThumbnail(filePath, thumbPath);
        
        // 3. Veritabanında güncelle
        // fotolar tablosunda kucuk = thumbName yap (sadece buyuk = file olanlar için)
        await pool.query(
          'UPDATE fotolar SET kucuk = $1 WHERE buyuk = $2 AND kucuk = $2',
          [thumbName, file]
        );
        
        processedCount++;
        console.log(`[${processedCount}/${files.length}] İşlendi: ${file} (Boyut: ${(stats.size / 1024 / 1024).toFixed(2)} MB -> ${(optimizedSize / 1024 / 1024).toFixed(2)} MB)`);
      } catch (err) {
        console.error(`Hata: ${file} işlenemedi.`, err.message);
      }
    }

    const savedMB = ((totalOriginalSize - totalOptimizedSize) / 1024 / 1024).toFixed(2);
    console.log(`\n--- OPTİMİZASYON TAMAMLANDI ---`);
    console.log(`Toplam işlenen dosya: ${processedCount}`);
    console.log(`Önceki toplam boyut: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Sonraki toplam boyut: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Tasarruf edilen alan: ${savedMB} MB`);

  } catch (error) {
    console.error('Genel hata:', error);
  } finally {
    pool.end();
  }
}

run();
