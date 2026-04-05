-- ============================================================
-- VERHUURPLANNER DATABASE SCHEMA
-- Voer dit uit in Supabase SQL Editor
-- ============================================================

-- Profiles (gekoppeld aan Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  naam TEXT,
  plan TEXT DEFAULT 'basic' CHECK (plan IN ('basic', 'premium', 'gold')),
  payment_status TEXT DEFAULT 'onbetaald' CHECK (payment_status IN ('betaald', 'onbetaald')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kalenders (per gebruiker, max 1 voor Basic, max 5 voor Gold)
CREATE TABLE IF NOT EXISTS calendars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  naam TEXT NOT NULL,
  woning_naam TEXT,
  kleur TEXT DEFAULT '#1d6fa4',
  public_token TEXT UNIQUE DEFAULT gen_random_uuid()::TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reservaties / boekingen
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_id UUID NOT NULL REFERENCES calendars(id) ON DELETE CASCADE,
  start_datum DATE NOT NULL,
  eind_datum DATE NOT NULL,
  gast_naam TEXT,
  status TEXT DEFAULT 'bezet' CHECK (status IN ('bezet', 'optie', 'geblokkeerd')),
  notities TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (eind_datum >= start_datum)
);

-- Indexen
CREATE INDEX IF NOT EXISTS idx_calendars_user_id ON calendars(user_id);
CREATE INDEX IF NOT EXISTS idx_calendars_public_token ON calendars(public_token);
CREATE INDEX IF NOT EXISTS idx_bookings_calendar_id ON bookings(calendar_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(calendar_id, start_datum, eind_datum);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Profiles: eigen profiel lezen/schrijven
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Calendars: eigen kalenders beheren
CREATE POLICY "calendars_select_own" ON calendars FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "calendars_insert_own" ON calendars FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "calendars_update_own" ON calendars FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "calendars_delete_own" ON calendars FOR DELETE USING (auth.uid() = user_id);

-- Calendars: publieke leestoegang via public_token (voor embed)
CREATE POLICY "calendars_public_read" ON calendars FOR SELECT USING (true);

-- Bookings: via eigen kalenders beheren
CREATE POLICY "bookings_select_own" ON bookings FOR SELECT
  USING (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
CREATE POLICY "bookings_insert_own" ON bookings FOR INSERT
  WITH CHECK (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
CREATE POLICY "bookings_update_own" ON bookings FOR UPDATE
  USING (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));
CREATE POLICY "bookings_delete_own" ON bookings FOR DELETE
  USING (calendar_id IN (SELECT id FROM calendars WHERE user_id = auth.uid()));

-- Bookings: publieke leestoegang (voor embed widget)
CREATE POLICY "bookings_public_read" ON bookings FOR SELECT USING (true);

-- ============================================================
-- TRIGGER: Profiel automatisch aanmaken bij registratie
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, naam)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'naam', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
