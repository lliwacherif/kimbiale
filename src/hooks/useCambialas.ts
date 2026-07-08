import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { CambialaPayload, CambialaRecord } from '../types';

interface SaveResult {
  record?: CambialaRecord;
  error?: string;
}

function friendlyDbError(error: { code?: string; message: string }): string {
  if (error.code === '42P01') {
    return "La table « cambialas » n'existe pas encore dans Supabase. Exécutez le script supabase/schema.sql dans l'éditeur SQL de votre projet.";
  }
  if (error.code === '23514') {
    return 'Contrainte violée : vérifiez que le RIB contient exactement 20 chiffres.';
  }
  if (error.code === '42501') {
    return 'Accès refusé par la politique de sécurité (RLS). Reconnectez-vous puis réessayez.';
  }
  return `Erreur Supabase : ${error.message}`;
}

/** Chargement + persistance des traites de l'utilisateur connecté. */
export function useCambialas(userId: string | undefined) {
  const [records, setRecords] = useState<CambialaRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tableMissing, setTableMissing] = useState(false);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('cambialas')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    setLoading(false);
    if (fetchError) {
      setTableMissing(fetchError.code === '42P01');
      setError(friendlyDbError(fetchError));
      return;
    }
    setTableMissing(false);
    setError(null);
    setRecords((data ?? []) as CambialaRecord[]);
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = useCallback(
    async (payload: CambialaPayload, editingId?: string): Promise<SaveResult> => {
      const query = editingId
        ? supabase.from('cambialas').update(payload).eq('id', editingId).select().single()
        : supabase.from('cambialas').insert(payload).select().single();

      const { data, error: saveError } = await query;
      if (saveError) {
        if (saveError.code === '42P01') setTableMissing(true);
        return { error: friendlyDbError(saveError) };
      }
      await refresh();
      return { record: data as CambialaRecord };
    },
    [refresh],
  );

  return { records, loading, error, tableMissing, refresh, save };
}
