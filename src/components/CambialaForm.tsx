import type { ChangeEvent, ReactNode } from 'react';
import type { CambialaFormState, FormErrors } from '../types';

interface CambialaFormProps {
  form: CambialaFormState;
  errors: FormErrors;
  onChange: <K extends keyof CambialaFormState>(field: K, value: CambialaFormState[K]) => void;
}

const inputClass =
  'w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200';

function Row({
  label,
  required,
  error,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="grid grid-cols-[140px_1fr] items-center gap-2">
        <label htmlFor={htmlFor} className="text-sm text-slate-700">
          {required && <span className="font-bold text-red-600">* </span>}
          {label} :
        </label>
        {children}
      </div>
      {error && <p className="mt-0.5 pl-[148px] text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function CambialaForm({ form, errors, onChange }: CambialaFormProps) {
  const text =
    (field: keyof CambialaFormState) => (event: ChangeEvent<HTMLInputElement>) =>
      onChange(field, event.target.value as never);

  return (
    <div className="space-y-2.5">
      <Row label="Date d'échéance" required error={errors.date_echeance} htmlFor="f-echeance">
        <input
          id="f-echeance"
          type="date"
          className={inputClass}
          value={form.date_echeance}
          onChange={text('date_echeance')}
        />
      </Row>

      <Row label="Ville" required error={errors.ville} htmlFor="f-ville">
        <input
          id="f-ville"
          type="text"
          className={inputClass}
          value={form.ville}
          onChange={text('ville')}
          placeholder="Zeramdine"
          maxLength={255}
        />
      </Row>

      <Row label="Date d'édition" error={errors.date_edition} htmlFor="f-edition">
        <input
          id="f-edition"
          type="date"
          className={inputClass}
          value={form.date_edition}
          onChange={text('date_edition')}
        />
      </Row>

      <Row label="RIB" required error={errors.rib} htmlFor="f-rib">
        <div className="relative">
          <input
            id="f-rib"
            type="text"
            inputMode="numeric"
            className={`${inputClass} pr-14 font-mono tracking-wide`}
            value={form.rib}
            onChange={(e) => onChange('rib', e.target.value.replace(/\D/g, '').slice(0, 20))}
            placeholder="20 chiffres"
          />
          <span
            className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs tabular-nums ${
              form.rib.length === 20 ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            {form.rib.length}/20
          </span>
        </div>
      </Row>

      <Row label="Montant (ex: 5381,800)" required error={errors.montant} htmlFor="f-montant">
        <input
          id="f-montant"
          type="text"
          inputMode="decimal"
          className={inputClass}
          value={form.montant}
          onChange={text('montant')}
          placeholder="2800.000"
        />
      </Row>

      <Row label="Monnaie" required error={errors.monnaie} htmlFor="f-monnaie">
        <input
          id="f-monnaie"
          type="text"
          className={inputClass}
          value={form.monnaie}
          onChange={text('monnaie')}
          placeholder="DT"
          maxLength={3}
        />
      </Row>

      <Row label="A l'ordre de" required error={errors.a_lordre_de} htmlFor="f-ordre">
        <input
          id="f-ordre"
          type="text"
          className={inputClass}
          value={form.a_lordre_de}
          onChange={text('a_lordre_de')}
          placeholder="LIWA CHERIF"
          maxLength={255}
        />
      </Row>

      <Row label="Payeur" required error={errors.payeur} htmlFor="f-payeur">
        <input
          id="f-payeur"
          type="text"
          className={inputClass}
          value={form.payeur}
          onChange={text('payeur')}
          placeholder="CHERIF"
          maxLength={255}
        />
      </Row>

      <Row label="Aval" error={errors.aval} htmlFor="f-aval">
        <input
          id="f-aval"
          type="text"
          className={inputClass}
          value={form.aval}
          onChange={text('aval')}
          placeholder="(optionnel)"
          maxLength={255}
        />
      </Row>

      <Row label="Banque" required error={errors.banque} htmlFor="f-banque">
        <input
          id="f-banque"
          type="text"
          className={inputClass}
          value={form.banque}
          onChange={text('banque')}
          placeholder="ZITOUNA BANQUE"
          maxLength={255}
        />
      </Row>

      <Row label="Protestable" htmlFor="f-protestable">
        <div className="flex items-center">
          <input
            id="f-protestable"
            type="checkbox"
            className="h-4 w-4 accent-blue-600"
            checked={form.protestable}
            onChange={(e) => onChange('protestable', e.target.checked)}
          />
        </div>
      </Row>
    </div>
  );
}
