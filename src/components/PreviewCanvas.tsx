import { useLayoutEffect } from "react";
import { useFitScale } from "../hooks/useFitScale";
import {
  A4_HEIGHT_MM,
  A4_HEIGHT_PX,
  A4_WIDTH_MM,
  A4_WIDTH_PX,
  FULL_TRAITE_HEIGHT_MM,
  FULL_TRAITE_WIDTH_MM,
  LCN_HEIGHT_MM,
  LCN_WIDTH_MM,
  MM_TO_PX,
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
}

/**
 * Canvas d'aperçu interactif = cible d'impression (`#print-target-canvas`).
 * Le mode complet produit une page A4. Le mode overlay produit directement
 * une page personnalisée 200 × 105 mm afin d'empêcher tout « fit to page ».
 */
export function PreviewCanvas({
  data,
  mode,
  offsetX,
  offsetY,
  scaleX,
  scaleY,
}: PreviewCanvasProps) {
  const isOverlay = mode === "OVERLAY_PHYSICAL";
  const pageWidthMm = isOverlay ? LCN_WIDTH_MM : A4_WIDTH_MM;
  const pageHeightMm = isOverlay ? LCN_HEIGHT_MM : A4_HEIGHT_MM;
  const pageWidthPx = isOverlay ? LCN_WIDTH_MM * MM_TO_PX : A4_WIDTH_PX;
  const pageHeightPx = isOverlay ? LCN_HEIGHT_MM * MM_TO_PX : A4_HEIGHT_PX;
  const traiteWidthMm = isOverlay ? LCN_WIDTH_MM : FULL_TRAITE_WIDTH_MM;
  const traiteHeightMm = isOverlay ? LCN_HEIGHT_MM : FULL_TRAITE_HEIGHT_MM;
  const { ref, scale } = useFitScale<HTMLDivElement>(pageWidthPx + 4);

  useLayoutEffect(() => {
    const style = document.createElement("style");
    style.id = "kimbiale-dynamic-page-size";
    style.textContent = isOverlay
      ? `@page { size: ${LCN_WIDTH_MM}mm ${LCN_HEIGHT_MM}mm; margin: 0; }`
      : "@page { size: A4 portrait; margin: 0; }";
    document.head.appendChild(style);
    return () => style.remove();
  }, [isOverlay]);

  return (
    <div
      className="preview-fit relative w-full"
      ref={ref}
      style={{ height: pageHeightPx * scale + (isOverlay ? 34 : 0) }}
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
          style={{ width: `${pageWidthMm}mm`, height: `${pageHeightMm}mm` }}
        >
          {/* Le mode overlay occupe exactement toute la feuille 200 × 105 mm. */}
          <div
            className="traite-area relative"
            style={{
              width: `${traiteWidthMm}mm`,
              height: `${traiteHeightMm}mm`,
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
            style={{ top: `${LCN_HEIGHT_MM + 3}mm`, left: "2mm" }}
          >
            Papier LCN réel : {LCN_WIDTH_MM} × {LCN_HEIGHT_MM} mm — le fond
            repère ne s'imprime pas.
          </p>
        )}
      </div>
    </div>
  );
}
