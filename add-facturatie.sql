-- ============================================================
-- VERHUURPLANNER — Facturatie migratie
-- Veilig om meerdere keren te draaien (IF NOT EXISTS overal)
-- ============================================================

-- Bedrijfsprofiel voor de verhuurmanager (voor afrekeningsheader)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS facturatie_profiel JSONB DEFAULT '{}'::JSONB;

-- Per-kalender facturatie-instellingen (eigenaar + commissie)
ALTER TABLE calendars ADD COLUMN IF NOT EXISTS facturatie_instellingen JSONB DEFAULT '{}'::JSONB;

-- Privé aantekeningen op boekingen (niet zichtbaar in widget/bevestiging)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS prive_notities TEXT;

-- Handmatige prijs op boeking (overschrijft tarieven bij afrekening)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS facturatie_prijs NUMERIC(10,2);
