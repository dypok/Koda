'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Flame, 
  Key, 
  Terminal, 
  Sparkle, 
  ShieldCheck, 
  Sliders, 
  Code, 
  Lightning, 
  Compass, 
  Play,
  Cpu,
  Target,
  Fingerprint,
  ArrowCounterClockwise
} from '@phosphor-icons/react';
import { HeroSkyBackground } from '@/components/landing/HeroSkyBackground';
import { cn } from '@/lib/utils';

interface ProposalMeta {
  id: string;
  num: string;
  name: string;
  tagline: string;
  badge: string;
  hoverDetail: string;
}

const PROPOSALS: ProposalMeta[] = [
  { 
    id: 'fusion-hud', 
    num: 'P1', 
    name: 'Roadmap Fusion HUD', 
    tagline: 'Continuidad espacial: píldoras flotantes, atmósfera traslúcida y resplandor de fuego.', 
    badge: 'Fusión 1:1',
    hoverDetail: 'Hover: Desplazamiento sutil + halo difuso de fuego ámbar + keycap dorada.'
  },
  { 
    id: 'tactical-pods', 
    num: 'P2', 
    name: 'Tactical Dual Pods', 
    tagline: 'Cápsulas cibernéticas angulares con escaneo láser, terminal CRT y medidor digital.', 
    badge: 'Cyber HUD',
    hoverDetail: 'Hover: Retícula táctica activa + mira [TARGET] + destello de alta tensión cyan.'
  },
  { 
    id: 'monaco-terminal', 
    num: 'P3', 
    name: 'Monaco Terminal Split', 
    tagline: 'IDE profesional con pestañas de archivo, números de línea y cursor parpadeante.', 
    badge: 'Developer Pro',
    hoverDetail: 'Hover: Deslizamiento de prompt de terminal `>` + iluminación de líneas de código.'
  },
  { 
    id: 'zen-streamline', 
    num: 'P4', 
    name: 'Zen Streamline Focus', 
    tagline: 'Minimalismo puro sin cajas pesadas: división sutil, foco absoluto y tipografía nítida.', 
    badge: 'Zen Focus',
    hoverDetail: 'Hover: Haz de luz inferior expansivo + bruma ámbar ultra delicada sin bordes gruesos.'
  },
  { 
    id: 'companion-streak', 
    num: 'P5', 
    name: 'Companion & Streak HUD', 
    tagline: 'Gamificación inmersiva: racha 🔥 3D, Koda companion reactivo y botones elásticos.', 
    badge: 'Arcade Play',
    hoverDetail: 'Hover: Elevación física 3D elástica + guiño de la mascota Koda 🦊 + chispa dorada.'
  },
  { 
    id: 'command-deck', 
    num: 'P6', 
    name: 'Command Deck Glass', 
    tagline: 'Cubierta orbital con barra de comando neon ámbar y telemetría de misión.', 
    badge: 'Sci-Fi Deck',
    hoverDetail: 'Hover: Barrido de radar superior + fijación de objetivo [LOCKED] + sobrecarga de reactor.'
  },
];

const MOCK_EXERCISE = {
  courseTitle: 'Fundamentos de Lua',
  sectionTitle: '¿Qué es Lua y dónde se usa?',
  lessonTitle: '¿Qué es un lenguaje de programación?',
  progressStep: 1,
  totalSteps: 10,
  explanation: 'Un lenguaje de programación es la forma en que le das instrucciones claras a una computadora. Las máquinas no hablan español ni inglés: solo entienden reglas exactas. Con un lenguaje escribes órdenes lógicas paso a paso y la computadora las ejecuta al instante. ¡Es tu puente para crear tecnología!',
  codeSnippet: 'print("Hola, mundo")',
  codeOutput: 'Hola, mundo',
  codeFootnote: 'Una orden simple que le dice a la máquina que imprima un mensaje en pantalla.',
  prompt: '¿Cuál es el propósito principal de un lenguaje de programación como Lua?',
  options: [
    { id: 'opt-a', label: 'A', num: '1', body: 'Darle órdenes e instrucciones lógicas a la computadora' },
    { id: 'opt-b', label: 'B', num: '2', body: 'Limpiar el polvo de la pantalla del monitor' },
    { id: 'opt-c', label: 'C', num: '3', body: 'Aumentar la velocidad de internet de tu casa' },
    { id: 'opt-d', label: 'D', num: '4', body: 'Guardar fotos en la memoria del teléfono' },
  ],
  correctId: 'opt-a',
};

export const WorkspaceLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>('opt-a');
  const [checked, setChecked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const proposal = PROPOSALS[activeTab];

  // GSAP: Animación de entrada al cambiar de propuesta
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-proposal-root',
        { opacity: 0, y: 16, scale: 0.99 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.gsap-stagger-item',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'back.out(1.4)', delay: 0.04 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [activeTab]);

  // Atajos de teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (['INPUT', 'TEXTAREA'].includes(tag)) return;

      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        const opt = MOCK_EXERCISE.options[idx];
        if (opt) {
          setSelectedOpt(opt.id);
          setChecked(false);
        }
      } else if (e.key === 'Enter') {
        setChecked(true);
      } else if (e.key === 'ArrowRight' && e.altKey) {
        setActiveTab((prev) => (prev + 1) % PROPOSALS.length);
      } else if (e.key === 'ArrowLeft' && e.altKey) {
        setActiveTab((prev) => (prev - 1 + PROPOSALS.length) % PROPOSALS.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="relative isolate min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
      <HeroSkyBackground starCount={80} interactive={false} className="fixed inset-0 pointer-events-none -z-10" />

      {/* Header Fijo con Switcher de Propuestas */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-2xl px-4 py-3 shadow-2xl">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/app/ruta"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700/60 bg-slate-900/60 text-xs font-mono font-bold text-slate-300 hover:text-white hover:border-orange-500/50 hover:shadow-[0_0_12px_rgba(255,106,0,0.3)] transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la ruta</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black uppercase tracking-wider text-orange-400">
                Workspace Lab
              </span>
              <span className="text-slate-600 font-mono">/</span>
              <span className="font-mono text-xs text-slate-400 hidden sm:inline">6 Variantes con Hover Únicos</span>
            </div>
          </div>

          {/* Switcher de Pestañas P1 a P6 */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none" role="tablist">
            {PROPOSALS.map((p, idx) => (
              <button
                key={p.id}
                role="tab"
                aria-selected={activeTab === idx}
                onClick={() => {
                  setActiveTab(idx);
                  setChecked(false);
                }}
                className={cn(
                  'group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs font-bold transition-all shrink-0 cursor-pointer',
                  activeTab === idx
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-[0_0_16px_rgba(255,106,0,0.5)] font-black scale-[1.03]'
                    : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-600 hover:bg-slate-800/80 hover:shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                )}
              >
                <span className="opacity-75">{p.num}</span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sub-barra descriptiva de la interacción activa */}
        <div className="mx-auto max-w-7xl pt-2.5 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800/40 mt-2">
          <p className="truncate flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/30 text-orange-300 font-bold text-[10px]">
              {proposal.badge}
            </span>
            <span className="text-amber-200 font-medium">{proposal.hoverDetail}</span>
          </p>
          <span className="hidden lg:inline text-slate-500 shrink-0">
            Pasa el cursor por las tarjetas y botones para ver las físicas y animaciones.
          </span>
        </div>
      </header>

      {/* Renderizado de la Propuesta Seleccionada */}
      <main ref={containerRef} className="flex-1 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full max-w-6xl gsap-proposal-root">
          {activeTab === 0 && (
            <ProposalFusionHUD
              data={MOCK_EXERCISE}
              selectedId={selectedOpt}
              onSelect={(id: string) => { setSelectedOpt(id); setChecked(false); }}
              checked={checked}
              onCheck={() => setChecked(true)}
              onReset={() => { setSelectedOpt(null); setChecked(false); }}
            />
          )}

          {activeTab === 1 && (
            <ProposalTacticalPods
              data={MOCK_EXERCISE}
              selectedId={selectedOpt}
              onSelect={(id: string) => { setSelectedOpt(id); setChecked(false); }}
              checked={checked}
              onCheck={() => setChecked(true)}
              onReset={() => { setSelectedOpt(null); setChecked(false); }}
            />
          )}

          {activeTab === 2 && (
            <ProposalMonacoTerminal
              data={MOCK_EXERCISE}
              selectedId={selectedOpt}
              onSelect={(id: string) => { setSelectedOpt(id); setChecked(false); }}
              checked={checked}
              onCheck={() => setChecked(true)}
              onReset={() => { setSelectedOpt(null); setChecked(false); }}
            />
          )}

          {activeTab === 3 && (
            <ProposalZenStreamline
              data={MOCK_EXERCISE}
              selectedId={selectedOpt}
              onSelect={(id: string) => { setSelectedOpt(id); setChecked(false); }}
              checked={checked}
              onCheck={() => setChecked(true)}
              onReset={() => { setSelectedOpt(null); setChecked(false); }}
            />
          )}

          {activeTab === 4 && (
            <ProposalCompanionStreak
              data={MOCK_EXERCISE}
              selectedId={selectedOpt}
              onSelect={(id: string) => { setSelectedOpt(id); setChecked(false); }}
              checked={checked}
              onCheck={() => setChecked(true)}
              onReset={() => { setSelectedOpt(null); setChecked(false); }}
            />
          )}

          {activeTab === 5 && (
            <ProposalCommandDeck
              data={MOCK_EXERCISE}
              selectedId={selectedOpt}
              onSelect={(id: string) => { setSelectedOpt(id); setChecked(false); }}
              checked={checked}
              onCheck={() => setChecked(true)}
              onReset={() => { setSelectedOpt(null); setChecked(false); }}
            />
          )}
        </div>
      </main>
    </div>
  );
};

/* =========================================================================
   PROPUESTA 1: ROADMAP FUSION HUD
   - HOVER UNIQUE: 
     * Opción: Hover con desplazamiento derecho sutil (translate-x-1.5), halo de fuego naranja expansivo y keycap dorada.
     * Botón: Halo magnético cálido y aumento de brillo con rebote táctil.
     * Terminal: Resplandor translúcido interior al pasar el mouse.
   ========================================================================= */
function ProposalFusionHUD({ data, selectedId, onSelect, checked, onCheck, onReset }: any) {
  const isCorrect = selectedId === data.correctId;
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!btnRef.current) return;
    const tween = gsap.to(btnRef.current, {
      boxShadow: '0 0 24px rgba(255, 106, 0, 0.65)',
      repeat: -1,
      yoyo: true,
      duration: 1.6,
      ease: 'sine.inOut',
    });
    return () => { tween.kill(); };
  }, []);

  return (
    <div className="space-y-4 font-sans">
      {/* HUD Flotante Superior en Píldora con hover reactivo */}
      <div className="group flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 rounded-full border border-slate-700/50 bg-slate-900/40 backdrop-blur-xl shadow-xl hover:border-orange-500/40 hover:shadow-[0_0_20px_rgba(255,106,0,0.15)] transition-all duration-300">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400 font-semibold group-hover:text-slate-300 transition-colors">{data.courseTitle}</span>
          <span className="text-slate-600">›</span>
          <span className="text-orange-400 font-bold group-hover:text-amber-300 transition-colors">{data.sectionTitle}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50 hover:border-amber-400/40 transition-colors">
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>1-4 · Enter</span>
          </div>
          <span className="font-mono text-xs font-bold text-orange-400 tabular-nums bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full">
            0{data.progressStep}/0{data.totalSteps}
          </span>
        </div>
      </div>

      {/* Stepper horizontal de píldoras luminosas */}
      <div className="flex items-center gap-1.5 px-2">
        {Array.from({ length: data.totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-all duration-300 hover:h-2 hover:brightness-125 cursor-pointer',
              i === 0
                ? 'bg-gradient-to-r from-orange-500 to-amber-400 shadow-[0_0_10px_rgba(255,106,0,0.8)] ring-1 ring-orange-400/50'
                : 'bg-slate-800/80 hover:bg-slate-700'
            )}
          />
        ))}
      </div>

      {/* Grid 50/50 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Panel Teórico con Resaltado Interactivo */}
        <div className="gsap-stagger-item group rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-6 flex flex-col justify-between gap-6 shadow-2xl hover:border-slate-700/80 hover:shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-all duration-300">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-[10px] font-mono font-bold text-orange-300 uppercase tracking-wider group-hover:border-orange-500/40 transition-colors">
              <span>Lección 01</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              {data.lessonTitle}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Un lenguaje de programación es la forma en que le das{' '}
              <span className="text-amber-300 font-semibold bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded hover:bg-amber-500/20 hover:border-amber-400/50 transition-all cursor-help" title="Instrucciones sin ambigüedad">
                instrucciones claras
              </span>{' '}
              a una computadora. Las máquinas no hablan español ni inglés: solo entienden{' '}
              <span className="text-cyan-300 font-semibold bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all cursor-help" title="Sintaxis y lógica determinista">
                reglas exactas
              </span>.
            </p>
          </div>

          {/* Terminal con hover luminoso */}
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 font-mono text-sm leading-relaxed text-slate-200 shadow-inner hover:border-orange-500/30 hover:shadow-[0_0_20px_rgba(255,106,0,0.1)] transition-all duration-300">
              <span className="text-slate-600 select-none">// Ejecución simple</span>
              <div className="text-amber-300 pt-1"><code>{data.codeSnippet}</code></div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs font-mono text-emerald-300 hover:border-emerald-400/60 hover:bg-emerald-950/50 transition-all">
              <span className="text-emerald-500 font-bold">$</span>
              <span>{data.codeOutput}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal pl-1">{data.codeFootnote}</p>
          </div>
        </div>

        {/* Panel Práctico con Hover de Desplazamiento y Halo */}
        <div className="gsap-stagger-item rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-6 flex flex-col justify-between gap-6 shadow-2xl">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Desafío de Comprensión
            </span>
            <p className="text-base sm:text-lg font-bold text-white leading-snug">
              {data.prompt}
            </p>

            <div className="space-y-2.5 pt-2">
              {data.options.map((opt: any) => {
                const isSelected = selectedId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onSelect(opt.id)}
                    className={cn(
                      'group relative flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left text-sm min-h-[54px] cursor-pointer select-none transition-all duration-200',
                      isSelected
                        ? 'border-orange-500/90 bg-orange-500/15 text-white shadow-[0_0_22px_rgba(255,106,0,0.35)] ring-1 ring-orange-500/50 translate-x-1.5'
                        : 'border-slate-800 bg-slate-950/60 text-slate-200 hover:border-orange-500/60 hover:bg-slate-900/90 hover:translate-x-1.5 hover:shadow-[0_0_16px_rgba(255,106,0,0.2)]'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-mono font-bold transition-all duration-200',
                          isSelected
                            ? 'border-orange-500 bg-orange-500 text-slate-950 shadow-sm'
                            : 'border-slate-700 bg-slate-900 text-slate-400 group-hover:border-orange-400 group-hover:text-orange-300 group-hover:bg-orange-500/10'
                        )}
                      >
                        {opt.label}
                      </span>
                      <span className="font-mono text-xs sm:text-sm leading-snug group-hover:text-white transition-colors">{opt.body}</span>
                    </div>

                    <kbd className={cn(
                      'hidden sm:inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded border text-[10px] font-mono font-semibold transition-all duration-200 shadow-sm',
                      isSelected
                        ? 'border-orange-400 bg-orange-400 text-slate-950 translate-y-0.5'
                        : 'border-slate-700 bg-slate-800 text-slate-400 group-hover:border-orange-400/60 group-hover:text-amber-200 group-hover:bg-slate-700'
                    )}>
                      {opt.num}
                    </kbd>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            {!checked ? (
              <button
                ref={btnRef}
                type="button"
                onClick={onCheck}
                disabled={!selectedId}
                className="group inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 font-mono text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_0_18px_rgba(255,106,0,0.4)] hover:brightness-115 hover:scale-[1.015] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Comprobar respuesta</span>
                <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-slate-950/30 bg-slate-950/10 text-[10px] font-mono font-bold group-hover:bg-slate-950/20">
                  Enter ↵
                </kbd>
              </button>
            ) : (
              <div className={cn(
                'rounded-xl border p-4 space-y-2 transition-all',
                isCorrect
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100 shadow-[0_0_18px_rgba(16,185,129,0.15)]'
                  : 'border-rose-500/40 bg-rose-500/10 text-rose-100'
              )}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold flex items-center gap-2">
                    {isCorrect ? <Check className="w-5 h-5 text-emerald-400" /> : null}
                    {isCorrect ? '¡Excelente! +5 XP de dominio' : 'Respuesta incorrecta'}
                  </p>
                  {!isCorrect && (
                    <button type="button" onClick={onReset} className="text-xs text-slate-400 underline hover:text-white">
                      Reintentar
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-300">
                  {isCorrect ? 'Lua traduce tus instrucciones lógicas en bytecodes para que el procesador los ejecute de inmediato.' : 'Recuerda: los lenguajes no limpian pantallas ni aumentan tu red física.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   PROPUESTA 2: TACTICAL DUAL PODS
   - HOVER UNIQUE: 
     * Opción: Mira táctica [TARGET] aparece con destello cyan y borde angular.
     * Botón: Expansión de tracking y sobretensión con destellos eléctricos.
     * Pods: Iluminación de esquinas chamfered.
   ========================================================================= */
function ProposalTacticalPods({ data, selectedId, onSelect, checked, onCheck, onReset }: any) {
  const isCorrect = selectedId === data.correctId;
  const scanRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scanRef.current) return;
    const tween = gsap.fromTo(
      scanRef.current,
      { top: '0%' },
      { top: '100%', duration: 2.2, repeat: -1, ease: 'linear' }
    );
    return () => { tween.kill(); };
  }, []);

  return (
    <div className="space-y-4 font-mono">
      {/* HUD Superior Táctico */}
      <div className="group border border-cyan-500/40 bg-slate-950/90 p-3.5 rounded-xl flex items-center justify-between text-xs shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all duration-300">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-400 font-black tracking-widest group-hover:text-cyan-300 transition-colors">// SYS.LUA_V5.4 // POD_01</span>
        </div>

        {/* Medidor de progreso digital escalonado */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                'h-2 w-2.5 rounded-sm transition-all duration-200 hover:scale-125 cursor-pointer',
                i === 0 ? 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]' : 'bg-slate-800 hover:bg-cyan-600'
              )}
            />
          ))}
          <span className="text-cyan-300 font-bold ml-2">10%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pod 1: Data Stream con Scanline Laser GSAP */}
        <div className="gsap-stagger-item group border border-slate-800 bg-slate-950/90 p-5 rounded-xl space-y-4 relative overflow-hidden shadow-2xl hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300">
          <div ref={scanRef} className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent pointer-events-none" />

          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-[10px] text-cyan-400 tracking-widest font-bold group-hover:text-cyan-300">[DATA_STREAM]</span>
            <span className="text-[10px] text-slate-500">ID: SEC_01</span>
          </div>

          <h2 className="font-display text-xl font-bold text-white tracking-tight">
            {data.lessonTitle}
          </h2>
          <p className="text-slate-300 text-xs font-sans leading-relaxed">
            {data.explanation}
          </p>

          <div className="border border-cyan-500/20 bg-slate-900/90 p-3.5 rounded-lg space-y-2 group-hover:border-cyan-500/40 transition-colors">
            <div className="text-[10px] text-cyan-400 flex items-center justify-between">
              <span>// LUA_BYTECODE_INPUT</span>
              <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <code className="text-amber-300 text-sm block font-bold">{data.codeSnippet}</code>
            <div className="border-t border-slate-800 pt-2 text-[11px] text-emerald-400 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>&gt; {data.codeOutput}</span>
            </div>
          </div>
        </div>

        {/* Pod 2: Terminal Táctica de Desafío con Hover de Retícula */}
        <div className="gsap-stagger-item border border-slate-800 bg-slate-950/90 p-5 rounded-xl space-y-4 relative shadow-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-[10px] text-orange-400 font-bold tracking-widest">[PROMPT_INPUT]</span>
              <span className="text-[10px] text-slate-500">VAL_TYPE: SINGLE</span>
            </div>
            <p className="text-sm font-bold text-white font-sans">{data.prompt}</p>

            <div className="space-y-2 pt-1">
              {data.options.map((opt: any) => {
                const active = selectedId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onSelect(opt.id)}
                    className={cn(
                      'group w-full flex items-center justify-between p-3 rounded-lg border text-left text-xs transition-all duration-200 cursor-pointer font-mono select-none',
                      active
                        ? 'border-cyan-400 bg-cyan-950/50 text-cyan-100 shadow-[0_0_18px_rgba(6,182,212,0.35)] scale-[1.01]'
                        : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-cyan-500/80 hover:bg-cyan-950/20 hover:text-white hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={cn(
                        'px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors',
                        active 
                          ? 'bg-cyan-400 text-slate-950' 
                          : 'bg-slate-800 text-slate-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300'
                      )}>
                        {opt.label}
                      </span>
                      <span>{opt.body}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-[10px] text-slate-500 group-hover:text-cyan-300">[{opt.num}]</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={onCheck}
            className="group w-full py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-widest shadow-[0_0_18px_rgba(6,182,212,0.45)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] hover:tracking-[0.2em] transition-all duration-200 cursor-pointer active:scale-[0.99]"
          >
            EJECUTAR VERIFICACIÓN [ENTER]
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   PROPUESTA 3: MONACO TERMINAL SPLIT
   - HOVER UNIQUE: 
     * Opción: Deslizamiento de prompt de terminal `>` a la izquierda y bracket inversion.
     * Botón: Inversión tipográfica `[ > RUN_CODE < ]` con resplandor monospaced.
     * Editor: Iluminación de números de línea al pasar el cursor.
   ========================================================================= */
function ProposalMonacoTerminal({ data, selectedId, onSelect, checked, onCheck }: any) {
  const runnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!runnerRef.current) return;
    const tween = gsap.fromTo(
      runnerRef.current,
      { left: '-20%' },
      { left: '100%', duration: 1.8, repeat: -1, ease: 'power1.inOut' }
    );
    return () => { tween.kill(); };
  }, []);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden font-mono">
      {/* Barra de Ventana de Editor */}
      <div className="bg-slate-900/95 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80 inline-block hover:scale-125 transition-transform cursor-pointer" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block hover:scale-125 transition-transform cursor-pointer" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block hover:scale-125 transition-transform cursor-pointer" />
          </div>
          <div className="ml-3 flex items-center gap-2 px-3 py-1 rounded bg-slate-950 border-t border-l border-r border-slate-800 text-xs text-orange-400 font-bold hover:text-amber-300 transition-colors cursor-pointer">
            <Code className="w-3.5 h-3.5" />
            <span>main.lua</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
            <span>stdout.log</span>
          </div>
        </div>

        {/* Runner laser beam */}
        <div className="relative w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div ref={runnerRef} className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
        {/* Editor con números de línea interactivos */}
        <div className="gsap-stagger-item p-6 space-y-4 font-sans group">
          <h2 className="font-display text-2xl font-black text-white">{data.lessonTitle}</h2>
          <p className="text-slate-300 text-sm leading-relaxed">{data.explanation}</p>

          <div className="font-mono text-xs bg-slate-900/90 border border-slate-800 rounded-lg p-3.5 space-y-1 shadow-inner hover:border-slate-700 transition-colors">
            <div className="text-slate-600 flex gap-4 hover:text-slate-400 transition-colors cursor-default">
              <span className="text-slate-500 group-hover:text-amber-400 transition-colors">1</span>
              <span>-- Imprime mensaje inicial en consola</span>
            </div>
            <div className="text-white flex gap-4 font-bold">
              <span className="text-slate-500 group-hover:text-amber-400 transition-colors">2</span>
              <span className="text-amber-300">{data.codeSnippet}</span>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-emerald-400 flex items-center gap-2 hover:border-emerald-500/40 hover:bg-emerald-950/20 transition-all">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>● stdout: {data.codeOutput}</span>
          </div>
        </div>

        {/* Panel de Desafío Monaco con deslizamiento de prompt `>` */}
        <div className="gsap-stagger-item p-6 flex flex-col justify-between gap-6 font-sans">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400">
              Evaluación en Tiempo Real
            </span>
            <p className="text-sm font-semibold text-white">{data.prompt}</p>

            <div className="space-y-2">
              {data.options.map((opt: any) => (
                <button
                  key={opt.id}
                  onClick={() => onSelect(opt.id)}
                  className={cn(
                    'group w-full flex items-center justify-between p-3 rounded-lg border text-left text-xs font-mono transition-all duration-150 cursor-pointer',
                    selectedId === opt.id
                      ? 'border-orange-500 bg-orange-500/15 text-orange-100 ring-1 ring-orange-500/40 translate-x-1'
                      : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-orange-500/60 hover:bg-slate-900/90 hover:text-white hover:translate-x-1'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">&gt;</span>
                    <span>{opt.label}. {opt.body}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 group-hover:text-amber-300">[{opt.num}]</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onCheck}
            className="group w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider cursor-pointer transition-all duration-200 shadow-[0_0_15px_rgba(255,106,0,0.35)] hover:shadow-[0_0_25px_rgba(255,106,0,0.6)]"
          >
            <span className="group-hover:hidden">[ RUN_EVALUATION : ENTER ]</span>
            <span className="hidden group-hover:inline">[ &gt; EXECUTING_EVALUATION &lt; ]</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   PROPUESTA 4: ZEN STREAMLINE FOCUS
   - HOVER UNIQUE: 
     * Opción: Haz inferior expansivo (`scale-x`) y bruma ámbar sutil sin bordes pesados.
     * Botón: Expansión zen suave con aumento de contraste tipográfico.
   ========================================================================= */
function ProposalZenStreamline({ data, selectedId, onSelect, onCheck }: any) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors">
        <span className="text-slate-300">{data.courseTitle} › {data.sectionTitle}</span>
        <span className="text-orange-400 font-bold tabular-nums">Paso 01.0 / 10.0</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div className="gsap-stagger-item space-y-4">
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white leading-tight">
            {data.lessonTitle}
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">{data.explanation}</p>
          <div className="group border-l-2 border-orange-500 pl-4 py-1.5 font-mono text-xs text-amber-300 bg-slate-900/30 rounded-r-lg hover:border-amber-400 hover:bg-slate-900/60 transition-all cursor-default">
            <code>{data.codeSnippet}</code>
          </div>
        </div>

        <div className="gsap-stagger-item space-y-5 bg-slate-900/20 p-6 rounded-2xl border border-slate-800/50 hover:border-slate-700/80 transition-colors">
          <p className="text-sm font-bold text-white leading-snug">{data.prompt}</p>
          <div className="space-y-2.5">
            {data.options.map((opt: any) => (
              <button
                key={opt.id}
                onClick={() => onSelect(opt.id)}
                className={cn(
                  'group relative w-full flex items-center justify-between p-3.5 rounded-xl border text-left text-xs transition-all duration-200 cursor-pointer overflow-hidden',
                  selectedId === opt.id
                    ? 'border-orange-500/90 bg-orange-500/10 text-white font-medium shadow-[0_0_14px_rgba(255,106,0,0.2)]'
                    : 'border-slate-800/70 bg-slate-950/40 text-slate-300 hover:border-orange-500/40 hover:bg-amber-500/[0.04] hover:text-white'
                )}
              >
                {/* Haz de luz inferior expansivo al hacer hover */}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                <span>{opt.body}</span>
                <span className="font-mono text-[10px] text-slate-500 group-hover:text-amber-300 transition-colors">[{opt.num}]</span>
              </button>
            ))}
          </div>

          <button
            onClick={onCheck}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer hover:brightness-110 hover:shadow-[0_0_20px_rgba(255,106,0,0.4)] transition-all duration-200"
          >
            Confirmar Selección [Enter]
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   PROPUESTA 5: COMPANION & STREAK HUD
   - HOVER UNIQUE: 
     * Koda Avatar: Rebote elástico y rotación al pasar el mouse por encima.
     * Opción: Elevación física 3D (-translate-y-1) con sombra de profundidad.
     * Botón: Efecto pulsador arcade elástico.
   ========================================================================= */
function ProposalCompanionStreak({ data, selectedId, onSelect, onCheck }: any) {
  const foxRef = useRef<HTMLDivElement>(null);

  const onFoxHover = () => {
    if (!foxRef.current) return;
    gsap.to(foxRef.current, {
      scale: 1.25,
      rotation: 12,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'back.out(2)',
    });
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Top Bar con Racha y Mascota */}
      <div className="flex items-center justify-between px-5 py-3 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-xl hover:border-orange-500/40 transition-colors">
        <div 
          onMouseEnter={onFoxHover}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div ref={foxRef} className="h-9 w-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-slate-950 font-black text-base shadow-lg shadow-orange-500/30 select-none group-hover:shadow-[0_0_16px_rgba(255,106,0,0.6)] transition-shadow">
            🦊
          </div>
          <div>
            <span className="font-display text-sm font-bold text-white block leading-none group-hover:text-amber-300 transition-colors">Koda Companion</span>
            <span className="font-mono text-[10px] text-slate-400">Guía interactiva activa (pasa el cursor)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full animate-pulse hover:scale-105 transition-transform cursor-pointer">
            <Flame className="w-4 h-4 fill-orange-500" />
            <span>3 DÍAS</span>
          </div>
          <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full hover:scale-105 transition-transform cursor-pointer">
            +150 XP
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teoría con consejo pedagógico de Koda */}
        <div className="gsap-stagger-item rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4 hover:border-slate-700 transition-colors">
          <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-xs text-orange-200 flex items-start gap-2.5 shadow-sm hover:bg-orange-500/20 transition-colors cursor-default">
            <Sparkle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <p><strong>Consejo de Koda:</strong> Las computadoras no suponen nada. Cada orden debe ser exacta o generará un error.</p>
          </div>
          <h2 className="font-display text-2xl font-black text-white">{data.lessonTitle}</h2>
          <p className="text-slate-300 text-sm leading-relaxed">{data.explanation}</p>
        </div>

        {/* Desafío Arcade con Elevación 3D en Hover */}
        <div className="gsap-stagger-item rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between gap-5">
          <div className="space-y-3">
            <p className="text-base font-bold text-white leading-snug">{data.prompt}</p>
            <div className="space-y-2.5">
              {data.options.map((opt: any) => (
                <button
                  key={opt.id}
                  onClick={() => onSelect(opt.id)}
                  className={cn(
                    'group w-full flex items-center justify-between p-3.5 rounded-xl border text-left text-sm transition-all duration-200 cursor-pointer select-none',
                    selectedId === opt.id
                      ? 'border-orange-400 bg-orange-400/20 text-white font-semibold shadow-[0_4px_16px_rgba(251,191,36,0.3)] -translate-y-1'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-orange-400/70 hover:bg-slate-900 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.6)]'
                  )}
                >
                  <span className="group-hover:text-white transition-colors">{opt.body}</span>
                  <span className="font-mono text-xs text-slate-500 group-hover:text-amber-300 transition-colors">[{opt.num}]</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onCheck}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 text-slate-950 font-bold text-sm shadow-xl shadow-orange-500/40 hover:brightness-110 hover:-translate-y-0.5 active:translate-y-1 transition-all duration-150 cursor-pointer"
          >
            Comprobar y Ganar +5 XP [Enter]
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   PROPUESTA 6: COMMAND DECK GLASS
   - HOVER UNIQUE: 
     * Opción: Telemetría [TARGET_LOCKED] activa al pasar el cursor con barrido de luz.
     * Botón: Sobrecarga de reactor nuclear táctico con halo de 30px.
     * Deck: Línea superior naranja con pulso continuo.
   ========================================================================= */
function ProposalCommandDeck({ data, selectedId, onSelect, onCheck }: any) {
  return (
    <div className="space-y-4 font-sans">
      {/* Barra de Mando con borde superior luminoso */}
      <div className="group rounded-2xl border-t-2 border-t-orange-500 border-x border-b border-slate-800 bg-slate-900/60 backdrop-blur-xl p-4 flex items-center justify-between shadow-2xl hover:border-t-amber-400 hover:shadow-[0_0_30px_rgba(255,106,0,0.2)] transition-all duration-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-orange-400 group-hover:text-amber-300 transition-colors" />
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            FASE 01 · {data.sectionTitle}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-20 bg-slate-800 rounded-full overflow-hidden">
            <span className="h-full bg-gradient-to-r from-orange-500 to-amber-400 block w-1/10 shadow-[0_0_8px_#ff6a00] group-hover:brightness-125 transition-all" />
          </span>
          <span className="font-mono text-xs font-bold text-orange-400">10%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="gsap-stagger-item rounded-2xl border-t-2 border-t-slate-700 border-x border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-6 space-y-4 hover:border-t-orange-500/80 transition-all duration-300">
          <h2 className="font-display text-2xl font-black text-white">{data.lessonTitle}</h2>
          <p className="text-slate-300 text-sm leading-relaxed">{data.explanation}</p>
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-amber-300 hover:border-orange-500/40 transition-colors">
            {data.codeSnippet}
          </div>
        </div>

        <div className="gsap-stagger-item rounded-2xl border-t-2 border-t-orange-500 border-x border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-6 flex flex-col justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-400">Comando Activo</span>
              <span className="text-[10px] font-mono text-slate-500">CANAL: SEGURO</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-white">{data.prompt}</p>
            <div className="space-y-2">
              {data.options.map((opt: any) => (
                <button
                  key={opt.id}
                  onClick={() => onSelect(opt.id)}
                  className={cn(
                    'group w-full flex items-center justify-between p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all duration-200 cursor-pointer',
                    selectedId === opt.id
                      ? 'border-orange-500 bg-orange-500/20 text-white font-semibold shadow-[0_0_18px_rgba(255,106,0,0.4)] translate-x-1'
                      : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:border-orange-500/70 hover:bg-slate-900 hover:text-white hover:translate-x-1 hover:shadow-[0_0_12px_rgba(255,106,0,0.2)]'
                  )}
                >
                  <span>{opt.body}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono text-orange-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      LOCKED
                    </span>
                    <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 group-hover:border-orange-500/50 group-hover:text-amber-200">
                      {opt.num}
                    </kbd>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onCheck}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/40 hover:brightness-125 hover:shadow-[0_0_28px_rgba(255,106,0,0.6)] active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            Transmitir Orden [Enter]
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkspaceLab;
