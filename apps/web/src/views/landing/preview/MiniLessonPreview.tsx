'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, RotateCcw, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const OPTIONS = [
  { key: 'A', label: 'Hola, Koda', correct: true },
  { key: 'B', label: '"Hola, Koda"', correct: false },
  { key: 'C', label: 'Hola Koda', correct: false },
  { key: 'D', label: 'Error', correct: false },
];

type Phase = 'answering' | 'success' | 'hint';

export const MiniLessonPreview: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('answering');
  const [attempts, setAttempts] = useState(0);

  const check = () => {
    if (!selected) return;
    const ok = OPTIONS.find((o) => o.key === selected)?.correct;
    setAttempts((n) => n + 1);
    setPhase(ok ? 'success' : 'hint');
  };

  const retry = () => {
    setSelected(null);
    setPhase('answering');
  };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md mx-auto lg:mx-0 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Pruébalo · Módulo 01
        </p>
        <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[11px] font-bold text-amber-300">
          +5 XP
        </span>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <p className="text-sm sm:text-base font-semibold text-white">
          ¿Qué muestra este código en pantalla?
        </p>
        <pre className="overflow-x-auto rounded-xl bg-slate-950 border border-slate-800 p-3.5 font-mono text-sm leading-relaxed">
          <code>
            <span className="text-fuchsia-400">print</span>
            <span className="text-slate-300">(</span>
            <span className="text-emerald-300">&quot;Hola, Koda&quot;</span>
            <span className="text-slate-300">)</span>
          </code>
        </pre>

        <motion.div
          key={`feedback-${attempts}`}
          animate={
            reduceMotion
              ? {}
              : phase === 'hint'
                ? { x: [0, -10, 10, -6, 6, 0] }
                : phase === 'success'
                  ? { scale: [1, 1.03, 1] }
                  : {}
          }
          transition={{ duration: 0.45 }}
          className="space-y-4"
        >
        <div role="radiogroup" aria-label="Opciones de respuesta" className="space-y-2">
          {OPTIONS.map((opt, i) => {
            const active = selected === opt.key;
            const disabled = phase === 'success';
            return (
              <button
                key={opt.key}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={disabled}
                onClick={() => {
                  setSelected(opt.key);
                  if (phase === 'hint') setPhase('answering');
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-sm font-medium transition-all min-h-[48px]',
                  active
                    ? 'border-amber-400/60 bg-amber-400/10 text-white'
                    : 'border-slate-700/80 bg-slate-950/60 text-slate-200 hover:border-slate-500 hover:bg-slate-800/60',
                  disabled && 'opacity-60 cursor-default'
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-[11px] font-bold',
                    active ? 'border-amber-400/60 text-amber-300' : 'border-slate-600 text-slate-400'
                  )}
                >
                  {i + 1}
                </span>
                <span className="font-mono">{opt.label}</span>
              </button>
            );
          })}
        </div>

        {phase === 'success' ? (
          <div role="status" className="space-y-3 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3.5">
            <p className="flex items-center gap-2 text-sm font-bold text-emerald-300">
              <Check aria-hidden="true" className="h-4 w-4" />
              ¡Correcto! +5 XP
            </p>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              <span className="font-mono">print()</span> muestra texto en pantalla. Así es cada
              lección: una idea corta, código real y práctica inmediata.
            </p>
            <Link
              href="/register"
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 transition-all hover:bg-emerald-300"
            >
              Seguir ganando XP
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            {phase === 'hint' && (
              <div role="alert" className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3.5">
                <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                  Casi. Pista: las comillas le dicen a Python que es texto, pero fíjate bien
                  en qué aparece en la salida{attempts > 1 ? ' — compara la coma y los espacios' : ''}.
                </p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={check}
                disabled={!selected}
                className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Comprobar
              </button>
              {phase === 'hint' && (
                <button
                  type="button"
                  onClick={retry}
                  className="inline-flex min-h-[48px] items-center gap-1.5 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-all hover:border-slate-500"
                >
                  <RotateCcw aria-hidden="true" className="h-4 w-4" />
                  Reintentar
                </button>
              )}
            </div>
          </>
        )}
        </motion.div>
      </div>
    </motion.div>
  );
};
