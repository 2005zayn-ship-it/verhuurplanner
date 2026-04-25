export type Plan = "basic" | "premium" | "gold";
export type PaymentStatus = "betaald" | "onbetaald";
export type BookingStatus = "bezet" | "optie" | "geblokkeerd";
export type BookingBron =
  | "eigen_website"
  | "vakantiewoningen_be"
  | "vipio"
  | "booking_com"
  | "airbnb"
  | "naturhuisje"
  | "micazu"
  | "rechtstreeks"
  | "import"
  | "andere"
  | null;

export interface Profile {
  id: string;
  email: string;
  naam: string | null;
  plan: Plan;
  payment_status: PaymentStatus;
  created_at: string;
}

// ============================================================
// WIDGET CONFIG — opgeslagen als JSONB op calendars.widget_config
// ============================================================

export interface BoekingsformulierConfig {
  adres_tonen: boolean;
  adres_verplicht: boolean;
  telefoon_tonen: boolean;
  telefoon_verplicht: boolean;
  land_tonen: boolean;
  land_verplicht: boolean;
  aantekeningen_tonen: boolean;
  aantal_personen: "niet_vragen" | "aantal_personen" | "volwassenen_en_kinderen";
  max_volwassenen: number;
  max_kinderen: number;
  max_totaal: number;
  leeftijd_kind: number;
  vrije_velden: { naam: string; breedte: "half" | "vol"; verplicht: boolean }[];
}

export interface ReserveringsConfig {
  ontvangen_via: "uitschakelen" | "inschakelen";
  email_adres: string;
  notificatie_bij: "elke_status" | "bevestigd" | "nieuw";
  start_tijd_uur: number;
  start_tijd_minuut: number;
  eind_tijd_uur: number;
  eind_tijd_minuut: number;
  aangenomen_reserveringen: "direct" | "op_bevestiging" | "na_betaling";
  boeking_per: "nacht" | "dag";
  boekingnummer: "doorlopend" | "jaartal_doorlopend" | "eigen_begin";
  eigen_begin_nummer: number;
  dankjewel_url: string;
  annulatie_url: string;
  boekingsscherm: "zelfde_scherm" | "popup" | "nieuw_scherm";
  meerdere_eenheden_boekbaar: boolean;
}

export interface WidgetUiterlijkConfig {
  // Kalender instellingen
  aantal_maanden: number;
  seizoen_van: string;
  seizoen_tot: string;
  min_van_tevoren: number;
  max_van_tevoren: number;
  schaalgrootte: number;
  historiek_tonen: boolean;
  historiek_kleur: "bezette_dagen" | "vrije_dagen";
  navigatiemenu_boven: boolean;
  navigatiemenu_onder: boolean;
  titel_tonen: boolean;
  titel_grootte: number;
  dropdown_tonen: boolean;
  uitlijning: "midden" | "links";
  maanden_uitlijning: "naast_elkaar" | "onder_elkaar";
  weeknummers_tonen: boolean;
  logo_tonen: boolean;
  bericht_niet_boekbaar: boolean;
  bericht_asterisk: boolean;
  // Stijl
  legenda_tonen: boolean;
  bezette_kleur_type: "statussen" | "een_kleur";
  bezette_kleur: string;
  beschikbare_kleur: string;
  achtergrond_kleur: string;
  kalender_achtergrond: string;
  vandaag_cirkel_kleur: string;
  lettertype: string;
  diagonale_streep: boolean;
  // Prijzen
  indicatie_prijzen: boolean;
  weekprijzen_tonen: boolean;
  midweekprijzen_tonen: boolean;
  lang_weekend_prijzen_tonen: boolean;
  weekendprijzen_tonen: boolean;
  nachtprijzen_tonen: boolean;
  standaard_personen: number;
  kortingscode_veld: boolean;
  extra_website_knop: boolean;
  extra_website_url: string;
  extra_website_tekst: string;
  kalender_wijzigen_boeking: boolean;
  // Combi kalender
  in_combi_kalender: boolean;
}

export interface TarievenConfig {
  beschrijving: string;
  prijs_per: "per_boeking" | "per_persoon";
  datums_zonder_prijs: "boekbaar" | "bezet";
}

export interface TaalConfig {
  actieve_talen: string[];
  kalender_namen: Record<string, string>; // { NL: "Charme à Graide", FR: "..." }
}

export interface WidgetConfig {
  boekingsformulier: Partial<BoekingsformulierConfig>;
  reserveringen: Partial<ReserveringsConfig>;
  tarieven: Partial<TarievenConfig>;
  uiterlijk: Partial<WidgetUiterlijkConfig>;
  talen: Partial<TaalConfig>;
}

// ============================================================
// CALENDAR
// ============================================================

export interface FacturatieInstellingen {
  eigenaar_naam?: string;
  eigenaar_email?: string;
  eigenaar_adres?: string;
  commissie_type?: "percentage" | "vast";
  commissie_waarde?: number;
  huurprijs_type?: "tarieven" | "vast";
  huurprijs_nacht?: number | null;
}

export interface FacturatieProfiel {
  bedrijfsnaam?: string;
  btw_nummer?: string;
  adres?: string;
  postcode?: string;
  gemeente?: string;
  telefoon?: string;
  facturatie_email?: string;
  iban?: string;
  bic?: string;
}

export interface Calendar {
  id: string;
  user_id: string;
  naam: string;
  woning_naam: string | null;
  kleur: string;
  public_token: string;
  widget_config: Partial<WidgetConfig> | null;
  ical_import_urls: { url: string; naam: string }[] | null;
  facturatie_instellingen?: Partial<FacturatieInstellingen> | null;
  created_at: string;
}

// ============================================================
// BOOKING
// ============================================================

export interface Booking {
  id: string;
  calendar_id: string;
  start_datum: string;
  eind_datum: string;
  gast_naam: string | null;
  gast_email?: string | null;
  gast_telefoon?: string | null;
  gast_adres?: string | null;
  gast_postcode?: string | null;
  gast_gemeente?: string | null;
  gast_land?: string | null;
  taal?: string | null;
  aantal_volwassenen?: number | null;
  aantal_kinderen?: number | null;
  check_in_tijd?: string | null;
  check_uit_tijd?: string | null;
  status: BookingStatus;
  notities: string | null;
  prive_notities?: string | null;
  bron: BookingBron;
  prijs_totaal?: number | null;
  facturatie_prijs?: number | null;
  boeking_nummer_extern?: string | null;
  created_at: string;
}

// ============================================================
// TARIEVEN & DIENSTEN
// ============================================================

export interface CalendarTarief {
  id: string;
  calendar_id: string;
  naam: string;
  van_datum: string | null;
  tot_datum: string | null;
  prijs_nacht: number | null;
  prijs_weekend: number | null;
  prijs_lang_weekend: number | null;
  prijs_midweek: number | null;
  prijs_week: number | null;
  prijs_14nachten: number | null;
  prijs_21nachten: number | null;
  prijs_maand: number | null;
  aankomst_dagen: number[];
  vertrek_dagen: number[];
  min_nachten: number;
  max_nachten: number | null;
  is_standaard: boolean;
  volgorde: number;
  actief: boolean;
  created_at: string;
}

export interface CalendarDienst {
  id: string;
  calendar_id: string;
  naam: string;
  omschrijving: string | null;
  actief: boolean;
  verplicht: boolean;
  optie_type: "ja_nee" | "aantal" | "altijd";
  frequentie: "per_boeking" | "per_nacht" | "per_persoon" | "per_item";
  prijs: number;
  btw_percentage: number;
  korting_meenemen: boolean;
  volgorde: number;
  created_at: string;
}

// ============================================================
// DEFAULT VALUES
// ============================================================

export const DEFAULT_BOEKINGSFORMULIER: BoekingsformulierConfig = {
  adres_tonen: true,
  adres_verplicht: true,
  telefoon_tonen: true,
  telefoon_verplicht: true,
  land_tonen: true,
  land_verplicht: true,
  aantekeningen_tonen: true,
  aantal_personen: "volwassenen_en_kinderen",
  max_volwassenen: 4,
  max_kinderen: 3,
  max_totaal: 4,
  leeftijd_kind: 18,
  vrije_velden: [],
};

export const DEFAULT_RESERVERINGEN: ReserveringsConfig = {
  ontvangen_via: "inschakelen",
  email_adres: "",
  notificatie_bij: "elke_status",
  start_tijd_uur: 15,
  start_tijd_minuut: 0,
  eind_tijd_uur: 10,
  eind_tijd_minuut: 0,
  aangenomen_reserveringen: "direct",
  boeking_per: "nacht",
  boekingnummer: "doorlopend",
  eigen_begin_nummer: 1,
  dankjewel_url: "",
  annulatie_url: "",
  boekingsscherm: "nieuw_scherm",
  meerdere_eenheden_boekbaar: false,
};

export const DEFAULT_UITERLIJK: WidgetUiterlijkConfig = {
  aantal_maanden: 4,
  seizoen_van: "",
  seizoen_tot: "",
  min_van_tevoren: 2,
  max_van_tevoren: 0,
  schaalgrootte: 100,
  historiek_tonen: false,
  historiek_kleur: "bezette_dagen",
  navigatiemenu_boven: true,
  navigatiemenu_onder: false,
  titel_tonen: true,
  titel_grootte: 42,
  dropdown_tonen: true,
  uitlijning: "midden",
  maanden_uitlijning: "naast_elkaar",
  weeknummers_tonen: true,
  logo_tonen: true,
  bericht_niet_boekbaar: false,
  bericht_asterisk: true,
  legenda_tonen: true,
  bezette_kleur_type: "een_kleur",
  bezette_kleur: "#f07e6f",
  beschikbare_kleur: "#3ae43a",
  achtergrond_kleur: "#ffffff",
  kalender_achtergrond: "#ffffff",
  vandaag_cirkel_kleur: "#5bc0de",
  lettertype: "Arial",
  diagonale_streep: true,
  indicatie_prijzen: true,
  weekprijzen_tonen: true,
  midweekprijzen_tonen: true,
  lang_weekend_prijzen_tonen: true,
  weekendprijzen_tonen: true,
  nachtprijzen_tonen: true,
  standaard_personen: 1,
  kortingscode_veld: true,
  extra_website_knop: false,
  extra_website_url: "",
  extra_website_tekst: "Website",
  kalender_wijzigen_boeking: true,
  in_combi_kalender: true,
};
