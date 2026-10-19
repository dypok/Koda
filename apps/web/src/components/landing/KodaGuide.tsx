'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { KodaMascot } from '@/components/brand/KodaMascot';

const CAPTIONS: { caption: string; ids: string[] }[] = [
  { caption: '> empieza_aqui', ids: ['inicio'] },
  { caption: '> ver_demo', ids: ['vista-previa', 'metodologia'] },
  { caption: '> casi_listo', ids: ['testimonios', 'mapa', 'planes', 'certificado'] },
  { caption: '> tu_racha', ids: ['finale'] },
];

/** Koda guía fija (solo desktop): narra el viaje según la sección visible. */
export const KodaGuide: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [caption, setCaption] = useState(CAPTIONS[0].caption);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const idToCaption = new Map<string, string>();
    CAPTIONS.forEach(({ caption: c, ids }) => ids.forEach((id) => idToCaption.set(id, c)));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const c = idToCaption.get(entry.target.id);
            if (c) {
              setCaption(c);
              setVisible(entry.target.id !== 'inicio');
            }
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    const els: Element[] = [];
    idToCaption.forEach((_, id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        els.push(el);
      }
    });
    return () => observer.disconnect();
  }, []);

  if (reduceMotion) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 24, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 24, scale: 0.9 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="pointer-events-none fixed right-5 bottom-24 z-30 hidden xl:flex flex-col items-center gap-1.5 select-none"
        >
          <span className="rounded-[6px] border border-amber-400/40 border-l-2 border-l-amber-400 bg-slate-950/90 backdrop-blur px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-amber-200 whitespace-nowrap">
            {caption}
          </span>
          <KodaMascot
            state="idle"
            size={56}
            animate="float"
            glow
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KodaGuide;
