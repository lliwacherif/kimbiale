import type { CSSProperties, ReactNode } from "react";
import {
  FIELDS,
  PHYSICAL_FIELDS_MM,
  type FieldPos,
  type PhysicalFieldPos,
} from "../lib/layout";
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
  physical?: boolean;
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

function PhysicalField({
  pos,
  children,
  bold = false,
  color = "#000",
  fontSize = 10.5,
}: {
  pos: PhysicalFieldPos;
  children: ReactNode;
  bold?: boolean;
  color?: string;
  fontSize?: number;
}) {
  return (
    <div
      className="absolute whitespace-nowrap"
      style={{
        left: `${pos.left}mm`,
        // Chromium's Arial glyph box starts ~0.26 mm above the CSS top edge.
        // This compensation reproduces the measured PDF coordinates exactly.
        top: `${pos.top + 0.26}mm`,
        color,
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: `${fontSize}pt`,
        fontWeight: bold ? 700 : 400,
        lineHeight: 1,
      }}
    >
      {children}
    </div>
  );
}

function PhysicalOverlay({
  data,
  montantStr,
  lettres,
}: {
  data: TraiteData;
  montantStr: string;
  lettres: string;
}) {
  const lettresReference = lettres
    ? `${lettres.charAt(0).toUpperCase()}${lettres.slice(1)} ###`
    : "";

  return (
    <>
      <PhysicalField pos={PHYSICAL_FIELDS_MM.echeanceTop}>
        {formatDateFr(data.dateEcheance)}
      </PhysicalField>
      <PhysicalField pos={PHYSICAL_FIELDS_MM.villeTop}>
        {data.ville}
      </PhysicalField>
      <PhysicalField pos={PHYSICAL_FIELDS_MM.dateEditionTop}>
        {formatDateFr(data.dateEdition)}
      </PhysicalField>

      {/* Le PDF de référence imprime les 20 chiffres en une chaîne continue. */}
      <PhysicalField pos={PHYSICAL_FIELDS_MM.ribTop}>{data.rib}</PhysicalField>
      <PhysicalField pos={PHYSICAL_FIELDS_MM.montantTop}>
        {montantStr}
      </PhysicalField>
      <PhysicalField pos={PHYSICAL_FIELDS_MM.montantMid}>
        {montantStr}
      </PhysicalField>

      {/* Le bénéficiaire apparaît dans le cadre Tireur et sur la ligne d'ordre. */}
      <PhysicalField pos={PHYSICAL_FIELDS_MM.tireur}>
        {data.aLordreDe.toUpperCase()}
      </PhysicalField>
      <PhysicalField pos={PHYSICAL_FIELDS_MM.ordreDe}>
        {data.aLordreDe.toUpperCase()}
      </PhysicalField>
      <PhysicalField
        pos={PHYSICAL_FIELDS_MM.montantLettres}
        fontSize={lettresReference.length > 90 ? 9 : 10.5}
      >
        {lettresReference}
      </PhysicalField>

      <PhysicalField pos={PHYSICAL_FIELDS_MM.lieuCreation}>
        {data.ville}
      </PhysicalField>
      <PhysicalField pos={PHYSICAL_FIELDS_MM.dateCreation}>
        {formatDateFr(data.dateEdition)}
      </PhysicalField>
      <PhysicalField pos={PHYSICAL_FIELDS_MM.echeanceBottom}>
        {formatDateFr(data.dateEcheance)}
      </PhysicalField>
      <PhysicalField pos={PHYSICAL_FIELDS_MM.monnaie}>
        {data.monnaie.toUpperCase()}
      </PhysicalField>
      <PhysicalField pos={PHYSICAL_FIELDS_MM.ribBottom}>
        {data.rib}
      </PhysicalField>
      <PhysicalField pos={PHYSICAL_FIELDS_MM.banque}>
        {data.banque.toUpperCase()}
      </PhysicalField>
      <PhysicalField pos={PHYSICAL_FIELDS_MM.nomTire}>
        {data.payeur.toUpperCase()}
      </PhysicalField>

      {data.aval && (
        <>
          <PhysicalField pos={PHYSICAL_FIELDS_MM.avalMention}>
            &quot;BON POUR AVAL&quot;
          </PhysicalField>
          <PhysicalField pos={PHYSICAL_FIELDS_MM.aval}>
            {data.aval.toUpperCase()}
          </PhysicalField>
        </>
      )}

      <PhysicalField
        pos={
          data.protestable
            ? PHYSICAL_FIELDS_MM.protestOui
            : PHYSICAL_FIELDS_MM.protestNon
        }
        bold
        color="#dc2626"
      >
        X
      </PhysicalField>
    </>
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
  physical = false,
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
      {physical ? (
        <PhysicalOverlay
          data={data}
          montantStr={montantStr}
          lettres={lettres}
        />
      ) : (
        <>
          {/* ——— Zone supérieure ——— */}
          <Field pos={FIELDS.echeanceTop}>
            {formatDateFr(data.dateEcheance)}
          </Field>
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
          <Field pos={FIELDS.dateCreation}>
            {formatDateFr(data.dateEdition)}
          </Field>
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
        </>
      )}
    </div>
  );
}
