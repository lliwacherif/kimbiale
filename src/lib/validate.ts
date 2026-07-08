import type { CambialaFormState, FormErrors } from '../types';
import { parseMontant } from './format';

const MAX_TEXT = 255;
const MAX_MONTANT = 999_999_999_999.999; // NUMERIC(15,3)

/** Règles de validation avant enregistrement / impression. */
export function validateForm(form: CambialaFormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.date_echeance) {
    errors.date_echeance = "La date d'échéance est obligatoire.";
  }

  if (!form.ville.trim()) {
    errors.ville = 'La ville est obligatoire.';
  } else if (form.ville.trim().length > MAX_TEXT) {
    errors.ville = `${MAX_TEXT} caractères maximum.`;
  }

  if (!/^\d{20}$/.test(form.rib)) {
    errors.rib = 'Le RIB doit contenir exactement 20 chiffres.';
  }

  if (!form.montant.trim()) {
    errors.montant = 'Le montant est obligatoire.';
  } else {
    const montant = parseMontant(form.montant);
    if (montant === null) {
      errors.montant = 'Format invalide (ex : 5381,800).';
    } else if (montant <= 0) {
      errors.montant = 'Le montant doit être supérieur à zéro.';
    } else if (montant > MAX_MONTANT) {
      errors.montant = 'Montant trop élevé (limite : 999 999 999 999.999).';
    }
  }

  if (!form.monnaie.trim()) {
    errors.monnaie = 'La monnaie est obligatoire.';
  } else if (form.monnaie.trim().length > 3) {
    errors.monnaie = '3 caractères maximum (ex : DT).';
  }

  if (!form.a_lordre_de.trim()) {
    errors.a_lordre_de = 'Le bénéficiaire est obligatoire.';
  } else if (form.a_lordre_de.trim().length > MAX_TEXT) {
    errors.a_lordre_de = `${MAX_TEXT} caractères maximum.`;
  }

  if (!form.payeur.trim()) {
    errors.payeur = 'Le payeur est obligatoire.';
  } else if (form.payeur.trim().length > MAX_TEXT) {
    errors.payeur = `${MAX_TEXT} caractères maximum.`;
  }

  if (form.aval.trim().length > MAX_TEXT) {
    errors.aval = `${MAX_TEXT} caractères maximum.`;
  }

  if (!form.banque.trim()) {
    errors.banque = 'La banque est obligatoire.';
  } else if (form.banque.trim().length > MAX_TEXT) {
    errors.banque = `${MAX_TEXT} caractères maximum.`;
  }

  return errors;
}
