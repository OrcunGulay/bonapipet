const translate = require('google-translate-api-x');

/**
 * Belirtilen metni hedeflenen dile çevirir.
 * @param {string} text Çevrilecek metin (HTML olabilir)
 * @param {string} targetLang Hedef dil kodu ('en', 'de', vb.)
 * @returns {Promise<string>} Çevrilmiş metin
 */
const translateText = async (text, targetLang) => {
  if (!text || text.trim() === '') return text;
  // Google Translate API uses 'es' for Spanish, but our system uses 'sp'
  const gtLang = targetLang === 'sp' ? 'es' : targetLang;
  try {
    const res = await translate(text, { to: gtLang });
    return res.text;
  } catch (error) {
    console.error(`Çeviri hatası (${targetLang}):`, error);
    return text; // Hata durumunda orijinal metni döndür ki sistem çökmesin
  }
};

/**
 * Birden fazla metni toplu halde çevirir.
 * @param {Object} fieldsObj { key: 'Metin', ... }
 * @param {string} targetLang Hedef dil kodu
 * @returns {Promise<Object>} Çevrilmiş objeyi döndürür
 */
const translateObject = async (fieldsObj, targetLang) => {
  const translated = {};
  for (const [key, value] of Object.entries(fieldsObj)) {
    translated[key] = await translateText(value, targetLang);
  }
  return translated;
};

// Desteklenen yabancı diller
const SUPPORTED_FOREIGN_LANGS = ['en', 'de', 'fr', 'ru', 'sp', 'ar'];

module.exports = {
  translateText,
  translateObject,
  SUPPORTED_FOREIGN_LANGS
};
