import type { CSSProperties, ReactNode } from 'react';

/**
 * Squelette haute-fidélité de la Lettre de Change tunisienne (Mode 1 — A4 complet).
 * Reproduit en CSS pur la typographie, les cadres et le phrasé bilingue
 * français / arabe du document officiel, sur le même système de coordonnées
 * (%) que la couche de données `OverlayData` — géométrie mesurée sur le scan
 * officiel `public/cambiale.png`.
 */

function pct(left: number, top: number, width?: number, height?: number): CSSProperties {
  return {
    left: `${left}%`,
    top: `${top}%`,
    width: width != null ? `${width}%` : undefined,
    height: height != null ? `${height}%` : undefined,
  };
}

/** Cadre étiqueté : libellé français à gauche, arabe à droite. */
function LabeledBox({
  l,
  t,
  w,
  h,
  fr,
  ar,
  children,
}: {
  l: number;
  t: number;
  w: number;
  h: number;
  fr?: string;
  ar?: string;
  children?: ReactNode;
}) {
  return (
    <div className="absolute border-[1.5px] border-current" style={pct(l, t, w, h)}>
      {(fr || ar) && (
        <div className="flex items-start justify-between gap-1 px-1 pt-0.5" style={{ fontSize: '2.1mm' }}>
          {fr && <span className="leading-tight">{fr}</span>}
          {ar && (
            <span dir="rtl" className="leading-tight">
              {ar}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

/** Rangée de cases (RIB) avec séparateurs internes. */
function CellRow({
  l,
  t,
  w,
  h,
  count,
  thickAfter = [],
}: {
  l: number;
  t: number;
  w: number;
  h: number;
  count: number;
  thickAfter?: number[];
}) {
  return (
    <div className="absolute flex border-[1.5px] border-current" style={pct(l, t, w, h)}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`flex-1 ${i < count - 1 ? (thickAfter.includes(i) ? 'border-r-[1.5px]' : 'border-r') : ''} border-current`}
        />
      ))}
    </div>
  );
}

function SmallLabel({
  l,
  t,
  w,
  fr,
  ar,
  align = 'center',
  size = 2.1,
}: {
  l: number;
  t: number;
  w?: number;
  fr?: string;
  ar?: string;
  align?: 'left' | 'center' | 'right';
  size?: number;
}) {
  return (
    <div
      className="absolute whitespace-nowrap leading-tight"
      style={{ ...pct(l, t, w), textAlign: align, fontSize: `${size}mm` }}
    >
      {fr}
      {fr && ar && ' '}
      {ar && <span dir="rtl">{ar}</span>}
    </div>
  );
}

/** Ligne pointillée pour saisie manuscrite. */
function DottedSlot({ l, t, w }: { l: number; t: number; w: number }) {
  return <div className="dotted-line absolute" style={{ ...pct(l, t, w), height: '3.4mm' }} />;
}

export function TraiteSkeleton() {
  return (
    <div className="traite-skeleton traite-serif absolute inset-0 select-none">
      {/* Fond légèrement crème + double cadre décoratif */}
      <div className="absolute inset-0" style={{ background: '#fffdf6' }} />
      <div
        className="absolute border-2 border-current"
        style={{ left: '0.7%', top: '1%', right: '0.7%', bottom: '1%' }}
      />
      <div
        className="absolute border border-current opacity-60"
        style={{ left: '1.2%', top: '1.8%', right: '1.2%', bottom: '1.8%' }}
      />

      {/* ——— Bandeau d'en-tête guilloché ——— */}
      <div
        className="guilloche absolute flex items-center justify-between px-[2%]"
        style={pct(1.2, 1.8, 97.6, 6.4)}
      >
        <div className="text-center leading-tight" style={{ fontSize: '2.2mm' }}>
          République
          <br />
          Tunisienne
        </div>
        <div className="font-bold" style={{ fontSize: '5mm' }}>
          Lettre de Change
        </div>
        <div className="text-center leading-tight" style={{ fontSize: '2.2mm' }}>
          Republic
          <br />
          Of Tunisia
        </div>
        <div className="font-bold" style={{ fontSize: '5mm' }}>
          Bill of exchange
        </div>
        <div dir="rtl" className="text-center leading-tight" style={{ fontSize: '2.6mm' }}>
          الجمهورية
          <br />
          التونسية
        </div>
      </div>

      {/* Ordre de paiement N° */}
      <div
        className="absolute flex items-end justify-end gap-1.5"
        style={{ ...pct(52, 8.4, 46.8), fontSize: '2.2mm' }}
      >
        <span>Ordre de paiement L - C N°</span>
        <span className="dotted-line inline-block w-[16%]" style={{ height: '2.6mm' }} />
        <span dir="rtl">أمر بدفع الكمبيالة عدد</span>
      </div>

      {/* ——— Signature du tiré ——— */}
      <LabeledBox l={3.2} t={10.3} w={20} h={16.9} fr="Signature du tiré" ar="إمضاء المسحوب عليه" />

      {/* ——— Echéance (étiquette + case) ——— */}
      <LabeledBox l={27.7} t={10.6} w={17.3} h={3.6}>
        <div className="flex justify-center gap-2 leading-tight" style={{ fontSize: '2.4mm' }}>
          <span>Echéance</span>
          <span dir="rtl">حلول الأجل</span>
        </div>
      </LabeledBox>
      <LabeledBox l={27.7} t={14.2} w={17.3} h={5.2} />

      {/* ——— A … بـ / Le … في / A … لـ ——— */}
      <SmallLabel l={46.6} t={11.2} fr="A" align="left" size={2.6} />
      <DottedSlot l={48.5} t={11.6} w={26.5} />
      <SmallLabel l={76} t={11.2} ar="بـ" align="left" size={2.6} />
      <SmallLabel l={46.6} t={15.0} fr="Le" align="left" size={2.6} />
      <DottedSlot l={48.5} t={15.4} w={16} />
      <SmallLabel l={65.4} t={15.0} ar="في" align="left" size={2.6} />
      <SmallLabel l={72.4} t={15.0} fr="A" align="left" size={2.6} />
      <DottedSlot l={74.3} t={15.4} w={22} />
      <SmallLabel l={97.2} t={15.0} ar="لـ" align="left" size={2.6} />

      {/* ——— RIB (rangée supérieure) ——— */}
      <SmallLabel
        l={27.2}
        t={19.0}
        w={42.4}
        fr="RIB ou RIP du Tiré"
        ar="المعرف البنكي أو البريدي للمسحوب عليه"
      />
      <CellRow l={27.2} t={21.4} w={42.4} h={5.2} count={20} thickAfter={[1, 4, 17]} />

      {/* ——— Montant (haut droite) ——— */}
      <SmallLabel l={74.4} t={19.4} w={24} fr="Montant" ar="المبلغ" size={2.6} />
      <LabeledBox l={74.4} t={21.8} w={24} h={5.4}>
        <div className="hatch-strip absolute inset-x-[2.5%] bottom-[14%] top-[30%]" />
      </LabeledBox>

      {/* ——— Tireur ——— */}
      <LabeledBox l={3.2} t={29} w={20} h={11.6} fr="Tireur" ar="الساحب" />

      {/* ——— Clause « Contre cette lettre de change … » ——— */}
      <div className="absolute leading-snug" style={{ ...pct(26, 31.6), fontSize: '2.4mm' }}>
        Contre cette lettre de change (Protestable*)
        <br />
        payer à l'ordre de
      </div>
      <div
        dir="rtl"
        className="absolute text-right leading-snug"
        style={{ ...pct(56, 31.6, 21.5), fontSize: '2.4mm' }}
      >
        مقابل هاته الكمبيالة (القابلة للاحتجاج*)،
        <br />
        إدفعوا لأمر
      </div>

      {/* Cases oui / non — نعم / لا */}
      <SmallLabel l={48.4} t={30.1} w={2.8} ar="لا" size={1.9} />
      <SmallLabel l={51.4} t={30.1} w={2.8} ar="نعم" size={1.9} />
      <div className="absolute border-[1.2px] border-current" style={pct(49.0, 32.4, 1.7, 2.4)} />
      <div className="absolute border-[1.2px] border-current" style={pct(52.0, 32.4, 1.7, 2.4)} />
      <SmallLabel l={48.4} t={35.2} w={2.8} fr="non" size={1.6} />
      <SmallLabel l={51.4} t={35.2} w={2.8} fr="oui" size={1.6} />

      {/* ——— Montant (second cadre) ——— */}
      <SmallLabel l={74.4} t={31.8} w={24} fr="Montant" ar="المبلغ" size={2.6} />
      <LabeledBox l={74.4} t={34.2} w={24} h={5.6}>
        <div className="hatch-strip absolute inset-x-[2.5%] bottom-[10%] top-[52%]" />
      </LabeledBox>

      {/* Ligne bénéficiaire (hachurée) */}
      <SmallLabel l={53} t={36.4} fr="▼" align="left" size={2} />
      <div className="hatch-strip absolute" style={pct(24.6, 38.1, 50.4, 3.2)} />

      {/* ——— Montant en lettres ——— */}
      <SmallLabel l={3.2} t={41.2} fr="Montant en lettres" align="left" size={2.4} />
      <SmallLabel l={80} t={41.2} w={18.4} ar="المبلغ بلسان القلم" align="right" size={2.4} />
      <SmallLabel l={5} t={42.5} fr="▼" align="left" size={1.8} />
      <SmallLabel l={92} t={42.5} fr="▼" align="left" size={1.8} />
      <div className="hatch-strip absolute" style={pct(1.5, 43.9, 97, 2.6)} />

      {/* ——— Rangée structurée (labels + cases) ——— */}
      <SmallLabel l={1.8} t={48.4} w={15.8} fr="Lieu de création" ar="مكان الاحداث" />
      <SmallLabel l={18} t={48.4} w={18} fr="Date de création" ar="تاريخ الاحداث" />
      <SmallLabel l={36.1} t={48.4} w={11.8} fr="Echéance" ar="حلول الأجل" />
      <SmallLabel l={56} t={48.4} w={26} fr="Nom du cédant" ar="اسم المحيل" />
      <SmallLabel l={82} t={48.4} w={15} fr="Codes réservés" ar="رموز خاصة" />
      <LabeledBox l={1.8} t={50.7} w={15.8} h={3.8} />
      <LabeledBox l={18} t={50.7} w={18} h={3.8} />
      <LabeledBox l={36.1} t={50.7} w={11.8} h={3.8} />
      <LabeledBox l={56} t={50.7} w={26} h={3.8} />
      <LabeledBox l={84.5} t={50.7} w={5.5} h={3.8} />
      <LabeledBox l={91.5} t={50.7} w={5.5} h={3.8} />

      {/* ——— RIB éclaté (bas) ——— */}
      <SmallLabel
        l={1.8}
        t={57.2}
        w={40}
        fr="RIB ou RIP du Tiré"
        ar="المعرف البنكي أو البريدي للمسحوب عليه"
      />
      <CellRow l={1.7} t={59.5} w={3.8} h={5} count={2} />
      <CellRow l={5.5} t={59.5} w={6.2} h={5} count={3} />
      <CellRow l={11.7} t={59.5} w={26.5} h={5} count={13} />
      <CellRow l={39} t={59.5} w={3.5} h={5} count={2} />
      <SmallLabel l={1.7} t={65.2} w={3.8} fr="Code étab." size={1.8} align="left" />
      <SmallLabel l={5.5} t={65.2} w={6.2} fr="Code Agence" size={1.8} />
      <SmallLabel l={11.7} t={65.2} w={26.5} fr="N° de Compte" size={1.8} />
      <SmallLabel l={39} t={65.2} w={3.5} fr="Clé" size={1.8} />

      {/* ——— Valeur en ——— */}
      <SmallLabel l={45.1} t={57.8} fr="Valeur en" ar="القيمة بـ" align="left" size={2.4} />
      <div className="hatch-strip absolute" style={pct(52.8, 57.7, 11, 2.6)} />

      {/* ——— Domiciliation ——— */}
      <SmallLabel l={67.2} t={58.3} w={31.2} fr="Domiciliation" ar="اسم وعنوان الفرع المسحوب عليه" size={2.3} />
      <LabeledBox l={67.2} t={60.6} w={31.2} h={20.4}>
        <div className="absolute inset-x-0 border-t border-current" style={{ top: '45%' }} />
      </LabeledBox>

      {/* ——— Nom et adresse du Tiré ——— */}
      <LabeledBox l={43.4} t={62} w={22} h={20.6}>
        <div className="text-center leading-tight" style={{ fontSize: '2.2mm' }}>
          ▼ Nom et adresse du Tiré
        </div>
        <div
          dir="rtl"
          className="absolute inset-x-0 bottom-0.5 text-center leading-tight"
          style={{ fontSize: '2.2mm' }}
        >
          اسم وعنوان المسحوب عليه ▲
        </div>
      </LabeledBox>

      {/* ——— Acceptation / Aval ——— */}
      <LabeledBox l={1.7} t={68.5} w={19.7} h={15} fr="Acceptation" ar="القبول" />
      <LabeledBox l={22.2} t={68.5} w={20.3} h={15} fr="Aval" ar="الكفالة" />

      {/* ——— Signature du tireur ——— */}
      <SmallLabel l={68} t={80.9} w={30} fr="Signature du tireur ▲" ar="توقيع الساحب" size={2.6} />
      <SmallLabel l={72} t={83.6} w={26} ar="* ضع علامة X في المربع المناسب" size={2} />

      {/* Renvoi bas de page */}
      <SmallLabel
        l={3.2}
        t={84}
        w={30}
        fr="* mettre X dans la case correspondante."
        align="left"
        size={2.2}
      />

      {/* ——— Timbre « Lettre de Change » ——— */}
      <div className="absolute border-2 border-current p-[0.3%]" style={pct(85.8, 85.5, 12.4, 12.4)}>
        <div className="relative flex h-full w-full items-center justify-center border border-current">
          <span
            className="absolute left-0 top-1/2 whitespace-nowrap font-bold"
            style={{ fontSize: '1.8mm', transform: 'translate(-32%, -50%) rotate(-90deg)' }}
          >
            LETTRE DE CHANGE
          </span>
          <div className="text-center leading-tight">
            <div dir="rtl" className="font-bold" style={{ fontSize: '3.4mm' }}>
              كمبيالة
            </div>
            <svg viewBox="0 0 24 24" className="mx-auto mt-0.5 h-[4mm] w-[4mm] fill-current" aria-hidden>
              <path d="M12 2a10 10 0 1 0 0 20 8 8 0 1 1 0-16z" />
              <path d="M15.5 8.5l1.2 2.4 2.6.4-1.9 1.9.5 2.6-2.4-1.2-2.4 1.2.5-2.6-1.9-1.9 2.6-.4z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
