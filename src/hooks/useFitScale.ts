import { useEffect, useRef, useState } from 'react';

/**
 * Calcule l'échelle CSS pour faire tenir un contenu de largeur fixe (px)
 * dans la largeur disponible du conteneur observé.
 */
export function useFitScale<T extends HTMLElement>(contentWidthPx: number, maxScale = 1.1) {
  const ref = useRef<T>(null);
  const [scale, setScale] = useState(0.6);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const compute = () => {
      const width = el.clientWidth;
      if (width > 0) setScale(Math.min(width / contentWidthPx, maxScale));
    };
    compute();
    const observer = new ResizeObserver(compute);
    observer.observe(el);
    return () => observer.disconnect();
  }, [contentWidthPx, maxScale]);

  return { ref, scale };
}
