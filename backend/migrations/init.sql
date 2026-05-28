-- Drop old tables if necessary (we keep categories, products, orders, tables just in case the user wants them, but let's drop them if we want a clean state. Actually, the user approved the plan which said "mismatch between restaurant db and bonapipet db", let's drop them to avoid confusion, or keep them? Keeping them doesn't hurt, but dropping them makes the DB clean. Let's DROP them if they exist.)

DROP TABLE IF EXISTS hizmetlerimiz;
DROP TABLE IF EXISTS fotokategori;
DROP TABLE IF EXISTS fotolar;
DROP TABLE IF EXISTS sayfa;
DROP TABLE IF EXISTS haber;
DROP TABLE IF EXISTS ayarlar;
DROP TABLE IF EXISTS yonetici;
DROP TABLE IF EXISTS smtp;
DROP TABLE IF EXISTS urun;

-- 1. Ayarlar
CREATE TABLE ayarlar (
  id SERIAL PRIMARY KEY,
  siteadi VARCHAR(255),
  siteadresi VARCHAR(255),
  slogan VARCHAR(255),
  title VARCHAR(255),
  meta TEXT,
  footer TEXT,
  google VARCHAR(255),
  mail VARCHAR(255),
  firmaadresi TEXT,
  telefon VARCHAR(255),
  gsm VARCHAR(255),
  yetkili VARCHAR(255),
  keyword TEXT,
  analiz TEXT,
  facebook VARCHAR(255),
  twitter VARCHAR(255),
  anasayfa VARCHAR(255),
  hakkimizda VARCHAR(255),
  haberler VARCHAR(255),
  iletisim VARCHAR(255)
);

-- 2. SMTP
CREATE TABLE smtp (
  id SERIAL PRIMARY KEY,
  gelen VARCHAR(255),
  giden VARCHAR(255),
  kullaniciadi VARCHAR(255),
  sifre VARCHAR(255)
);

-- 3. Yonetici
CREATE TABLE yonetici (
  adminkodu SERIAL PRIMARY KEY,
  admin_adi VARCHAR(255),
  admin_sifresi VARCHAR(255)
);

-- 4. Foto Kategori (Ürün Kategorileri)
CREATE TABLE fotokategori (
  id SERIAL PRIMARY KEY,
  no VARCHAR(255),
  seo VARCHAR(255),
  dil VARCHAR(10) DEFAULT 'tr'
);

-- 5. Hizmetlerimiz (Ürünler)
CREATE TABLE hizmetlerimiz (
  id SERIAL PRIMARY KEY,
  no VARCHAR(255),
  seo VARCHAR(255),
  aciklama TEXT,
  meta TEXT,
  keyword TEXT,
  tarih VARCHAR(50),
  resim VARCHAR(255),
  kategori VARCHAR(255),
  dil VARCHAR(10) DEFAULT 'tr'
);

-- 6. Fotolar (Galeri)
CREATE TABLE fotolar (
  id SERIAL PRIMARY KEY,
  kategori VARCHAR(255),
  buyuk VARCHAR(255),
  kucuk VARCHAR(255)
);

-- 7. Sayfa (Kurumsal Sayfalar)
CREATE TABLE sayfa (
  id SERIAL PRIMARY KEY,
  no VARCHAR(255),
  seo VARCHAR(255),
  aciklama TEXT,
  meta TEXT,
  keyword TEXT,
  resim VARCHAR(255),
  dil VARCHAR(10) DEFAULT 'tr'
);

-- 8. Haber (Duyurular)
CREATE TABLE haber (
  id SERIAL PRIMARY KEY,
  no VARCHAR(255),
  seo VARCHAR(255),
  aciklama TEXT,
  meta TEXT,
  keyword TEXT,
  tarih VARCHAR(50),
  resim VARCHAR(255),
  dil VARCHAR(10) DEFAULT 'tr'
);

-- 9. Urun (Slaytlar)
CREATE TABLE urun (
  id SERIAL PRIMARY KEY,
  urunadi VARCHAR(255),
  kod VARCHAR(255),
  sira INTEGER DEFAULT 0,
  dil VARCHAR(10) DEFAULT 'tr',
  resimbuyuk VARCHAR(255),
  seo VARCHAR(255)
);
