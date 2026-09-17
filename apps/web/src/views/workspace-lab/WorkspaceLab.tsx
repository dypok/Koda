'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { 
  ArrowLeft, 
  Check, 
  Flame, 
  Key, 
  Sparkle, 
  ShieldCheck, 
  Sliders, 
  Code, 
  Lightning, 
  Compass, 
  Play, 
  Cpu, 
  Target,
  ArrowCounterClockwise
} from '@phosphor-icons/react';
import { HeroSkyBackground } from '@/components/landing/HeroSkyBackground';
import { cn } from '@/lib/utils';

interface ButtonProposal {
  id: string;
  num: string;
  name: string;
  tagline: string;
  badge: string;
  svgHighlight: string;
}

const BUTTON_PROPOSALS: ButtonProposal[] = [
  { id: 'm01', num: '01', name: 'Liquid Chrome Gooey Fusion', tagline: 'Filtro SVG feGaussianBlur + feColorMatrix con fusión orgánica de dos gotas de mercurio.', badge: 'Metaball SVG', svgHighlight: 'Fusión de gotas feColorMatrix' },
  { id: 'm02', num: '02', name: 'Magnetic Ferrofluid Spikes', tagline: 'Líquido ferrohidrodinámico que despliega espinas afiladas al activarse el campo magnético.', badge: 'Ferrofluid', svgHighlight: 'Espinas Bézier polares' },
  { id: 'm03', num: '03', name: 'Molten Amber Meniscus Wave', tagline: 'Cámara hidrostática con onda de menisco senoidal y burbujas de lava ámbar ascendentes.', badge: 'Meniscus Wave', svgHighlight: 'Onda sinusoidal + ebullición' },
  { id: 'm04', num: '04', name: 'Cyber Viscous Coalescence', tagline: 'Gotas de mercurio en riel capilar que colapsan por tensión superficial en un solo orbe.', badge: 'Surface Tension', svgHighlight: 'Gotas colapsantes en riel' },
  { id: 'm05', num: '05', name: 'Vortex Hydro-Centrifuge', tagline: 'Remolino líquido centrífugo con espirales logarítmicas que convergen en el núcleo.', badge: 'Vortex Swirl', svgHighlight: 'Espirales de succión fluida' },
  { id: 'm06', num: '06', name: 'Biomorphic Amoeba Membrane', tagline: 'Membrana orgánica con border-radius ondulante y orgánulos citoplasmáticos flotantes.', badge: 'Bio Membrane', svgHighlight: 'Deformación celular elástica' },
  { id: 'm07', num: '07', name: 'Chromium Solder Ribbon', tagline: 'Cinta perimétrica de soldadura líquida con destello de mercurio cromado en órbita.', badge: 'Liquid Ribbon', svgHighlight: 'Pista perimétrica fluida' },
  { id: 'm08', num: '08', name: 'Alchemical Glass Ampoule', tagline: 'Ampolleta de cristal pirex con nivel milimétrico, líquido reactivo y microburbujas.', badge: 'Bio Ampoule', svgHighlight: 'Cámara volumétrica de vidrio' },
  { id: 'm09', num: '09', name: 'Surface Tension Dewdrop Lens', tagline: 'Gota de agua esférica de tensión superficial con lente cáustica y destello Fresnel.', badge: 'Dewdrop Lens', svgHighlight: 'Lente esférica y cáusticas' },
  { id: 'm10', num: '10', name: 'Laminar Flow Twin Jet', tagline: 'Chorros laminares sin turbulencia con inestabilidad de Rayleigh-Plateau en los bordes.', badge: 'Laminar Stream', svgHighlight: 'Líneas de corriente paralelas' },
  { id: 'm11', num: '11', name: 'Ferro-Magnetic Core Pulsar', tagline: 'Núcleo de mercurio suspendido en levitación magnética con corona de plasma líquido.', badge: 'Levitating Core', svgHighlight: 'Corona magnética orbital' },
  { id: 'm12', num: '12', name: 'High-Speed Splash Crown', tagline: 'Corona de impacto hidrodinámico (Worthington Jet) congelada en alta velocidad.', badge: 'Splash Crown', svgHighlight: 'Corona de gotas satélite' },
  { id: 'm13', num: '13', name: 'Hydrogel Plasma Capsule', tagline: 'Cápsula de hidrogel elástica con núcleo viscoso luminiscente y refracción interna.', badge: 'Hydrogel Slime', svgHighlight: 'Núcleo gelatinoso táctil' },
  { id: 'm14', num: '14', name: 'Obsidian Dark Matter Ooze', tagline: 'Líquido de obsidiana viscosa con microfisuras radiactivas de magma ámbar.', badge: 'Dark Ooze', svgHighlight: 'Fisuras de magma viscoso' },
  { id: 'm15', num: '15', name: 'Superfluid Zero-Viscosity Film', tagline: 'Película de Rollin cuántica trepando por las paredes del botón sin fricción.', badge: 'Superfluidity', svgHighlight: 'Flujo perimétrico cuántico' },
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

  // Atajos de teclado para probar
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
      <HeroSkyBackground starCount={90} interactive={false} className="fixed inset-0 pointer-events-none -z-10" />

      {/* SVG Global Filters for Gooey Metaball effects */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="liquid-goo-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
          <filter id="liquid-high-viscosity">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Header Fijo con Selector Ergonómico de 15 Botones */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl px-4 py-3 shadow-2xl">
        <div className="mx-auto max-w-7xl flex flex-col gap-3">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
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
                  Liquid Mercury Lab
                </span>
                <span className="text-slate-600 font-mono">/</span>
                <span className="font-mono text-xs text-slate-400">15 Variaciones Fluidas</span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 hidden md:block">
              Usa <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Alt + ←/→</kbd> para ciclar variantes fluidas.
            </div>
          </div>

          {/* Carrusel/Grid Compacto de Píldoras M01 a M15 */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none" role="tablist">
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
                  'group flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs font-bold transition-all shrink-0 cursor-pointer',
                  activeBtnIndex === idx
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-[0_0_16px_rgba(255,106,0,0.5)] font-black scale-[1.03]'
                    : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-600 hover:bg-slate-800/80'
                )}
              >
                <span className="opacity-75">{btn.num}</span>
                <span className="truncate max-w-[120px] sm:max-w-none">{btn.name}</span>
              </button>
            ))}
          </div>

          {/* Sub-barra informativa con detalles del SVG y de la interacción */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400 border-t border-slate-800/40 pt-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/30 text-orange-300 font-bold text-[10px]">
                {activeProposal.badge}
              </span>
              <strong className="text-white">{activeProposal.name}:</strong>
              <span className="text-slate-300 hidden sm:inline">{activeProposal.tagline}</span>
            </div>
            <div className="text-amber-300/90 font-medium">
              SVG: {activeProposal.svgHighlight}
            </div>
          </div>

        </div>
      </header>

      {/* Espacio de Lección Principal */}
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

            {/* Columna Derecha: Práctica & Los 15 Botones Líquidos */}
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

              {/* Renderizado del Botón Líquido Activo (M01 a M15) */}
              <div className="space-y-3 pt-2">
                {!checked ? (
                  <div className="w-full">
                    {activeBtnIndex === 0 && <FluidBtn01ChromeGooey disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 1 && <FluidBtn02FerrofluidSpikes disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 2 && <FluidBtn03MoltenMeniscus disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 3 && <FluidBtn04ViscousCoalesce disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 4 && <FluidBtn05HydroVortex disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 5 && <FluidBtn06AmoebaMembrane disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 6 && <FluidBtn07ChromiumRibbon disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 7 && <FluidBtn08AlchemicalAmpoule disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 8 && <FluidBtn09DewdropLens disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 9 && <FluidBtn10LaminarJets disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 10 && <FluidBtn11MagneticPulsar disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 11 && <FluidBtn12SplashCrown disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 12 && <FluidBtn13HydrogelPlasma disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 13 && <FluidBtn14DarkMatterOoze disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 14 && <FluidBtn15SuperfluidFilm disabled={!selectedOpt} onClick={() => setChecked(true)} />}
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
                        Probar botón de nuevo
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
   M01 — LIQUID CHROME GOOEY FUSION (Evolución de Propuesta 10 con Filtro SVG)
   ========================================================================= */
function FluidBtn01ChromeGooey({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-2xl border border-orange-400/80 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-[length:200%_auto] px-6 font-mono text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_0_25px_rgba(255,106,0,0.5)] hover:shadow-[0_0_35px_rgba(255,106,0,0.8)] hover:bg-right hover:scale-[1.01] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div className="relative z-10 flex items-center gap-3">
        {/* SVG Gooey Metaballs */}
        <div 
          className="relative h-7 w-14 flex items-center justify-center pointer-events-none"
          style={{ filter: 'url(#liquid-goo-filter)' }}
        >
          <span className="h-5 w-5 rounded-full bg-slate-950 group-hover:translate-x-3 transition-transform duration-500 ease-out" />
          <span className="h-4 w-4 rounded-full bg-slate-950 -ml-1 group-hover:-translate-x-3 transition-transform duration-500 ease-out" />
          <span className="h-3 w-3 rounded-full bg-slate-950 absolute opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300" />
        </div>
        <span className="text-slate-950 font-black tracking-widest text-sm">COMPROBAR RESPUESTA</span>
      </div>

      <div className="relative z-10 flex items-center gap-2">
        <kbd className="hidden sm:inline-flex items-center justify-center px-2 py-0.5 rounded-lg border border-slate-950/40 bg-slate-950/15 text-[10px] font-bold text-slate-950">
          Enter ↵
        </kbd>
      </div>
    </button>
  );
}

/* =========================================================================
   M02 — MAGNETIC FERROFLUID SPIKES (Espinas Bézier Ferrohidrodinámicas)
   ========================================================================= */
function FluidBtn02FerrofluidSpikes({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-2xl border-2 border-amber-500 bg-slate-950 px-6 font-mono text-xs font-black uppercase tracking-wider text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:border-orange-400 hover:shadow-[0_0_30px_rgba(255,106,0,0.6)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      {/* SVG Ferrofluid Dynamic Spikes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity" viewBox="0 0 400 60" preserveAspectRatio="none">
        <path
          d="M0,30 Q30,10 60,30 T120,30 T180,30 T240,30 T300,30 T360,30 T400,30"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="3"
          className="group-hover:stroke-[#FF6A00] transition-colors"
        />
        <path
          d="M20,60 L30,40 L40,60 M100,60 L110,35 L120,60 M220,60 L230,30 L240,60 M320,60 L330,38 L340,60"
          fill="#FF6A00"
          className="group-hover:scale-y-125 origin-bottom transition-transform duration-300"
        />
      </svg>

      <div className="relative z-10 flex items-center gap-3">
        <div className="h-4 w-4 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 shadow-[0_0_12px_#F59E0B] group-hover:scale-125 transition-transform" />
        <span className="text-white font-black tracking-wider">FERROFLUID MAGNÉTICO</span>
      </div>

      <span className="relative z-10 text-[10px] font-mono border border-amber-500/50 bg-amber-500/20 px-2 py-0.5 rounded text-amber-200">
        MAGNETIC_ENTER [↵]
      </span>
    </button>
  );
}

/* =========================================================================
   M03 — MOLTEN AMBER MENISCUS WAVE (Cámara de Lava con Menisco Senoidal)
   ========================================================================= */
function FluidBtn03MoltenMeniscus({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-2xl border border-orange-500/70 bg-slate-950 px-6 font-mono text-xs font-black uppercase tracking-wider text-orange-200 shadow-[0_0_22px_rgba(255,106,0,0.3)] hover:border-orange-400 hover:shadow-[0_0_32px_rgba(255,106,0,0.6)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      {/* SVG Molten Fluid Wave Level */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60 group-hover:opacity-90 transition-opacity" viewBox="0 0 300 50" preserveAspectRatio="none">
        <path
          d="M0,25 Q50,15 100,25 T200,25 T300,25 L300,50 L0,50 Z"
          fill="url(#molten-grad)"
          className="group-hover:translate-y-[-4px] transition-transform duration-500"
        />
        <defs>
          <linearGradient id="molten-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#EA580C" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FF6A00" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {/* Floating heat bubbles */}
        <circle cx="45" cy="30" r="2.5" fill="#FFF" className="group-hover:animate-bounce" />
        <circle cx="160" cy="35" r="3" fill="#FFF" className="group-hover:animate-bounce" style={{ animationDelay: '150ms' }} />
        <circle cx="250" cy="28" r="2" fill="#FFF" className="group-hover:animate-bounce" style={{ animationDelay: '300ms' }} />
      </svg>

      <div className="relative z-10 flex items-center gap-2">
        <Flame className="w-4 h-4 text-amber-400 group-hover:scale-125 transition-transform" />
        <span className="text-white font-black tracking-widest">MENISCO TERMODINÁMICO</span>
      </div>

      <span className="relative z-10 font-mono text-[10px] text-slate-950 font-black bg-amber-400 px-2 py-0.5 rounded shadow">
        BOIL [↵]
      </span>
    </button>
  );
}

/* =========================================================================
   M04 — CYBER VISCOUS COALESCENCE (Gotas en Riel de Tensión Superficial)
   ========================================================================= */
function FluidBtn04ViscousCoalesce({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-2xl border border-amber-400 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-6 font-mono text-xs font-bold text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:border-amber-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div className="relative z-10 flex items-center gap-3">
        {/* SVG Capillary Rail */}
        <svg className="w-16 h-6 shrink-0" viewBox="0 0 60 24">
          <line x1="4" y1="12" x2="56" y2="12" stroke="#475569" strokeWidth="2" strokeDasharray="2,2" />
          <circle cx="10" cy="12" r="4" fill="#FF6A00" className="group-hover:translate-x-5 transition-transform duration-500" />
          <circle cx="50" cy="12" r="4" fill="#FBBF24" className="group-hover:-translate-x-5 transition-transform duration-500" />
          <circle cx="30" cy="12" r="6" fill="#FFF" className="opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
        </svg>
        <span className="uppercase tracking-wider font-black text-white">COALESCENCIA CAPILAR</span>
      </div>

      <span className="relative z-10 text-[10px] font-mono border border-amber-500/50 bg-amber-500/20 px-2 py-0.5 rounded text-amber-200">
        FUSION [↵]
      </span>
    </button>
  );
}

/* =========================================================================
   M05 — VORTEX HYDRO-CENTRIFUGE (Remolino de Succión Centrífuga)
   ========================================================================= */
function FluidBtn05HydroVortex({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-2xl border border-cyan-500/60 bg-slate-950 px-6 font-mono text-xs font-bold text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:border-cyan-400 hover:shadow-[0_0_32px_rgba(6,182,212,0.55)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div className="relative z-10 flex items-center gap-3">
        {/* SVG Vortex Spiral */}
        <div className="relative h-7 w-7 shrink-0">
          <svg viewBox="0 0 40 40" className="w-full h-full group-hover:animate-spin" style={{ animationDuration: '2.5s' }}>
            <circle cx="20" cy="20" r="16" fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="8,6" />
            <path d="M20,4 A16,16 0 0,1 36,20 A10,10 0 0,1 20,30 A6,6 0 0,1 20,20" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-2.5 rounded-full bg-cyan-400/40 group-hover:bg-cyan-300 shadow-[0_0_12px_#06B6D4] transition-all" />
        </div>
        <span className="uppercase tracking-wider font-black text-white">VÓRTICE HIDROCÊNTRICO</span>
      </div>

      <span className="relative z-10 font-mono text-[10px] text-cyan-300 border border-cyan-500/50 px-2 py-0.5 rounded bg-cyan-950/60">
        SWIRL_ENTER ↵
      </span>
    </button>
  );
}

/* =========================================================================
   M06 — BIOMORPHIC AMOEBA MEMBRANE (Membrana Celular Ondulante)
   ========================================================================= */
function FluidBtn06AmoebaMembrane({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden border-2 border-orange-500/80 bg-gradient-to-r from-orange-600 to-amber-500 px-6 font-mono text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_0_22px_rgba(255,106,0,0.4)] hover:shadow-[0_0_35px_rgba(255,106,0,0.7)] transition-all duration-500 cursor-pointer disabled:opacity-40"
      style={{
        borderRadius: '24px 12px 28px 14px / 14px 28px 12px 24px'
      }}
    >
      <div className="flex items-center gap-3">
        {/* SVG Organelles */}
        <div className="relative h-6 w-8">
          <span className="absolute top-1 left-1 h-3 w-3 rounded-full bg-slate-950 group-hover:translate-x-3 group-hover:scale-125 transition-all duration-500" />
          <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full bg-slate-950/70 group-hover:-translate-x-3 transition-transform duration-500" />
        </div>
        <span className="font-black text-slate-950 tracking-widest text-sm">MEMBRANA BIOMÓRFICA</span>
      </div>

      <kbd className="hidden sm:inline-flex items-center justify-center px-2 py-0.5 rounded border border-slate-950/40 bg-slate-950/20 text-[10px] font-bold text-slate-950">
        Enter ↵
      </kbd>
    </button>
  );
}

/* =========================================================================
   M07 — CHROMIUM SOLDER RIBBON (Cinta de Mercurio Cromado Perimétrico)
   ========================================================================= */
function FluidBtn07ChromiumRibbon({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 px-6 font-mono text-xs font-bold text-slate-100 shadow-xl hover:border-amber-400 hover:shadow-[0_0_28px_rgba(251,191,36,0.4)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      {/* SVG Liquid Ribbon Stroke */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="2"
          y="2"
          width="calc(100% - 4px)"
          height="calc(100% - 4px)"
          rx="14"
          fill="none"
          stroke="url(#ribbon-grad)"
          strokeWidth="2"
          strokeDasharray="40 120"
          className="group-hover:animate-[dash_2s_linear_infinite]"
        />
        <defs>
          <linearGradient id="ribbon-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#FFF" />
            <stop offset="100%" stopColor="#FF6A00" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative z-10 flex items-center gap-3">
        <div className="h-3 w-3 rounded-full bg-amber-400 shadow-[0_0_10px_#F59E0B] group-hover:scale-150 transition-transform" />
        <span className="uppercase tracking-wider font-black text-white">SOLDADURA CROMADA</span>
      </div>

      <span className="relative z-10 text-[10px] font-mono border border-slate-700 bg-slate-900 px-2 py-0.5 rounded text-slate-300 group-hover:border-amber-400 group-hover:text-amber-300">
        [FLOW_ENTER]
      </span>
    </button>
  );
}

/* =========================================================================
   M08 — ALCHEMICAL GLASS AMPOULE (Ampolleta de Vidrio con Microburbujas)
   ========================================================================= */
function FluidBtn08AlchemicalAmpoule({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-full border border-amber-500/50 bg-slate-900/80 px-6 font-mono text-xs font-bold text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:border-amber-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      {/* SVG Volumetric Graduations */}
      <svg className="absolute left-4 top-0 bottom-0 w-8 h-full pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity" viewBox="0 0 30 50">
        <line x1="2" y1="12" x2="12" y2="12" stroke="#FBBF24" strokeWidth="1.5" />
        <line x1="2" y1="25" x2="18" y2="25" stroke="#FBBF24" strokeWidth="2" />
        <line x1="2" y1="38" x2="12" y2="38" stroke="#FBBF24" strokeWidth="1.5" />
      </svg>

      <div className="relative z-10 ml-6 flex items-center gap-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
        <span className="font-black tracking-wider uppercase text-white">AMPOLLETA ALQUÍMICA</span>
      </div>

      <span className="relative z-10 text-[10px] font-mono border border-amber-500/60 bg-amber-500/20 px-2.5 py-0.5 rounded-full text-amber-200">
        50mL · REAGENTE [↵]
      </span>
    </button>
  );
}

/* =========================================================================
   M09 — SURFACE TENSION DEWDROP LENS (Gota Esférica con Refracción Fresnel)
   ========================================================================= */
function FluidBtn09DewdropLens({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-2xl border border-orange-400/60 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400 px-6 font-mono text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_0_24px_rgba(255,106,0,0.4)] hover:brightness-110 hover:shadow-[0_0_36px_rgba(255,106,0,0.7)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div className="flex items-center gap-3">
        {/* SVG Dewdrop Specular Sphere */}
        <div className="relative h-6 w-6 shrink-0 rounded-full bg-slate-950 shadow-inner group-hover:scale-125 transition-transform duration-300">
          <div className="absolute top-1 left-1.5 h-2 w-2 rounded-full bg-white opacity-90" />
          <div className="absolute bottom-1 right-1.5 h-1 w-1 rounded-full bg-amber-400 opacity-80" />
        </div>
        <span className="text-slate-950 font-black tracking-widest text-sm">LENTE GOTA FRESNEL</span>
      </div>

      <kbd className="hidden sm:inline-flex items-center justify-center px-2 py-0.5 rounded border border-slate-950/40 bg-slate-950/15 text-[10px] font-bold text-slate-950">
        Enter ↵
      </kbd>
    </button>
  );
}

/* =========================================================================
   M10 — LAMINAR FLOW TWIN JET (Chorros Fluidos Paralelos Sin Turbulencia)
   ========================================================================= */
function FluidBtn10LaminarJets({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-2xl border border-teal-500/50 bg-slate-950 px-6 font-mono text-xs font-bold text-teal-200 shadow-[0_0_20px_rgba(20,184,166,0.2)] hover:border-teal-400 hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      {/* SVG Laminar Streamlines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 group-hover:opacity-90 transition-opacity" viewBox="0 0 350 50">
        <path d="M0,15 L120,15 Q180,35 240,35 L350,35" fill="none" stroke="#2DD4BF" strokeWidth="2" />
        <path d="M0,35 L120,35 Q180,15 240,15 L350,15" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
      </svg>

      <span className="relative z-10 font-black uppercase tracking-wider text-white">
        FLUJO LAMINAR PURO
      </span>

      <span className="relative z-10 text-[10px] font-mono border border-teal-500/60 bg-teal-950/60 px-2 py-0.5 rounded text-teal-300">
        REYNOLDS [↵]
      </span>
    </button>
  );
}

/* =========================================================================
   M11 — FERRO-MAGNETIC CORE PULSAR (Núcleo en Levitación Magnética)
   ========================================================================= */
function FluidBtn11MagneticPulsar({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-2xl border border-orange-500/70 bg-gradient-to-r from-slate-950 via-orange-950/40 to-slate-950 px-6 font-mono text-xs font-bold text-orange-200 shadow-[0_0_22px_rgba(255,106,0,0.3)] hover:border-orange-400 hover:shadow-[0_0_34px_rgba(255,106,0,0.6)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div className="relative z-10 flex items-center gap-3">
        {/* SVG Levitating Core & Corona */}
        <div className="relative h-7 w-7 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full group-hover:rotate-180 transition-transform duration-700">
            <circle cx="18" cy="18" r="14" fill="none" stroke="#FF6A00" strokeWidth="1" strokeDasharray="4,4" />
          </svg>
          <div className="absolute inset-1.5 rounded-full bg-gradient-to-tr from-orange-500 to-amber-300 shadow-[0_0_14px_#FF6A00] group-hover:scale-110 transition-transform" />
        </div>
        <span className="uppercase tracking-wider font-black text-white">NÚCLEO EN LEVITACIÓN</span>
      </div>

      <span className="relative z-10 text-[10px] font-mono border border-orange-500/60 bg-orange-500/20 px-2 py-0.5 rounded text-orange-200">
        PULSAR_EXEC [↵]
      </span>
    </button>
  );
}

/* =========================================================================
   M12 — HIGH-SPEED SPLASH CROWN (Corona de Impacto Hidrodinámico)
   ========================================================================= */
function FluidBtn12SplashCrown({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-2xl border border-amber-500/80 bg-gradient-to-r from-orange-500 to-amber-400 px-6 font-mono text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_0_22px_rgba(255,106,0,0.4)] hover:shadow-[0_0_35px_rgba(255,106,0,0.7)] transition-all duration-200 cursor-pointer disabled:opacity-40"
    >
      <div className="flex items-center gap-3">
        {/* SVG Splash Crown */}
        <svg viewBox="0 0 32 24" className="w-7 h-5 shrink-0 fill-slate-950 group-hover:scale-125 transition-transform duration-300">
          <path d="M2,20 C8,18 10,6 12,6 C14,6 14,14 16,14 C18,14 18,4 20,4 C22,4 24,18 30,20 Z" />
          <circle cx="12" cy="3" r="1.5" />
          <circle cx="20" cy="1.5" r="1.5" />
        </svg>
        <span className="font-black text-slate-950 tracking-widest text-sm">CORONA DE IMPACTO</span>
      </div>

      <kbd className="hidden sm:inline-flex items-center justify-center px-2 py-0.5 rounded border border-slate-950/40 bg-slate-950/15 text-[10px] font-bold text-slate-950">
        Enter ↵
      </kbd>
    </button>
  );
}

/* =========================================================================
   M13 — HYDROGEL PLASMA CAPSULE (Cápsula Elástica de Hidrogel)
   ========================================================================= */
function FluidBtn13HydrogelPlasma({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-3xl border-2 border-amber-400 bg-slate-950/90 px-6 font-mono text-xs font-black uppercase tracking-wider text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(251,191,36,0.6)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 rounded-full bg-gradient-to-r from-orange-500 to-amber-300 shadow-[0_0_12px_#F59E0B] group-hover:scale-125 group-hover:rotate-45 transition-all" />
        <span className="text-white font-black tracking-wider">CÁPSULA HIDROGEL</span>
      </div>

      <span className="text-[10px] font-mono border border-amber-400/50 bg-amber-400/20 px-2 py-0.5 rounded-full text-amber-200">
        GEL_EXEC [↵]
      </span>
    </button>
  );
}

/* =========================================================================
   M14 — OBSIDIAN DARK MATTER OOZE (Obsidiana con Fisuras de Magma)
   ========================================================================= */
function FluidBtn14DarkMatterOoze({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-2xl border border-rose-500/50 bg-slate-950 px-6 font-mono text-xs font-bold text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.2)] hover:border-rose-400 hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      {/* SVG Magma Veins */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity" viewBox="0 0 300 50">
        <path d="M10,25 Q70,5 130,30 T250,20 T300,35" fill="none" stroke="#F43F5E" strokeWidth="1.5" />
        <path d="M30,45 Q110,20 180,40 T290,15" fill="none" stroke="#FB923C" strokeWidth="1" strokeDasharray="4,4" />
      </svg>

      <span className="relative z-10 font-black uppercase tracking-wider text-white">
        OBSIDIANA MAGMÁTICA
      </span>

      <span className="relative z-10 text-[10px] font-mono border border-rose-500/60 bg-rose-950/60 px-2 py-0.5 rounded text-rose-200">
        OOZE [↵]
      </span>
    </button>
  );
}

/* =========================================================================
   M15 — SUPERFLUID ZERO-VISCOSITY FILM (Película Cuántica de Rollin)
   ========================================================================= */
function FluidBtn15SuperfluidFilm({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-2xl border border-cyan-400/80 bg-gradient-to-r from-orange-500 via-amber-400 to-cyan-400 px-6 font-mono text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_38px_rgba(255,106,0,0.8)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div className="flex items-center gap-3">
        {/* SVG Superfluid creeping beads */}
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-slate-950 group-hover:-translate-y-2 transition-transform duration-300" />
          <span className="h-4 w-4 rounded-full bg-slate-950 group-hover:translate-y-2 transition-transform duration-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-950 group-hover:-translate-y-2 transition-transform duration-300" />
        </div>
        <span className="font-black text-slate-950 tracking-widest text-sm">SUPERFLUIDO CUÁNTICO</span>
      </div>

      <kbd className="hidden sm:inline-flex items-center justify-center px-2 py-0.5 rounded border border-slate-950/40 bg-slate-950/20 text-[10px] font-bold text-slate-950">
        Enter ↵
      </kbd>
    </button>
  );
}

export default WorkspaceLab;
