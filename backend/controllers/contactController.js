const nodemailer = require('nodemailer');
const db = require('../config/db');

/**
 * POST /api/contact — İletişim formu
 * iletisim.php'nin güvenli, modern Node.js karşılığı.
 * - Rate limiting middleware tarafından sağlanır (contactLimiter)
 * - express-validator ile doğrulama
 * - SMTP ayarları veritabanından çekilir
 */
const sendContact = async (req, res) => {
  try {
    const { adi, mail, telefon, mesaj } = req.body;

    // Temel doğrulama
    if (!adi || !mail || !mesaj) {
      return res.status(400).json({ success: false, message: 'Lütfen zorunlu alanları doldurun.' });
    }

    // E-posta format doğrulama
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail)) {
      return res.status(400).json({ success: false, message: 'Geçerli bir e-posta adresi girin.' });
    }

    // SMTP ayarlarını veritabanından al
    const [smtpRows] = await db.execute('SELECT * FROM smtp WHERE id=1 LIMIT 1');
    if (!smtpRows.length) {
      return res.status(500).json({ success: false, message: 'Mail sistemi yapılandırılmamış.' });
    }
    const smtp = smtpRows[0];

    const transporter = nodemailer.createTransport({
      host: smtp.gelen,
      port: 587,
      secure: false,
      auth: { user: smtp.kullaniciadi, pass: smtp.sifre },
    });

    const mailBody = `
      Bona Pipet - Yeni İletişim Mesajı
      ─────────────────────────────────
      Gönderen : ${adi}
      E-posta  : ${mail}
      Telefon  : ${telefon || '-'}
      Tarih    : ${new Date().toLocaleString('tr-TR')}
      IP       : ${req.ip}

      Mesaj:
      ${mesaj}
    `;

    await transporter.sendMail({
      from: smtp.kullaniciadi,
      to: smtp.kullaniciadi,
      replyTo: mail,
      subject: `Bona Pipet - ${adi} tarafından yeni mesaj`,
      text: mailBody,
    });

    res.json({ success: true, message: 'Mesajınız başarıyla gönderildi.' });
  } catch (err) {
    console.error('sendContact hatası:', err);
    res.status(500).json({ success: false, message: 'Mesaj gönderilirken bir hata oluştu.' });
  }
};

module.exports = { sendContact };
