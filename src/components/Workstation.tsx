import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { parseMontant, todayIso } from "../lib/format";
import { validateForm } from "../lib/validate";
import { useCambialas } from "../hooks/useCambialas";
import type {
  CambialaFormState,
  CambialaPayload,
  CambialaRecord,
  FormErrors,
  PrintMethod,
  TraiteData,
} from "../types";
import { CambialaForm } from "./CambialaForm";
import { ModeSelector } from "./ModeSelector";
import { CalibrationControls } from "./CalibrationControls";
import { HistoryLedger } from "./HistoryLedger";
import { PreviewCanvas } from "./PreviewCanvas";

function defaultForm(): CambialaFormState {
  return {
    date_echeance: "",
    ville: "",
    date_edition: todayIso(),
    rib: "",
    montant: "",
    monnaie: "DT",
    a_lordre_de: "",
    payeur: "",
    aval: "",
    banque: "",
    protestable: true,
  };
}

const MODE_LABELS: Record<PrintMethod, string> = {
  FULL_A4: "Impression complète — Page entière A4",
  OVERLAY_PHYSICAL: "Sur-impression — Papier officiel LCN",
};

interface DeviceCalibration {
  offsetX: number;
  offsetY: number;
  scaleX: number;
  scaleY: number;
}

const CALIBRATION_STORAGE_KEY = "kimbiale-lcn-calibration-reference-v3";

function loadDeviceCalibration(): DeviceCalibration {
  try {
    const saved = localStorage.getItem(CALIBRATION_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<DeviceCalibration>;
      return {
        offsetX: Number(parsed.offsetX) || 0,
        offsetY: Number(parsed.offsetY) || 0,
        scaleX: Number(parsed.scaleX) || 100,
        scaleY: Number(parsed.scaleY) || 100,
      };
    }
  } catch {
    // Stockage indisponible ou ancienne valeur invalide : valeurs neutres.
  }
  return { offsetX: 0, offsetY: 0, scaleX: 100, scaleY: 100 };
}

export function Workstation({ session }: { session: Session }) {
  const userId = session.user.id;
  const initialCalibration = useMemo(loadDeviceCalibration, []);

  const [form, setForm] = useState<CambialaFormState>(defaultForm());
  const [errors, setErrors] = useState<FormErrors>({});
  const [mode, setMode] = useState<PrintMethod>("FULL_A4");
  const [offsetX, setOffsetX] = useState(initialCalibration.offsetX);
  const [offsetY, setOffsetY] = useState(initialCalibration.offsetY);
  const [scaleX, setScaleX] = useState(initialCalibration.scaleX);
  const [scaleY, setScaleY] = useState(initialCalibration.scaleY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { records, loading, error, refresh, save } = useCambialas(userId);

  useEffect(() => {
    try {
      localStorage.setItem(
        CALIBRATION_STORAGE_KEY,
        JSON.stringify({
          offsetX,
          offsetY,
          scaleX,
          scaleY,
        } satisfies DeviceCalibration),
      );
    } catch {
      // L'impression reste fonctionnelle même si le stockage local est bloqué.
    }
  }, [offsetX, offsetY, scaleX, scaleY]);

  const handleFieldChange = <K extends keyof CambialaFormState>(
    field: K,
    value: CambialaFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const traiteData: TraiteData = useMemo(
    () => ({
      dateEcheance: form.date_echeance,
      dateEdition: form.date_edition,
      ville: form.ville.trim(),
      rib: form.rib,
      montant: parseMontant(form.montant),
      monnaie: form.monnaie.trim().toUpperCase() || "DT",
      aLordreDe: form.a_lordre_de.trim(),
      payeur: form.payeur.trim(),
      aval: form.aval.trim(),
      banque: form.banque.trim(),
      protestable: form.protestable,
    }),
    [form],
  );

  const runValidation = (): boolean => {
    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSaveError("Corrigez les champs signalés avant de continuer.");
      return false;
    }
    setSaveError(null);
    return true;
  };

  const triggerPrint = () => {
    // Laisse React peindre l'aperçu final avant d'ouvrir la fenêtre d'impression.
    setTimeout(() => window.print(), 120);
  };

  const handleSaveAndPrint = async () => {
    if (!runValidation()) return;
    const montant = parseMontant(form.montant);
    if (montant === null) return;

    const payload: CambialaPayload = {
      user_id: userId,
      date_echeance: form.date_echeance,
      ville: form.ville.trim(),
      date_edition: form.date_edition || null,
      rib: form.rib,
      montant,
      monnaie: form.monnaie.trim().toUpperCase(),
      a_lordre_de: form.a_lordre_de.trim(),
      payeur: form.payeur.trim(),
      aval: form.aval.trim() || null,
      banque: form.banque.trim(),
      protestable: form.protestable,
      print_method: mode,
      offset_x: mode === "OVERLAY_PHYSICAL" ? offsetX : 0,
      offset_y: mode === "OVERLAY_PHYSICAL" ? offsetY : 0,
    };

    setSaving(true);
    const result = await save(payload, editingId ?? undefined);
    setSaving(false);

    if (result.error) {
      setSaveError(result.error);
      return;
    }
    if (result.record) setEditingId(result.record.id);
    triggerPrint();
  };

  const handlePrintOnly = () => {
    if (!runValidation()) return;
    triggerPrint();
  };

  const handleSelectRecord = (record: CambialaRecord) => {
    setForm({
      date_echeance: record.date_echeance ?? "",
      ville: record.ville ?? "",
      date_edition: record.date_edition ?? "",
      rib: record.rib ?? "",
      montant: Number(record.montant).toFixed(3),
      monnaie: record.monnaie ?? "DT",
      a_lordre_de: record.a_lordre_de ?? "",
      payeur: record.payeur ?? "",
      aval: record.aval ?? "",
      banque: record.banque ?? "",
      protestable: record.protestable,
    });
    setMode(record.print_method);
    setEditingId(record.id);
    setErrors({});
    setSaveError(null);
  };

  const handleNewTraite = () => {
    setForm(defaultForm());
    setEditingId(null);
    setErrors({});
    setSaveError(null);
  };

  return (
    <div className="app-shell flex h-screen flex-col bg-slate-100">
      {/* ——— En-tête ——— */}
      <header className="no-print flex items-center justify-between border-b border-slate-200 bg-white px-5 py-2.5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-red-700 text-sm font-bold text-white">
            LC
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight text-slate-800">
              Générateur d'impression de Lettre de Change (TRAITE)
            </h1>
            <p className="text-xs leading-tight text-slate-500" dir="rtl">
              نموذج طباعة كمبيالة (KEMBIALA)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-slate-500 sm:inline">
            {session.user.email}
          </span>
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-slate-600 transition hover:bg-slate-50"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <div className="app-main flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* ——— Panneau gauche : formulaire & historique ——— */}
        <aside className="no-print w-full shrink-0 space-y-5 overflow-y-auto border-r border-slate-200 bg-white p-5 lg:w-[440px]">
          <CambialaForm
            form={form}
            errors={errors}
            onChange={handleFieldChange}
          />

          <hr className="border-slate-100" />

          <ModeSelector mode={mode} onChange={setMode} />

          {mode === "OVERLAY_PHYSICAL" && (
            <CalibrationControls
              offsetX={offsetX}
              offsetY={offsetY}
              scaleX={scaleX}
              scaleY={scaleY}
              onChangeX={setOffsetX}
              onChangeY={setOffsetY}
              onChangeScaleX={setScaleX}
              onChangeScaleY={setScaleY}
            />
          )}

          {/* ——— Avertissement de responsabilité ——— */}
          <div className="border-l-4 border-red-600 bg-slate-100 p-3 text-xs leading-relaxed text-slate-600">
            Les utilisateurs assument l'entière responsabilité du contenu
            imprimé. Il est impératif de contrôler visuellement vos traites
            avant de les signer. Nous n'assumons aucune responsabilité pour ce
            service gratuit mis à la disposition de nos partenaires
            gracieusement.
          </div>
          <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-blue-600"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
            />
            <span>
              Je reconnais que je suis le seul responsable de l'impression de la
              traite
            </span>
          </label>

          {/* ——— Banc d'actions ——— */}
          <div className="space-y-2">
            {saveError && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs leading-snug text-red-700">
                {saveError}
              </p>
            )}
            <button
              type="button"
              onClick={handleSaveAndPrint}
              disabled={!acknowledged || saving}
              className="w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Enregistrement…"
                : editingId
                  ? "Mettre à jour & Imprimer"
                  : "Enregistrer & Imprimer"}
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePrintOnly}
                disabled={!acknowledged}
                className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Imprimer (test, sans enregistrer)
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleNewTraite}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Nouvelle traite
                </button>
              )}
            </div>
          </div>

          <hr className="border-slate-100" />

          <HistoryLedger
            records={records}
            loading={loading}
            error={error}
            selectedId={editingId}
            onSelect={handleSelectRecord}
            onRefresh={() => void refresh()}
          />
        </aside>

        {/* ——— Panneau droit : canvas d'aperçu ——— */}
        <main className="preview-pane flex-1 overflow-auto bg-slate-200/80 p-6">
          <div className="no-print mb-3 flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">
              Aperçu avant impression —{" "}
              {mode === "OVERLAY_PHYSICAL"
                ? "coordonnées du PDF de référence sur A4 (210 × 297 mm)"
                : "A4 portrait (210 × 297 mm)"}
            </span>
            <span className="rounded-full bg-white px-3 py-1 font-semibold text-slate-600 shadow-sm ring-1 ring-slate-900/5">
              {MODE_LABELS[mode]}
            </span>
          </div>
          <PreviewCanvas
            data={traiteData}
            mode={mode}
            offsetX={offsetX}
            offsetY={offsetY}
            scaleX={scaleX}
            scaleY={scaleY}
          />
        </main>
      </div>
    </div>
  );
}
