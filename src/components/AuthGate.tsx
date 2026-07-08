import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthGateProps {
  children: (session: Session) => ReactNode;
}

function translateAuthError(message: string): string {
  const map: Record<string, string> = {
    'Invalid login credentials': 'Email ou mot de passe incorrect.',
    'Email not confirmed': 'Email non confirmé. Vérifiez votre boîte de réception.',
    'User already registered': 'Un compte existe déjà avec cet email.',
    'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caractères.',
    'Signups not allowed for this instance': 'Les inscriptions sont désactivées sur cette instance.',
  };
  return map[message] ?? message;
}

export function AuthGate({ children }: AuthGateProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setInfo(null);
    if (!email.trim() || password.length < 6) {
      setError('Renseignez un email valide et un mot de passe d’au moins 6 caractères.');
      return;
    }
    setPending(true);
    if (tab === 'login') {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) setError(translateAuthError(authError.message));
    } else {
      const { data, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) {
        setError(translateAuthError(authError.message));
      } else if (!data.session) {
        setInfo('Compte créé. Vérifiez votre boîte mail pour confirmer votre adresse, puis connectez-vous.');
        setTab('login');
      }
    }
    setPending(false);
  };

  if (!ready) {
    return (
      <div className="grid h-screen place-items-center bg-slate-100 text-slate-500">
        Chargement de la session…
      </div>
    );
  }

  if (session) return <>{children(session)}</>;

  const inputClass =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-900/5">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <img
            src="/CherifCorp%20Logo.png"
            alt="CherifCorp Technologies"
            className="h-24 w-24 select-none object-contain"
            draggable={false}
          />
          <div>
            <h1 className="text-lg font-bold leading-tight text-slate-800">
              Générateur de Lettre de Change
            </h1>
            <p className="text-sm text-slate-500" dir="rtl">
              نموذج طباعة كمبيالة (KEMBIALA)
            </p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-lg bg-slate-100 p-1 text-sm font-medium">
          {(
            [
              ['login', 'Connexion'],
              ['signup', 'Inscription'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setTab(key);
                setError(null);
                setInfo(null);
              }}
              className={`rounded-md py-2 transition ${
                tab === key ? 'bg-white text-blue-700 shadow' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="auth-email">
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.tn"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="auth-password">
              Mot de passe
            </label>
            <input
              id="auth-password"
              type="password"
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          {info && (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? 'Veuillez patienter…' : tab === 'login' ? 'Se connecter' : 'Créer un compte'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Vos traites sont enregistrées de façon privée (RLS Supabase) et liées à votre compte.
        </p>
        <p className="mt-3 text-center text-xs font-medium text-slate-500">
          Kimbiale, CherifCorp Technologies @2026
        </p>
      </div>
    </div>
  );
}
