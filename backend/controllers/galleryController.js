const db = require('../config/db');
const fs = require('fs');
const path = require('path');

/** GET /api/gallery?category=galeri — Galeri fotoğrafları */
const getGallery = async (req, res) => {
  try {
    const { category = 'galeri' } = req.query;
    const [rows] = await db.execute(
      'SELECT * FROM fotolar WHERE kategori = $1 ORDER BY id ASC',
      [category]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** GET /api/gallery/footer — Footer için rastgele 9 galeri fotoğrafı */
const getFooterGallery = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM fotolar WHERE kategori='galeri' ORDER BY RANDOM() LIMIT 9"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** GET /api/admin/gallery — Admin: Tüm fotoğraflar */
const getAllGalleryAdmin = async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM fotolar ORDER BY id DESC';
    const params = [];
    if (category) {
      query = 'SELECT * FROM fotolar WHERE kategori = $1 ORDER BY id DESC';
      params.push(category);
    }
    const [rows] = await db.execute(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** POST /api/admin/gallery — Fotoğraf yükle */
const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Dosya seçilmedi.' });

    const { kategori = 'galeri' } = req.body;
    const buyuk = req.file.filename;
    const kucuk = req.file.filename; // Küçük boyut oluşturmak için sharp kullanılabilir

    await db.execute(
      'INSERT INTO fotolar (kategori, buyuk, kucuk) VALUES ($1, $2, $3)',
      [kategori, buyuk, kucuk]
    );

    res.status(201).json({ success: true, message: 'Fotoğraf yüklendi.', filename: buyuk });
  } catch (err) {
    console.error('uploadPhoto hatası:', err);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** DELETE /api/admin/gallery/:id — Fotoğraf sil */
const deletePhoto = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM fotolar WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Fotoğraf bulunamadı.' });

    // Dosyayı diskten sil
    const filePath = path.join(__dirname, '..', 'uploads', rows[0].buyuk);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await db.execute('DELETE FROM fotolar WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Fotoğraf silindi.' });
  } catch (err) {
    console.error('deletePhoto hatası:', err);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

module.exports = { getGallery, getFooterGallery, getAllGalleryAdmin, uploadPhoto, deletePhoto };
