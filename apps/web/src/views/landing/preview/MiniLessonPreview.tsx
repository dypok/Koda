'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowCounterClockwise, ArrowRight, Check } from '@phosphor-icons/react';
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

export type DemoId = 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7' | 'p8' | 'p9' | 'p10' | 'p11' | 'p12';

/** Quest en vivo de la landing con el form aprobado, en naranja terminal. */
export const MiniLessonPreview: React.FC<{ demo?: DemoId }> = ({ demo }) => {
  void demo;
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
      className="relative w-full max-w-md mx-auto lg:mx-0 min-h-[480px] flex flex-col justify-between px-5 py-5 rounded-2xl bg-gradient-to-b from-[#0e1422] via-[#090d16] to-[#06080d] border border-white/[0.06] shadow-2xl overflow-hidden will-change-transform"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-48 bg-amber-500/10 blur-3xl rounded-full"
      />

      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="mb-6 text-center sm:text-left">
          <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400 font-medium">
            Prueba rápida
          </span>
          <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight leading-snug mt-1.5">
            ¿Qué muestra este código en pantalla?
          </h3>
        </div>

        <section aria-label="Código de ejemplo" className="relative mb-6 rounded-xl bg-[#080b11] border border-white/[0.06] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.04] bg-white/[0.01]">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="w-2 h-2 rounded-full bg-white/20" />
              <span className="w-2 h-2 rounded-full bg-white/20" />
              <span className="w-2 h-2 rounded-full bg-white/20" />
            </div>
            <span className="text-[11px] font-mono text-slate-500 tracking-wide">main.py</span>
          </div>
          <div className="p-4 sm:p-5 font-mono text-[14px] sm:text-[15px] leading-relaxed flex items-center bg-[#07090e]">
            <span aria-hidden="true" className="select-none text-slate-600 pr-4 text-xs">
              1
            </span>
            <p className="text-slate-100">
              <span className="text-orange-400 font-medium">print</span>
              <span className="text-slate-400">(</span>
              <span className="text-amber-300">&quot;Hola, Koda&quot;</span>
              <span className="text-slate-400">)</span>
            </p>
          </div>
        </section>

        <div ref={feedbackRef} className="will-change-transform">
          <div role="radiogroup" aria-label="Opciones de respuesta" className="space-y-2.5">
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
                    'w-full group relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl text-left transition-all duration-200',
                    active
                      ? 'bg-amber-500/[0.08] border border-amber-500/70 shadow-[0_0_20px_-3px_rgba(245,158,11,0.25)]'
                      : 'bg-white/[0.02] border border-white/[0.06] hover:border-white/20 hover:bg-white/[0.04] active:scale-[0.99]',
                    disabled && 'opacity-70 cursor-default'
                  )}
                >
                  <span className="flex items-center gap-3.5">
                    <span
                      aria-hidden="true"
                      className={cn(
                        'flex items-center justify-center w-6 h-6 rounded-md font-mono text-xs transition-colors',
                        active
                          ? 'font-semibold bg-amber-400 text-slate-950'
                          : 'font-normal bg-white/[0.05] text-slate-400 group-hover:text-slate-200 border border-white/[0.06]'
                      )}
                    >
                      {opt.key}
                    </span>
                    <span
                      className={cn(
                        'font-mono text-sm sm:text-[15px]',
                        active ? 'font-medium text-amber-200' : 'text-slate-300 group-hover:text-white'
                      )}
                    >
                      {opt.label}
                    </span>
                  </span>
                  {active && (
                    <span
                      aria-hidden="true"
                      className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0"
                    >
                      <Check className="w-3 h-3" weight="bold" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {phase === 'success' ? (
            <div role="status" className="relative mt-4 space-y-3 rounded-xl border border-amber-400/30 bg-amber-400/[0.07] p-4 overflow-hidden">
              <CodeConfetti burstKey={attempts} />
              <p className="flex items-center gap-2 text-sm font-bold text-amber-300">
                <Check aria-hidden="true" className="h-4 w-4" weight="bold" />
                ¡Correcto! +5 XP
              </p>
              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                <span className="font-mono">print()</span> muestra texto en pantalla. Así es cada
                lección: una idea corta, código real y práctica inmediata.
              </p>
              <Link
                href="/register"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 transition-all hover:bg-amber-300"
              >
                Seguir ganando XP
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              {phase === 'hint' && (
                <div role="alert" className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3.5">
                  <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                    Casi. Pista: las comillas le dicen a Python que es texto, pero fíjate bien
                    en qué aparece en la salida{attempts > 1 ? ' — compara la coma y los espacios' : ''}.
                  </p>
                </div>
              )}
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={check}
                  disabled={!selected}
                  className="w-full py-3 px-5 rounded-xl font-medium text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-40 shadow-[0_0_20px_-3px_rgba(245,158,11,0.35)]"
                >
                  <span>Ejecutar y comprobar</span>
                  <ArrowRight aria-hidden="true" className="w-4 h-4 translate-x-0.5" />
                </button>
                {phase === 'hint' && (
                  <button
                    type="button"
                    onClick={retry}
                    aria-label="Reintentar"
                    className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl border border-slate-700 text-slate-300 transition-all hover:border-slate-500"
                  >
                    <ArrowCounterClockwise aria-hidden="true" className="h-4 w-4" />
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

export default MiniLessonPreview;
