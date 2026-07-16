/**
 * Géométrie du document.
 *
 * Toutes les positions de champs sont exprimées en POURCENTAGE de la zone
 * « traite » (calées sur le scan officiel `public/cambiale.png`, 1024×661 px).
 * Les deux moteurs impriment sur une page A4. En sur-impression, les champs
 * utilisent des coordonnées absolues en millimètres, mesurées dans le PDF de
 * référence `Traite à Imprimer.pdf`.
 *
 * Si votre lot de papier LCN diffère légèrement, ajustez ici les constantes
 * (dimensions physiques et/ou coordonnées) — les curseurs Offset X/Y de
 * l'application gèrent les décalages globaux d'imprimante.
 */

export const MM_TO_PX = 96 / 25.4;

export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;
export const A4_WIDTH_PX = A4_WIDTH_MM * MM_TO_PX; // ≈ 793.7
export const A4_HEIGHT_PX = A4_HEIGHT_MM * MM_TO_PX; // ≈ 1122.5

/** Zone du dessin reconstitué en mode impression complète (sur A4). */
export const FULL_TRAITE_WIDTH_MM = 210;
export const FULL_TRAITE_HEIGHT_MM = 135.5;

export interface FieldPos {
  /** % depuis la gauche de la zone traite */
  left: number;
  /** % depuis le haut de la zone traite */
  top: number;
  /** % de largeur (optionnel) */
  width?: number;
  /** % de hauteur (optionnel) */
  height?: number;
  align?: "left" | "center" | "right";
  /** Taille de police en mm (imprimée à l'échelle exacte) */
  size?: number;
}

/** Emplacements des données sur la traite (Mode 1 et Mode 2 partagent ces coordonnées). */
export const FIELDS = {
  /** Date d'échéance — case sous l'étiquette « Echéance » (haut gauche). */
  echeanceTop: {
    left: 27.7,
    top: 14.4,
    width: 17.3,
    align: "center",
    size: 3.2,
  },
  /** Ville — ligne pointillée « A ....... بـ ». */
  villeTop: { left: 48.5, top: 11.2, width: 26.5, align: "center", size: 3 },
  /** Date d'édition — ligne pointillée « Le ....... في ». */
  dateEditionTop: {
    left: 48.5,
    top: 15.0,
    width: 16,
    align: "center",
    size: 3,
  },
  /** RIB — rangée supérieure de 20 cases. */
  ribTop: { left: 27.2, top: 22.3, width: 42.4, height: 3.6 },
  /** Montant en chiffres — cadre supérieur droit. */
  montantTop: { left: 74.4, top: 22.8, width: 24, align: "center", size: 3.4 },
  /** Croix « oui / نعم » (protestable) — case de droite. */
  protestOui: { left: 52.0, top: 32.1, width: 1.7, align: "center", size: 3 },
  /** Croix « non / لا » (non protestable) — case de gauche. */
  protestNon: { left: 49.0, top: 32.1, width: 1.7, align: "center", size: 3 },
  /** Bénéficiaire — ligne « payer à l'ordre de ». */
  ordreDe: { left: 26.0, top: 38.3, width: 48, align: "center", size: 3.2 },
  /** Montant en chiffres — second cadre (droite, milieu). */
  montantMid: { left: 74.4, top: 37.7, width: 24, align: "center", size: 3.4 },
  /** Montant en toutes lettres — long bandeau central. */
  montantLettres: {
    left: 3.4,
    top: 44.2,
    width: 94.9,
    align: "center",
    size: 2.9,
  },
  /** Lieu de création (= ville). */
  lieuCreation: {
    left: 1.8,
    top: 51.6,
    width: 15.8,
    align: "center",
    size: 2.6,
  },
  /** Date de création (= date d'édition). */
  dateCreation: {
    left: 18.0,
    top: 51.6,
    width: 18.0,
    align: "center",
    size: 2.8,
  },
  /** Echéance — rangée structurée du bas. */
  echeanceBottom: {
    left: 36.1,
    top: 51.6,
    width: 11.8,
    align: "center",
    size: 2.8,
  },
  /** RIB bas — Code établissement (2). */
  ribEtab: { left: 1.7, top: 60.4, width: 3.8, height: 3.5 },
  /** RIB bas — Code agence (3). */
  ribAgence: { left: 5.5, top: 60.4, width: 6.2, height: 3.5 },
  /** RIB bas — Numéro de compte (13). */
  ribCompte: { left: 11.7, top: 60.4, width: 26.5, height: 3.5 },
  /** RIB bas — Clé (2). */
  ribCle: { left: 39.0, top: 60.4, width: 3.5, height: 3.5 },
  /** Banque — cadre « Domiciliation ». */
  domiciliation: {
    left: 67.2,
    top: 63.0,
    width: 31.2,
    align: "center",
    size: 3,
  },
  /** Payeur — cadre « Nom et adresse du Tiré ». */
  nomTire: { left: 43.6, top: 68.8, width: 21.7, align: "center", size: 3 },
  /** Aval — cadre « Aval ». */
  aval: { left: 22.4, top: 74.0, width: 19.8, align: "center", size: 2.8 },
} satisfies Record<string, FieldPos>;

export type FieldKey = keyof typeof FIELDS;

export interface PhysicalFieldPos {
  /** Position absolue depuis le bord gauche de la page A4. */
  left: number;
  /** Position absolue depuis le bord supérieur de la page A4. */
  top: number;
}

/**
 * Coordonnées effectives du générateur de référence BoxyLab, extraites du PDF
 * A4 fourni (MediaBox 209,889 × 297,011 mm, police Arial 10,5 pt).
 *
 * Les RIB sont volontairement imprimés comme chaînes continues : le PDF de
 * référence ne répartit pas les chiffres dans les cases du fond pré-imprimé.
 */
export const PHYSICAL_FIELDS_MM = {
  echeanceTop: { left: 76.46, top: 16.49 },
  villeTop: { left: 110.07, top: 11.46 },
  dateEditionTop: { left: 110.07, top: 16.49 },
  ribTop: { left: 92.6, top: 26.28 },
  montantTop: { left: 153.19, top: 26.28 },
  montantMid: { left: 153.19, top: 40.3 },
  tireur: { left: 23.55, top: 38.19 },
  ordreDe: { left: 69.32, top: 42.42 },
  montantLettres: { left: 23.55, top: 49.3 },
  lieuCreation: { left: 23.55, top: 58.56 },
  dateCreation: { left: 52.65, top: 58.56 },
  echeanceBottom: { left: 79.11, top: 58.56 },
  monnaie: { left: 109.54, top: 65.17 },
  ribBottom: { left: 43.66, top: 69.14 },
  banque: { left: 137.32, top: 69.14 },
  nomTire: { left: 96.31, top: 72.58 },
  avalMention: { left: 60.06, top: 79.73 },
  aval: { left: 60.06, top: 83.96 },
  protestOui: { left: 110.6, top: 36.86 },
  protestNon: { left: 104.3, top: 36.86 },
} satisfies Record<string, PhysicalFieldPos>;
