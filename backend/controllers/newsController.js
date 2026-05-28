const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { translateObject, SUPPORTED_FOREIGN_LANGS } = require('../utils/translator');

/** GET /api/news/:lang — Haberleri listele */
const getNews = async (req, res) => {
  try {
    const { lang = 'tr' } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    const [rows] = await db.execute(
      'SELECT * FROM haber WHERE dil = $1 ORDER BY id DESC LIMIT $2',
      [lang, limit]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('getNews hatası:', err);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** GET /api/news/:lang/:seo — Tek haber detayı */
const getNewsBySeo = async (req, res) => {
  try {
    const { lang = 'tr', seo } = req.params;
    const [rows] = await db.execute(
      'SELECT * FROM haber WHERE seo = $1 LIMIT 1',
      [seo]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Haber bulunamadı.' });

    // Sidebar için tüm haberler
    const [allNews] = await db.execute(
      'SELECT id, no, seo, tarih FROM haber WHERE dil = $1 ORDER BY id DESC',
      [lang]
    );

    res.json({ success: true, data: rows[0], allNews });
  } catch (err) {
    console.error('getNewsBySeo hatası:', err);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** GET /api/admin/news — Admin: Tüm haberler */
const getAllNewsAdmin = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM haber ORDER BY id DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

function slugify(text) {
  const map = { ş:'s',ı:'i',ğ:'g',ü:'u',ö:'o',ç:'c',Ş:'s',İ:'i',Ğ:'g',Ü:'u',Ö:'o',Ç:'c' };
  return text.split('').map(c=>map[c]||c).join('').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}

/** POST /api/admin/news — Haber ekle */
const createNews = async (req, res) => {
  try {
    const { no, aciklama, meta, keyword, dil } = req.body;
    const resim = req.file ? req.file.filename : 'resimyok.png';
    const seo = slugify(no);
    const tarih = new Date().toLocaleDateString('tr-TR');

    const groupId = uuidv4();

    await db.execute(
      'INSERT INTO haber (no, seo, aciklama, meta, keyword, tarih, resim, dil, group_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [no, seo, aciklama, meta, keyword, tarih, resim, dil, groupId]
    );

    if (dil === 'tr') {
      for (const lang of SUPPORTED_FOREIGN_LANGS) {
        try {
          const translated = await translateObject({ no, aciklama, meta, keyword }, lang);
          const tSeo = slugify(translated.no);
          await db.execute(
            'INSERT INTO haber (no, seo, aciklama, meta, keyword, tarih, resim, dil, group_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [translated.no, tSeo, translated.aciklama, translated.meta, translated.keyword, tarih, resim, lang, groupId]
          );
        } catch (e) {
          console.error(`Çeviri hatası (${lang}):`, e);
        }
      }
    }
    res.status(201).json({ success: true, message: 'Haber eklendi.' });
  } catch (err) {
    console.error('createNews hatası:', err);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** PUT /api/admin/news/:id — Haber güncelle */
const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { no, aciklama, meta, keyword, dil, mevcut_resim } = req.body;
    const resim = req.file ? req.file.filename : mevcut_resim;
    const seo = slugify(no);
    const tarih = new Date().toLocaleDateString('tr-TR');

    const [rows] = await db.execute('SELECT group_id FROM haber WHERE id=$1', [id]);
    const groupId = rows.length ? rows[0].group_id : null;

    await db.execute(
      'UPDATE haber SET no=$1, seo=$2, aciklama=$3, meta=$4, keyword=$5, tarih=$6, resim=$7, dil=$8 WHERE id=$9',
      [no, seo, aciklama, meta, keyword, tarih, resim, dil, id]
    );

    if (dil === 'tr' && groupId) {
      for (const lang of SUPPORTED_FOREIGN_LANGS) {
        try {
          const translated = await translateObject({ no, aciklama, meta, keyword }, lang);
          const tSeo = slugify(translated.no);
          await db.execute(
            'UPDATE haber SET no=$1, seo=$2, aciklama=$3, meta=$4, keyword=$5, tarih=$6, resim=$7 WHERE group_id=$8 AND dil=$9',
            [translated.no, tSeo, translated.aciklama, translated.meta, translated.keyword, tarih, resim, groupId, lang]
          );
        } catch (e) {
          console.error(`Çeviri hatası (${lang}):`, e);
        }
      }
    }
    res.json({ success: true, message: 'Haber güncellendi.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** DELETE /api/admin/news/:id — Haber sil */
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT group_id FROM haber WHERE id = $1', [id]);
    if (rows.length && rows[0].group_id) {
      await db.execute('DELETE FROM haber WHERE group_id = $1', [rows[0].group_id]);
    } else {
      await db.execute('DELETE FROM haber WHERE id = $1', [id]);
    }
    res.json({ success: true, message: 'Haber silindi.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

module.exports = { getNews, getNewsBySeo, getAllNewsAdmin, createNews, updateNews, deleteNews };
