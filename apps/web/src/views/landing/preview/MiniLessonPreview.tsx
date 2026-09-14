'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Check, ArrowCounterClockwise, ArrowRight } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { sound } from '@/lib/sound';
import { getGsap, prefersReducedMotion } from '@/lib/gsap';
import { CodeConfetti } from './CodeConfetti';

const OPTIONS = [
  { key: 'A', label: 'Hola, Koda', correct: true },
  { key: 'B', label: '"Hola, Koda"', correct: false },
  { key: 'C', label: 'Hola Koda', correct: false },
  { key: 'D', label: 'Error', correct: false },
];

type Phase = 'answering' | 'success' | 'hint';

export const MiniLessonPreview: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('answering');
  const [attempts, setAttempts] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 32,
        opacity: 0,
        clipPath: 'inset(12% 4% 12% 4%)',
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: cardRef.current, start: 'top 85%', once: true },
      });
    }, cardRef);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !feedbackRef.current) return;
    const { gsap } = getGsap();
    if (phase === 'hint') {
      gsap.fromTo(
        feedbackRef.current,
        { x: 0 },
        { keyframes: [{ x: -10 }, { x: 10 }, { x: -6 }, { x: 6 }, { x: 0 }], duration: 0.45, ease: 'power2.out' }
      );
    }
    if (phase === 'success') {
      gsap.fromTo(
        feedbackRef.current,
        { scale: 1 },
        { scale: 1.02, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.out' }
      );
    }
  }, [phase, attempts]);

  const check = () => {
    if (!selected) return;
    const ok = OPTIONS.find((o) => o.key === selected)?.correct;
    setAttempts((n) => n + 1);
    setPhase(ok ? 'success' : 'hint');
    if (ok) sound.success();
    else sound.hint();
  };

  const retry = () => {
    setSelected(null);
    setPhase('answering');
  };

  return (
    <div
      ref={cardRef}
      className="w-full max-w-md mx-auto lg:mx-0 rounded-[10px] border border-slate-700 bg-slate-950 overflow-hidden will-change-transform"
    >
      <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900/80 px-4 py-2.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        </span>
        <p className="ml-1 font-mono text-[11px] font-bold uppercase tracking-widest text-slate-400">
          modulo_01.py --preview
        </p>
        <span className="ml-auto rounded-[6px] border border-amber-400/40 border-l-2 border-l-amber-400 bg-slate-950 px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-widest text-amber-300">
          +5 XP
        </span>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm sm:text-base font-semibold text-white">
            ¿Qué muestra este código en pantalla?
          </p>
        </div>
        <p aria-live="polite" className="text-xs text-slate-400 -mt-2 font-mono">
          {phase === 'success'
            ? '[koda] acierto_confirmado'
            : phase === 'hint'
              ? '[koda] pista_disponible'
              : '[koda] en_observacion'}
        </p>
        <pre className="overflow-x-auto rounded-[8px] border border-slate-800 border-l-2 border-l-emerald-400 bg-black p-3.5 font-mono text-sm leading-relaxed">
          <code>
            <span className="text-fuchsia-400">print</span>
            <span className="text-slate-300">(</span>
            <span className="text-emerald-300">&quot;Hola, Koda&quot;</span>
            <span className="text-slate-300">)</span>
          </code>
        </pre>

        <div ref={feedbackRef} className="space-y-4 will-change-transform">
        <div role="radiogroup" aria-label="Opciones de respuesta" className="space-y-2">
          {OPTIONS.map((opt) => {
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
                  'flex w-full items-center gap-3 rounded-[8px] border px-3.5 py-3 text-left text-sm font-medium transition-all min-h-[48px]',
                  active
                    ? 'border-amber-400/60 border-l-2 border-l-amber-400 bg-amber-400/10 text-white'
                    : 'border-slate-700/80 bg-slate-900/60 text-slate-200 hover:border-slate-500 hover:bg-slate-800/60',
                  disabled && 'opacity-60 cursor-default'
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex h-6 min-w-9 shrink-0 items-center justify-center rounded-[6px] border px-1 font-mono text-[11px] font-bold',
                    active ? 'border-amber-400/60 text-amber-300' : 'border-slate-600 text-slate-400'
                  )}
                >
                  [{opt.key}]
                </span>
                <span className="font-mono">{opt.label}</span>
              </button>
            );
          })}
        </div>

        {phase === 'success' ? (
          <div role="status" className="relative space-y-3 rounded-[8px] border border-emerald-400/30 border-l-2 border-l-emerald-400 bg-emerald-400/10 p-3.5">
            <CodeConfetti burstKey={attempts} />
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
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-[8px] bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 transition-all hover:bg-emerald-300"
            >
              Seguir ganando XP
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            {phase === 'hint' && (
              <div role="alert" className="rounded-[8px] border border-amber-400/30 border-l-2 border-l-amber-400 bg-amber-400/10 p-3.5">
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
                className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-[8px] bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Comprobar
              </button>
              {phase === 'hint' && (
                <button
                  type="button"
                  onClick={retry}
                  className="inline-flex min-h-[48px] items-center gap-1.5 rounded-[8px] border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-all hover:border-slate-500"
                >
                  <ArrowCounterClockwise aria-hidden="true" className="h-4 w-4" />
                  Reintentar
                </button>
              )}
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
};
