const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { translateObject, SUPPORTED_FOREIGN_LANGS } = require('../utils/translator');

/** GET /api/pages/:lang — Kurumsal sayfaları listele */
const getPages = async (req, res) => {
  try {
    const { lang = 'tr' } = req.params;
    const [rows] = await db.execute(
      'SELECT * FROM sayfa WHERE dil = $1 ORDER BY id ASC',
      [lang]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** GET /api/pages/:lang/:seo — Tek kurumsal sayfa detayı */
const getPageBySeo = async (req, res) => {
  try {
    const { lang = 'tr', seo } = req.params;

    let rows;
    if (seo) {
      [rows] = await db.execute(
        "SELECT * FROM sayfa WHERE seo = $1 AND dil = $2 LIMIT 1",
        [seo, lang]
      );
    }
    if (!rows || !rows.length) {
      [rows] = await db.execute(
        "SELECT * FROM sayfa WHERE dil = $1 ORDER BY id ASC LIMIT 1",
        [lang]
      );
    }
    if (!rows.length) return res.status(404).json({ success: false, message: 'Sayfa bulunamadı.' });

    // Sidebar için tüm kurumsal sayfalar
    const [allPages] = await db.execute(
      'SELECT id, no, seo FROM sayfa WHERE dil = $1 ORDER BY id ASC',
      [lang]
    );

    res.json({ success: true, data: rows[0], allPages });
  } catch (err) {
    console.error('getPageBySeo hatası:', err);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** GET /api/admin/pages — Admin: Tüm sayfalar */
const getAllPagesAdmin = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM sayfa ORDER BY id DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

function slugify(text) {
  const map = { ş:'s',ı:'i',ğ:'g',ü:'u',ö:'o',ç:'c',Ş:'s',İ:'i',Ğ:'g',Ü:'u',Ö:'o',Ç:'c' };
  return text.split('').map(c=>map[c]||c).join('').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}

/** POST /api/admin/pages — Sayfa ekle */
const createPage = async (req, res) => {
  try {
    const { no, aciklama, meta, keyword, dil } = req.body;
    const resim = req.file ? req.file.filename : '';
    const seo = slugify(no);

    const groupId = uuidv4();

    await db.execute(
      'INSERT INTO sayfa (no, seo, aciklama, meta, keyword, resim, dil, group_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [no, seo, aciklama, meta, keyword, resim, dil, groupId]
    );

    if (dil === 'tr') {
      for (const lang of SUPPORTED_FOREIGN_LANGS) {
        try {
          const translated = await translateObject({ no, aciklama, meta, keyword }, lang);
          const tSeo = slugify(translated.no);
          await db.execute(
            'INSERT INTO sayfa (no, seo, aciklama, meta, keyword, resim, dil, group_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [translated.no, tSeo, translated.aciklama, translated.meta, translated.keyword, resim, lang, groupId]
          );
        } catch (e) {
          console.error(`Çeviri hatası (${lang}):`, e);
        }
      }
    }
    res.status(201).json({ success: true, message: 'Sayfa eklendi.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** PUT /api/admin/pages/:id — Sayfa güncelle */
const updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { no, aciklama, meta, keyword, dil, mevcut_resim } = req.body;
    const resim = req.file ? req.file.filename : mevcut_resim;
    const seo = slugify(no);

    const [rows] = await db.execute('SELECT group_id FROM sayfa WHERE id=$1', [id]);
    const groupId = rows.length ? rows[0].group_id : null;

    await db.execute(
      'UPDATE sayfa SET no=$1, seo=$2, aciklama=$3, meta=$4, keyword=$5, resim=$6, dil=$7 WHERE id=$8',
      [no, seo, aciklama, meta, keyword, resim, dil, id]
    );

    if (dil === 'tr' && groupId) {
      for (const lang of SUPPORTED_FOREIGN_LANGS) {
        try {
          const translated = await translateObject({ no, aciklama, meta, keyword }, lang);
          const tSeo = slugify(translated.no);
          await db.execute(
            'UPDATE sayfa SET no=$1, seo=$2, aciklama=$3, meta=$4, keyword=$5, resim=$6 WHERE group_id=$7 AND dil=$8',
            [translated.no, tSeo, translated.aciklama, translated.meta, translated.keyword, resim, groupId, lang]
          );
        } catch (e) {
          console.error(`Çeviri hatası (${lang}):`, e);
        }
      }
    }
    res.json({ success: true, message: 'Sayfa güncellendi.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** DELETE /api/admin/pages/:id — Sayfa sil */
const deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT group_id FROM sayfa WHERE id = $1', [id]);
    if (rows.length && rows[0].group_id) {
      await db.execute('DELETE FROM sayfa WHERE group_id = $1', [rows[0].group_id]);
    } else {
      await db.execute('DELETE FROM sayfa WHERE id = $1', [id]);
    }
    res.json({ success: true, message: 'Sayfa silindi.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

module.exports = { getPages, getPageBySeo, getAllPagesAdmin, createPage, updatePage, deletePage };
