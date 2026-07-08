interface CalibrationControlsProps {
  offsetX: number;
  offsetY: number;
  onChangeX: (value: number) => void;
  onChangeY: (value: number) => void;
}

function signed(value: number): string {
  return `${value > 0 ? '+' : ''}${value} px`;
}

export function CalibrationControls({ offsetX, offsetY, onChangeX, onChangeY }: CalibrationControlsProps) {
  return (
    <div className="space-y-3 rounded-lg border border-amber-300 bg-amber-50 p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-amber-900">Calibrage de la sur-impression</h3>
        <button
          type="button"
          onClick={() => {
            onChangeX(0);
            onChangeY(0);
          }}
          className="rounded border border-amber-400 px-2 py-0.5 text-xs text-amber-800 transition hover:bg-amber-100"
        >
          Réinitialiser
        </button>
      </div>

      <label className="block">
        <span className="mb-1 flex justify-between text-xs font-medium text-amber-900">
          <span>Offset X (horizontal)</span>
          <span className="tabular-nums">{signed(offsetX)}</span>
        </span>
        <input
          type="range"
          min={-20}
          max={20}
          step={1}
          value={offsetX}
          onChange={(e) => onChangeX(Number(e.target.value))}
          className="w-full accent-amber-600"
        />
      </label>

      <label className="block">
        <span className="mb-1 flex justify-between text-xs font-medium text-amber-900">
          <span>Offset Y (vertical)</span>
          <span className="tabular-nums">{signed(offsetY)}</span>
        </span>
        <input
          type="range"
          min={-20}
          max={20}
          step={1}
          value={offsetY}
          onChange={(e) => onChangeY(Number(e.target.value))}
          className="w-full accent-amber-600"
        />
      </label>

      <p className="text-xs leading-snug text-amber-800/80">
        Décale l'ensemble des champs en temps réel pour compenser les marges matérielles de votre
        imprimante. Faites un test sur feuille blanche superposée à la traite avant l'impression finale.
      </p>
    </div>
  );
}
