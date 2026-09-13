'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';
import { TransitionLink } from '@/components/ui/transition-link';
import { CodeConfetti } from '@/views/landing/preview/CodeConfetti';

interface RegisterSuccessModalProps {
  isOpen: boolean;
  studentName?: string;
  techName?: string;
  goalMinutes?: number;
}

export const RegisterSuccessModal: React.FC<RegisterSuccessModalProps> = ({
  isOpen,
  studentName = 'Estudiante',
  techName = 'Python',
  goalMinutes = 10,
}) => {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [handoff, setHandoff] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ctaRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // El éxito no se descarta: Escape lleva a la ruta.
        ctaRef.current?.click();
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="register-success-title"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="relative w-full max-w-md rounded-3xl border border-amber-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-center space-y-5 overflow-hidden"
          >
            <CodeConfetti burstKey={1} />
            <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28">
              <div aria-hidden="true" className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-pulse" />
              <Image
                src="/brand/koda-mascot-cartoon-2d.svg"
                alt="Koda celebrando"
                width={120}
                height={120}
                className="w-full h-full object-contain relative z-10 select-none"
              />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
                <Sparkles aria-hidden="true" className="w-3.5 h-3.5" />
                ¡Perfil Guardado con Éxito!
              </span>
              <h2 id="register-success-title" className="text-2xl font-black text-white tracking-tight">
                ¡Bienvenido, {studentName}!
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                Tu viaje para dominar <strong className="text-amber-400">{techName}</strong> ha comenzado. Hemos activado tu racha y tu meta diaria de {goalMinutes} min.
              </p>
            </div>

            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-center gap-4 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5 text-orange-400">
                <Flame aria-hidden="true" className="w-4 h-4 fill-orange-500" />
                Racha: 1 día iniciada
              </span>
              <span aria-hidden="true" className="text-slate-600">•</span>
              <span className="text-emerald-400">XP Inicial: +50 XP</span>
            </div>

            <GradientButton asChild className="w-full py-3 text-sm gap-2">
              <TransitionLink ref={ctaRef} href="/?roadmap=true" onClick={() => setHandoff(true)}>
                <span>Comenzar a Programar</span>
                <ArrowRight aria-hidden="true" className="w-4 h-4" />
              </TransitionLink>
            </GradientButton>
          </motion.div>

          {/* Handoff: Koda vuela hacia la ruta durante la transición */}
          <AnimatePresence>
            {handoff && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                aria-hidden="true"
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-950/95 backdrop-blur-md"
              >
                <motion.div
                  initial={reduceMotion ? {} : { scale: 0.6, y: 30 }}
                  animate={{ scale: 1.4, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image
                    src="/brand/koda-mascot-cartoon-2d.svg"
                    alt=""
                    width={120}
                    height={120}
                    className="object-contain select-none"
                  />
                </motion.div>
                <p className="font-display font-black text-amber-300">¡A la ruta! 🚀</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
};
