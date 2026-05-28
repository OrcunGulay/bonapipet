-- PostgreSQL Init DB Script for Bonapipet

-- yonetici tablosu
CREATE TABLE IF NOT EXISTS yonetici (
    adminkodu SERIAL PRIMARY KEY,
    admin_adi VARCHAR(255) NOT NULL,
    admin_sifresi VARCHAR(255) NOT NULL
);

-- hizmetlerimiz tablosu (Ürünler)
CREATE TABLE IF NOT EXISTS hizmetlerimiz (
    id SERIAL PRIMARY KEY,
    no VARCHAR(255),
    seo VARCHAR(255),
    aciklama TEXT,
    meta VARCHAR(255),
    keyword VARCHAR(255),
    tarih VARCHAR(50),
    resim VARCHAR(255),
    kategori VARCHAR(255),
    dil VARCHAR(10)
);

-- fotolar tablosu (Galeri)
CREATE TABLE IF NOT EXISTS fotolar (
    id SERIAL PRIMARY KEY,
    kategori VARCHAR(255),
    buyuk VARCHAR(255),
    kucuk VARCHAR(255)
);

-- fotokategori tablosu (Kategoriler)
CREATE TABLE IF NOT EXISTS fotokategori (
    id SERIAL PRIMARY KEY,
    seo VARCHAR(255),
    no VARCHAR(255)
);

-- haber tablosu (Haberler)
CREATE TABLE IF NOT EXISTS haber (
    id SERIAL PRIMARY KEY,
    no VARCHAR(255),
    seo VARCHAR(255),
    aciklama TEXT,
    meta VARCHAR(255),
    keyword VARCHAR(255),
    tarih VARCHAR(50),
    resim VARCHAR(255),
    dil VARCHAR(10)
);

-- sayfa tablosu (Sayfalar)
CREATE TABLE IF NOT EXISTS sayfa (
    id SERIAL PRIMARY KEY,
    no VARCHAR(255),
    seo VARCHAR(255),
    aciklama TEXT,
    meta VARCHAR(255),
    keyword VARCHAR(255),
    resim VARCHAR(255),
    dil VARCHAR(10)
);

-- ayarlar tablosu
CREATE TABLE IF NOT EXISTS ayarlar (
    id SERIAL PRIMARY KEY,
    siteadi VARCHAR(255),
    siteadresi VARCHAR(255),
    slogan VARCHAR(255),
    title VARCHAR(255),
    meta TEXT,
    footer TEXT,
    google TEXT,
    mail VARCHAR(255),
    firmaadresi TEXT,
    telefon VARCHAR(50),
    gsm VARCHAR(50),
    yetkili VARCHAR(255),
    keyword TEXT,
    analiz TEXT,
    facebook VARCHAR(255),
    twitter VARCHAR(255),
    anasayfa TEXT,
    hakkimizda TEXT,
    haberler TEXT,
    iletisim TEXT
);

-- smtp tablosu
CREATE TABLE IF NOT EXISTS smtp (
    id SERIAL PRIMARY KEY,
    gelen VARCHAR(255),
    giden VARCHAR(255),
    kullaniciadi VARCHAR(255),
    sifre VARCHAR(255)
);

-- urun tablosu (Slider)
CREATE TABLE IF NOT EXISTS urun (
    id SERIAL PRIMARY KEY,
    urunadi VARCHAR(255),
    kod VARCHAR(255),
    sira INTEGER DEFAULT 0,
    dil VARCHAR(10),
    resimbuyuk VARCHAR(255),
    seo VARCHAR(255)
);

-- Varsayılan Verileri Ekle (sadece tablolar boşsa eklenmeli, ancak her ihtimale karşı TRUNCATE edip ekliyoruz veya ON CONFLICT DO NOTHING yapabiliriz ama PostgreSQL de id ile insert yaparsak yapabiliriz)
INSERT INTO yonetici (adminkodu, admin_adi, admin_sifresi) VALUES (1, 'admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918') ON CONFLICT (adminkodu) DO NOTHING;

INSERT INTO ayarlar (id, siteadi, siteadresi, slogan) VALUES (1, 'Bona Pipet', 'http://localhost:5173', 'Slogan') ON CONFLICT (id) DO NOTHING;

INSERT INTO smtp (id, kullaniciadi, sifre, gelen, giden) VALUES (1, 'info@bonapipet.com', 'password', 'mail.bonapipet.com', 'mail.bonapipet.com') ON CONFLICT (id) DO NOTHING;
