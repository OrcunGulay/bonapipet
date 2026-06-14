const multer = require('multer');
const path = require('path');

// Sadece güvenli resim ve video formatlarına izin ver
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif|mp4|webm|ogg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Sadece JPEG, PNG, WebP, GIF, MP4, WEBM ve OGG formatları kabul edilmektedir.'));
};

const upload = multer({
  storage: multer.memoryStorage(), // Bellekte tut, controller'da optimize edip kaydedeceğiz
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // Max 50MB (videolar için artırıldı)
});

module.exports = upload;

