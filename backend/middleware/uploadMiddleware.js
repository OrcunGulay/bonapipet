const multer = require('multer');
const path = require('path');

// Sadece güvenli resim formatlarına izin ver
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Sadece JPEG, PNG, WebP ve GIF formatları kabul edilmektedir.'));
};

const upload = multer({
  storage: multer.memoryStorage(), // Bellekte tut, controller'da optimize edip kaydedeceğiz
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // Max 15MB'a çıkardım çünkü orijinal resimler büyük olabiliyor
});

module.exports = upload;

