'use client';

import { useEffect } from 'react';

// Tramos: 1 hero/noche · 2 preview+metodología/atardecer · 3 social/noche profunda · 4 finale/negro.
const ACTS: { act: string; ids: string[] }[] = [
  { act: '1', ids: ['inicio'] },
  { act: '2', ids: ['vista-previa', 'metodologia'] },
  { act: '3', ids: ['testimonios', 'mapa', 'planes', 'certificado'] },
  { act: '4', ids: ['finale'] },
];

/** Observa el tramo visible y lo publica en `body[data-act]`. */
export const ActTheme: React.FC = () => {
  useEffect(() => {
    const idToAct = new Map<string, string>();
    ACTS.forEach(({ act, ids }) => ids.forEach((id) => idToAct.set(id, act)));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const act = idToAct.get(entry.target.id);
            if (act) document.body.dataset.act = act;
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    const els: Element[] = [];
    idToAct.forEach((_, id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        els.push(el);
      }
    });
    return () => observer.disconnect();
  }, []);

  return null;
};

export default ActTheme;
