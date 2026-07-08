/** Helpers de formatage : montants, dates, RIB. */

/** 2800 → « 2 800.000 » (séparateur de milliers espace, millimes sur 3 chiffres). */
export function formatMontant(value: number): string {
  if (!Number.isFinite(value)) return '';
  const total = Math.round(value * 1000);
  const entier = Math.floor(total / 1000);
  const millimes = String(total % 1000).padStart(3, '0');
  const entierStr = String(entier).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${entierStr}.${millimes}`;
}

/** Montant borné par des « # » anti-falsification : « #2 800.000 DT# ». */
export function montantBorne(value: number, monnaie: string): string {
  return `#${formatMontant(value)} ${monnaie.trim()}#`;
}

/** « YYYY-MM-DD » → « DD/MM/YYYY ». */
export function formatDateFr(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

/** Analyse un montant saisi (accepte virgule ou point, espaces). null si invalide. */
export function parseMontant(raw: string): number | null {
  const cleaned = raw.trim().replace(/\s/g, '').replace(',', '.');
  if (!/^\d+(\.\d{1,3})?$/.test(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

/** Découpage normalisé du RIB tunisien : 2 (établ.) + 3 (agence) + 13 (compte) + 2 (clé). */
export function splitRib(rib: string): { etab: string; agence: string; compte: string; cle: string } {
  return {
    etab: rib.slice(0, 2),
    agence: rib.slice(2, 5),
    compte: rib.slice(5, 18),
    cle: rib.slice(18, 20),
  };
}

/** Date du jour au format ISO (YYYY-MM-DD), fuseau local. */
export function todayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
