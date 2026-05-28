const express = require('express');
const router = express.Router();
const { generalLimiter, contactLimiter } = require('../middleware/rateLimiter');

const { getSettings } = require('../controllers/settingsController');
const { getProducts, getProductBySeo, getCategories } = require('../controllers/productsController');
const { getNews, getNewsBySeo } = require('../controllers/newsController');
const { getPages, getPageBySeo } = require('../controllers/pagesController');
const { getGallery, getFooterGallery } = require('../controllers/galleryController');
const { sendContact } = require('../controllers/contactController');
const { getSlides } = require('../controllers/slidesController');

router.use(generalLimiter);

// Site ayarları
router.get('/settings', getSettings);

// Dil desteği - lang/tr.php vb. dosyalarından dönüştürülmüş
router.get('/lang/:lang', (req, res) => {
  const { translations } = require('../i18n/translations');
  const { lang } = req.params;
  const supportedLangs = ['tr', 'en', 'de', 'fr', 'ru', 'sp', 'ar'];
  if (!supportedLangs.includes(lang)) {
    return res.status(400).json({ success: false, message: 'Desteklenmeyen dil.' });
  }
  res.json({ success: true, data: translations[lang] || translations['tr'] });
});

// Slaytlar
router.get('/slides/:lang', getSlides);

// Ürünler
router.get('/products/:lang', getProducts);
router.get('/products/:lang/:seo', getProductBySeo);
router.get('/categories', getCategories);

// Haberler / Duyurular
router.get('/news/:lang', getNews);
router.get('/news/:lang/:seo', getNewsBySeo);

// Kurumsal sayfalar
router.get('/pages/:lang', getPages);
router.get('/pages/:lang/:seo', getPageBySeo);

// Galeri
router.get('/gallery', getGallery);
router.get('/gallery/footer', getFooterGallery);

// İletişim formu
router.post('/contact', contactLimiter, sendContact);

module.exports = router;
