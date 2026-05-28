const db = require('../config/db');

function slugify(text) {
  const map = { ş:'s',ı:'i',ğ:'g',ü:'u',ö:'o',ç:'c',Ş:'s',İ:'i',Ğ:'g',Ü:'u',Ö:'o',Ç:'c' };
  return text.split('').map(c=>map[c]||c).join('').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}

/** GET /api/slides/:lang — Slayt listesi */
const getSlides = async (req, res) => {
  try {
    const { lang = 'tr' } = req.params;
    const [rows] = await db.execute(
      'SELECT * FROM urun WHERE dil = $1 ORDER BY sira ASC LIMIT 5',
      [lang]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** GET /api/admin/slides — Admin: Tüm slaytlar */
const getAllSlidesAdmin = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM urun ORDER BY sira ASC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** POST /api/admin/slides — Slayt ekle */
const createSlide = async (req, res) => {
  try {
    const { urunadi, kod, sira, dil } = req.body;
    const resimbuyuk = req.file ? req.file.filename : 'resimyok.png';
    const seo = slugify(urunadi);

    await db.execute(
      'INSERT INTO urun (urunadi, kod, sira, dil, resimbuyuk, seo) VALUES ($1, $2, $3, $4, $5, $6)',
      [urunadi, kod, sira || 0, dil || 'tr', resimbuyuk, seo]
    );
    res.status(201).json({ success: true, message: 'Slayt eklendi.' });
  } catch (err) {
    console.error('createSlide hatası:', err);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** PUT /api/admin/slides/:id — Slayt güncelle */
const updateSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const { urunadi, kod, sira, dil, mevcut_resim } = req.body;
    const resimbuyuk = req.file ? req.file.filename : mevcut_resim;
    const seo = slugify(urunadi);

    await db.execute(
      'UPDATE urun SET urunadi=$1, kod=$2, sira=$3, dil=$4, resimbuyuk=$5, seo=$6 WHERE id=$7',
      [urunadi, kod, sira || 0, dil || 'tr', resimbuyuk, seo, id]
    );
    res.json({ success: true, message: 'Slayt güncellendi.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** DELETE /api/admin/slides/:id — Slayt sil */
const deleteSlide = async (req, res) => {
  try {
    await db.execute('DELETE FROM urun WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Slayt silindi.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

module.exports = { getSlides, getAllSlidesAdmin, createSlide, updateSlide, deleteSlide };
