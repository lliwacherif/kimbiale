import { useFitScale } from "../hooks/useFitScale";
import {
  A4_HEIGHT_MM,
  A4_HEIGHT_PX,
  A4_WIDTH_MM,
  A4_WIDTH_PX,
  FULL_TRAITE_HEIGHT_MM,
  FULL_TRAITE_WIDTH_MM,
} from "../lib/layout";
import type { PrintMethod, TraiteData } from "../types";
import { OverlayData } from "./OverlayData";
import { TraiteSkeleton } from "./TraiteSkeleton";

interface PreviewCanvasProps {
  data: TraiteData;
  mode: PrintMethod;
  offsetX: number;
  offsetY: number;
  scaleX: number;
  scaleY: number;
  boldText: boolean;
}

/**
 * Canvas d'aperçu interactif = cible d'impression (`#print-target-canvas`).
 * Les deux modes produisent une page A4, comme le PDF de référence. En mode
 * overlay, seul le calque de données de la zone supérieure est imprimé.
 */
export function PreviewCanvas({
  data,
  mode,
  offsetX,
  offsetY,
  scaleX,
  scaleY,
  boldText,
}: PreviewCanvasProps) {
  const isOverlay = mode === "OVERLAY_PHYSICAL";
  const { ref, scale } = useFitScale<HTMLDivElement>(A4_WIDTH_PX + 4);

  return (
    <div
      className="preview-fit relative w-full"
      ref={ref}
      style={{ height: A4_HEIGHT_PX * scale }}
    >
      <div
        className="preview-scale absolute left-0 top-0 origin-top-left"
        style={{ transform: `scale(${scale})` }}
      >
        <div
          id="print-target-canvas"
          className={`relative bg-white shadow-2xl ring-1 ring-slate-900/10 ${
            isOverlay ? "mode-overlay-physical" : "mode-full-a4"
          }`}
          style={{ width: `${A4_WIDTH_MM}mm`, height: `${A4_HEIGHT_MM}mm` }}
        >
          {/* Zone du papier officiel, ancrée sur la page A4 de référence. */}
          <div
            className="traite-area relative"
            style={{
              width: `${FULL_TRAITE_WIDTH_MM}mm`,
              height: `${FULL_TRAITE_HEIGHT_MM}mm`,
            }}
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

            <OverlayData
              data={data}
              dx={isOverlay ? offsetX : 0}
              dy={isOverlay ? offsetY : 0}
              scaleX={isOverlay ? scaleX : 100}
              scaleY={isOverlay ? scaleY : 100}
              physical={isOverlay}
              boldText={boldText}
            />

            {isOverlay && (
              <div
                className="screen-only pointer-events-none absolute inset-0 border-2 border-dashed border-red-400/70"
                aria-hidden
              />
            )}
          </div>
        </div>
        {isOverlay && (
          <p
            className="screen-only absolute whitespace-nowrap text-[11px] italic text-slate-500"
            style={{ top: `${FULL_TRAITE_HEIGHT_MM + 3}mm`, left: "2mm" }}
          >
            Repère visuel indicatif — l'impression suit les coordonnées du PDF
            de référence A4 ; ce fond ne s'imprime pas.
          </p>
        )}
      </div>
    </div>
  );
}
