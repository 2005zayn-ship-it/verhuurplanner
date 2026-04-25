-- ============================================================
-- VERHUURPLANNER — Volledige widget + tarieven migratie
-- Veilig om meerdere keren te draaien (IF NOT EXISTS overal)
-- ============================================================

-- Widget config + iCal import op kalenders
ALTER TABLE calendars ADD COLUMN IF NOT EXISTS widget_config JSONB DEFAULT '{}'::JSONB;
ALTER TABLE calendars ADD COLUMN IF NOT EXISTS ical_import_urls JSONB DEFAULT '[]'::JSONB;

-- Boekingsbron + groep (multi-unit boekingen)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS bron TEXT DEFAULT NULL;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS groep_id UUID;

-- ============================================================
-- TARIEVEN TABEL
-- ============================================================
CREATE TABLE IF NOT EXISTS calendar_tarieven (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_id UUID NOT NULL REFERENCES calendars(id) ON DELETE CASCADE,
  naam TEXT NOT NULL DEFAULT 'Standaardtarief',
  van_datum DATE,
  tot_datum DATE,
  prijs_nacht NUMERIC(10,2),
  prijs_weekend NUMERIC(10,2),
  prijs_lang_weekend NUMERIC(10,2),
  prijs_midweek NUMERIC(10,2),
  prijs_week NUMERIC(10,2),
  prijs_14nachten NUMERIC(10,2),
  prijs_21nachten NUMERIC(10,2),
  prijs_maand NUMERIC(10,2),
  aankomst_dagen INTEGER[] DEFAULT '{1,2,3,4,5,6,7}',
  vertrek_dagen INTEGER[] DEFAULT '{1,2,3,4,5,6,7}',
  min_nachten INTEGER DEFAULT 1,
  max_nachten INTEGER,
  is_standaard BOOLEAN DEFAULT FALSE,
  volgorde INTEGER DEFAULT 0,
  actief BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Nieuwe prijskolommen toevoegen als de tabel al bestond
ALTER TABLE calendar_tarieven ADD COLUMN IF NOT EXISTS prijs_14nachten NUMERIC(10,2);
ALTER TABLE calendar_tarieven ADD COLUMN IF NOT EXISTS prijs_21nachten NUMERIC(10,2);
ALTER TABLE calendar_tarieven ADD COLUMN IF NOT EXISTS prijs_maand NUMERIC(10,2);

-- ============================================================
-- DIENSTEN TABEL
-- ============================================================
CREATE TABLE IF NOT EXISTS calendar_diensten (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_id UUID NOT NULL REFERENCES calendars(id) ON DELETE CASCADE,
  naam TEXT NOT NULL,
  omschrijving TEXT,
  actief BOOLEAN DEFAULT TRUE,
  verplicht BOOLEAN DEFAULT FALSE,
  optie_type TEXT DEFAULT 'ja_nee' CHECK (optie_type IN ('ja_nee', 'aantal', 'altijd')),
  frequentie TEXT DEFAULT 'per_boeking' CHECK (frequentie IN ('per_boeking', 'per_nacht', 'per_persoon', 'per_item')),
  prijs NUMERIC(10,2) DEFAULT 0,
  btw_percentage NUMERIC(5,2) DEFAULT 0,
  korting_meenemen BOOLEAN DEFAULT TRUE,
  volgorde INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexen
CREATE INDEX IF NOT EXISTS idx_calendar_tarieven_calendar_id ON calendar_tarieven(calendar_id);
CREATE INDEX IF NOT EXISTS idx_calendar_diensten_calendar_id ON calendar_diensten(calendar_id);

-- ============================================================
-- RLS POLICIES
-- ============================================================
ALTER TABLE calendar_tarieven ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_diensten ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'calendar_tarieven' AND policyname = 'tarieven_select_own') THEN
    CREATE POLICY "tarieven_select_own" ON calendar_tarieven FOR SELECT
      USING (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'calendar_tarieven' AND policyname = 'tarieven_insert_own') THEN
    CREATE POLICY "tarieven_insert_own" ON calendar_tarieven FOR INSERT
      WITH CHECK (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'calendar_tarieven' AND policyname = 'tarieven_update_own') THEN
    CREATE POLICY "tarieven_update_own" ON calendar_tarieven FOR UPDATE
      USING (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'calendar_tarieven' AND policyname = 'tarieven_delete_own') THEN
    CREATE POLICY "tarieven_delete_own" ON calendar_tarieven FOR DELETE
      USING (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'calendar_diensten' AND policyname = 'diensten_select_own') THEN
    CREATE POLICY "diensten_select_own" ON calendar_diensten FOR SELECT
      USING (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'calendar_diensten' AND policyname = 'diensten_insert_own') THEN
    CREATE POLICY "diensten_insert_own" ON calendar_diensten FOR INSERT
      WITH CHECK (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'calendar_diensten' AND policyname = 'diensten_update_own') THEN
    CREATE POLICY "diensten_update_own" ON calendar_diensten FOR UPDATE
      USING (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'calendar_diensten' AND policyname = 'diensten_delete_own') THEN
    CREATE POLICY "diensten_delete_own" ON calendar_diensten FOR DELETE
      USING (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
  END IF;
END $$;
