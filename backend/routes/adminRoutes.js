const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const { getSettings, updateSettings, getSmtp, updateSmtp, changePassword } = require('../controllers/settingsController');
const { getAllProductsAdmin, createProduct, updateProduct, deleteProduct, getCategories } = require('../controllers/productsController');
const { getAllNewsAdmin, createNews, updateNews, deleteNews } = require('../controllers/newsController');
const { getAllPagesAdmin, createPage, updatePage, deletePage } = require('../controllers/pagesController');
const { getAllGalleryAdmin, uploadPhoto, deletePhoto } = require('../controllers/galleryController');
const { getAllSlidesAdmin, createSlide, updateSlide, deleteSlide } = require('../controllers/slidesController');

// Tüm admin rotalarına JWT middleware uygula
router.use(authMiddleware);

// ── Ayarlar ──────────────────────────────────────────────────────────────────
router.get('/settings',              getSettings);
router.put('/settings',              updateSettings);
router.get('/smtp',                  getSmtp);
router.put('/smtp',                  updateSmtp);
router.put('/auth/password',         changePassword);

// ── Ürünler ──────────────────────────────────────────────────────────────────
router.get('/products',              getAllProductsAdmin);
router.post('/products',             upload.single('resim'), createProduct);
router.put('/products/:id',          upload.single('resim'), updateProduct);
router.delete('/products/:id',       deleteProduct);

// ── Ürün Kategorileri ────────────────────────────────────────────────────────
router.get('/categories',            getCategories);

// ── Haberler ─────────────────────────────────────────────────────────────────
router.get('/news',                  getAllNewsAdmin);
router.post('/news',                 upload.single('resim'), createNews);
router.put('/news/:id',              upload.single('resim'), updateNews);
router.delete('/news/:id',           deleteNews);

// ── Kurumsal Sayfalar ─────────────────────────────────────────────────────────
router.get('/pages',                 getAllPagesAdmin);
router.post('/pages',                upload.single('resim'), createPage);
router.put('/pages/:id',             upload.single('resim'), updatePage);
router.delete('/pages/:id',          deletePage);

// ── Galeri ───────────────────────────────────────────────────────────────────
router.get('/gallery',               getAllGalleryAdmin);
router.post('/gallery',              upload.single('resim'), uploadPhoto);
router.delete('/gallery/:id',        deletePhoto);

// ── Slaytlar ─────────────────────────────────────────────────────────────────
router.get('/slides',                getAllSlidesAdmin);
router.post('/slides',               upload.single('resim'), createSlide);
router.put('/slides/:id',            upload.single('resim'), updateSlide);
router.delete('/slides/:id',         deleteSlide);

module.exports = router;
