'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

export type DemoId = 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7' | 'p8' | 'p9' | 'p10' | 'p11' | 'p12';

const HINT_LEVELS = [
  'nivel_1: compara cada opción con lo que hay entre comillas en el código.',
  'nivel_2: las comillas marcan texto; la salida muestra el texto sin comillas.',
  'nivel_3: la salida es Hola, Koda — con coma y sin comillas.',
];

const OPT_DIFF: Record<string, { t: string; hl?: boolean }[]> = {
  A: [{ t: 'Hola, Koda' }],
  B: [{ t: '"', hl: true }, { t: 'Hola, Koda' }, { t: '"', hl: true }],
  C: [{ t: 'Hola' }, { t: ' ', hl: true }, { t: 'Koda' }],
  D: [{ t: 'Error' }],
};

/** Lluvia ASCII para celebrar sin romper la estética terminal. */
const AsciiRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const chars = '01>{};#$'.split('');
    const drops = Array.from({ length: 28 }, () => Math.random() * 20);
    let raf = 0;
    const tick = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#34d399';
      ctx.font = '12px monospace';
      drops.forEach((y, i) => {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(ch, i * 12, y * 14);
        drops[i] = y * 14 > 120 ? 0 : y + 0.5;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} width={336} height={120} aria-hidden="true" className="absolute inset-0 h-full w-full opacity-40" />;
};

export const MiniLessonPreview: React.FC<{ demo?: DemoId }> = ({ demo }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('answering');
  const [attempts, setAttempts] = useState(0);
  const [hintLevel, setHintLevel] = useState(1);
  const [typed, setTyped] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const statusText =
    phase === 'success'
      ? '[koda] acierto_confirmado'
      : phase === 'hint'
        ? '[koda] pista_disponible'
        : '[koda] en_observacion';

  useEffect(() => {
    if (demo !== 'p1' || prefersReducedMotion()) {
      setTyped(statusText);
      return;
    }
    setTyped('');
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setTyped(statusText.slice(0, i));
      if (i >= statusText.length) clearInterval(t);
    }, 28);
    return () => clearInterval(t);
  }, [demo, statusText]);

  useEffect(() => {
    if (demo !== 'p9') return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      const k = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(k) && phase !== 'success') {
        setSelected(k);
        if (phase === 'hint') setPhase('answering');
      }
      if (e.key === 'Enter' && selected && phase !== 'success') {
        const ok = OPTIONS.find((o) => o.key === selected)?.correct;
        setAttempts((n) => n + 1);
        setPhase(ok ? 'success' : 'hint');
        if (ok) sound.success();
        else sound.hint();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [demo, phase, selected]);

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
    setHintLevel(1);
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

      <div className={demo === 'p12' ? 'flex flex-col gap-3 p-4 sm:p-5' : 'space-y-4 p-4 sm:p-5'}>
        <div className={`flex items-center justify-between gap-2 ${demo === 'p12' ? 'order-first' : ''}`}>
          <p className="text-sm sm:text-base font-semibold text-white">
            ¿Qué muestra este código en pantalla?
          </p>
        </div>
        <p aria-live="polite" className="text-xs text-slate-400 -mt-2 font-mono">
          {demo === 'p1' ? (
            <>
              {typed}
              <span aria-hidden="true" className="ml-0.5 inline-block h-3 w-[7px] translate-y-[2px] bg-amber-400/80" />
            </>
          ) : (
            statusText
          )}
        </p>
        {demo === 'p5' && (
          <p className="-mt-3 font-mono text-[11px] uppercase tracking-widest text-slate-500">
            attempt <span className="text-amber-300">{String(Math.min(attempts + 1, 3)).padStart(2, '0')}/03</span>
            {' · streak '}
            <span className="text-emerald-300">07</span>
          </p>
        )}
        {demo === 'p2' ? (
          <div className="overflow-hidden rounded-[8px] border border-slate-800 bg-black">
            <p className="border-b border-slate-800 px-3.5 py-1.5 font-mono text-[11px] text-slate-500">
              $ python modulo_01.py
            </p>
            <pre className="overflow-x-auto border-l-2 border-l-emerald-400 p-3.5 font-mono text-sm leading-relaxed">
              <code>
                <span className="mr-3 select-none text-slate-600">01|</span>
                <span className="text-fuchsia-400">print</span>
                <span className="text-slate-300">(</span>
                <span className="text-emerald-300">&quot;Hola, Koda&quot;</span>
                <span className="text-slate-300">)</span>
              </code>
            </pre>
          </div>
        ) : (
        <pre className={`overflow-x-auto rounded-[8px] border border-slate-800 border-l-2 border-l-emerald-400 bg-black p-3.5 font-mono text-sm leading-relaxed ${demo === 'p12' ? 'order-first' : ''}`}>
          <code>
            <span className="text-fuchsia-400">print</span>
            <span className="text-slate-300">(</span>
            <span className="text-emerald-300">&quot;Hola, Koda&quot;</span>
            <span className="text-slate-300">)</span>
          </code>
        </pre>
        )}

        <div ref={feedbackRef} className="space-y-4 will-change-transform">
        <div role="radiogroup" aria-label="Opciones de respuesta" className="space-y-2">
          {OPTIONS.map((opt) => {
            const active = selected === opt.key;
            const disabled = phase === 'success';
            const judged = demo === 'p4' && selected === opt.key && phase !== 'answering';
            const verdict = judged ? (opt.correct ? 'ok' : 'bad') : null;
            return (
              <button
                key={opt.key}
                type="button"
                role="radio"
                aria-checked={active}
                aria-keyshortcuts={demo === 'p9' ? opt.key.toLowerCase() : undefined}
                disabled={disabled}
                onClick={() => {
                  setSelected(opt.key);
                  if (phase === 'hint') setPhase('answering');
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-[8px] border px-3.5 text-left text-sm font-medium transition-all min-h-[48px]',
                  demo === 'p12' ? 'py-2' : 'py-3',
                  active
                    ? 'border-amber-400/60 border-l-2 border-l-amber-400 bg-amber-400/10 text-white'
                    : verdict === 'bad'
                      ? 'border-red-400/60 border-l-2 border-l-red-400 bg-red-400/10 text-white'
                      : verdict === 'ok'
                        ? 'border-emerald-400/60 border-l-2 border-l-emerald-400 bg-emerald-400/10 text-white'
                        : 'border-slate-700/80 bg-slate-900/60 text-slate-200 hover:border-slate-500 hover:bg-slate-800/60',
                  disabled && !verdict && 'opacity-60 cursor-default'
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex h-6 min-w-9 shrink-0 items-center justify-center rounded-[6px] border px-1 font-mono text-[11px] font-bold',
                    verdict === 'ok'
                      ? 'border-emerald-400/60 text-emerald-300'
                      : verdict === 'bad'
                        ? 'border-red-400/60 text-red-300'
                        : active
                          ? 'border-amber-400/60 text-amber-300'
                          : 'border-slate-600 text-slate-400'
                  )}
                >
                  {verdict === 'ok' ? '[✓]' : verdict === 'bad' ? '[✗]' : `[${opt.key}]`}
                </span>
                <span className="font-mono">
                  {demo === 'p3' ? (
                    <>
                      {OPT_DIFF[opt.key].map((seg, si) => (
                        <mark
                          key={si}
                          className={seg.hl ? 'rounded bg-amber-400/25 px-0.5 text-amber-200' : 'bg-transparent text-inherit'}
                        >
                          {seg.t}
                        </mark>
                      ))}
                    </>
                  ) : (
                    opt.label
                  )}
                </span>
              </button>
            );
          })}
        </div>
        {demo === 'p9' && (
          <p className="-mt-1 font-mono text-[11px] uppercase tracking-widest text-slate-600">
            teclas A–D + Enter
          </p>
        )}

        {phase === 'success' ? (
          <div role="status" className="relative space-y-3 overflow-hidden rounded-[8px] border border-emerald-400/30 border-l-2 border-l-emerald-400 bg-emerald-400/10 p-3.5">
            {demo === 'p11' ? <AsciiRain /> : <CodeConfetti burstKey={attempts} />}
            {demo === 'p8' ? (
              <>
                <p className="font-mono text-sm font-bold text-emerald-300">{'> PASS …… +5 XP'}</p>
                <p className="font-mono text-xs leading-relaxed text-emerald-100/80">
                  {'# print() muestra texto en pantalla.'}
                  <br />
                  {'# una idea corta + código real + práctica inmediata.'}
                </p>
                <Link
                  href="/register"
                  className="inline-flex min-h-[44px] items-center gap-1.5 font-mono text-sm font-bold text-emerald-300 transition-colors hover:text-emerald-200"
                >
                  {'$ koda next →'}
                </Link>
              </>
            ) : (
              <>
            <p className="flex items-center gap-2 text-sm font-bold text-emerald-300">
              <Check aria-hidden="true" className="h-4 w-4" />
              ¡Correcto! +5 XP
            </p>
            {demo === 'p10' ? (
              <details className="group rounded-[6px] border border-emerald-400/20 bg-black/30 px-3 py-2">
                <summary className="cursor-pointer font-mono text-xs font-bold text-emerald-200">
                  {'> why --expand'}
                </summary>
                <p className="mt-2 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  <span className="font-mono">print()</span> muestra texto en pantalla. Así es cada
                  lección: una idea corta, código real y práctica inmediata.
                </p>
              </details>
            ) : (
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              <span className="font-mono">print()</span> muestra texto en pantalla. Así es cada
              lección: una idea corta, código real y práctica inmediata.
            </p>
            )}
            <Link
              href="/register"
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-[8px] bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 transition-all hover:bg-emerald-300"
            >
              Seguir ganando XP
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
              </>
            )}
          </div>
        ) : (
          <>
            {phase === 'hint' && (
              <div role="alert" className="rounded-[8px] border border-amber-400/30 border-l-2 border-l-amber-400 bg-amber-400/10 p-3.5">
                {demo === 'p6' ? (
                  <>
                    <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-amber-300">
                      pista_nivel_{hintLevel}/3
                    </p>
                    <p className="mt-1 text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                      {HINT_LEVELS[hintLevel - 1]}
                    </p>
                    {hintLevel < 3 && (
                      <button
                        type="button"
                        onClick={() => setHintLevel((n) => Math.min(n + 1, 3))}
                        className="mt-2 font-mono text-xs font-bold text-amber-300 underline-offset-4 hover:underline"
                      >
                        {'$ koda hint --next'}
                      </button>
                    )}
                  </>
                ) : (
                <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                  Casi. Pista: las comillas le dicen a Python que es texto, pero fíjate bien
                  en qué aparece en la salida{attempts > 1 ? ' — compara la coma y los espacios' : ''}.
                </p>
                )}
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={check}
                disabled={!selected}
                className={
                  demo === 'p7'
                    ? 'inline-flex min-h-[48px] flex-1 items-center justify-center rounded-[8px] border border-amber-400/50 bg-black px-4 py-2.5 font-mono text-sm font-bold text-amber-300 transition-all hover:bg-amber-400/10 disabled:cursor-not-allowed disabled:opacity-40'
                    : 'inline-flex min-h-[48px] flex-1 items-center justify-center rounded-[8px] bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40'
                }
              >
                {demo === 'p7'
                  ? selected
                    ? `$ check --answer ${selected}`
                    : '$ check --awaiting-selection'
                  : 'Comprobar'}
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
