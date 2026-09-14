'use client';

import { useEffect } from 'react';
import { getLenisInstance } from '@/lib/scroll';

const CHAPTERS = [
  'inicio',
  'vista-previa',
  'metodologia',
  'testimonios',
  'mapa',
  'planes',
  'certificado',
  'finale',
];

const OFFSET = -80;
const DURATION = 1.25;
const COOLDOWN = 1400;
const EDGE = 120;

/**
 * Snap por capítulos: una rueda = una sección (ida y vuelta).
 * Las secciones altas (metodología) se leen con scroll nativo hasta
 * llegar a su borde; ahí el siguiente tick salta al capítulo siguiente.
 * Solo mouse con movimiento fino; táctil, teclado y reduced-motion intactos.
 */
export const SectionSnap: React.FC = () => {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let cooling = false;

    const currentIndex = () => {
      const y = window.scrollY;
      let idx = 0;
      CHAPTERS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top + window.scrollY + OFFSET <= y + 2) idx = i;
      });
      return idx;
    };

    const goTo = (idx: number) => {
      const el = document.getElementById(CHAPTERS[idx]);
      if (!el) return;
      cooling = true;
      const lenis = getLenisInstance();
      if (lenis) {
        lenis.scrollTo(el, {
          offset: OFFSET,
          duration: DURATION,
          onComplete: () => {
            window.setTimeout(() => {
              cooling = false;
            }, 150);
          },
        });
        window.setTimeout(() => {
          cooling = false;
        }, COOLDOWN);
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
        window.setTimeout(() => {
          cooling = false;
        }, COOLDOWN);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (cooling) {
        e.preventDefault();
        return;
      }
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('input, textarea, select, [contenteditable="true"], dialog, [role="dialog"]')) return;
      if (document.querySelector('dialog[open], [role="dialog"]')) return;
      const dy = e.deltaY;
      if (Math.abs(dy) < 4) return;

      const idx = currentIndex();
      const current = document.getElementById(CHAPTERS[idx]);
      if (!current) return;
      const rect = current.getBoundingClientRect();
      const vh = window.innerHeight;

      if (dy > 0) {
        // Bajando: si queda contenido del capítulo fuera de vista, scroll nativo.
        if (rect.bottom > vh + EDGE) return;
        if (idx >= CHAPTERS.length - 1) return;
        e.preventDefault();
        goTo(idx + 1);
      } else {
        // Subiendo: si el inicio del capítulo está arriba fuera de vista, nativo.
        if (rect.top < -EDGE) return;
        if (idx <= 0) {
          if (window.scrollY > 2) {
            e.preventDefault();
            cooling = true;
            const lenis = getLenisInstance();
            if (lenis) lenis.scrollTo(0, { duration: DURATION });
            else window.scrollTo({ top: 0, behavior: 'smooth' });
            window.setTimeout(() => {
              cooling = false;
            }, COOLDOWN);
          }
          return;
        }
        e.preventDefault();
        goTo(idx - 1);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  return null;
};

export default SectionSnap;
