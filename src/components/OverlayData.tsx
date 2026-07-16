import type { CSSProperties, ReactNode } from "react";
import { FIELDS, type FieldPos } from "../lib/layout";
import { formatDateFr, montantBorne, splitRib } from "../lib/format";
import { montantEnLettres } from "../lib/frenchNumbers";
import type { TraiteData } from "../types";

interface OverlayDataProps {
  data: TraiteData;
  /** Calibrage physique du papier (mm et pourcentage). */
  dx: number;
  dy: number;
  scaleX?: number;
  scaleY?: number;
}

function fieldStyle(pos: FieldPos): CSSProperties {
  return {
    left: `${pos.left}%`,
    top: `${pos.top}%`,
    width: pos.width != null ? `${pos.width}%` : undefined,
    height: pos.height != null ? `${pos.height}%` : undefined,
    textAlign: pos.align ?? "left",
    fontSize: `${pos.size ?? 3}mm`,
  };
}

function Field({
  pos,
  children,
  wrap = false,
}: {
  pos: FieldPos;
  children: ReactNode;
  wrap?: boolean;
}) {
  return (
    <div
      className={`traite-value absolute leading-tight ${wrap ? "" : "whitespace-nowrap"}`}
      style={fieldStyle(pos)}
    >
      {children}
    </div>
  );
}

/** Répartit uniformément les caractères dans des cellules égales (cases RIB). */
function RibCells({
  pos,
  value,
  count,
  size = 3.2,
}: {
  pos: FieldPos;
  value: string;
  count: number;
  size?: number;
}) {
  const chars = Array.from({ length: count }, (_, i) => value[i] ?? "");
  return (
    <div
      className="traite-value absolute flex items-center"
      style={{ ...fieldStyle(pos), fontSize: `${size}mm` }}
    >
      {chars.map((char, index) => (
        <span key={index} className="flex-1 text-center">
          {char}
        </span>
      ))}
    </div>
  );
}

/**
 * Couche de données — positions partagées entre le Mode 1 (fond squelette CSS)
 * et le Mode 2 (sur-impression papier officiel). Décalée via CSS transform.
 */
export function OverlayData({
  data,
  dx,
  dy,
  scaleX = 100,
  scaleY = 100,
}: OverlayDataProps) {
  const rib = splitRib(data.rib);
  const montantStr =
    data.montant != null
      ? montantBorne(data.montant, data.monnaie || "DT")
      : "";
  const lettres =
    data.montant != null
      ? montantEnLettres(data.montant, data.monnaie || "DT")
      : "";
  const lettresSize =
    lettres.length > 95 ? 2.1 : lettres.length > 70 ? 2.5 : 2.9;

  return (
    <div
      className="overlay-data pointer-events-none absolute inset-0"
      style={{
        transform: `translate(${dx}mm, ${dy}mm) scale(${scaleX / 100}, ${scaleY / 100})`,
        transformOrigin: "0 0",
      }}
    >
      {/* ——— Zone supérieure ——— */}
      <Field pos={FIELDS.echeanceTop}>{formatDateFr(data.dateEcheance)}</Field>
      <Field pos={FIELDS.villeTop}>{data.ville}</Field>
      <Field pos={FIELDS.dateEditionTop}>
        {formatDateFr(data.dateEdition)}
      </Field>
      <RibCells pos={FIELDS.ribTop} value={data.rib} count={20} />
      <Field pos={FIELDS.montantTop}>{montantStr}</Field>

      {/* ——— Protestable : croix oui / non ——— */}
      <Field pos={data.protestable ? FIELDS.protestOui : FIELDS.protestNon}>
        X
      </Field>

      {/* ——— Corps central ——— */}
      <Field pos={FIELDS.ordreDe}>{data.aLordreDe.toUpperCase()}</Field>
      <Field pos={FIELDS.montantMid}>{montantStr}</Field>
      <Field pos={{ ...FIELDS.montantLettres, size: lettresSize }}>
        {lettres}
      </Field>

      {/* ——— Rangée structurée du bas ——— */}
      <Field pos={FIELDS.lieuCreation}>{data.ville}</Field>
      <Field pos={FIELDS.dateCreation}>{formatDateFr(data.dateEdition)}</Field>
      <Field pos={FIELDS.echeanceBottom}>
        {formatDateFr(data.dateEcheance)}
      </Field>

      {/* ——— RIB éclaté : Code établ. / Code agence / N° de compte / Clé ——— */}
      <RibCells pos={FIELDS.ribEtab} value={rib.etab} count={2} />
      <RibCells pos={FIELDS.ribAgence} value={rib.agence} count={3} />
      <RibCells pos={FIELDS.ribCompte} value={rib.compte} count={13} />
      <RibCells pos={FIELDS.ribCle} value={rib.cle} count={2} />

      {/* ——— Cadres inférieurs ——— */}
      <Field pos={FIELDS.domiciliation} wrap>
        {data.banque.toUpperCase()}
      </Field>
      <Field pos={FIELDS.nomTire} wrap>
        {data.payeur.toUpperCase()}
      </Field>
      <Field pos={FIELDS.aval} wrap>
        {data.aval.toUpperCase()}
      </Field>
    </div>
  );
}
