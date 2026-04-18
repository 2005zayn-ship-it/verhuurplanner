export type Plan = "basic" | "premium" | "gold";
export type PaymentStatus = "betaald" | "onbetaald";
export type BookingStatus = "bezet" | "optie" | "geblokkeerd";

export interface Profile {
  id: string;
  email: string;
  naam: string | null;
  plan: Plan;
  payment_status: PaymentStatus;
  created_at: string;
}

export interface Calendar {
  id: string;
  user_id: string;
  naam: string;
  woning_naam: string | null;
  kleur: string;
  public_token: string;
  created_at: string;
  ical_import_urls?: { url: string; naam: string }[];
}

export interface Booking {
  id: string;
  calendar_id: string;
  start_datum: string; // YYYY-MM-DD
  eind_datum: string;  // YYYY-MM-DD
  gast_naam: string | null;
  status: BookingStatus;
  notities: string | null;
  created_at: string;
}
