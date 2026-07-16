interface CalibrationControlsProps {
  offsetX: number;
  offsetY: number;
  scaleX: number;
  scaleY: number;
  onChangeX: (value: number) => void;
  onChangeY: (value: number) => void;
  onChangeScaleX: (value: number) => void;
  onChangeScaleY: (value: number) => void;
}

interface CalibrationRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}

function CalibrationRow({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: CalibrationRowProps) {
  const update = (raw: string) => {
    const parsed = Number(raw);
    if (Number.isFinite(parsed)) onChange(Math.min(max, Math.max(min, parsed)));
  };

  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-amber-950">
        {label}
      </span>
      <span className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => update(event.target.value)}
          className="min-w-0 flex-1 accent-amber-600"
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => update(event.target.value)}
          className="w-16 rounded border border-amber-300 bg-white px-1.5 py-1 text-right text-xs tabular-nums text-amber-950 outline-none focus:border-amber-600"
        />
        <span className="w-6 text-xs text-amber-900">{unit}</span>
      </span>
    </label>
  );
}

export function CalibrationControls({
  offsetX,
  offsetY,
  scaleX,
  scaleY,
  onChangeX,
  onChangeY,
  onChangeScaleX,
  onChangeScaleY,
}: CalibrationControlsProps) {
  return (
    <div className="space-y-3 rounded-lg border border-amber-300 bg-amber-50 p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-amber-900">
          Calibrage de la sur-impression
        </h3>
        <button
          type="button"
          onClick={() => {
            onChangeX(0);
            onChangeY(0);
            onChangeScaleX(100);
            onChangeScaleY(100);
          }}
          className="rounded border border-amber-400 px-2 py-0.5 text-xs text-amber-800 transition hover:bg-amber-100"
        >
          Réinitialiser
        </button>
      </div>

      <div className="rounded-md border border-amber-200 bg-white/60 p-2 text-xs leading-relaxed text-amber-950">
        <strong>Format imposé par le PDF de référence : A4 portrait.</strong>{" "}
        Dans la fenêtre d'impression, sélectionnez A4,{" "}
        <strong>échelle 100 % / taille réelle</strong>, marges nulles, et
        désactivez « Ajuster à la page », les en-têtes et les pieds de page.
      </div>

      <CalibrationRow
        label="Décalage X — droite (+) / gauche (−)"
        value={offsetX}
        min={-10}
        max={10}
        step={0.5}
        unit="mm"
        onChange={onChangeX}
      />
      <CalibrationRow
        label="Décalage Y — bas (+) / haut (−)"
        value={offsetY}
        min={-10}
        max={10}
        step={0.5}
        unit="mm"
        onChange={onChangeY}
      />

      <div className="border-t border-amber-200 pt-3">
        <p className="mb-2 text-xs leading-snug text-amber-900">
          Si les chiffres du RIB occupent trop peu ou trop d'espace, corrigez
          l'échelle plutôt que le décalage.
        </p>
        <div className="space-y-2.5">
          <CalibrationRow
            label="Échelle X — espacement horizontal"
            value={scaleX}
            min={90}
            max={110}
            step={0.1}
            unit="%"
            onChange={onChangeScaleX}
          />
          <CalibrationRow
            label="Échelle Y — espacement vertical"
            value={scaleY}
            min={90}
            max={110}
            step={0.1}
            unit="%"
            onChange={onChangeScaleY}
          />
        </div>
      </div>

      <p className="text-xs leading-snug text-amber-800/80">
        Faites toujours un test sur feuille blanche, puis superposez-la au
        papier officiel avant l'impression finale. Le calibrage d'échelle est
        mémorisé sur cet appareil.
      </p>
    </div>
  );
}
