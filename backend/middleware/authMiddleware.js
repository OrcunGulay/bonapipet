const jwt = require('jsonwebtoken');

/**
 * JWT tabanlı kimlik doğrulama middleware'i.
 * admin/kado.php'deki session kontrolünün güvenli karşılığı.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ success: false, message: 'Yetkilendirme token\'ı bulunamadı. Lütfen giriş yapın.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Oturumunuzun süresi doldu. Lütfen tekrar giriş yapın.' });
    }
    return res.status(403).json({ success: false, message: 'Geçersiz token. Erişim reddedildi.' });
  }
};

module.exports = authMiddleware;
