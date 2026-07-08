import type { CambialaRecord, PrintMethod } from '../types';
import { formatDateFr, formatMontant } from '../lib/format';

interface HistoryLedgerProps {
  records: CambialaRecord[];
  loading: boolean;
  error: string | null;
  selectedId: string | null;
  onSelect: (record: CambialaRecord) => void;
  onRefresh: () => void;
}

function MethodBadge({ method }: { method: PrintMethod }) {
  const styles =
    method === 'FULL_A4'
      ? 'bg-sky-100 text-sky-700 ring-sky-300'
      : 'bg-amber-100 text-amber-800 ring-amber-300';
  return (
    <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold tracking-tight ring-1 ${styles}`}>
      {method}
    </span>
  );
}

export function HistoryLedger({
  records,
  loading,
  error,
  selectedId,
  onSelect,
  onRefresh,
}: HistoryLedgerProps) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">Historique des traites</h2>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1 rounded border border-slate-300 px-2 py-1 text-xs text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          title="Recharger l'historique"
        >
          <svg viewBox="0 0 16 16" className="h-3 w-3 fill-current" aria-hidden>
            <path d="M8 3a5 5 0 1 0 4.55 2.9l1.32-.75A6.5 6.5 0 1 1 8 1.5V0l3.5 2.25L8 4.5V3Z" />
          </svg>
          {loading ? 'Chargement…' : 'Recharger'}
        </button>
      </div>

      {error && (
        <p className="mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs leading-snug text-red-700">
          {error}
        </p>
      )}

      <div className="max-h-72 overflow-y-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-2.5 py-2 font-semibold">Payeur</th>
              <th className="px-2.5 py-2 text-right font-semibold">Montant</th>
              <th className="px-2.5 py-2 font-semibold">Échéance</th>
              <th className="px-2.5 py-2 font-semibold">Mode</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-xs text-slate-400">
                  Aucune traite enregistrée pour l'instant.
                </td>
              </tr>
            )}
            {records.map((record) => (
              <tr
                key={record.id}
                onClick={() => onSelect(record)}
                className={`cursor-pointer transition hover:bg-blue-50 ${
                  selectedId === record.id ? 'bg-blue-100/70' : 'bg-white'
                }`}
                title="Cliquer pour recharger cette traite dans le formulaire"
              >
                <td className="max-w-[110px] truncate px-2.5 py-2 font-medium text-slate-700">
                  {record.payeur}
                </td>
                <td className="whitespace-nowrap px-2.5 py-2 text-right tabular-nums text-slate-600">
                  {formatMontant(Number(record.montant))} {record.monnaie}
                </td>
                <td className="whitespace-nowrap px-2.5 py-2 text-slate-600">
                  {formatDateFr(record.date_echeance)}
                </td>
                <td className="px-2.5 py-2">
                  <MethodBadge method={record.print_method} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
