/** Print engine used for a cambiala — mirrors the `print_method_type` Postgres enum. */
export type PrintMethod = 'FULL_A4' | 'OVERLAY_PHYSICAL';

/** Row shape of `public.cambialas`. */
export interface CambialaRecord {
  id: string;
  user_id: string;
  date_echeance: string; // ISO date (YYYY-MM-DD)
  ville: string;
  date_edition: string | null;
  rib: string; // exactly 20 digits
  montant: number; // NUMERIC(15,3)
  monnaie: string;
  a_lordre_de: string;
  payeur: string;
  aval: string | null;
  banque: string;
  protestable: boolean;
  print_method: PrintMethod;
  offset_x: number;
  offset_y: number;
  created_at: string;
  updated_at: string;
}

/** Insert/update payload for `public.cambialas`. */
export interface CambialaPayload {
  user_id: string;
  date_echeance: string;
  ville: string;
  date_edition: string | null;
  rib: string;
  montant: number;
  monnaie: string;
  a_lordre_de: string;
  payeur: string;
  aval: string | null;
  banque: string;
  protestable: boolean;
  print_method: PrintMethod;
  offset_x: number;
  offset_y: number;
}

/** Raw, editable state of the entry form (everything as strings for controlled inputs). */
export interface CambialaFormState {
  date_echeance: string;
  ville: string;
  date_edition: string;
  rib: string;
  montant: string;
  monnaie: string;
  a_lordre_de: string;
  payeur: string;
  aval: string;
  banque: string;
  protestable: boolean;
}

export type FormErrors = Partial<Record<keyof CambialaFormState, string>>;

/** Parsed values consumed by the preview / print canvas. */
export interface TraiteData {
  dateEcheance: string;
  dateEdition: string;
  ville: string;
  rib: string;
  montant: number | null;
  monnaie: string;
  aLordreDe: string;
  payeur: string;
  aval: string;
  banque: string;
  protestable: boolean;
}
