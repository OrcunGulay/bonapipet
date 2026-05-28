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

// ── Güvenlik Middleware ──────────────────────────────────────────────────────
app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body Parser ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Static Dosya Servisi (Yüklenen Görseller) ───────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Rotaları ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// ── Sağlık Kontrolü ─────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bona Pipet API çalışıyor', timestamp: new Date().toISOString() });
});

// ── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint bulunamadı.' });
});

// ── Global Hata Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Global Hata:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Sunucu hatası.',
  });
});

// ── Sunucuyu Başlat ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Bona Pipet API sunucusu http://localhost:${PORT} adresinde çalışıyor.`);
  console.log(`📂  Ortam: ${process.env.NODE_ENV || 'development'}`);
});
