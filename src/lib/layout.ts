/**
 * Géométrie du document.
 *
 * Toutes les positions de champs sont exprimées en POURCENTAGE de la zone
 * « traite » (calées sur le scan officiel `public/cambiale.png`, 1024×661 px).
 * La zone traite est ancrée au coin supérieur gauche de la page A4 portrait.
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

/** Dimensions physiques de la traite (ratio du scan 1024/661 ≈ 1.549). */
export const TRAITE_WIDTH_MM = 210;
export const TRAITE_HEIGHT_MM = 135.5;

export interface FieldPos {
  /** % depuis la gauche de la zone traite */
  left: number;
  /** % depuis le haut de la zone traite */
  top: number;
  /** % de largeur (optionnel) */
  width?: number;
  /** % de hauteur (optionnel) */
  height?: number;
  align?: 'left' | 'center' | 'right';
  /** Taille de police en mm (imprimée à l'échelle exacte) */
  size?: number;
}

/** Emplacements des données sur la traite (Mode 1 et Mode 2 partagent ces coordonnées). */
export const FIELDS = {
  /** Date d'échéance — case sous l'étiquette « Echéance » (haut gauche). */
  echeanceTop: { left: 27.7, top: 14.4, width: 17.3, align: 'center', size: 3.2 },
  /** Ville — ligne pointillée « A ....... بـ ». */
  villeTop: { left: 48.5, top: 11.2, width: 26.5, align: 'center', size: 3 },
  /** Date d'édition — ligne pointillée « Le ....... في ». */
  dateEditionTop: { left: 48.5, top: 15.0, width: 16, align: 'center', size: 3 },
  /** RIB — rangée supérieure de 20 cases. */
  ribTop: { left: 27.2, top: 22.3, width: 42.4, height: 3.6 },
  /** Montant en chiffres — cadre supérieur droit. */
  montantTop: { left: 74.4, top: 22.8, width: 24, align: 'center', size: 3.4 },
  /** Croix « oui / نعم » (protestable) — case de droite. */
  protestOui: { left: 52.0, top: 32.1, width: 1.7, align: 'center', size: 3 },
  /** Croix « non / لا » (non protestable) — case de gauche. */
  protestNon: { left: 49.0, top: 32.1, width: 1.7, align: 'center', size: 3 },
  /** Bénéficiaire — ligne « payer à l'ordre de ». */
  ordreDe: { left: 26.0, top: 38.3, width: 48, align: 'center', size: 3.2 },
  /** Montant en chiffres — second cadre (droite, milieu). */
  montantMid: { left: 74.4, top: 37.7, width: 24, align: 'center', size: 3.4 },
  /** Montant en toutes lettres — long bandeau central. */
  montantLettres: { left: 3.4, top: 44.2, width: 94.9, align: 'center', size: 2.9 },
  /** Lieu de création (= ville). */
  lieuCreation: { left: 1.8, top: 51.6, width: 15.8, align: 'center', size: 2.6 },
  /** Date de création (= date d'édition). */
  dateCreation: { left: 18.0, top: 51.6, width: 18.0, align: 'center', size: 2.8 },
  /** Echéance — rangée structurée du bas. */
  echeanceBottom: { left: 36.1, top: 51.6, width: 11.8, align: 'center', size: 2.8 },
  /** RIB bas — Code établissement (2). */
  ribEtab: { left: 1.7, top: 60.4, width: 3.8, height: 3.5 },
  /** RIB bas — Code agence (3). */
  ribAgence: { left: 5.5, top: 60.4, width: 6.2, height: 3.5 },
  /** RIB bas — Numéro de compte (13). */
  ribCompte: { left: 11.7, top: 60.4, width: 26.5, height: 3.5 },
  /** RIB bas — Clé (2). */
  ribCle: { left: 39.0, top: 60.4, width: 3.5, height: 3.5 },
  /** Banque — cadre « Domiciliation ». */
  domiciliation: { left: 67.2, top: 63.0, width: 31.2, align: 'center', size: 3 },
  /** Payeur — cadre « Nom et adresse du Tiré ». */
  nomTire: { left: 43.6, top: 68.8, width: 21.7, align: 'center', size: 3 },
  /** Aval — cadre « Aval ». */
  aval: { left: 22.4, top: 74.0, width: 19.8, align: 'center', size: 2.8 },
} satisfies Record<string, FieldPos>;

export type FieldKey = keyof typeof FIELDS;
