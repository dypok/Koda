'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { AsciiVortexBackground } from '@/components/landing/AsciiVortexBackground';
import { CodeConfetti } from '@/views/landing/preview/CodeConfetti';
import { ArrowCounterClockwise, Flame, Gift, Shield } from '@phosphor-icons/react';
import { reveal } from '@/lib/reveal';

const DAYS = [
  { short: 'LUN', full: 'Lunes', mins: 18 },
  { short: 'MAR', full: 'Martes', mins: 22 },
  { short: 'MIÉ', full: 'Miércoles', mins: 15 },
  { short: 'JUE', full: 'Jueves', mins: 30 },
  { short: 'VIE', full: 'Viernes', mins: 20 },
  { short: 'SÁB', full: 'Sábado', mins: 25 },
];

const WEEK_MINUTES = DAYS.reduce((n, d) => n + d.mins, 0); // 130
const IGNITE_BASE = 0.5;
const IGNITE_STEP = 0.3;
const DONE_LINE = 'PIPELINE COMPLETADO: cofre bonus desbloqueado.';

const randHash = () => Math.random().toString(16).slice(2, 8);

/** Pipeline de encendido secuencial: 7 commits que se encienden uno a uno con consola git en vivo. */
export const StreakSection: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [runId, setRunId] = useState(0);
  const [consoleLine, setConsoleLine] = useState(DONE_LINE);
  const [claimed, setClaimed] = useState(false);
  const [bursts, setBursts] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setConsoleLine(DONE_LINE);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setConsoleLine('pipeline.init(): preparando secuencia de commits…'), 100));
    DAYS.forEach((d, i) => {
      timers.push(
        setTimeout(
          () => setConsoleLine(`commit [${d.short}]: ${d.mins}m registrado. Hash #${randHash()} OK`),
          (IGNITE_BASE + i * IGNITE_STEP) * 1000
        )
      );
    });
    timers.push(setTimeout(() => setConsoleLine(DONE_LINE), (IGNITE_BASE + DAYS.length * IGNITE_STEP) * 1000));
    return () => timers.forEach(clearTimeout);
  }, [runId, reduceMotion]);

  const replay = () => {
    setRunId((n) => n + 1);
  };

  const claim = () => {
    setClaimed(true);
    setBursts((n) => n + 1);
    setConsoleLine('¡COFRE RECLAMADO! Freeze +1: tu racha sobrevive un día libre.');
  };

  const inspect = (full: string, mins: number) => {
    setConsoleLine(`inspect [${full}]: commit validado con ${mins}m invertidos.`);
  };

  return (
    <section
      id="rachas"
      className="py-12 md:py-16 relative overflow-hidden border-t border-slate-900/80 bg-slate-950 scroll-mt-20 rounded-t-3xl shadow-[0_-20px_60px_rgba(0,0,0,0.5)]"
    >
      <AsciiVortexBackground />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(circle at 50% 30%, rgba(245,158,11,0.07) 0%, transparent 75%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(245,158,11,0.03)_50%,transparent_100%)] bg-[size:100%_4px]"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-8 lg:mb-12">
          <motion.div
            {...reveal(reduceMotion)}
            className="lg:col-span-7 space-y-5"
          >
            <h3 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.12] tracking-tight text-white text-balance">
              Rachas que encienden tu <br className="hidden sm:inline" />
              hábito diario
            </h3>
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl">
              Cada sesión de código es un commit a tu futuro: la constancia diaria vence a cualquier maratón de
              fin de semana y convierte la programación en tu mayor fortaleza.
            </p>
          </motion.div>

          <motion.div
            {...reveal(reduceMotion, { delay: 0.06 })}
            className="lg:col-span-5 flex flex-col lg:items-end justify-center text-left lg:text-right gap-5"
          >
            <div className="flex flex-col lg:items-end">
              <span className="font-display font-extrabold text-7xl sm:text-8xl lg:text-8xl leading-none text-amber-400 tracking-tight select-none drop-shadow-[0_0_35px_rgba(255,180,0,0.25)]">
                15<span className="font-sans font-bold text-6xl sm:text-7xl ml-1 text-amber-300">m</span>
              </span>
              <span className="mt-2 text-xs sm:text-sm font-bold tracking-[0.2em] text-slate-300 uppercase">
                Al día para crear el hábito
              </span>
            </div>
            <div className="flex items-center gap-3.5 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Flame aria-hidden="true" className="w-6 h-6" weight="fill" />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-baseline gap-1.5">
                  <AnimatedCounter
                    to={7}
                    duration={1.6}
                    delay={0.5}
                    className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight select-none"
                  />
                  <span className="text-sm sm:text-base font-bold text-amber-400 font-display">DÍAS CONSECUTIVOS</span>
                </div>
                <span className="text-[11px] sm:text-xs text-slate-400 font-mono">
                  commit branch: <span className="text-amber-300">master#daily_streak</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          {...reveal(reduceMotion, { delay: 0.1 })}
          className="relative overflow-hidden rounded-3xl bg-[#0b0e14]/95 border border-white/10 p-6 sm:p-9 shadow-2xl shadow-black/80 transition-colors duration-300 hover:border-amber-500/40"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-96 h-36 bg-amber-500/15 blur-3xl"
          />
          <CodeConfetti burstKey={bursts} />

          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/5 mb-8">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-xs tracking-[0.2em] uppercase font-bold text-slate-300 font-display">
                  Commit pipeline: semana en curso
                </span>
                <span className="text-[11px] font-mono text-slate-400">git streak log --stat (7 commits)</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={replay}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-800 text-amber-300 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/10 active:scale-95 transition-all"
              >
                <ArrowCounterClockwise aria-hidden="true" className="w-3.5 h-3.5" />
                Replay Pipeline
              </button>
              <button
                type="button"
                onClick={() =>
                  setConsoleLine('[FREEZE SHIELD]: racha blindada. Si un día fallas, el freeze la mantiene.')
                }
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium bg-sky-950 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/60 active:scale-95 transition-all"
              >
                <Shield aria-hidden="true" className="w-3.5 h-3.5 text-cyan-400" />
                Freeze Shield
                <span className="px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-200 text-[10px] font-bold">
                  ×{claimed ? 2 : 1} activo
                </span>
              </button>
            </div>
          </div>

          <div className="relative py-2" key={`pipeline-${runId}`}>
            <svg
              aria-hidden="true"
              className="absolute top-[38px] sm:top-[44px] left-0 w-full h-8 pointer-events-none z-0 hidden md:block"
              preserveAspectRatio="none"
              viewBox="0 0 700 20"
            >
              <line x1="50" x2="650" y1="10" y2="10" stroke="#1f293d" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 4" />
              {DAYS.map((d, i) => (
                <motion.line
                  key={d.short}
                  x1={50 + i * 100}
                  x2={150 + i * 100}
                  y1="10"
                  y2="10"
                  stroke="#f59e0b"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="100"
                  initial={{ strokeDashoffset: 100 }}
                  whileInView={{ strokeDashoffset: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: reduceMotion ? 0 : IGNITE_BASE + i * IGNITE_STEP, duration: reduceMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
                />
              ))}
            </svg>
            <div className="grid grid-cols-7 gap-2 sm:gap-4 relative z-10">
              {DAYS.map((d, i) => (
                <motion.button
                  key={d.short}
                  type="button"
                  onClick={() => inspect(d.full, d.mins)}
                  aria-label={`${d.full}, ${d.mins} minutos, inspeccionar commit`}
                  initial={{
                    borderColor: 'rgba(51,65,85,0.6)',
                    backgroundColor: 'rgba(20,24,36,0.9)',
                    boxShadow: 'none',
                  }}
                  whileInView={{
                    borderColor: 'rgba(245,158,11,0.6)',
                    backgroundColor: 'rgba(27,23,21,0.85)',
                    boxShadow: '0 0 20px rgba(245,158,11,0.35)',
                  }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: reduceMotion ? 0 : IGNITE_BASE + i * IGNITE_STEP, duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex flex-col items-center rounded-2xl border py-2 px-1 transition-transform duration-300 hover:-translate-y-1"
                >
                  <span className="text-[10px] sm:text-xs font-mono text-slate-400 group-hover:text-amber-400 transition-colors mb-2 font-bold">
                    {d.short}
                  </span>
                  <motion.span
                    initial={{ color: '#475569' }}
                    whileInView={{ color: '#fbbf24' }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: reduceMotion ? 0 : IGNITE_BASE + i * IGNITE_STEP, duration: reduceMotion ? 0 : 0.3 }}
                    className="flex items-center justify-center"
                  >
                    <Flame aria-hidden="true" className="w-5 h-5" weight="fill" />
                  </motion.span>
                  <span className="font-mono text-[9px] font-bold text-amber-300 mt-1">✓ OK</span>
                  <span className="mt-2 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[10px] sm:text-xs font-semibold">
                    {d.mins}m
                  </span>
                </motion.button>
              ))}
              <motion.button
                key="chest"
                type="button"
                onClick={claim}
                aria-label="Domingo, cofre bonus, reclamar freeze"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: reduceMotion ? 0 : IGNITE_BASE + DAYS.length * IGNITE_STEP, duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col items-center rounded-2xl border-2 border-amber-400 bg-gradient-to-b from-amber-500/20 to-amber-500/5 py-2 px-1 shadow-[0_0_35px_rgba(245,158,11,0.35)] transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="text-[10px] sm:text-xs font-mono text-amber-400 font-extrabold mb-2">DOM</span>
                <motion.span
                  animate={reduceMotion ? undefined : { y: [0, -3, 0], scale: [1, 1.06, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex items-center justify-center text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]"
                >
                  <Gift aria-hidden="true" className="w-5 h-5" weight="fill" />
                </motion.span>
                <span className="font-mono text-[8px] sm:text-[9px] font-black uppercase text-amber-300 tracking-wider mt-1">
                  Bonus
                </span>
                <span className="mt-2 px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono text-[9px] sm:text-[10px] font-black whitespace-nowrap">
                  {claimed ? 'Reclamado' : 'Cofre Bonus'}
                </span>
              </motion.button>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <p className="flex items-center gap-2">
              <span aria-hidden="true" className="text-amber-400 font-bold">&gt;_</span>
              <span role="status" className="text-slate-300">
                {consoleLine}
              </span>
            </p>
            <p className="flex items-center gap-4 text-[11px]">
              <span>
                <strong className="text-white font-semibold">{WEEK_MINUTES}m</strong> semanales
              </span>
              <span className="text-amber-400">● 100% Eficiencia</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StreakSection;
