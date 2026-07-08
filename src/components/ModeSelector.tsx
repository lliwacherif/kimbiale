import type { PrintMethod } from '../types';

interface ModeSelectorProps {
  mode: PrintMethod;
  onChange: (mode: PrintMethod) => void;
}

const MODES: { value: PrintMethod; title: string; description: string }[] = [
  {
    value: 'FULL_A4',
    title: 'Impression Complète (Page Entière A4)',
    description: 'Imprime le document entier — cadre bilingue + données — sur une feuille A4 vierge.',
  },
  {
    value: 'OVERLAY_PHYSICAL',
    title: 'Sur-impression sur Papier Officiel (LCN)',
    description: 'Imprime uniquement les données, positionnées sur votre traite pré-imprimée insérée dans l’imprimante.',
  },
];

export function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="mb-1 text-sm font-semibold text-slate-700">Méthode d'impression</legend>
      {MODES.map((item) => {
        const active = mode === item.value;
        return (
          <label
            key={item.value}
            className={`block cursor-pointer rounded-lg border p-3 transition ${
              active
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <input
                type="radio"
                name="print-mode"
                className="mt-0.5 h-4 w-4 accent-blue-600"
                checked={active}
                onChange={() => onChange(item.value)}
              />
              <div>
                <span className={`block text-sm font-semibold ${active ? 'text-blue-800' : 'text-slate-700'}`}>
                  {item.title}
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-slate-500">
                  {item.description}
                </span>
              </div>
            </div>
          </label>
        );
      })}
    </fieldset>
  );
}
