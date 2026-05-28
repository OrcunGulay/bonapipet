const rateLimit = require('express-rate-limit');

/**
 * Admin girişi için rate limiter.
 * Mevcut PHP'deki hardcoded "123456" CAPTCHA bypass açığının gerçek çözümü.
 * 15 dakika içinde maksimum 5 başarısız giriş denemesi.
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Çok fazla giriş denemesi yaptınız. Lütfen 15 dakika sonra tekrar deneyin.',
  },
  skipSuccessfulRequests: true, // Başarılı girişleri sayma
});

/**
 * İletişim formu için rate limiter.
 * Mevcut PHP'deki session sayacının gerçek (IP bazlı) karşılığı.
 * 10 dakika içinde maksimum 3 mesaj.
 */
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 dakika
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Mesaj gönderme limitinizi aştınız. Lütfen 10 dakika sonra tekrar deneyin.',
  },
});

/**
 * Genel API istekleri için rate limiter.
 */
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 dakika
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Çok fazla istek gönderdiniz. Lütfen bir dakika bekleyin.',
  },
});

module.exports = { loginLimiter, contactLimiter, generalLimiter };
