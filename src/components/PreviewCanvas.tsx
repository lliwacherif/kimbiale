import { useFitScale } from '../hooks/useFitScale';
import {
  A4_HEIGHT_PX,
  A4_WIDTH_PX,
  TRAITE_HEIGHT_MM,
  TRAITE_WIDTH_MM,
} from '../lib/layout';
import type { PrintMethod, TraiteData } from '../types';
import { OverlayData } from './OverlayData';
import { TraiteSkeleton } from './TraiteSkeleton';

interface PreviewCanvasProps {
  data: TraiteData;
  mode: PrintMethod;
  offsetX: number;
  offsetY: number;
}

/**
 * Canvas d'aperçu interactif = cible d'impression (`#print-target-canvas`).
 * À l'écran : page A4 mise à l'échelle. À l'impression : dimensions A4 exactes
 * (210 × 297 mm), zone traite ancrée au coin supérieur gauche.
 */
export function PreviewCanvas({ data, mode, offsetX, offsetY }: PreviewCanvasProps) {
  const { ref, scale } = useFitScale<HTMLDivElement>(A4_WIDTH_PX + 4);
  const isOverlay = mode === 'OVERLAY_PHYSICAL';

  return (
    <div className="preview-fit relative w-full" ref={ref} style={{ height: A4_HEIGHT_PX * scale }}>
      <div
        className="preview-scale absolute left-0 top-0 origin-top-left"
        style={{ transform: `scale(${scale})` }}
      >
        <div
          id="print-target-canvas"
          className={`relative bg-white shadow-2xl ring-1 ring-slate-900/10 ${
            isOverlay ? 'mode-overlay-physical' : 'mode-full-a4'
          }`}
          style={{ width: '210mm', height: '297mm' }}
        >
          {/* Zone traite — ancrée en haut à gauche de la page A4 */}
          <div
            className="traite-area relative"
            style={{ width: `${TRAITE_WIDTH_MM}mm`, height: `${TRAITE_HEIGHT_MM}mm` }}
          >
            {isOverlay ? (
              <img
                src="/cambiale.png"
                alt="Modèle officiel de traite (repère écran, non imprimé)"
                className="preview-bg-image pointer-events-none absolute inset-0 h-full w-full select-none object-fill opacity-40"
                draggable={false}
              />
            ) : (
              <TraiteSkeleton />
            )}

            <OverlayData data={data} dx={isOverlay ? offsetX : 0} dy={isOverlay ? offsetY : 0} />

            {isOverlay && (
              <div
                className="screen-only pointer-events-none absolute inset-0 border-2 border-dashed border-red-400/70"
                aria-hidden
              />
            )}
          </div>

          {isOverlay && (
            <p
              className="screen-only absolute text-[11px] italic text-slate-400"
              style={{ top: `${TRAITE_HEIGHT_MM + 3}mm`, left: '5mm' }}
            >
              Zone du papier LCN ({TRAITE_WIDTH_MM} × {TRAITE_HEIGHT_MM} mm) — le fond visible à
              l'écran ne sera PAS imprimé ; seules les données le seront.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
