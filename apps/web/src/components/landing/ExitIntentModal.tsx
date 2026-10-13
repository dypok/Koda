'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from '@phosphor-icons/react';

const SESSION_KEY = 'koda-exit-shown';

/** Modal dulce de salida: 1 vez por sesión, solo desktop con mouse. */
export const ExitIntentModal: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    let done = false;
    try {
      done = sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      done = false;
    }
    if (done) return;
    const onOut = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setOpen(true);
        try {
          sessionStorage.setItem(SESSION_KEY, '1');
        } catch {
          // sin sesión, igual se muestra una vez
        }
        document.removeEventListener('mouseout', onOut);
      }
    };
    document.addEventListener('mouseout', onOut);
    return () => document.removeEventListener('mouseout', onOut);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open ]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-title"
            className="relative z-10 w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-950 p-6 text-center space-y-4 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="absolute right-3 top-3 inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
            <Image
              src="/brand/koda-mascot-cartoon-2d-transparent.png"
              alt=""
              width={96}
              height={96}
              className="mx-auto object-contain"
            />
            <h3 id="exit-title" className="font-display text-2xl font-bold text-white">
              ¿Te vas sin tu primera lección?
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Son 2 minutos, en tu navegador y sin registrarte: prueba la demo de arriba. 🦊
            </p>
            <Link
              href="/register"
              className="flex min-h-[48px] items-center justify-center rounded-xl bg-amber-400 px-4 text-sm font-bold text-slate-950 hover:bg-amber-300"
            >
              Probar la demo gratis
            </Link>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentModal;
