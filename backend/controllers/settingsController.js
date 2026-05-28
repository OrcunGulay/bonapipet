const db = require('../config/db');

/** GET /api/settings — Site ayarlarını döndür */
const getSettings = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM ayarlar WHERE id = 1 LIMIT 1');
    if (!rows.length) return res.status(404).json({ success: false, message: 'Ayarlar bulunamadı.' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('getSettings hatası:', err);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** PUT /api/admin/settings — Site ayarlarını güncelle */
const updateSettings = async (req, res) => {
  try {
    const {
      siteadi, siteadresi, slogan, title, meta, footer, google, mail,
      firmaadresi, telefon, gsm, yetkili, keyword, analiz, facebook, twitter,
      anasayfa, hakkimizda, haberler, iletisim,
    } = req.body;

    await db.execute(
      `UPDATE ayarlar SET
        siteadi=$1, siteadresi=$2, slogan=$3, title=$4, meta=$5, footer=$6,
        google=$7, mail=$8, firmaadresi=$9, telefon=$10, gsm=$11, yetkili=$12,
        keyword=$13, analiz=$14, facebook=$15, twitter=$16,
        anasayfa=$17, hakkimizda=$18, haberler=$19, iletisim=$20
       WHERE id=1`,
      [siteadi, siteadresi, slogan, title, meta, footer, google, mail,
       firmaadresi, telefon, gsm, yetkili, keyword, analiz, facebook, twitter,
       anasayfa, hakkimizda, haberler, iletisim]
    );

    res.json({ success: true, message: 'Ayarlar güncellendi.' });
  } catch (err) {
    console.error('updateSettings hatası:', err);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** GET /api/admin/smtp — SMTP ayarlarını döndür */
const getSmtp = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, gelen, giden, kullaniciadi FROM smtp WHERE id=1 LIMIT 1');
    res.json({ success: true, data: rows[0] || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** PUT /api/admin/smtp — SMTP ayarlarını güncelle */
const updateSmtp = async (req, res) => {
  try {
    const { gelen, giden, kullaniciadi, sifre } = req.body;
    await db.execute(
      'UPDATE smtp SET gelen=$1, giden=$2, kullaniciadi=$3, sifre=$4 WHERE id=1',
      [gelen, giden, kullaniciadi, sifre]
    );
    res.json({ success: true, message: 'SMTP ayarları güncellendi.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/** PUT /api/admin/auth/password — Yönetici şifresini değiştir */
const changePassword = async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const { username, password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
      return res.status(400).json({ success: false, message: 'Şifre tekrarı uyuşmuyor.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Şifre en az 6 karakter olmalıdır.' });
    }

    const hashed = await bcrypt.hash(password, 12);
    await db.execute(
      'UPDATE yonetici SET admin_adi=$1, admin_sifresi=$2 WHERE adminkodu=1',
      [username, hashed]
    );

    res.json({ success: true, message: 'Yönetici bilgileri güncellendi.' });
  } catch (err) {
    console.error('changePassword hatası:', err);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

module.exports = { getSettings, updateSettings, getSmtp, updateSmtp, changePassword };
