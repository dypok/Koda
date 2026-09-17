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
  { id: 'b01', num: '01', name: 'Quantum Circuit PCB', tagline: 'Pistas de circuito impreso dorado con corriente eléctrica vectorial en dashoffset.', badge: 'Hardware PCB', svgHighlight: 'Circuito integrado + pulsos' },
  { id: 'b02', num: '02', name: 'Cyber Hexagon Mesh', tagline: 'Malla hexagonal con esquinas biseladas 45°, retícula HUD y scanlines cruzadas.', badge: 'Hex Matrix', svgHighlight: 'Panal reactivo + retícula' },
  { id: 'b03', num: '03', name: 'Arc Reactor Core', tagline: 'Anillos concéntricos dentados en contrarrotación magnética y núcleo de plasma.', badge: 'Fusion Core', svgHighlight: 'Engranajes vectoriales duales' },
  { id: 'b04', num: '04', name: 'Solar Flare Waveform', tagline: 'Curva sinusoidal Bézier interactiva que modula amplitud y frecuencia de audio.', badge: 'Audio Synth', svgHighlight: 'Osciloscopio espectral' },
  { id: 'b05', num: '05', name: 'Origami Fox Matrix', tagline: 'Máscara geométrica Low-Poly de Koda 🦊 con polígonos que se encienden.', badge: 'Koda Vector', svgHighlight: 'Facetado 3D origami' },
  { id: 'b06', num: '06', name: 'Isometric Tesseract', tagline: 'Hipercubo isométrico 3D flotante que se descompone en capas holográficas.', badge: 'Holo 3D', svgHighlight: 'Proyección isométrica' },
  { id: 'b07', num: '07', name: 'Constellation Gate', tagline: 'Mapa estelar orbital kepleriano con glifos y nebulosa de partículas doradas.', badge: 'Astro Star', svgHighlight: 'Órbitas elípticas trazadas' },
  { id: 'b08', num: '08', name: 'Hydraulic Mech Clamp', tagline: 'Pistones mecatrónicos vectoriales y placas de titanio angulares con compresión.', badge: 'Heavy Mech', svgHighlight: 'Pistones + pernos' },
  { id: 'b09', num: '09', name: 'Neural Synapse Graph', tagline: 'Red neuronal con propagación de pesos sinápticos que viajan al centro [Enter].', badge: 'AI Synapse', svgHighlight: 'Nodos + axones activos' },
  { id: 'b10', num: '10', name: 'Liquid Mercury Morph', tagline: 'Gotas de metal líquido fundido (SVG Gooey Filter) que se atraen y estiran.', badge: 'Liquid Metal', svgHighlight: 'Filtro SVG feGaussianBlur' },
  { id: 'b11', num: '11', name: 'Tachometer Redline', tagline: 'Tacómetro de competición con aguja analógica que se dispara a 9.000 RPM.', badge: 'Telemetry RPM', svgHighlight: 'Arco graduado 180°' },
  { id: 'b12', num: '12', name: 'Radar Sweep Sonar', tagline: 'Pantalla de sonar orbital 360° con haz giratorio y detección de objetivo.', badge: 'Sonar 360°', svgHighlight: 'Haz giratorio continuo' },
  { id: 'b13', num: '13', name: 'Bioluminescent Abyss', tagline: 'Filamentos de fibra óptica orgánica con pulsos de luz abisal cian/ámbar.', badge: 'Bio Abyss', svgHighlight: 'Tentáculos y gradientes' },
  { id: 'b14', num: '14', name: 'Prism Crystal Flare', tagline: 'Facetas de cristal reflectante con refracción y dispersión espectral de luz.', badge: 'Prism Glass', svgHighlight: 'Geometría refractiva' },
  { id: 'b15', num: '15', name: 'Matrix Data Stream', tagline: 'Cascada vertical de glifos de código binario y lambdas que se solidifican.', badge: 'Binary Rain', svgHighlight: 'Rieles de código de flujo' },
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
                  Button Lab
                </span>
                <span className="text-slate-600 font-mono">/</span>
                <span className="font-mono text-xs text-slate-400">15 Propuestas SVG Complejas</span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 hidden md:block">
              Usa <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Alt + ←/→</kbd> para ciclar botones rápidamente.
            </div>
          </div>

          {/* Carrusel/Grid Compacto de Píldoras B01 a B15 */}
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

            {/* Columna Derecha: Práctica & Los 15 Botones SVG */}
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

              {/* Renderizado del Botón SVG Activo (B01 a B15) */}
              <div className="space-y-3 pt-2">
                {!checked ? (
                  <div className="w-full">
                    {activeBtnIndex === 0 && <SvgBtn01QuantumPCB disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 1 && <SvgBtn02HexagonMesh disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 2 && <SvgBtn03ArcReactor disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 3 && <SvgBtn04SolarWaveform disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 4 && <SvgBtn05OrigamiFox disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 5 && <SvgBtn06IsometricTesseract disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 6 && <SvgBtn07ConstellationGate disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 7 && <SvgBtn08HydraulicMech disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 8 && <SvgBtn09NeuralSynapse disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 9 && <SvgBtn10LiquidMercury disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 10 && <SvgBtn11TachometerRedline disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 11 && <SvgBtn12RadarSonar disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 12 && <SvgBtn13BioluminescentAbyss disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 13 && <SvgBtn14PrismCrystal disabled={!selectedOpt} onClick={() => setChecked(true)} />}
                    {activeBtnIndex === 14 && <SvgBtn15MatrixStream disabled={!selectedOpt} onClick={() => setChecked(true)} />}
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
   B01 — QUANTUM CIRCUIT PCB (Placa de Circuito Impreso con Pistas Vectoriales)
   ========================================================================= */
function SvgBtn01QuantumPCB({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[52px] w-full items-center justify-between overflow-hidden rounded-xl border border-amber-500/50 bg-slate-950 px-5 font-mono text-xs font-bold text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {/* SVG Circuit Tracks Background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-300" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,26 L60,26 L80,10 L180,10 L200,26 L360,26 L380,42 L500,42" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4,6" className="group-hover:animate-[dash_1.5s_linear_infinite]" />
        <path d="M40,52 L120,52 L140,36 L240,36 L260,52 L450,52" fill="none" stroke="#F97316" strokeWidth="1" strokeDasharray="3,5" />
        <circle cx="80" cy="10" r="3" fill="#FBBF24" />
        <circle cx="200" cy="26" r="3" fill="#FBBF24" />
        <circle cx="380" cy="42" r="3" fill="#FBBF24" />
      </svg>

      <div className="relative z-10 flex items-center gap-2.5">
        <Cpu className="w-4 h-4 text-amber-400 group-hover:rotate-90 transition-transform duration-500" />
        <span className="uppercase tracking-wider">COMPROBAR ORDEN [PCB]</span>
      </div>

      <div className="relative z-10 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 group-hover:animate-ping" />
        <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-amber-500/50 bg-amber-500/10 text-[10px] text-amber-200">
          Enter ↵
        </kbd>
      </div>
    </button>
  );
}

/* =========================================================================
   B02 — CYBER HEXAGON MESH (Panal Hexagonal Biselado con Scanline HUD)
   ========================================================================= */
function SvgBtn02HexagonMesh({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[52px] w-full items-center justify-between overflow-hidden rounded-xl border border-orange-500/60 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-6 font-mono text-xs font-black uppercase tracking-widest text-orange-400 shadow-[0_0_18px_rgba(255,106,0,0.2)] hover:border-orange-400 hover:text-white hover:shadow-[0_0_28px_rgba(255,106,0,0.5)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      {/* SVG Hexagon Pattern */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25 group-hover:opacity-60 transition-opacity" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hex-pattern" width="16" height="27.7" patternUnits="userSpaceOnUse">
            <path d="M8 0 L16 4.6 L16 13.9 L8 18.5 L0 13.9 L0 4.6 Z M0 27.7 L8 23.1 L16 27.7" fill="none" stroke="#FF6A00" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex-pattern)" />
      </svg>

      <span className="relative z-10 flex items-center gap-2">
        <Target className="w-4 h-4 text-orange-400 group-hover:rotate-180 transition-transform duration-500" />
        <span>VERIFICAR RETÍCULA HEX</span>
      </span>

      <span className="relative z-10 font-mono text-[10px] px-2 py-0.5 rounded border border-orange-500/60 bg-orange-500/20 text-orange-200">
        [ 0x01_ENTER ]
      </span>
    </button>
  );
}

/* =========================================================================
   B03 — ARC REACTOR CORE (Núcleo Arc con Anillos Dentados en Contrarrotación)
   ========================================================================= */
function SvgBtn03ArcReactor({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-xl border border-cyan-500/40 bg-slate-950 px-6 font-mono text-xs font-bold text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div className="relative z-10 flex items-center gap-3">
        {/* SVG Arc Reactor Gears */}
        <div className="relative h-7 w-7 shrink-0">
          <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full group-hover:animate-spin" style={{ animationDuration: '4s' }}>
            <circle cx="20" cy="20" r="16" fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="6,4" />
          </svg>
          <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full group-hover:animate-[spin_3s_linear_infinite_reverse]">
            <circle cx="20" cy="20" r="10" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3,3" />
          </svg>
          <div className="absolute inset-2.5 rounded-full bg-cyan-400/30 group-hover:bg-cyan-400 shadow-[0_0_10px_#06B6D4] transition-colors" />
        </div>
        <span className="uppercase tracking-wider font-black text-white">IGNICIÓN ARC REACTOR</span>
      </div>

      <span className="relative z-10 font-mono text-[10px] text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded bg-cyan-950/40">
        [ENTER ↵]
      </span>
    </button>
  );
}

/* =========================================================================
   B04 — SOLAR FLARE WAVEFORM (Onda Sinusoidal Bézier Audio/Energía)
   ========================================================================= */
function SvgBtn04SolarWaveform({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[52px] w-full items-center justify-between overflow-hidden rounded-xl border border-amber-500/50 bg-gradient-to-r from-amber-950/40 via-slate-950 to-orange-950/40 px-6 font-mono text-xs font-bold text-amber-200 shadow-[0_0_18px_rgba(245,158,11,0.2)] hover:border-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      {/* SVG Sine Waves Animated */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 group-hover:opacity-90 transition-opacity" viewBox="0 0 400 50" preserveAspectRatio="none">
        <path d="M0,25 Q50,5 100,25 T200,25 T300,25 T400,25" fill="none" stroke="#F59E0B" strokeWidth="2" className="group-hover:stroke-amber-300 transition-colors" />
        <path d="M0,25 Q50,45 100,25 T200,25 T300,25 T400,25" fill="none" stroke="#FF6A00" strokeWidth="1.5" opacity="0.6" />
      </svg>

      <span className="relative z-10 font-black uppercase tracking-wider text-white">
        MODULACIÓN SINTÉTICA
      </span>

      <span className="relative z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] text-amber-300 font-mono">
        <Lightning className="w-3.5 h-3.5 text-amber-400" />
        <span>RUN [↵]</span>
      </span>
    </button>
  );
}

/* =========================================================================
   B05 — ORIGAMI FOX MATRIX (Máscara Vectorial Geométrica de Koda 🦊)
   ========================================================================= */
function SvgBtn05OrigamiFox({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[54px] w-full items-center justify-between overflow-hidden rounded-xl border border-orange-500/70 bg-gradient-to-r from-orange-600 to-amber-500 px-6 font-mono text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_0_22px_rgba(255,106,0,0.4)] hover:brightness-115 hover:scale-[1.01] transition-all duration-200 cursor-pointer disabled:opacity-40"
    >
      <div className="flex items-center gap-3">
        {/* SVG Low-Poly Fox Mask */}
        <svg viewBox="0 0 32 32" className="w-6 h-6 shrink-0 fill-slate-950 group-hover:scale-110 transition-transform">
          <polygon points="16,2 8,14 16,18 24,14" />
          <polygon points="8,14 2,22 16,30 16,18" />
          <polygon points="24,14 30,22 16,30 16,18" />
          <polygon points="8,14 16,18 16,2" fill="#FFE8C8" />
          <polygon points="24,14 16,18 16,2" fill="#FFC078" />
        </svg>
        <span className="text-slate-950 font-black tracking-widest">COMPROBAR CON KODA 🦊</span>
      </div>

      <kbd className="hidden sm:inline-flex items-center justify-center px-2 py-0.5 rounded border border-slate-950/40 bg-slate-950/15 text-[10px] font-bold text-slate-950">
        Enter ↵
      </kbd>
    </button>
  );
}

/* =========================================================================
   B06 — ISOMETRIC TESSERACT (Hipercubo Isométrico 3D en Capas)
   ========================================================================= */
function SvgBtn06IsometricTesseract({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[52px] w-full items-center justify-between overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/90 px-6 font-mono text-xs font-bold text-slate-200 shadow-xl hover:border-amber-400 hover:text-amber-200 hover:shadow-[0_0_25px_rgba(251,191,36,0.3)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div className="flex items-center gap-3">
        {/* SVG Isometric Cube */}
        <svg viewBox="0 0 30 30" className="w-5 h-5 shrink-0 group-hover:rotate-45 transition-transform duration-500">
          <polygon points="15,2 27,9 15,16 3,9" fill="#F59E0B" fillOpacity="0.8" />
          <polygon points="3,9 15,16 15,28 3,21" fill="#D97706" fillOpacity="0.6" />
          <polygon points="27,9 15,16 15,28 27,21" fill="#B45309" fillOpacity="0.9" />
        </svg>
        <span className="uppercase tracking-wider font-mono font-bold">DESPLEGAR HIPERCUBO</span>
      </div>

      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 group-hover:border-amber-400/50 group-hover:text-amber-300">
        [ 3D_ENTER ]
      </span>
    </button>
  );
}

/* =========================================================================
   B07 — CONSTELLATION GATE (Portal Estelar Kepleriano con Órbitas Elípticas)
   ========================================================================= */
function SvgBtn07ConstellationGate({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[52px] w-full items-center justify-between overflow-hidden rounded-xl border border-amber-500/40 bg-slate-950 px-6 font-mono text-xs font-bold text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:border-amber-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      {/* SVG Kepler Orbit Ellipses */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 group-hover:opacity-80 transition-opacity" viewBox="0 0 300 60">
        <ellipse cx="150" cy="30" rx="130" ry="22" fill="none" stroke="#FBBF24" strokeWidth="1" strokeDasharray="5,4" className="group-hover:animate-[spin_10s_linear_infinite]" />
        <ellipse cx="150" cy="30" rx="90" ry="14" fill="none" stroke="#F97316" strokeWidth="1" />
        <circle cx="50" cy="20" r="2" fill="#FFF" />
        <circle cx="220" cy="38" r="2.5" fill="#FBBF24" />
      </svg>

      <span className="relative z-10 flex items-center gap-2 font-black uppercase tracking-wider text-white">
        <Sparkle className="w-4 h-4 text-amber-400" />
        <span>TRANSMISIÓN KEPLER</span>
      </span>

      <span className="relative z-10 text-[10px] font-mono border border-amber-500/50 bg-amber-500/10 px-2 py-0.5 rounded text-amber-300">
        GLYPH_ENTER ↵
      </span>
    </button>
  );
}

/* =========================================================================
   B08 — HYDRAULIC MECH CLAMP (Pistones Mecatrónicos y Blindaje Pesado)
   ========================================================================= */
function SvgBtn08HydraulicMech({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[52px] w-full items-center justify-between overflow-hidden rounded-xl border-2 border-slate-700 bg-slate-900 px-6 font-mono text-xs font-black uppercase tracking-widest text-slate-100 shadow-xl hover:border-orange-500 hover:text-orange-400 hover:shadow-[0_0_25px_rgba(255,106,0,0.35)] transition-all duration-200 cursor-pointer disabled:opacity-40"
    >
      {/* SVG Mech Bolts & Pistones */}
      <svg className="absolute left-2 top-0 bottom-0 w-6 h-full pointer-events-none" viewBox="0 0 20 50">
        <circle cx="10" cy="12" r="3" fill="#64748B" />
        <circle cx="10" cy="38" r="3" fill="#64748B" />
        <line x1="10" y1="15" x2="10" y2="35" stroke="#475569" strokeWidth="2" />
      </svg>

      <svg className="absolute right-2 top-0 bottom-0 w-6 h-full pointer-events-none" viewBox="0 0 20 50">
        <circle cx="10" cy="12" r="3" fill="#64748B" />
        <circle cx="10" cy="38" r="3" fill="#64748B" />
        <line x1="10" y1="15" x2="10" y2="35" stroke="#475569" strokeWidth="2" />
      </svg>

      <span className="ml-4 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-orange-400" />
        <span>PINZA HIDRÁULICA [MECH]</span>
      </span>

      <span className="mr-4 text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 group-hover:border-orange-500/50 group-hover:text-orange-300">
        LOCK_ENTER
      </span>
    </button>
  );
}

/* =========================================================================
   B09 — NEURAL SYNAPSE GRAPH (Red Neuronal con Axones y Pesos Vectoriales)
   ========================================================================= */
function SvgBtn09NeuralSynapse({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[52px] w-full items-center justify-between overflow-hidden rounded-xl border border-violet-500/40 bg-gradient-to-r from-slate-950 via-violet-950/30 to-slate-950 px-6 font-mono text-xs font-bold text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:border-violet-400 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      {/* SVG Neural Graph */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 group-hover:opacity-90 transition-opacity" viewBox="0 0 350 50">
        <line x1="20" y1="15" x2="90" y2="35" stroke="#A78BFA" strokeWidth="1" />
        <line x1="20" y1="35" x2="90" y2="15" stroke="#A78BFA" strokeWidth="1" />
        <line x1="90" y1="35" x2="180" y2="25" stroke="#F59E0B" strokeWidth="1.5" />
        <line x1="180" y1="25" x2="280" y2="25" stroke="#F97316" strokeWidth="1.5" strokeDasharray="4,4" className="group-hover:animate-[dash_1s_linear_infinite]" />
        <circle cx="20" cy="15" r="3" fill="#C4B5FD" />
        <circle cx="20" cy="35" r="3" fill="#C4B5FD" />
        <circle cx="90" cy="35" r="3.5" fill="#FBBF24" />
        <circle cx="180" cy="25" r="4" fill="#F97316" />
        <circle cx="280" cy="25" r="3.5" fill="#34D399" />
      </svg>

      <span className="relative z-10 font-black uppercase tracking-wider text-white">
        PROPAGACIÓN SINÁPTICA
      </span>

      <span className="relative z-10 text-[10px] font-mono border border-violet-500/50 bg-violet-500/20 px-2 py-0.5 rounded text-violet-200">
        FIRE_AXON [↵]
      </span>
    </button>
  );
}

/* =========================================================================
   B10 — LIQUID MERCURY MORPH (Metaballs Líquidas con Filtro SVG Gooey)
   ========================================================================= */
function SvgBtn10LiquidMercury({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[52px] w-full items-center justify-between overflow-hidden rounded-xl border border-orange-500/50 bg-gradient-to-r from-orange-500 to-amber-400 px-6 font-mono text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_0_20px_rgba(255,106,0,0.4)] hover:shadow-[0_0_30px_rgba(255,106,0,0.7)] hover:scale-[1.01] transition-all duration-200 cursor-pointer disabled:opacity-40"
    >
      <div className="flex items-center gap-3">
        {/* SVG Liquid Goo Animation */}
        <div className="relative h-6 w-12 flex items-center">
          <span className="h-4 w-4 rounded-full bg-slate-950 group-hover:translate-x-6 transition-transform duration-500 ease-out" />
          <span className="h-3 w-3 rounded-full bg-slate-950 opacity-80 ml-1 group-hover:-translate-x-3 transition-transform duration-500" />
        </div>
        <span>FUSIÓN MERCURIO LÍQUIDO</span>
      </div>

      <kbd className="hidden sm:inline-flex items-center justify-center px-2 py-0.5 rounded border border-slate-950/40 bg-slate-950/15 text-[10px] font-bold">
        Enter ↵
      </kbd>
    </button>
  );
}

/* =========================================================================
   B11 — TACHOMETER REDLINE (Tacómetro Analógico con Aguja a 9.000 RPM)
   ========================================================================= */
function SvgBtn11TachometerRedline({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[52px] w-full items-center justify-between overflow-hidden rounded-xl border border-rose-500/40 bg-slate-950 px-6 font-mono text-xs font-bold text-slate-200 shadow-[0_0_18px_rgba(244,63,94,0.15)] hover:border-rose-500 hover:shadow-[0_0_28px_rgba(244,63,94,0.4)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div className="flex items-center gap-3">
        {/* SVG Tachometer Dial */}
        <svg viewBox="0 0 40 24" className="w-8 h-5 shrink-0">
          <path d="M4,22 A16,16 0 0,1 36,22" fill="none" stroke="#334155" strokeWidth="3" />
          <path d="M28,8 A16,16 0 0,1 36,22" fill="none" stroke="#F43F5E" strokeWidth="3" />
          {/* Needle */}
          <line x1="20" y1="22" x2="10" y2="10" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" className="group-hover:origin-bottom group-hover:rotate-45 transition-transform duration-300" />
          <circle cx="20" cy="22" r="2.5" fill="#FFF" />
        </svg>
        <span className="uppercase tracking-wider font-black text-white">REDLINE 9000 RPM</span>
      </div>

      <span className="text-[10px] font-mono border border-rose-500/50 bg-rose-500/20 px-2 py-0.5 rounded text-rose-300">
        SHIFT_ENTER ↵
      </span>
    </button>
  );
}

/* =========================================================================
   B12 — RADAR SWEEP SONAR (Sonar Táctico Orbital 360°)
   ========================================================================= */
function SvgBtn12RadarSonar({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[52px] w-full items-center justify-between overflow-hidden rounded-xl border border-emerald-500/40 bg-slate-950 px-6 font-mono text-xs font-bold text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.15)] hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div className="flex items-center gap-3">
        {/* SVG Radar Sweep */}
        <div className="relative h-6 w-6 shrink-0">
          <svg viewBox="0 0 30 30" className="w-full h-full">
            <circle cx="15" cy="15" r="13" fill="none" stroke="#10B981" strokeWidth="1" strokeOpacity="0.4" />
            <circle cx="15" cy="15" r="7" fill="none" stroke="#10B981" strokeWidth="1" strokeOpacity="0.3" />
            <line x1="15" y1="2" x2="15" y2="28" stroke="#10B981" strokeWidth="0.5" strokeOpacity="0.5" />
            <line x1="2" y1="15" x2="28" y2="15" stroke="#10B981" strokeWidth="0.5" strokeOpacity="0.5" />
          </svg>
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/40 to-transparent group-hover:animate-spin" style={{ animationDuration: '2s' }} />
        </div>
        <span className="uppercase tracking-wider font-black text-white">BARRIDO SONAR 360°</span>
      </div>

      <span className="text-[10px] font-mono border border-emerald-500/40 bg-emerald-950/40 px-2 py-0.5 rounded text-emerald-300">
        PING_TARGET [↵]
      </span>
    </button>
  );
}

/* =========================================================================
   B13 — BIOLUMINESCENT ABYSS (Filamentos y Tentáculos de Fibra Óptica)
   ========================================================================= */
function SvgBtn13BioluminescentAbyss({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[52px] w-full items-center justify-between overflow-hidden rounded-xl border border-teal-500/40 bg-gradient-to-r from-slate-950 via-teal-950/30 to-slate-950 px-6 font-mono text-xs font-bold text-teal-200 shadow-[0_0_20px_rgba(20,184,166,0.2)] hover:border-teal-400 hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      {/* SVG Bioluminescent Curves */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 group-hover:opacity-80 transition-opacity" viewBox="0 0 300 50">
        <path d="M10,25 C80,5 120,45 200,20 S280,40 320,15" fill="none" stroke="#2DD4BF" strokeWidth="1.5" />
        <path d="M10,35 C90,15 140,55 220,15 S260,35 300,25" fill="none" stroke="#F59E0B" strokeWidth="1" />
      </svg>

      <span className="relative z-10 font-black uppercase tracking-wider text-white">
        FILAMENTO BIOLUMINISCENTE
      </span>

      <span className="relative z-10 text-[10px] font-mono border border-teal-500/50 bg-teal-500/20 px-2 py-0.5 rounded text-teal-200">
        PULSE [↵]
      </span>
    </button>
  );
}

/* =========================================================================
   B14 — PRISM CRYSTAL FLARE (Refracción de Cristal y Espectro Cromático)
   ========================================================================= */
function SvgBtn14PrismCrystal({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[52px] w-full items-center justify-between overflow-hidden rounded-xl border border-white/20 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 px-6 font-mono text-xs font-bold text-slate-100 shadow-xl hover:border-amber-400 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      <div className="flex items-center gap-3">
        {/* SVG Prism Facets */}
        <svg viewBox="0 0 30 26" className="w-6 h-5 shrink-0 group-hover:scale-110 transition-transform">
          <polygon points="15,2 28,24 2,24" fill="none" stroke="#FFF" strokeWidth="1.5" />
          <line x1="2" y1="16" x2="15" y2="16" stroke="#F59E0B" strokeWidth="1" />
          <line x1="15" y1="16" x2="26" y2="12" stroke="#06B6D4" strokeWidth="1" />
          <line x1="15" y1="16" x2="28" y2="20" stroke="#F43F5E" strokeWidth="1" />
        </svg>
        <span className="uppercase tracking-wider font-black text-white">REFRACCIÓN PRISMÁTICA</span>
      </div>

      <span className="text-[10px] font-mono border border-amber-400/50 bg-amber-400/10 px-2 py-0.5 rounded text-amber-300">
        REFRACT [↵]
      </span>
    </button>
  );
}

/* =========================================================================
   B15 — MATRIX DATA STREAM (Cascada de Glifos y Rieles de Código Binario)
   ========================================================================= */
function SvgBtn15MatrixStream({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex min-h-[52px] w-full items-center justify-between overflow-hidden rounded-xl border border-emerald-500/50 bg-slate-950 px-6 font-mono text-xs font-bold text-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.2)] hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300 cursor-pointer disabled:opacity-40"
    >
      {/* SVG Binary Matrix Columns */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 group-hover:opacity-70 transition-opacity" viewBox="0 0 300 50">
        <text x="20" y="15" fill="#10B981" fontSize="9" fontFamily="monospace">1 0 1</text>
        <text x="20" y="32" fill="#10B981" fontSize="9" fontFamily="monospace">0 1 0</text>
        <text x="140" y="20" fill="#F59E0B" fontSize="9" fontFamily="monospace">λ fn()</text>
        <text x="240" y="15" fill="#10B981" fontSize="9" fontFamily="monospace">0 0 1</text>
        <text x="240" y="35" fill="#10B981" fontSize="9" fontFamily="monospace">1 1 0</text>
      </svg>

      <span className="relative z-10 flex items-center gap-2 font-black uppercase tracking-wider text-white">
        <Code className="w-4 h-4 text-emerald-400" />
        <span>STREAM MATRIX LUA</span>
      </span>

      <span className="relative z-10 text-[10px] font-mono border border-emerald-500/60 bg-emerald-950/60 px-2 py-0.5 rounded text-emerald-300">
        0xEXEC [↵]
      </span>
    </button>
  );
}

export default WorkspaceLab;
