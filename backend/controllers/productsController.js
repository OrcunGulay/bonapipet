const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { translateObject, SUPPORTED_FOREIGN_LANGS } = require('../utils/translator');

/** GET /api/products/:lang — Tüm ürünleri (artık fotoğrafları) listele */
const getProducts = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT fotolar.id, fotolar.kategori, fotolar.buyuk as resim, fotolar.buyuk as no 
      FROM fotolar 
      JOIN fotokategori ON fotolar.kategori = fotokategori.seo 
      ORDER BY fotolar.id DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('getProducts hatası:', err);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** GET /api/products/:lang/:seo — Tek ürün detayı */
const getProductBySeo = async (req, res) => {
  try {
    const { lang = 'tr', seo } = req.params;
    const [rows] = await db.execute(
      'SELECT * FROM hizmetlerimiz WHERE seo = $1 AND dil = $2 LIMIT 1',
      [seo, lang]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Ürün bulunamadı.' });

    // İlgili fotoğrafları da getir
    const [photos] = await db.execute(
      "SELECT * FROM fotolar WHERE kategori = $1",
      [rows[0].kategori]
    );

    res.json({ success: true, data: { ...rows[0], photos } });
  } catch (err) {
    console.error('getProductBySeo hatası:', err);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** GET /api/admin/products — Admin: Tüm ürünleri listele */
const getAllProductsAdmin = async (req, res) => {
  try {
    // Sadece ürün kategorilerine (fotokategori) ait fotoğrafları listele
    const [rows] = await db.execute(`
      SELECT fotolar.id, fotolar.kategori, fotolar.buyuk as resim, fotolar.buyuk as no 
      FROM fotolar 
      JOIN fotokategori ON fotolar.kategori = fotokategori.seo 
      ORDER BY fotolar.id DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** POST /api/admin/products — Yeni ürün ekle (Fotoğraf olarak) */
const createProduct = async (req, res) => {
  try {
    const { kategori } = req.body;
    const resim = req.file ? req.file.filename : 'resimyok.png';

    await db.execute(
      'INSERT INTO fotolar (kategori, buyuk, kucuk) VALUES ($1, $2, $3)',
      [kategori, resim, resim]
    );

    res.status(201).json({ success: true, message: 'Kategoriye fotoğraf eklendi.' });
  } catch (err) {
    console.error('createProduct hatası:', err);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** PUT /api/admin/products/:id — Ürün güncelle (Sadece kategori değiştirmeye izin ver) */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { kategori } = req.body;
    
    // Fotoğraf güncelleme varsa
    if (req.file) {
      const resim = req.file.filename;
      await db.execute('UPDATE fotolar SET kategori=$1, buyuk=$2, kucuk=$3 WHERE id=$4', [kategori, resim, resim, id]);
    } else {
      await db.execute('UPDATE fotolar SET kategori=$1 WHERE id=$2', [kategori, id]);
    }

    res.json({ success: true, message: 'Fotoğraf güncellendi.' });
  } catch (err) {
    console.error('updateProduct hatası:', err);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** DELETE /api/admin/products/:id — Ürün sil */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const fs = require('fs');
    const path = require('path');
    
    const [rows] = await db.execute('SELECT buyuk FROM fotolar WHERE id = $1', [id]);
    if (rows.length) {
      const filePath = path.join(__dirname, '..', 'uploads', rows[0].buyuk);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await db.execute('DELETE FROM fotolar WHERE id = $1', [id]);
    res.json({ success: true, message: 'Fotoğraf silindi.' });
  } catch (err) {
    console.error('deleteProduct hatası:', err);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** GET /api/admin/categories — Ürün kategorileri */
const getCategories = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM fotokategori ORDER BY id ASC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

// Yardımcı: Türkçe karakterli slug üretici
function slugify(text) {
  const map = { ş: 's', ı: 'i', ğ: 'g', ü: 'u', ö: 'o', ç: 'c', Ş: 's', İ: 'i', Ğ: 'g', Ü: 'u', Ö: 'o', Ç: 'c' };
  return text
    .split('')
    .map(c => map[c] || c)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

module.exports = { getProducts, getProductBySeo, getAllProductsAdmin, createProduct, updateProduct, deleteProduct, getCategories };
