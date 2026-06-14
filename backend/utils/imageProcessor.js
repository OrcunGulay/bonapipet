const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// Uploads dizinini oluştur (yoksa)
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Resim buffer'ını optimize ederek büyük ve küçük versiyonlarını diske yazar.
 * Eğer dosya bir video ise optimize etmeden doğrudan kaydeder.
 * @param {Buffer} buffer – Resim veya video dosyasının buffer'ı
 * @param {string} originalName – Orijinal dosya adı (uzantı çıkarımı için)
 * @returns {{ buyuk: string, kucuk: string }} – Diske yazılan dosya adları
 */
async function processImage(buffer, originalName) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = path.extname(originalName).toLowerCase();
  
  const isVideo = ['.mp4', '.webm', '.ogg'].includes(ext);

  if (isVideo) {
    const videoName = `vid-${uniqueSuffix}${ext}`;
    const videoPath = path.join(UPLOADS_DIR, videoName);
    
    // Videoyu doğrudan diske yaz
    fs.writeFileSync(videoPath, buffer);
    
    return { buyuk: videoName, kucuk: videoName }; // Videolar için küçük versiyon (thumbnail) oluşturmuyoruz şimdilik, aynı ismi dönüyoruz
  }

  const buyukName = `img-${uniqueSuffix}.jpg`;
  const kucukName = `img-${uniqueSuffix}_thumb.jpg`;

  const buyukPath = path.join(UPLOADS_DIR, buyukName);
  const kucukPath = path.join(UPLOADS_DIR, kucukName);

  // Büyük versiyon: max 1200px genişlik, JPEG kalite 80, progressive
  await sharp(buffer)
    .rotate() // EXIF rotation düzeltmesi
    .resize(1200, null, {
      withoutEnlargement: true, // Küçük resimleri büyütme
      fit: 'inside',
    })
    .jpeg({ quality: 80, progressive: true })
    .toFile(buyukPath);

  // Küçük versiyon (thumbnail): max 400px genişlik, JPEG kalite 70
  await sharp(buffer)
    .rotate()
    .resize(400, null, {
      withoutEnlargement: true,
      fit: 'inside',
    })
    .jpeg({ quality: 70, progressive: true })
    .toFile(kucukPath);

  return { buyuk: buyukName, kucuk: kucukName };
}

/**
 * Mevcut bir dosyayı optimize eder (yerinde güncelleme).
 * @param {string} filePath – Optimize edilecek dosyanın tam yolu
 * @param {number} maxWidth – Maksimum genişlik
 * @param {number} quality – JPEG kalite (1-100)
 * @returns {Promise<{ originalSize: number, optimizedSize: number }>}
 */
async function optimizeExistingFile(filePath, maxWidth = 1200, quality = 80) {
  const originalSize = fs.statSync(filePath).size;

  const buffer = fs.readFileSync(filePath);
  const optimized = await sharp(buffer)
    .rotate()
    .resize(maxWidth, null, {
      withoutEnlargement: true,
      fit: 'inside',
    })
    .jpeg({ quality, progressive: true })
    .toBuffer();

  fs.writeFileSync(filePath, optimized);

  return { originalSize, optimizedSize: optimized.length };
}

/**
 * Bir dosyadan thumbnail oluşturur.
 * @param {string} sourcePath – Kaynak dosya yolu
 * @param {string} thumbPath – Thumbnail dosya yolu
 * @param {number} maxWidth – Thumbnail genişliği
 * @param {number} quality – JPEG kalite
 */
async function createThumbnail(sourcePath, thumbPath, maxWidth = 400, quality = 70) {
  const buffer = fs.readFileSync(sourcePath);
  await sharp(buffer)
    .rotate()
    .resize(maxWidth, null, {
      withoutEnlargement: true,
      fit: 'inside',
    })
    .jpeg({ quality, progressive: true })
    .toFile(thumbPath);
}

module.exports = { processImage, optimizeExistingFile, createThumbnail, UPLOADS_DIR };
