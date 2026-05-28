
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT column_name FROM information_schema.columns WHERE table_name = 'ayarlar' AND column_name != 'id' AND is_nullable = 'NO')
  LOOP
    EXECUTE 'ALTER TABLE ayarlar ALTER COLUMN ' || quote_ident(r.column_name) || ' DROP NOT NULL';
  END LOOP;
END $$;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT column_name FROM information_schema.columns WHERE table_name = 'galeri' AND column_name != 'id' AND is_nullable = 'NO')
  LOOP
    EXECUTE 'ALTER TABLE galeri ALTER COLUMN ' || quote_ident(r.column_name) || ' DROP NOT NULL';
  END LOOP;
END $$;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT column_name FROM information_schema.columns WHERE table_name = 'haberler' AND column_name != 'id' AND is_nullable = 'NO')
  LOOP
    EXECUTE 'ALTER TABLE haberler ALTER COLUMN ' || quote_ident(r.column_name) || ' DROP NOT NULL';
  END LOOP;
END $$;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT column_name FROM information_schema.columns WHERE table_name = 'hizmetlerimiz' AND column_name != 'id' AND is_nullable = 'NO')
  LOOP
    EXECUTE 'ALTER TABLE hizmetlerimiz ALTER COLUMN ' || quote_ident(r.column_name) || ' DROP NOT NULL';
  END LOOP;
END $$;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT column_name FROM information_schema.columns WHERE table_name = 'iletisim' AND column_name != 'id' AND is_nullable = 'NO')
  LOOP
    EXECUTE 'ALTER TABLE iletisim ALTER COLUMN ' || quote_ident(r.column_name) || ' DROP NOT NULL';
  END LOOP;
END $$;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT column_name FROM information_schema.columns WHERE table_name = 'kategori' AND column_name != 'id' AND is_nullable = 'NO')
  LOOP
    EXECUTE 'ALTER TABLE kategori ALTER COLUMN ' || quote_ident(r.column_name) || ' DROP NOT NULL';
  END LOOP;
END $$;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT column_name FROM information_schema.columns WHERE table_name = 'kategoriler' AND column_name != 'id' AND is_nullable = 'NO')
  LOOP
    EXECUTE 'ALTER TABLE kategoriler ALTER COLUMN ' || quote_ident(r.column_name) || ' DROP NOT NULL';
  END LOOP;
END $$;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT column_name FROM information_schema.columns WHERE table_name = 'sayfa' AND column_name != 'id' AND is_nullable = 'NO')
  LOOP
    EXECUTE 'ALTER TABLE sayfa ALTER COLUMN ' || quote_ident(r.column_name) || ' DROP NOT NULL';
  END LOOP;
END $$;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT column_name FROM information_schema.columns WHERE table_name = 'slider' AND column_name != 'id' AND is_nullable = 'NO')
  LOOP
    EXECUTE 'ALTER TABLE slider ALTER COLUMN ' || quote_ident(r.column_name) || ' DROP NOT NULL';
  END LOOP;
END $$;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT column_name FROM information_schema.columns WHERE table_name = 'smtp' AND column_name != 'id' AND is_nullable = 'NO')
  LOOP
    EXECUTE 'ALTER TABLE smtp ALTER COLUMN ' || quote_ident(r.column_name) || ' DROP NOT NULL';
  END LOOP;
END $$;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT column_name FROM information_schema.columns WHERE table_name = 'sosyal' AND column_name != 'id' AND is_nullable = 'NO')
  LOOP
    EXECUTE 'ALTER TABLE sosyal ALTER COLUMN ' || quote_ident(r.column_name) || ' DROP NOT NULL';
  END LOOP;
END $$;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT column_name FROM information_schema.columns WHERE table_name = 'urun' AND column_name != 'id' AND is_nullable = 'NO')
  LOOP
    EXECUTE 'ALTER TABLE urun ALTER COLUMN ' || quote_ident(r.column_name) || ' DROP NOT NULL';
  END LOOP;
END $$;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT column_name FROM information_schema.columns WHERE table_name = 'yonetici' AND column_name NOT IN ('id', 'adminkodu') AND is_nullable = 'NO')
  LOOP
    EXECUTE 'ALTER TABLE yonetici ALTER COLUMN ' || quote_ident(r.column_name) || ' DROP NOT NULL';
  END LOOP;
END $$;
