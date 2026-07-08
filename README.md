# Kimbiale — Générateur de Lettre de Change tunisienne (Cambiala / Traite)

Application web complète pour générer, enregistrer et imprimer des lettres de change (traites) tunisiennes, avec deux moteurs d'impression de haute précision.

## Stack technique

| Couche | Technologie |
| --- | --- |
| Frontend | React 19 + TypeScript (Vite) |
| Styles | Tailwind CSS v4 + CSS `@media print` dédié |
| Backend / BDD | Supabase (Auth email/mot de passe + PostgreSQL avec RLS) |
| Impression | Fenêtre d'impression native du navigateur, page A4 absolue (210 × 297 mm) |

## Installation

```bash
npm install
npm run dev
```

L'application démarre sur `http://localhost:5173`.

Les identifiants Supabase sont déjà configurés dans `.env` (clé anonyme publique, sans danger côté client). Un repli codé en dur existe aussi dans `src/lib/supabase.ts`.

## Base de données (étape obligatoire, une seule fois)

La clé anonyme ne permet pas de créer des tables : exécutez le script SQL fourni.

1. Ouvrez le [Dashboard Supabase](https://supabase.com/dashboard/project/pxufxatfecpxnhkhgxpj) du projet.
2. Menu **SQL Editor** → **New query**.
3. Collez l'intégralité de `supabase/schema.sql` et cliquez **Run**.

Le script provisionne : l'enum `print_method_type`, la table `public.cambialas`, les politiques RLS (chaque utilisateur ne voit/modifie que ses propres traites) et le trigger `updated_at` automatique.

> Si la table n'existe pas encore, l'application affiche un bandeau explicite dans l'historique au lieu de planter.

### Confirmation d'email

Si l'option **Confirm email** est activée dans *Authentication → Sign In / Up* de votre projet Supabase, les nouveaux inscrits devront cliquer le lien reçu par email avant de pouvoir se connecter (l'application affiche le message adéquat). Désactivez cette option pour une connexion immédiate après inscription.

## Utilisation

1. **Inscription / Connexion** par email et mot de passe.
2. **Panneau gauche** : saisissez les champs de la traite (RIB à 20 chiffres contrôlé, montant à 3 décimales, etc.).
3. **Méthode d'impression** :
   - **Mode 1 — Impression Complète (Page Entière A4)** : imprime le document entier (cadre bilingue FR/AR reconstitué en CSS + données) sur une feuille A4 vierge.
   - **Mode 2 — Sur-impression sur Papier Officiel (LCN)** : imprime *uniquement les données*, positionnées pour tomber dans les cases de votre traite pré-imprimée. Le fond affiché à l'écran (opacité réduite) sert de repère et **n'est jamais imprimé**.
4. **Calibrage (Mode 2)** : les curseurs *Offset X / Offset Y* (−20 px → +20 px) décalent l'ensemble des champs en temps réel pour compenser les marges matérielles de votre imprimante.
5. **Enregistrer & Imprimer** : enregistre la traite dans Supabase sous votre session puis ouvre l'impression native.
6. **Historique** : cliquez sur une ligne pour recharger la traite dans le formulaire (relecture, modification, réimpression). Le badge indique le moteur utilisé (`FULL_A4` / `OVERLAY_PHYSICAL`).

## Guide d'impression (précision bancaire)

Dans la boîte de dialogue d'impression du navigateur (Chrome/Edge recommandés) :

- **Papier : A4**, orientation **Portrait**.
- **Échelle : 100 %** — jamais « Ajuster à la page ».
- **Marges : Aucune**.
- **En-têtes et pieds de page : désactivés**.
- **Graphiques d'arrière-plan : activés** (nécessaire au Mode 1 pour les trames).

### Mode 2 — papier officiel

1. Insérez la traite officielle dans le bac de sorte qu'elle soit saisie **bord haut en premier**, calée sur le côté d'alimentation (la zone imprimable est ancrée au coin supérieur gauche de la page A4).
2. Faites d'abord un **« Imprimer (test, sans enregistrer) »** sur une feuille A4 blanche ; superposez-la à la traite face à une source de lumière.
3. Corrigez avec les curseurs *Offset X/Y* puis relancez.

### Ajustements fins

- Les décalages globaux se règlent avec les curseurs.
- Les positions individuelles des champs (en % de la zone traite) et les dimensions physiques du papier (`TRAITE_WIDTH_MM` / `TRAITE_HEIGHT_MM`) se règlent dans **`src/lib/layout.ts`** si votre lot de papier diffère du gabarit scanné (`public/cambiale.png`).

## Structure du projet

```
src/
├── components/
│   ├── AuthGate.tsx          # Porte d'authentification (connexion / inscription)
│   ├── Workstation.tsx       # Poste de travail en écran scindé
│   ├── CambialaForm.tsx      # Formulaire de saisie + validation
│   ├── ModeSelector.tsx      # Bascule Mode 1 / Mode 2
│   ├── CalibrationControls.tsx # Curseurs Offset X / Y
│   ├── HistoryLedger.tsx     # Registre des traites enregistrées
│   ├── PreviewCanvas.tsx     # Canvas A4 = cible d'impression (#print-target-canvas)
│   ├── TraiteSkeleton.tsx    # Reconstitution CSS bilingue du document (Mode 1)
│   └── OverlayData.tsx       # Couche de données positionnées (partagée entre modes)
├── hooks/
│   ├── useCambialas.ts       # CRUD Supabase + gestion d'erreurs
│   └── useFitScale.ts        # Mise à l'échelle de l'aperçu écran
├── lib/
│   ├── supabase.ts           # Client Supabase
│   ├── layout.ts             # ⚙ Coordonnées de mappage des champs (LCN)
│   ├── frenchNumbers.ts      # Montant en toutes lettres (règles françaises)
│   ├── format.ts             # #2 800.000 DT#, dates, découpage RIB 2-3-13-2
│   └── validate.ts           # Règles de validation du formulaire
└── index.css                 # Tailwind + moteur @media print haute précision
supabase/schema.sql           # Script de provisionnement PostgreSQL
```

## Avertissement

Les utilisateurs assument l'entière responsabilité du contenu imprimé. Contrôlez visuellement chaque traite avant signature.
