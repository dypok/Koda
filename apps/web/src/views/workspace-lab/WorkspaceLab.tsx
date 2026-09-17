'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Check, 
  Flame, 
  Key, 
  Sparkle, 
  ShieldCheck, 
  Drop,
  Waves,
  Lightning, 
  Atom,
  Target,
  CircleNotch
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
  { id: 'l01', num: '01', name: 'Chrome Liquid Gooey', tagline: 'Metaballs de mercurio líquido en órbita continua con fusión orgánica y estiramiento.', badge: 'Liquid Mercury', svgHighlight: 'Filtro SVG feColorMatrix Gooey' },
  { id: 'l02', num: '02', name: 'Molten Solar Magma', tagline: 'Olas de lava incandescente en doble fase senoidal con flujo continuo de convección.', badge: 'Solar Magma', svgHighlight: 'Ondas senoidales duales en bucle' },
  { id: 'l03', num: '03', name: 'Ferrofluid Magnetic Flux', tagline: 'Agujas magnéticas de ferrofluido negro que oscilan en frecuencia armónica.', badge: 'Ferrofluid Spikes', svgHighlight: 'Picos magnéticos oscilantes' },
  { id: 'l04', num: '04', name: 'Deep Space Liquid Vortex', tagline: 'Remolino de plasma fluido en rotación vorticial continua con disco de acreción.', badge: 'Fluid Vortex', svgHighlight: 'Vórtice espiral centrípeto' },
  { id: 'l05', num: '05', name: 'Bioluminescent Abyss Goo', tagline: 'Burbujas bioluminiscentes cian/esmeralda que ascienden en flotabilidad infinita.', badge: 'Bio Abyss Goo', svgHighlight: 'Gotas con flotación continua' },
  { id: 'l06', num: '06', name: 'Quantum Mercury Beads', tagline: 'Esferas de mercurio entrelazadas que se deslizan, colisionan y fusionan sin cesar.', badge: 'Mercury Beads', svgHighlight: 'Microgotas en colisión elástica' },
  { id: 'l07', num: '07', name: 'Molten Gold Viscosity', tagline: 'Olas de oro líquido de 24K con densidad viscosa y reflejo metálico persistente.', badge: 'Molten Gold', svgHighlight: 'Parallax de fluidos dorados' },
  { id: 'l08', num: '08', name: 'Liquid Caustic Interference', tagline: 'Malla refractiva de cáusticas subacuáticas de mercurio con turbulencia SVG dinámica.', badge: 'Caustic Waves', svgHighlight: 'Filtro feTurbulence animado' },
  { id: 'l09', num: '09', name: 'Mercury Rain & Splash Pool', tagline: 'Lluvia vertical de microgotas de mercurio que caen e impactan en un estanque líquido.', badge: 'Rain & Ripple', svgHighlight: 'Salpicaduras y ondas de impacto' },
  { id: 'l10', num: '10', name: 'Dark Void Slime Surge', tagline: 'Masa de fluido oscuro violeta que respira y proyecta tentáculos líquidos peristálticos.', badge: 'Dark Slime', svgHighlight: 'Pulso orgánico peristáltico' },
  { id: 'l11', num: '11', name: 'Cryo-Nitrogen Sub-Zero', tagline: 'Fluido criogénico en ebullición helada con estelas de vapor y condensación fluida.', badge: 'Cryo Sub-Zero', svgHighlight: 'Vapor y ebullición fría' },
  { id: 'l12', num: '12', name: 'Radial Mercury Shockwaves', tagline: 'Ondas de choque circulares concéntricas que emanan continuamente desde el centro.', badge: 'Sonar Shockwave', svgHighlight: 'Anillos de choque continuos' },
  { id: 'l13', num: '13', name: 'Hydrodynamic Glass Capsule', tagline: 'Cápsula de cristal con nivel de mercurio líquido que chapotea con inercia hidrodinámica.', badge: 'Glass Capsule', svgHighlight: 'Nivel oleaginoso en vaivén' },
  { id: 'l14', num: '14', name: 'Liquid Plasma Conduit', tagline: 'Conducto translúcido con un río de plasma líquido a hipervelocidad y chispas de ionización.', badge: 'Plasma Conduit', svgHighlight: 'Corriente continua hiperbólica' },
  { id: 'l15', num: '15', name: 'Toxic Hyper-Ooze Drip', tagline: 'Gotas de limo radioactivo ultra-viscoso que gotean, se estiran y retraen en bucle.', badge: 'Hyper-Ooze', svgHighlight: 'Estiramiento y rebote de gota' },
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

      {/* Estilos CSS Keyframes para Animaciones de Fondo Continuas en Hover */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes liquidWave1 {
          0% { transform: translateX(0) scaleY(1); }
          50% { transform: translateX(-25%) scaleY(1.2); }
          100% { transform: translateX(-50%) scaleY(1); }
        }
        @keyframes liquidWave2 {
          0% { transform: translateX(0) scaleY(1.1); }
          50% { transform: translateX(-35%) scaleY(0.9); }
          100% { transform: translateX(-70%) scaleY(1.1); }
        }
        @keyframes orbFloat1 {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(45px, -8px) scale(1.3); }
          66% { transform: translate(90px, 6px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes orbFloat2 {
          0% { transform: translate(0px, 0px) scale(1.1); }
          33% { transform: translate(-55px, 8px) scale(0.85); }
          66% { transform: translate(-30px, -6px) scale(1.25); }
          100% { transform: translate(0px, 0px) scale(1.1); }
        }
        @keyframes orbFloat3 {
          0% { transform: translate(0px, 0px); }
          50% { transform: translate(60px, -12px); }
          100% { transform: translate(0px, 0px); }
        }
        @keyframes magneticSpike {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.8) scaleX(1.1); }
        }
        @keyframes vortexSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bubbleRise {
          0% { transform: translateY(30px) scale(0.6); opacity: 0; }
          20% { opacity: 0.9; }
          80% { opacity: 0.9; }
          100% { transform: translateY(-30px) scale(1.2); opacity: 0; }
        }
        @keyframes shimmerPan {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes mercuryRain {
          0% { transform: translateY(-40px); opacity: 0; }
          20% { opacity: 1; }
          90% { transform: translateY(30px); opacity: 1; }
          100% { transform: translateY(35px) scaleX(2) scaleY(0.2); opacity: 0; }
        }
        @keyframes slimePulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          33% { transform: scale(1.08, 0.92) rotate(2deg); }
          66% { transform: scale(0.94, 1.06) rotate(-2deg); }
        }
        @keyframes shockwaveRipple {
          0% { r: 6px; opacity: 0.9; stroke-width: 3px; }
          100% { r: 90px; opacity: 0; stroke-width: 0.5px; }
        }
        @keyframes capsuleSlosh {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          25% { transform: rotate(2.5deg) translateY(-2px); }
          75% { transform: rotate(-2.5deg) translateY(2px); }
        }
        @keyframes oozeDrip {
          0% { transform: scaleY(0.2) translateY(-10px); }
          40% { transform: scaleY(1.6) translateY(5px); }
          70% { transform: scaleY(2.2) translateY(18px); }
          80% { transform: scaleY(0.4) translateY(24px); opacity: 0; }
          100% { transform: scaleY(0.2) translateY(-10px); opacity: 0; }
        }
        @keyframes causticJitter {
          0% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-3px, 2px) scale(1.02); }
          50% { transform: translate(2px, -3px) scale(0.98); }
          75% { transform: translate(-2px, -1px) scale(1.01); }
          100% { transform: translate(0, 0) scale(1); }
        }
      ` }} />

      {/* Definición de Filtros SVG Gooey y Fluidos */}
      <svg className="absolute w-0 h-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="koda-goo-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="
              1 0 0 0 0  
              0 1 0 0 0  
              0 0 1 0 0  
              0 0 0 20 -9" result="goo" />
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
                  Liquid Lab
                </span>
                <span className="text-slate-600 font-mono">/</span>
                <span className="font-mono text-xs text-slate-400">15 Variaciones de Mercurio Líquido (#10)</span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 hidden md:block">
              Usa <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Alt + ←/→</kbd> para ciclar fluidos.
            </div>
          </div>

          {/* Selector de Píldoras L01 a L15 */}
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
                    ? 'bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 text-slate-950 shadow-[0_0_18px_rgba(255,106,0,0.5)] font-black scale-[1.03]'
                    : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-600 hover:bg-slate-800/80'
                )}
              >
                <span className="opacity-75">{btn.num}</span>
                <span className="truncate max-w-[120px] sm:max-w-none">{btn.name}</span>
              </button>
            ))}
          </div>

          {/* Sub-barra informativa */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400 border-t border-slate-800/40 pt-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/30 text-orange-300 font-bold text-[10px]">
                {activeProposal.badge}
              </span>
              <strong className="text-white">{activeProposal.name}:</strong>
              <span className="text-slate-300 hidden sm:inline">{activeProposal.tagline}</span>
            </div>
            <div className="text-amber-300/90 font-medium">
              Física: {activeProposal.svgHighlight}
            </div>
          </div>

        </div>
      </header>

      {/* Espacio de Lección Principal (Base: Roadmap Fusion HUD) */}
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

              {/* Renderizado del Botón Líquido Activo (L01 a L15) */}
              <div className="space-y-3 pt-2">
                {!checked ? (
                  <div className="w-full">
                    {activeBtnIndex === 0 && <SvgBtn01LiquidChrome disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 1 && <SvgBtn02MoltenMagma disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 2 && <SvgBtn03FerrofluidFlux disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 3 && <SvgBtn04LiquidVortex disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 4 && <SvgBtn05BioluminescentGoo disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 5 && <SvgBtn06QuantumBeads disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 6 && <SvgBtn07MoltenGold disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 7 && <SvgBtn08LiquidCaustics disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 8 && <SvgBtn09MercuryRain disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 9 && <SvgBtn10DarkVoidSlime disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 10 && <SvgBtn11CryoNitrogen disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 11 && <SvgBtn12MercuryShockwave disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 12 && <SvgBtn13HydroCapsule disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 13 && <SvgBtn14PlasmaConduit disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 14 && <SvgBtn15ToxicHyperOoze disabled={!selectedOpt} onClick={() => setChecked(true)} />}
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
   L01 — CHROME LIQUID GOOEY (Metaballs Líquidas en Órbita Continua)
   ========================================================================= */
function SvgBtn01LiquidChrome({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-xl border border-orange-500/60 bg-slate-950 px-6 font-mono text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_0_20px_rgba(255,106,0,0.3)] hover:shadow-[0_0_35px_rgba(255,106,0,0.7)] hover:border-orange-400 transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div 
        className="absolute inset-0 bg-gradient-to-r from-orange-600 via-amber-400 to-orange-500 opacity-90 group-hover:opacity-100 transition-opacity"
        style={{ filter: 'url(#koda-goo-filter)' }}
      >
        <div className="absolute left-[15%] top-[25%] w-10 h-10 rounded-full bg-amber-300" style={{ animation: 'orbFloat1 4s ease-in-out infinite' }} />
        <div className="absolute left-[45%] top-[35%] w-12 h-12 rounded-full bg-orange-500" style={{ animation: 'orbFloat2 5s ease-in-out infinite' }} />
        <div className="absolute left-[70%] top-[20%] w-9 h-9 rounded-full bg-amber-400" style={{ animation: 'orbFloat3 3.5s ease-in-out infinite' }} />
        <div className="absolute left-[30%] bottom-[10%] w-7 h-7 rounded-full bg-orange-400" style={{ animation: 'orbFloat1 6s ease-in-out infinite reverse' }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundSize: '200% 100%', animation: 'shimmerPan 2s linear infinite' }} />

      <div className="relative z-10 flex items-center gap-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-950/20 text-slate-950 shadow-inner group-hover:rotate-45 transition-transform duration-300">
          <Drop className="w-4 h-4 fill-current" />
        </div>
        <span className="tracking-widest font-black text-slate-950 drop-shadow-sm">COMPROBAR RESPUESTA</span>
      </div>

      <kbd className="relative z-10 hidden sm:inline-flex items-center justify-center px-2 py-0.5 rounded border border-slate-950/40 bg-slate-950/20 text-[10px] font-bold text-slate-950 shadow-sm">
        Enter ↵
      </kbd>
    </button>
  );
}

/* =========================================================================
   L02 — MOLTEN SOLAR MAGMA (Olas de Lava Incandescente en Doble Fase)
   ========================================================================= */
function SvgBtn02MoltenMagma({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-xl border border-amber-500/50 bg-slate-950 px-6 font-mono text-xs font-black uppercase tracking-wider text-amber-100 shadow-[0_0_22px_rgba(245,158,11,0.25)] hover:border-amber-400 hover:shadow-[0_0_35px_rgba(255,106,0,0.6)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity duration-300">
        <svg className="absolute -inset-x-[100%] top-0 h-full w-[300%]" preserveAspectRatio="none" viewBox="0 0 1200 60">
          <path
            d="M0,35 C150,15 350,55 600,30 C850,5 1050,45 1200,25 L1200,60 L0,60 Z"
            fill="rgba(255, 106, 0, 0.45)"
            style={{ animation: 'liquidWave1 6s linear infinite' }}
          />
          <path
            d="M0,45 C200,60 400,20 600,45 C800,70 1000,25 1200,50 L1200,60 L0,60 Z"
            fill="rgba(251, 191, 36, 0.35)"
            style={{ animation: 'liquidWave2 4.5s linear infinite' }}
          />
        </svg>
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <Flame className="w-4 h-4 text-orange-400 group-hover:scale-125 group-hover:text-amber-300 transition-all duration-300" />
        <span className="tracking-wider font-black text-white group-hover:text-amber-200 transition-colors">FLUJO DE MAGMA SOLAR</span>
      </div>

      <span className="relative z-10 font-mono text-[10px] px-2 py-0.5 rounded border border-amber-500/50 bg-amber-500/15 text-amber-300">
        MAGMA_ENTER ↵
      </span>
    </button>
  );
}

/* =========================================================================
   L03 — FERROFLUID MAGNETIC FLUX (Agujas Magnéticas de Fluido Negro)
   ========================================================================= */
function SvgBtn03FerrofluidFlux({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-xl border-2 border-slate-700 bg-slate-950 px-6 font-mono text-xs font-black uppercase tracking-wider text-slate-100 shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:border-orange-500 hover:text-orange-400 hover:shadow-[0_0_30px_rgba(255,106,0,0.4)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div className="absolute inset-x-0 top-0 h-3 flex justify-around pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={`top-${i}`}
            className="w-1.5 h-3 bg-gradient-to-b from-orange-500 to-transparent rounded-b-full origin-top"
            style={{
              animation: `magneticSpike ${1.2 + (i % 5) * 0.2}s ease-in-out infinite ${(i % 3) * 0.15}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 h-3 flex justify-around pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={`bot-${i}`}
            className="w-1.5 h-3 bg-gradient-to-t from-orange-500 to-transparent rounded-t-full origin-bottom"
            style={{
              animation: `magneticSpike ${1.4 + (i % 4) * 0.2}s ease-in-out infinite ${(i % 4) * 0.12}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <Atom className="w-4 h-4 text-orange-400 group-hover:rotate-180 transition-transform duration-700" />
        <span className="tracking-widest">FERROFLUIDO POLAR</span>
      </div>

      <span className="relative z-10 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 bg-slate-900 text-slate-300 group-hover:border-orange-500 group-hover:text-orange-300">
        PULSE_FLUX ↵
      </span>
    </button>
  );
}

/* =========================================================================
   L04 — DEEP SPACE LIQUID VORTEX (Remolino de Plasma Vorticial Continuo)
   ========================================================================= */
function SvgBtn04LiquidVortex({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-xl border border-cyan-500/40 bg-slate-950 px-6 font-mono text-xs font-black uppercase tracking-wider text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 group-hover:opacity-80 transition-opacity">
        <div 
          className="w-48 h-48 rounded-full bg-[conic-gradient(from_0deg,#06B6D4,#FF6A00,#3B82F6,#06B6D4)] blur-lg opacity-60"
          style={{ animation: 'vortexSpin 6s linear infinite' }}
        />
        <svg viewBox="0 0 100 100" className="absolute w-28 h-28 opacity-80" style={{ animation: 'vortexSpin 4s linear infinite reverse' }}>
          <path d="M50,10 A40,40 0 0,1 90,50 A40,40 0 0,1 50,90 A40,40 0 0,1 10,50" fill="none" stroke="#06B6D4" strokeWidth="2" strokeDasharray="12,6" />
          <path d="M50,25 A25,25 0 0,1 75,50 A25,25 0 0,1 50,75 A25,25 0 0,1 25,50" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="6,4" />
        </svg>
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <CircleNotch className="w-4 h-4 text-cyan-400 animate-spin" />
        <span className="tracking-widest font-black text-white">VÓRTICE CENTRÍPETO</span>
      </div>

      <span className="relative z-10 text-[10px] font-mono border border-cyan-500/50 bg-cyan-500/10 px-2 py-0.5 rounded text-cyan-300">
        VORTEX_ENTER ↵
      </span>
    </button>
  );
}

/* =========================================================================
   L05 — BIOLUMINESCENT ABYSS GOO (Gotas que Ascienden en Flotabilidad Infinita)
   ========================================================================= */
function SvgBtn05BioluminescentGoo({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-xl border border-emerald-500/40 bg-slate-950 px-6 font-mono text-xs font-black uppercase tracking-wider text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:border-emerald-400 hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 group-hover:opacity-100 transition-opacity">
        <div className="absolute left-[12%] bottom-0 w-4 h-4 rounded-full bg-emerald-400 blur-[1px]" style={{ animation: 'bubbleRise 3s ease-in-out infinite' }} />
        <div className="absolute left-[28%] bottom-0 w-6 h-6 rounded-full bg-cyan-400 blur-[1.5px]" style={{ animation: 'bubbleRise 4.2s ease-in-out infinite 0.7s' }} />
        <div className="absolute left-[52%] bottom-0 w-3 h-3 rounded-full bg-emerald-300 blur-[1px]" style={{ animation: 'bubbleRise 2.5s ease-in-out infinite 1.2s' }} />
        <div className="absolute left-[72%] bottom-0 w-5 h-5 rounded-full bg-teal-400 blur-[1.5px]" style={{ animation: 'bubbleRise 3.8s ease-in-out infinite 0.3s' }} />
        <div className="absolute left-[88%] bottom-0 w-4 h-4 rounded-full bg-emerald-400 blur-[1px]" style={{ animation: 'bubbleRise 3.2s ease-in-out infinite 1.8s' }} />
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <Sparkle className="w-4 h-4 text-emerald-400 group-hover:scale-125 transition-transform" />
        <span className="tracking-widest font-black text-white">LIMO BIOLUMINISCENTE</span>
      </div>

      <span className="relative z-10 text-[10px] font-mono border border-emerald-500/50 bg-emerald-500/15 px-2 py-0.5 rounded text-emerald-300">
        BIO_VERIFY ↵
      </span>
    </button>
  );
}

/* =========================================================================
   L06 — QUANTUM MERCURY BEADS (Microgotas en Colisión y Fusión Elástica)
   ========================================================================= */
function SvgBtn06QuantumBeads({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-xl border border-orange-500/50 bg-slate-950 px-6 font-mono text-xs font-black uppercase tracking-wider text-orange-200 shadow-[0_0_20px_rgba(255,106,0,0.25)] hover:border-orange-400 hover:shadow-[0_0_35px_rgba(255,106,0,0.6)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div 
        className="absolute inset-0 flex items-center pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"
        style={{ filter: 'url(#koda-goo-filter)' }}
      >
        <div className="absolute left-[10%] w-7 h-7 rounded-full bg-orange-500 shadow-lg" style={{ animation: 'orbFloat1 3s ease-in-out infinite' }} />
        <div className="absolute left-[30%] w-8 h-8 rounded-full bg-amber-400 shadow-lg" style={{ animation: 'orbFloat2 4s ease-in-out infinite' }} />
        <div className="absolute left-[50%] w-6 h-6 rounded-full bg-orange-600 shadow-lg" style={{ animation: 'orbFloat1 3.5s ease-in-out infinite 0.5s' }} />
        <div className="absolute left-[70%] w-8 h-8 rounded-full bg-amber-300 shadow-lg" style={{ animation: 'orbFloat3 4.2s ease-in-out infinite 1s' }} />
        <div className="absolute left-[85%] w-7 h-7 rounded-full bg-orange-500 shadow-lg" style={{ animation: 'orbFloat2 3.8s ease-in-out infinite 0.3s' }} />
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <Atom className="w-4 h-4 text-amber-400 group-hover:rotate-90 transition-transform duration-500" />
        <span className="tracking-widest font-black text-white">COLISIÓN DE GOTAS HG</span>
      </div>

      <kbd className="relative z-10 hidden sm:inline-flex items-center justify-center px-2 py-0.5 rounded border border-orange-500/50 bg-orange-500/15 text-[10px] font-bold text-orange-300">
        Enter ↵
      </kbd>
    </button>
  );
}

/* =========================================================================
   L07 — MOLTEN GOLD VISCOSITY (Parallax de Fluidos de Oro 24K)
   ========================================================================= */
function SvgBtn07MoltenGold({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-xl border border-yellow-500/60 bg-gradient-to-r from-amber-950/80 via-slate-950 to-amber-950/80 px-6 font-mono text-xs font-black uppercase tracking-wider text-yellow-300 shadow-[0_0_22px_rgba(234,179,8,0.25)] hover:border-yellow-400 hover:shadow-[0_0_35px_rgba(234,179,8,0.6)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div className="absolute inset-0 pointer-events-none opacity-50 group-hover:opacity-90 transition-opacity">
        <svg className="absolute -inset-x-[100%] top-0 h-full w-[300%]" preserveAspectRatio="none" viewBox="0 0 1200 60">
          <path
            d="M0,20 Q300,5 600,25 T1200,20 L1200,60 L0,60 Z"
            fill="rgba(234, 179, 8, 0.4)"
            style={{ animation: 'liquidWave1 8s ease-in-out infinite' }}
          />
          <path
            d="M0,35 Q300,50 600,30 T1200,35 L1200,60 L0,60 Z"
            fill="rgba(251, 191, 36, 0.5)"
            style={{ animation: 'liquidWave2 5.5s ease-in-out infinite' }}
          />
        </svg>
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <ShieldCheck className="w-4 h-4 text-yellow-400" />
        <span className="tracking-widest font-black text-white">ORO FUNDIDO 24K</span>
      </div>

      <span className="relative z-10 text-[10px] font-mono border border-yellow-500/50 bg-yellow-500/20 px-2 py-0.5 rounded text-yellow-200">
        GOLD_CONFIRM ↵
      </span>
    </button>
  );
}

/* =========================================================================
   L08 — LIQUID CAUSTIC INTERFERENCE (Turbulencia Cáustica Submarina)
   ========================================================================= */
function SvgBtn08LiquidCaustics({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-xl border border-cyan-400/50 bg-slate-950 px-6 font-mono text-xs font-black uppercase tracking-wider text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:border-cyan-300 hover:shadow-[0_0_35px_rgba(34,211,238,0.5)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div 
        className="absolute inset-0 bg-gradient-to-r from-cyan-600/30 via-teal-500/40 to-blue-600/30 opacity-40 group-hover:opacity-100 transition-opacity"
        style={{ animation: 'causticJitter 2s ease-in-out infinite' }}
      >
        <svg className="w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
          <pattern id="caustic-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="8" fill="none" stroke="#22D3EE" strokeWidth="0.8" strokeOpacity="0.6" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#caustic-grid)" />
        </svg>
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <Waves className="w-4 h-4 text-cyan-300 group-hover:rotate-12 transition-transform" />
        <span className="tracking-widest font-black text-white">INTERFERENCIA CÁUSTICA</span>
      </div>

      <span className="relative z-10 text-[10px] font-mono border border-cyan-400/50 bg-cyan-400/10 px-2 py-0.5 rounded text-cyan-200">
        CAUSTIC_RUN ↵
      </span>
    </button>
  );
}

/* =========================================================================
   L09 — MERCURY RAIN & SPLASH POOL (Lluvia de Gotas y Estanque de Salpicaduras)
   ========================================================================= */
function SvgBtn09MercuryRain({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-xl border border-orange-500/50 bg-slate-950 px-6 font-mono text-xs font-black uppercase tracking-wider text-orange-200 shadow-[0_0_20px_rgba(255,106,0,0.25)] hover:border-orange-400 hover:shadow-[0_0_35px_rgba(255,106,0,0.6)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 group-hover:opacity-90 transition-opacity">
        <div className="absolute left-[18%] w-1.5 h-3 rounded-full bg-amber-300" style={{ animation: 'mercuryRain 1.4s linear infinite' }} />
        <div className="absolute left-[38%] w-2 h-4 rounded-full bg-orange-400" style={{ animation: 'mercuryRain 1.8s linear infinite 0.4s' }} />
        <div className="absolute left-[62%] w-1.5 h-3 rounded-full bg-amber-400" style={{ animation: 'mercuryRain 1.2s linear infinite 0.7s' }} />
        <div className="absolute left-[82%] w-2 h-4 rounded-full bg-orange-300" style={{ animation: 'mercuryRain 1.6s linear infinite 0.2s' }} />
        <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-t from-orange-500/60 to-transparent" />
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <Drop className="w-4 h-4 text-orange-400 group-hover:translate-y-1 transition-transform" />
        <span className="tracking-widest font-black text-white">LLUVIA & SALPICADURA</span>
      </div>

      <span className="relative z-10 text-[10px] font-mono border border-orange-500/50 bg-orange-500/20 px-2 py-0.5 rounded text-orange-300">
        DROP_ENTER ↵
      </span>
    </button>
  );
}

/* =========================================================================
   L10 — DARK VOID SLIME SURGE (Masa Oscura Peristáltica con Pulso)
   ========================================================================= */
function SvgBtn10DarkVoidSlime({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-xl border border-violet-500/50 bg-slate-950 px-6 font-mono text-xs font-black uppercase tracking-wider text-violet-200 shadow-[0_0_20px_rgba(139,92,246,0.25)] hover:border-violet-400 hover:shadow-[0_0_35px_rgba(139,92,246,0.6)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div 
        className="absolute inset-0 bg-gradient-to-r from-violet-900/60 via-fuchsia-950/40 to-slate-950 opacity-50 group-hover:opacity-100 transition-opacity"
        style={{ animation: 'slimePulse 4s ease-in-out infinite' }}
      >
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-24 h-16 rounded-full bg-violet-600/40 blur-md" />
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-24 h-16 rounded-full bg-fuchsia-600/40 blur-md" />
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <Sparkle className="w-4 h-4 text-violet-400 group-hover:scale-125 transition-transform" />
        <span className="tracking-widest font-black text-white">LIMO DEL VACÍO ESTELAR</span>
      </div>

      <span className="relative z-10 text-[10px] font-mono border border-violet-500/50 bg-violet-500/20 px-2 py-0.5 rounded text-violet-300">
        VOID_SURGE ↵
      </span>
    </button>
  );
}

/* =========================================================================
   L11 — CRYO-NITROGEN SUB-ZERO (Fluido Criogénico en Ebullición Helada)
   ========================================================================= */
function SvgBtn11CryoNitrogen({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-xl border border-sky-400/50 bg-slate-950 px-6 font-mono text-xs font-black uppercase tracking-wider text-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.2)] hover:border-sky-300 hover:shadow-[0_0_35px_rgba(56,189,248,0.55)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-90 transition-opacity">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 via-cyan-400/30 to-sky-500/20" />
        <div className="absolute left-[20%] top-0 bottom-0 w-12 bg-white/10 blur-md" style={{ animation: 'liquidWave1 4s ease-in-out infinite' }} />
        <div className="absolute left-[60%] top-0 bottom-0 w-16 bg-sky-300/10 blur-lg" style={{ animation: 'liquidWave2 5s ease-in-out infinite' }} />
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <Sparkle className="w-4 h-4 text-sky-300 group-hover:rotate-90 transition-transform" />
        <span className="tracking-widest font-black text-white">NITRÓGENO CRIOGÉNICO</span>
      </div>

      <span className="relative z-10 text-[10px] font-mono border border-sky-400/50 bg-sky-400/20 px-2 py-0.5 rounded text-sky-200">
        CRYO_ZERO ↵
      </span>
    </button>
  );
}

/* =========================================================================
   L12 — RADIAL MERCURY SHOCKWAVES (Ondas Concéntricas de Choque)
   ========================================================================= */
function SvgBtn12MercuryShockwave({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-xl border border-amber-500/50 bg-slate-950 px-6 font-mono text-xs font-black uppercase tracking-wider text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:border-amber-400 hover:shadow-[0_0_35px_rgba(255,106,0,0.6)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 group-hover:opacity-100 transition-opacity" viewBox="0 0 300 60">
        <circle cx="150" cy="30" r="10" fill="none" stroke="#FF6A00" style={{ animation: 'shockwaveRipple 2.5s cubic-bezier(0.1, 0.8, 0.3, 1) infinite' }} />
        <circle cx="150" cy="30" r="10" fill="none" stroke="#FBBF24" style={{ animation: 'shockwaveRipple 2.5s cubic-bezier(0.1, 0.8, 0.3, 1) infinite 0.8s' }} />
        <circle cx="150" cy="30" r="10" fill="none" stroke="#F97316" style={{ animation: 'shockwaveRipple 2.5s cubic-bezier(0.1, 0.8, 0.3, 1) infinite 1.6s' }} />
      </svg>

      <div className="relative z-10 flex items-center gap-3">
        <Target className="w-4 h-4 text-amber-400 group-hover:scale-125 transition-transform" />
        <span className="tracking-widest font-black text-white">ONDA DE CHOQUE MERCURIO</span>
      </div>

      <span className="relative z-10 text-[10px] font-mono border border-amber-500/50 bg-amber-500/20 px-2 py-0.5 rounded text-amber-300">
        SHOCK_WAVE ↵
      </span>
    </button>
  );
}

/* =========================================================================
   L13 — HYDRODYNAMIC GLASS CAPSULE (Cápsula de Cristal en Vaivén)
   ========================================================================= */
function SvgBtn13HydroCapsule({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-xl border-2 border-orange-500/40 bg-slate-950/90 px-6 font-mono text-xs font-black uppercase tracking-wider text-orange-200 shadow-[0_0_20px_rgba(255,106,0,0.2)] hover:border-orange-400 hover:shadow-[0_0_35px_rgba(255,106,0,0.6)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div 
        className="absolute inset-0 bg-gradient-to-t from-orange-600/70 via-amber-500/40 to-transparent pointer-events-none opacity-40 group-hover:opacity-90 transition-opacity"
        style={{ animation: 'capsuleSlosh 3s ease-in-out infinite' }}
      >
        <div className="absolute inset-x-0 top-1/3 h-0.5 bg-amber-300/60 shadow-[0_0_8px_#FBBF24]" />
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <Drop className="w-4 h-4 text-amber-300" />
        <span className="tracking-widest font-black text-white">CÁPSULA HIDRODINÁMICA</span>
      </div>

      <span className="relative z-10 text-[10px] font-mono border border-orange-500/50 bg-orange-500/20 px-2 py-0.5 rounded text-orange-300">
        SLOSH_ENTER ↵
      </span>
    </button>
  );
}

/* =========================================================================
   L14 — LIQUID PLASMA CONDUIT (Conducto con Río de Plasma a Hipervelocidad)
   ========================================================================= */
function SvgBtn14PlasmaConduit({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-xl border border-rose-500/50 bg-slate-950 px-6 font-mono text-xs font-black uppercase tracking-wider text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.2)] hover:border-rose-400 hover:shadow-[0_0_35px_rgba(244,63,94,0.6)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div 
        className="absolute inset-0 bg-gradient-to-r from-rose-600 via-orange-500 to-rose-600 opacity-40 group-hover:opacity-90 transition-opacity"
        style={{
          backgroundSize: '200% 100%',
          animation: 'shimmerPan 1.5s linear infinite',
        }}
      />

      <div className="relative z-10 flex items-center gap-3">
        <Lightning className="w-4 h-4 text-rose-400 group-hover:text-amber-300 transition-colors" />
        <span className="tracking-widest font-black text-white">CONDUCTO DE PLASMA</span>
      </div>

      <span className="relative z-10 text-[10px] font-mono border border-rose-500/50 bg-rose-500/20 px-2 py-0.5 rounded text-rose-300">
        PLASMA_FIRE ↵
      </span>
    </button>
  );
}

/* =========================================================================
   L15 — TOXIC HYPER-OOZE DRIP (Limo Radioactivo con Estiramiento y Rebote)
   ========================================================================= */
function SvgBtn15ToxicHyperOoze({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-xl border border-lime-500/50 bg-slate-950 px-6 font-mono text-xs font-black uppercase tracking-wider text-lime-200 shadow-[0_0_20px_rgba(132,204,22,0.2)] hover:border-lime-400 hover:shadow-[0_0_35px_rgba(132,204,22,0.6)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
        <div className="absolute left-[15%] top-0 w-3 h-8 bg-lime-400 rounded-b-full origin-top" style={{ animation: 'oozeDrip 2.2s ease-in-out infinite' }} />
        <div className="absolute left-[40%] top-0 w-4 h-10 bg-amber-400 rounded-b-full origin-top" style={{ animation: 'oozeDrip 2.8s ease-in-out infinite 0.6s' }} />
        <div className="absolute left-[70%] top-0 w-3 h-7 bg-lime-300 rounded-b-full origin-top" style={{ animation: 'oozeDrip 2.0s ease-in-out infinite 1.1s' }} />
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <Drop className="w-4 h-4 text-lime-400 group-hover:rotate-180 transition-transform duration-500" />
        <span className="tracking-widest font-black text-white">LIMO TÓXICO RADIOACTIVO</span>
      </div>

      <span className="relative z-10 text-[10px] font-mono border border-lime-500/50 bg-lime-500/20 px-2 py-0.5 rounded text-lime-300">
        OOZE_CONFIRM ↵
      </span>
    </button>
  );
}

export default WorkspaceLab;
