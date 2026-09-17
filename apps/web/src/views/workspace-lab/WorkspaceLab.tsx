'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { 
  ArrowLeft, 
  Check, 
  Flame, 
  Key, 
  Lightning, 
  Sparkle, 
  Play, 
  ArrowRight,
  ShieldCheck,
  Cpu,
  ArrowCounterClockwise
} from '@phosphor-icons/react';
import { HeroSkyBackground } from '@/components/landing/HeroSkyBackground';
import { cn } from '@/lib/utils';

interface ButtonProposal {
  id: string;
  num: string;
  name: string;
  description: string;
  badge: string;
}

const BUTTON_PROPOSALS: ButtonProposal[] = [
  {
    id: 'fiery-core',
    num: 'B1',
    name: 'Fiery Core Reactor',
    description: 'Degradado de fuego continuo con respiración lumínica GSAP y halo ámbar difuso de 24px.',
    badge: 'Fuego Koda',
  },
  {
    id: 'tactical-laser',
    num: 'B2',
    name: 'Tactical Laser Perimeter',
    description: 'Borde de cristal oscuro con haz de láser naranja reactivo al cursor y micro-flecha cinética.',
    badge: 'Cyber Táctico',
  },
  {
    id: 'arcade-3d-push',
    num: 'B3',
    name: 'Neumorphic Arcade Push',
    description: 'Pulsador mecánico 3D con relieve físico (`border-b-4`), compresión táctil y keycap incrustada.',
    badge: '3D Arcade',
  },
  {
    id: 'obsidian-zen',
    num: 'B4',
    name: 'Obsidian Zen Aura',
    description: 'Minimalismo puro: dark obsidian profundo, borde dorado milimétrico y expansión suave de aura.',
    badge: 'Zen Minimal',
  },
  {
    id: 'particle-shimmer',
    num: 'B5',
    name: 'Particle Energy Shimmer',
    description: 'Rayo de luz oblicuo continuo (shimmer effect), micro-destellos en hover y resplandor activo.',
    badge: 'Energy Shimmer',
  },
  {
    id: 'kinetic-split',
    num: 'B6',
    name: 'Kinetic Split Capsule',
    description: 'Cápsula bipartita: texto principal a la izquierda y keycap [Enter ↵] desacoplada magnética.',
    badge: 'Split Pill',
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
  const [activeBtnIndex, setActiveBtnIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>('opt-a');
  const [checked, setChecked] = useState(false);

  const activeProposal = BUTTON_PROPOSALS[activeBtnIndex];
  const isCorrect = selectedOpt === MOCK_EXERCISE.correctId;

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
        setActiveBtnIndex((prev) => (prev + 1) % BUTTON_PROPOSALS.length);
      } else if (e.key === 'ArrowLeft' && e.altKey) {
        setActiveBtnIndex((prev) => (prev - 1 + BUTTON_PROPOSALS.length) % BUTTON_PROPOSALS.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="relative isolate min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
      <HeroSkyBackground starCount={80} interactive={false} className="fixed inset-0 pointer-events-none -z-10" />

      {/* Header Fijo con Switcher de Propuestas de Botón */}
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
                Button Lab
              </span>
              <span className="text-slate-600 font-mono">/</span>
              <span className="font-mono text-xs text-slate-400 hidden sm:inline">6 Diseños para &quot;Comprobar respuesta&quot;</span>
            </div>
          </div>

          {/* Switcher de Pestañas B1 a B6 */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none" role="tablist">
            {BUTTON_PROPOSALS.map((btn, idx) => (
              <button
                key={btn.id}
                role="tab"
                aria-selected={activeBtnIndex === idx}
                onClick={() => {
                  setActiveBtnIndex(idx);
                  setChecked(false);
                }}
                className={cn(
                  'group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs font-bold transition-all shrink-0 cursor-pointer',
                  activeBtnIndex === idx
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-[0_0_16px_rgba(255,106,0,0.5)] font-black scale-[1.03]'
                    : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-600 hover:bg-slate-800/80'
                )}
              >
                <span className="opacity-75">{btn.num}</span>
                <span>{btn.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sub-barra con descripción del botón activo */}
        <div className="mx-auto max-w-7xl pt-2.5 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800/40 mt-2">
          <p className="truncate flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/30 text-orange-300 font-bold text-[10px]">
              {activeProposal.badge}
            </span>
            <strong className="text-white">{activeProposal.name}:</strong> {activeProposal.description}
          </p>
          <span className="hidden lg:inline text-slate-500 shrink-0">
            Prueba: Tecla <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Enter</kbd> o clic · Alternar botón: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Alt + ←/→</kbd>
          </span>
        </div>
      </header>

      {/* Espacio de Lección Principal (Diseño Oficial Roadmap Fusion HUD) */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full max-w-6xl space-y-4 font-sans">
          
          {/* HUD Flotante Superior en Píldora */}
          <div className="group flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 rounded-full border border-slate-700/50 bg-slate-900/40 backdrop-blur-xl shadow-xl hover:border-orange-500/40 hover:shadow-[0_0_20px_rgba(255,106,0,0.15)] transition-all duration-300">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400 font-semibold group-hover:text-slate-300 transition-colors">{MOCK_EXERCISE.courseTitle}</span>
              <span className="text-slate-600">›</span>
              <span className="text-orange-400 font-bold group-hover:text-amber-300 transition-colors">{MOCK_EXERCISE.sectionTitle}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50 hover:border-amber-400/40 transition-colors">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>1-4 · Enter</span>
              </div>
              <span className="font-mono text-xs font-bold text-orange-400 tabular-nums bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full">
                0{MOCK_EXERCISE.progressStep}/0{MOCK_EXERCISE.totalSteps}
              </span>
            </div>
          </div>

          {/* Stepper horizontal de píldoras luminosas */}
          <div className="flex items-center gap-1.5 px-2">
            {Array.from({ length: MOCK_EXERCISE.totalSteps }).map((_, i) => (
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
            
            {/* Columna Izquierda: Teoría & Código */}
            <div className="group rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-6 flex flex-col justify-between gap-6 shadow-2xl hover:border-slate-700/80 transition-all duration-300">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-[10px] font-mono font-bold text-orange-300 uppercase tracking-wider">
                  <span>Lección 01</span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                  {MOCK_EXERCISE.lessonTitle}
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

              {/* Terminal de Vidrio Translúcido */}
              <div className="space-y-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 font-mono text-sm leading-relaxed text-slate-200 shadow-inner hover:border-orange-500/30 hover:shadow-[0_0_20px_rgba(255,106,0,0.1)] transition-all duration-300">
                  <span className="text-slate-600 select-none">// Ejecución simple</span>
                  <div className="text-amber-300 pt-1"><code>{MOCK_EXERCISE.codeSnippet}</code></div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs font-mono text-emerald-300 hover:border-emerald-400/60 hover:bg-emerald-950/50 transition-all">
                  <span className="text-emerald-500 font-bold">$</span>
                  <span>{MOCK_EXERCISE.codeOutput}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal pl-1">{MOCK_EXERCISE.codeFootnote}</p>
              </div>
            </div>

            {/* Columna Derecha: Práctica & El Botón de Comprobación que estamos evaluando */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-6 flex flex-col justify-between gap-6 shadow-2xl">
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Desafío de Comprensión
                </span>
                <p className="text-base sm:text-lg font-bold text-white leading-snug">
                  {MOCK_EXERCISE.prompt}
                </p>

                <div className="space-y-2.5 pt-2">
                  {MOCK_EXERCISE.options.map((opt) => {
                    const isSelected = selectedOpt === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSelectedOpt(opt.id);
                          setChecked(false);
                        }}
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

              {/* Área del Botón (Renderiza la Propuesta de Botón Activa B1..B6) */}
              <div className="space-y-3 pt-2">
                {!checked ? (
                  <div>
                    {activeBtnIndex === 0 && (
                      <ButtonVariantFieryCore
                        disabled={!selectedOpt}
                        onClick={() => setChecked(true)}
                      />
                    )}
                    {activeBtnIndex === 1 && (
                      <ButtonVariantTacticalLaser
                        disabled={!selectedOpt}
                        onClick={() => setChecked(true)}
                      />
                    )}
                    {activeBtnIndex === 2 && (
                      <ButtonVariantArcade3D
                        disabled={!selectedOpt}
                        onClick={() => setChecked(true)}
                      />
                    )}
                    {activeBtnIndex === 3 && (
                      <ButtonVariantObsidianZen
                        disabled={!selectedOpt}
                        onClick={() => setChecked(true)}
                      />
                    )}
                    {activeBtnIndex === 4 && (
                      <ButtonVariantParticleShimmer
                        disabled={!selectedOpt}
                        onClick={() => setChecked(true)}
                      />
                    )}
                    {activeBtnIndex === 5 && (
                      <ButtonVariantKineticSplit
                        disabled={!selectedOpt}
                        onClick={() => setChecked(true)}
                      />
                    )}
                  </div>
                ) : (
                  <div className={cn(
                    'rounded-xl border p-4 space-y-2 transition-all duration-300',
                    isCorrect
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100 shadow-[0_0_18px_rgba(16,185,129,0.15)]'
                      : 'border-rose-500/40 bg-rose-500/10 text-rose-100'
                  )}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold flex items-center gap-2">
                        {isCorrect ? <Check className="w-5 h-5 text-emerald-400" /> : null}
                        {isCorrect ? '¡Excelente! +5 XP de dominio' : 'Respuesta incorrecta'}
                      </p>
                      <button
                        type="button"
                        onClick={() => setChecked(false)}
                        className="text-xs font-mono text-slate-400 underline hover:text-white cursor-pointer"
                      >
                        Reiniciar botón
                      </button>
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
      </main>
    </div>
  );
};

/* =========================================================================
   VARIANTE B1: FIERY CORE REACTOR
   - Halo de respiración continuo GSAP (24px)
   - Degradado de llama Koda (#FF6A00 -> #F59E0B)
   - Keycap incrustada con micro-hundimiento
   ========================================================================= */
function ButtonVariantFieryCore({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!btnRef.current || disabled) return;
    const tween = gsap.to(btnRef.current, {
      boxShadow: '0 0 26px rgba(255, 106, 0, 0.7)',
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: 'sine.inOut',
    });
    return () => { tween.kill(); };
  }, [disabled]);

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[50px] w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 px-6 font-mono text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_0_18px_rgba(255,106,0,0.4)] hover:brightness-115 hover:scale-[1.015] active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
    >
      <span className="flex items-center gap-2">
        <Flame className="w-4 h-4 fill-slate-950 text-slate-950" />
        <span>Comprobar respuesta</span>
      </span>
      <kbd className="hidden sm:inline-flex items-center justify-center px-2 py-0.5 rounded-md border border-slate-950/40 bg-slate-950/15 text-[10px] font-mono font-bold group-hover:bg-slate-950/25 transition-colors">
        Enter ↵
      </kbd>
    </button>
  );
}

/* =========================================================================
   VARIANTE B2: TACTICAL LASER PERIMETER
   - Borde de cristal oscuro con haz de luz naranja animado en el contorno
   - Flecha de vector que pulsa en hover
   - Acento de energía ciberpunk sobrio
   ========================================================================= */
function ButtonVariantTacticalLaser({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[50px] w-full items-center justify-between overflow-hidden rounded-xl border border-orange-500/50 bg-slate-950 px-6 font-mono text-xs font-bold text-orange-400 shadow-[0_0_15px_rgba(255,106,0,0.15)] hover:border-orange-400 hover:bg-orange-500/10 hover:text-white hover:shadow-[0_0_24px_rgba(255,106,0,0.4)] transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {/* Línea de escaneo superior */}
      <span className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      
      <div className="flex items-center gap-2.5">
        <span className="h-2 w-2 rounded-full bg-orange-500 group-hover:animate-ping" />
        <span className="uppercase tracking-widest">[ VERIFICAR_ORDEN ]</span>
      </div>

      <div className="flex items-center gap-2">
        <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
        <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-orange-500/40 bg-slate-900 text-[10px] text-orange-300">
          ↵
        </kbd>
      </div>
    </button>
  );
}

/* =========================================================================
   VARIANTE B3: NEUMORPHIC ARCADE PUSH
   - Relieve físico 3D con borde inferior oscuro (border-b-4)
   - Efecto push real al hacer clic (active:translate-y-1 active:border-b-0)
   - Sensación táctil mecánica de consola
   ========================================================================= */
function ButtonVariantArcade3D({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-xl border border-amber-500/40 border-b-4 border-b-orange-600 bg-gradient-to-b from-amber-400 to-orange-500 px-6 font-mono text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-orange-500/25 hover:brightness-110 hover:border-b-[5px] active:translate-y-1 active:border-b-0 active:shadow-none transition-all duration-100 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:border-b-2"
    >
      <span>Comprobar respuesta</span>
      <kbd className="hidden sm:inline-flex items-center justify-center px-2 py-0.5 rounded border border-slate-950/30 bg-slate-950/20 text-[10px] font-mono font-bold shadow-inner">
        Enter ↵
      </kbd>
    </button>
  );
}

/* =========================================================================
   VARIANTE B4: OBSIDIAN ZEN AURA
   - Fondo dark obsidian puro (#0B0F19)
   - Borde dorado milimétrico fino
   - Expansión de aura suave al hover sin saturación
   ========================================================================= */
function ButtonVariantObsidianZen({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[50px] w-full items-center justify-center gap-3 rounded-xl border border-amber-400/40 bg-slate-900/90 px-6 font-sans text-xs font-bold text-slate-100 shadow-[0_0_12px_rgba(0,0,0,0.8)] hover:border-amber-400 hover:bg-slate-900 hover:text-amber-200 hover:shadow-[0_0_20px_rgba(251,191,36,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <span className="tracking-wide">Comprobar respuesta</span>
      <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800 text-[10px] font-mono text-slate-400 group-hover:border-amber-400/50 group-hover:text-amber-300 transition-colors">
        Enter ↵
      </kbd>
    </button>
  );
}

/* =========================================================================
   VARIANTE B5: PARTICLE ENERGY SHIMMER
   - Rayo oblicuo de luz continua (Shimmer)
   - Gradiente de alta luminosidad ámbar/fuego
   - Micro-destello de partículas en hover
   ========================================================================= */
function ButtonVariantParticleShimmer({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[50px] w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 px-6 font-mono text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_0_20px_rgba(255,106,0,0.45)] hover:shadow-[0_0_30px_rgba(255,106,0,0.7)] hover:scale-[1.015] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {/* Rayo de luz oblicuo animado (Shimmer) */}
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.4s_infinite]" />

      <Sparkle className="w-4 h-4 fill-slate-950 text-slate-950 animate-pulse" />
      <span>Comprobar respuesta</span>
      <kbd className="hidden sm:inline-flex items-center justify-center px-2 py-0.5 rounded border border-slate-950/30 bg-slate-950/15 text-[10px] font-mono font-bold">
        Enter ↵
      </kbd>
    </button>
  );
}

/* =========================================================================
   VARIANTE B6: KINETIC SPLIT CAPSULE
   - Cápsula dividida en 2 mitades con conector magnético
   - Lado izquierdo: Botón principal de texto
   - Lado derecho: Keycap física [Enter ↵] desacoplada
   ========================================================================= */
function ButtonVariantKineticSplit({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[50px] w-full items-stretch justify-between overflow-hidden rounded-xl border border-orange-500/60 bg-slate-900/90 shadow-[0_0_16px_rgba(255,106,0,0.25)] hover:border-orange-400 hover:shadow-[0_0_26px_rgba(255,106,0,0.5)] transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {/* Lado Izquierdo: Acción */}
      <div className="flex flex-1 items-center justify-center gap-2 px-6 py-3 font-mono text-xs font-black uppercase tracking-wider text-white group-hover:text-amber-300 transition-colors">
        <Lightning className="w-4 h-4 text-orange-400 group-hover:rotate-12 transition-transform" />
        <span>Comprobar respuesta</span>
      </div>

      {/* Lado Derecho: Keycap Desacoplada */}
      <div className="flex items-center justify-center border-l border-orange-500/40 bg-gradient-to-r from-orange-500 to-amber-500 px-4 font-mono text-xs font-bold text-slate-950 group-hover:brightness-110 transition-all">
        <span className="flex items-center gap-1">
          <span>Enter</span>
          <span className="font-bold text-sm">↵</span>
        </span>
      </div>
    </button>
  );
}

export default WorkspaceLab;
