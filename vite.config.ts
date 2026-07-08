import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Config PostCSS inline (vide) : empêche Vite de remonter chercher un
  // postcss.config.js hors du projet (ex. sur le Bureau) — Tailwind v4
  // est déjà géré par son plugin Vite dédié.
  css: {
    postcss: {},
  },
});
