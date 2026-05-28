require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Güvenlik Middleware (Helmet'i Cross-Origin ile yapılandır) ──────────────
// crossOriginResourcePolicy: false yaparak resimlerin dışarıdan yüklenmesini engellemiyoruz
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// ── Body Parser ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Static Dosya Servisi (CORS'u Buraya da Uygula) ──────────────────────────
// Resimlerin olduğu klasörü CORS ile sarmalıyoruz
app.use('/uploads', cors(corsOptions), express.static(path.join(__dirname, 'uploads')));

// ── API Rotaları ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// ── Sağlık Kontrolü ─────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bona Pipet API çalışıyor' });
});

// ── Hata Yönetimi ──────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint bulunamadı.' });
});

app.use((err, req, res, next) => {
  console.error('Global Hata:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: 'Sunucu hatası.',
  });
});

app.listen(PORT, '0.0.0.0', () => { // 0.0.0.0 ekledik, dış dünyaya tam açtık
  console.log(`✅ Sunucu ${PORT} portunda çalışıyor.`);
});