/**
 * Conversion sécurisée d'un montant numérique en toutes lettres (français),
 * conforme aux règles d'accord : « quatre-vingts », « deux cents », « deux cent mille »…
 */

const UNITS = [
  'zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
  'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize',
  'dix-sept', 'dix-huit', 'dix-neuf',
];

function tensWord(t: number): string {
  switch (t) {
    case 2: return 'vingt';
    case 3: return 'trente';
    case 4: return 'quarante';
    case 5: return 'cinquante';
    case 6: return 'soixante';
    default: return '';
  }
}

/**
 * 0..99. `allowPlural` contrôle le « s » final de « quatre-vingts »
 * (supprimé lorsque le nombre est suivi de « mille »).
 */
function under100(n: number, allowPlural: boolean): string {
  if (n < 20) return UNITS[n];
  const t = Math.floor(n / 10);
  const u = n % 10;
  if (t === 8) {
    if (u === 0) return allowPlural ? 'quatre-vingts' : 'quatre-vingt';
    return `quatre-vingt-${UNITS[u]}`;
  }
  if (t === 9) return `quatre-vingt-${UNITS[10 + u]}`;
  if (t === 7) {
    if (u === 1) return 'soixante et onze';
    return `soixante-${UNITS[10 + u]}`;
  }
  if (u === 0) return tensWord(t);
  if (u === 1) return `${tensWord(t)} et un`;
  return `${tensWord(t)}-${UNITS[u]}`;
}

/** 0..999. `allowPlural` contrôle le « s » de « cents » / « quatre-vingts ». */
function under1000(n: number, allowPlural: boolean): string {
  const h = Math.floor(n / 100);
  const r = n % 100;
  if (h === 0) return under100(n, allowPlural);
  const head = h === 1 ? 'cent' : `${UNITS[h]} cent`;
  if (r === 0) return h > 1 && allowPlural ? `${head}s` : head;
  return `${head} ${under100(r, allowPlural)}`;
}

/** Entier positif → lettres françaises. */
export function integerToFrenchWords(value: number): string {
  if (!Number.isFinite(value) || value < 0) return '';
  const n = Math.floor(value);
  if (n === 0) return 'zéro';

  const milliards = Math.floor(n / 1_000_000_000);
  const millions = Math.floor(n / 1_000_000) % 1000;
  const milliers = Math.floor(n / 1000) % 1000;
  const unites = n % 1000;

  const groups: string[] = [];
  // « milliard » et « million » sont des noms : le multiplicateur garde son pluriel.
  if (milliards > 0) groups.push(`${under1000(milliards, true)} milliard${milliards > 1 ? 's' : ''}`);
  if (millions > 0) groups.push(`${under1000(millions, true)} million${millions > 1 ? 's' : ''}`);
  // « mille » est un adjectif numéral invariable : pas de « s » avant lui.
  if (milliers > 0) groups.push(milliers === 1 ? 'mille' : `${under1000(milliers, false)} mille`);
  if (unites > 0) groups.push(under1000(unites, true));

  return groups.join(' ');
}

function currencyWords(monnaie: string): [singular: string, plural: string] {
  const m = monnaie.trim().toUpperCase();
  if (m === 'DT' || m === 'TND' || m === 'DIN') return ['dinar', 'dinars'];
  if (m === 'EUR' || m === '€') return ['euro', 'euros'];
  if (m === 'USD' || m === '$') return ['dollar', 'dollars'];
  return [monnaie.trim(), monnaie.trim()];
}

/**
 * Montant (3 décimales max) → « deux mille huit cents dinars » /
 * « douze dinars et cinq cents millimes ».
 */
export function montantEnLettres(montant: number, monnaie: string): string {
  if (!Number.isFinite(montant) || montant < 0) return '';
  const totalMillimes = Math.round(montant * 1000);
  const entier = Math.floor(totalMillimes / 1000);
  const millimes = totalMillimes % 1000;
  const [sing, plur] = currencyWords(monnaie);

  // « deux millions DE dinars » : « de » requis quand le nombre se termine
  // par million(s)/milliard(s) (multiple exact d'un million).
  const liaison = entier >= 1_000_000 && entier % 1_000_000 === 0 ? 'de ' : '';
  const partieEntiere = `${integerToFrenchWords(entier)} ${liaison}${entier > 1 ? plur : sing}`;
  const partieMillimes =
    millimes > 0 ? `${integerToFrenchWords(millimes)} millime${millimes > 1 ? 's' : ''}` : '';

  if (entier === 0 && millimes > 0) return partieMillimes;
  if (millimes === 0) return partieEntiere;
  return `${partieEntiere} et ${partieMillimes}`;
}
