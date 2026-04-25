-- ============================================================
-- WIDGET MIGRATION — verhuurplanner.be
-- Voer uit in Supabase SQL Editor
-- ============================================================

-- Widget configuratie op kalender (JSONB voor flexibiliteit)
ALTER TABLE calendars ADD COLUMN IF NOT EXISTS widget_config JSONB DEFAULT '{}'::JSONB;

-- iCal import URLs (was al in types.ts maar niet in schema)
ALTER TABLE calendars ADD COLUMN IF NOT EXISTS ical_import_urls JSONB DEFAULT '[]'::JSONB;

-- Boekingsbron op reservaties
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS bron TEXT DEFAULT NULL;

-- ============================================================
-- TARIEVEN TABEL (prijsperiodes per kalender)
-- ============================================================
CREATE TABLE IF NOT EXISTS calendar_tarieven (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_id UUID NOT NULL REFERENCES calendars(id) ON DELETE CASCADE,
  naam TEXT NOT NULL DEFAULT 'Standaardtarief',
  van_datum DATE,
  tot_datum DATE,
  prijs_week NUMERIC(10,2),
  prijs_midweek NUMERIC(10,2),
  prijs_lang_weekend NUMERIC(10,2),
  prijs_weekend NUMERIC(10,2),
  prijs_nacht NUMERIC(10,2),
  aankomst_dagen INTEGER[] DEFAULT '{1,2,3,4,5,6,7}',
  vertrek_dagen INTEGER[] DEFAULT '{1,2,3,4,5,6,7}',
  min_nachten INTEGER DEFAULT 1,
  max_nachten INTEGER,
  is_standaard BOOLEAN DEFAULT FALSE,
  volgorde INTEGER DEFAULT 0,
  actief BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DIENSTEN TABEL (bijkomende kosten/services per kalender)
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

CREATE POLICY "tarieven_select_own" ON calendar_tarieven FOR SELECT
  USING (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
CREATE POLICY "tarieven_insert_own" ON calendar_tarieven FOR INSERT
  WITH CHECK (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
CREATE POLICY "tarieven_update_own" ON calendar_tarieven FOR UPDATE
  USING (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
CREATE POLICY "tarieven_delete_own" ON calendar_tarieven FOR DELETE
  USING (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));

CREATE POLICY "diensten_select_own" ON calendar_diensten FOR SELECT
  USING (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
CREATE POLICY "diensten_insert_own" ON calendar_diensten FOR INSERT
  WITH CHECK (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
CREATE POLICY "diensten_update_own" ON calendar_diensten FOR UPDATE
  USING (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
CREATE POLICY "diensten_delete_own" ON calendar_diensten FOR DELETE
  USING (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
