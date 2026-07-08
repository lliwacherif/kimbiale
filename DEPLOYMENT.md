# Kimbiale — Fiche de déploiement

Générateur de Lettre de Change tunisienne (Cambiala / Traite).
**Kimbiale, CherifCorp Technologies @2026**

## Spécifications

| | |
| --- | --- |
| Type | SPA statique (aucun serveur backend à héberger) |
| Frontend | React 19 + TypeScript, Vite 8 |
| Styles | Tailwind CSS 4 (plugin `@tailwindcss/vite`) + CSS `@media print` |
| Backend | Supabase (Auth email/mot de passe + PostgreSQL avec RLS) |
| Node requis | ≥ 20.19 (build) |
| Sortie de build | dossier `dist/` |

## Variables d'environnement

À définir sur la plateforme d'hébergement (variables de build) :

```env
VITE_SUPABASE_URL="https://pxufxatfecpxnhkhgxpj.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4dWZ4YXRmZWNweG5oa2hneHBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0OTg2NDAsImV4cCI6MjA5OTA3NDY0MH0.xHC9-YPD9uA8coAW7ZYGo1f3MEoLXaRWeJKdRrQYRBs"
```

Notes :
- Clé **anon publique** (prévue pour le client, protégée par RLS) — pas un secret.
- Le fichier `.env` du repo contient déjà ces valeurs ; un repli codé en dur existe dans `src/lib/supabase.ts`.
- Ne jamais exposer la clé `service_role` côté client.

## Commandes

```bash
npm install        # installer les dépendances
npm run build      # type-check (tsc) + build production → dist/
npm run preview    # tester le build en local
```

## Hébergement (Vercel / Netlify / Cloudflare Pages…)

| Paramètre | Valeur |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| Framework preset | Vite |

- Application mono-page sans routeur : aucune règle de réécriture SPA indispensable (mais `/* → /index.html` ne nuit pas).
- Assets requis servis depuis `public/` : `cambiale.png` (gabarit LCN), `CherifCorp Logo.png`, `favicon.svg`.

## Supabase (déjà provisionné)

- Projet : `pxufxatfecpxnhkhgxpj` — table `public.cambialas` + enum `print_method_type` + politiques RLS + trigger `updated_at` **déjà en place** (script de référence : `supabase/schema.sql`).
- Auth : inscriptions ouvertes, **confirmation d'email activée** (les nouveaux comptes doivent cliquer le lien reçu). Modifiable dans *Authentication → Sign In / Up → Confirm email*.
- Après mise en ligne, ajouter l'URL de production dans *Authentication → URL Configuration* (Site URL + Redirect URLs) pour que les liens de confirmation redirigent correctement.

## Checklist post-déploiement

1. Inscription + confirmation email + connexion.
2. Saisie d'une traite → « Enregistrer & Imprimer » → vérifier la ligne dans l'historique (Supabase).
3. Impression : A4, échelle 100 %, marges « Aucune », graphiques d'arrière-plan activés (Mode 1).
4. Mode 2 (papier officiel LCN) : test sur feuille blanche + calibrage Offset X/Y avant impression réelle.
