-- ============================================================
-- VERHUURPLANNER — Uitgebreide boekingsvelden
-- Veilig om meerdere keren te draaien (IF NOT EXISTS overal)
-- ============================================================

-- Contactgegevens gast
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS gast_email TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS gast_telefoon TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS gast_adres TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS gast_postcode TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS gast_gemeente TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS gast_land TEXT DEFAULT 'NL';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS taal TEXT DEFAULT 'NL';

-- Aantallen
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS aantal_volwassenen INTEGER;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS aantal_kinderen INTEGER;

-- Check-in / check-uit tijden
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS check_in_tijd TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS check_uit_tijd TEXT;

-- Totaalprijs boeking (verschilt van facturatie_prijs per nacht)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS prijs_totaal NUMERIC(10,2);

-- Origineel boekingsnummer van extern platform
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS boeking_nummer_extern TEXT;

-- Indexen voor veelgebruikte zoekopdrachten
CREATE INDEX IF NOT EXISTS idx_bookings_gast_email ON bookings(gast_email);
