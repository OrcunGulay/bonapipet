const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

/**
 * POST /api/auth/login
 * admin/giriskontrol.php'nin güvenli karşılığı.
 * - sha1(md5()) yerine bcrypt
 * - SQL Injection'a karşı prepared statements
 * - Hardcoded güvenlik kodu yerine rate limiting
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Kullanıcı adı ve şifre gereklidir.' });
    }

    // Prepared statement - SQL Injection yoktur
    const [rows] = await db.execute(
      'SELECT * FROM yonetici WHERE admin_adi = $1 LIMIT 1',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı.' });
    }

    const admin = rows[0];

    // bcrypt karşılaştırması
    const isMatch = await bcrypt.compare(password, admin.admin_sifresi);

    if (!isMatch) {
      // Eski sha1(md5()) hash'ini de kontrol et (geçiş dönemi için)
      const crypto = require('crypto');
      const oldHash = crypto.createHash('sha1').update(
        crypto.createHash('md5').update(password).digest('hex')
      ).digest('hex');

      if (oldHash !== admin.admin_sifresi) {
        return res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı.' });
      }

      // Eski hash eşleşti, bcrypt'e yükselt
      const newHash = await bcrypt.hash(password, 12);
      await db.execute('UPDATE yonetici SET admin_sifresi = $1 WHERE adminkodu = $2', [newHash, admin.adminkodu]);
      console.log(`ℹ️  Admin "${username}" şifresi bcrypt'e yükseltildi.`);
    }

    // JWT token oluştur
    const token = jwt.sign(
      { id: admin.adminkodu, username: admin.admin_adi },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      message: 'Giriş başarılı.',
      token,
      admin: { id: admin.adminkodu, username: admin.admin_adi },
    });
  } catch (err) {
    console.error('Login hatası:', err);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

/**
 * POST /api/auth/logout
 * JWT stateless olduğundan client tarafında token silinir.
 * Sunucu sadece onay mesajı döner.
 */
const logout = (req, res) => {
  res.json({ success: true, message: 'Çıkış başarıyla yapıldı.' });
};

/**
 * GET /api/auth/verify
 * Token geçerliliğini kontrol et (frontend için)
 */
const verify = (req, res) => {
  res.json({ success: true, admin: req.admin });
};

module.exports = { login, logout, verify };
