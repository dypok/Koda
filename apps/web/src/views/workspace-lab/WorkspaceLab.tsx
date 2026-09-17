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
  Lightning, 
  Sparkle, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  Code, 
  Target, 
  Atom, 
  Drop, 
  Waves, 
  Crosshair, 
  Fingerprint, 
  Sliders, 
  Pulse, 
  Broadcast,
  CaretRight,
  Compass,
  Play
} from '@phosphor-icons/react';
import { HeroSkyBackground } from '@/components/landing/HeroSkyBackground';
import { cn } from '@/lib/utils';
import { BUTTON_CATALOG, ButtonVariantItem } from './button-catalog-data';

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

const CATEGORIES = [
  'Todos (100)',
  'Fuego & Plasma',
  'Cyber & HUD',
  'Arcade 3D',
  'Obsidian Glass',
  'Terminal Hacker',
  'Sci-Fi Holodeck',
  'Brutalismo',
  'Shimmer & Láser',
  'Split Capsules',
  'Líquido & Morphing',
];

export const WorkspaceLab: React.FC = () => {
  const [activeBtnIndex, setActiveBtnIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('Todos (100)');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOpt, setSelectedOpt] = useState<string | null>('opt-a');
  const [checked, setChecked] = useState(false);
  const [viewMode, setViewMode] = useState<'single' | 'gallery'>('single');

  // Lectura de URL params opcionales
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'gallery') {
        setViewMode('gallery');
      }
      if (params.get('cat')) {
        const cat = params.get('cat');
        if (cat && CATEGORIES.includes(cat)) {
          setActiveCategory(cat);
        }
      }
      if (params.get('btn')) {
        const b = parseInt(params.get('btn') || '1', 10) - 1;
        if (b >= 0 && b < BUTTON_CATALOG.length) {
          setActiveBtnIndex(b);
        }
      }
    }
  }, []);

  // Filtrado del catálogo
  const filteredButtons = BUTTON_CATALOG.filter((btn) => {
    const matchesCat = activeCategory === 'Todos (100)' || btn.category === activeCategory;
    const matchesSearch = 
      btn.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      btn.num.toLowerCase().includes(searchQuery.toLowerCase()) ||
      btn.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeBtn = BUTTON_CATALOG[activeBtnIndex] || BUTTON_CATALOG[0];
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
      } else if (e.key === 'ArrowRight') {
        setActiveBtnIndex((prev) => (prev + 1) % BUTTON_CATALOG.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveBtnIndex((prev) => (prev - 1 + BUTTON_CATALOG.length) % BUTTON_CATALOG.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="relative isolate min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden font-sans">
      <HeroSkyBackground starCount={90} interactive={false} className="fixed inset-0 pointer-events-none -z-10" />

      {/* Header Fijo de Control */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl px-4 py-3 shadow-2xl">
        <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
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
                100 Button Lab
              </span>
              <span className="text-slate-600 font-mono">/</span>
              <span className="font-mono text-xs text-slate-400">
                {activeBtn.num}: <strong className="text-amber-300">{activeBtn.name}</strong>
              </span>
            </div>
          </div>

          {/* Selector de Modos y Buscador */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
            <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-full p-1">
              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer',
                  viewMode === 'single' ? 'bg-orange-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                )}
              >
                Workspace Real
              </button>
              <button
                type="button"
                onClick={() => setViewMode('gallery')}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer',
                  viewMode === 'gallery' ? 'bg-orange-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                )}
              >
                Galería 100
              </button>
            </div>

            {/* Controles Rápido Anterior / Siguiente */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveBtnIndex((prev) => (prev - 1 + BUTTON_CATALOG.length) % BUTTON_CATALOG.length)}
                className="p-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 text-slate-300 hover:text-white hover:border-orange-500/50 cursor-pointer"
                title="Botón anterior (←)"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-xs font-bold text-orange-400 px-2">
                {activeBtn.num} / B100
              </span>
              <button
                type="button"
                onClick={() => setActiveBtnIndex((prev) => (prev + 1) % BUTTON_CATALOG.length)}
                className="p-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 text-slate-300 hover:text-white hover:border-orange-500/50 cursor-pointer"
                title="Siguiente botón (→)"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Barra de Categorías */}
        <div className="mx-auto max-w-7xl pt-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 border-t border-slate-800/40 mt-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-3 py-1 rounded-full text-[11px] font-mono font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer',
                activeCategory === cat
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 shadow-[0_0_10px_rgba(251,191,36,0.2)]'
                  : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Vista de Modo */}
      {viewMode === 'single' ? (
        /* Modo 1: Workspace Integrado con el Botón Activo */
        <main className="flex-1 p-4 md:p-6 lg:p-8 flex items-center justify-center">
          <div className="w-full max-w-6xl space-y-4">
            
            {/* HUD Flotante Superior en Píldora */}
            <div className="group flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 rounded-full border border-slate-700/50 bg-slate-900/40 backdrop-blur-xl shadow-xl hover:border-orange-500/40 transition-all duration-300">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400 font-semibold">{MOCK_EXERCISE.courseTitle}</span>
                <span className="text-slate-600">›</span>
                <span className="text-orange-400 font-bold">{MOCK_EXERCISE.sectionTitle}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>1-4 · Enter · ←/→ Botón</span>
                </div>
                <span className="font-mono text-xs font-bold text-orange-400 tabular-nums bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full">
                  0{MOCK_EXERCISE.progressStep}/0{MOCK_EXERCISE.totalSteps}
                </span>
              </div>
            </div>

            {/* Stepper horizontal */}
            <div className="flex items-center gap-1.5 px-2">
              {Array.from({ length: MOCK_EXERCISE.totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1.5 flex-1 rounded-full transition-all duration-300',
                    i === 0
                      ? 'bg-gradient-to-r from-orange-500 to-amber-400 shadow-[0_0_10px_rgba(255,106,0,0.8)] ring-1 ring-orange-400/50'
                      : 'bg-slate-800/80'
                  )}
                />
              ))}
            </div>

            {/* Grid 50/50 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              
              {/* Columna Izquierda: Teoría */}
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-6 flex flex-col justify-between gap-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-[10px] font-mono font-bold text-orange-300 uppercase tracking-wider">
                    <span>Lección 01</span>
                  </div>
                  <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                    {MOCK_EXERCISE.lessonTitle}
                  </h1>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    Un lenguaje de programación es la forma en que le das{' '}
                    <span className="text-amber-300 font-semibold bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                      instrucciones claras
                    </span>{' '}
                    a una computadora. Las máquinas no hablan español ni inglés: solo entienden{' '}
                    <span className="text-cyan-300 font-semibold bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded">
                      reglas exactas
                    </span>.
                  </p>
                </div>

                {/* Terminal */}
                <div className="space-y-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 font-mono text-sm leading-relaxed text-slate-200 shadow-inner">
                    <span className="text-slate-600 select-none">// Ejecución simple</span>
                    <div className="text-amber-300 pt-1"><code>{MOCK_EXERCISE.codeSnippet}</code></div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs font-mono text-emerald-300">
                    <span className="text-emerald-500 font-bold">$</span>
                    <span>{MOCK_EXERCISE.codeOutput}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal pl-1">{MOCK_EXERCISE.codeFootnote}</p>
                </div>
              </div>

              {/* Columna Derecha: Práctica & Botón Evaluado */}
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-6 flex flex-col justify-between gap-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                      Desafío de Comprensión
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-300 border border-orange-500/30">
                      {activeBtn.num}: {activeBtn.name}
                    </span>
                  </div>

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
                              : 'border-slate-700 bg-slate-800 text-slate-400 group-hover:border-orange-400/60 group-hover:text-amber-200'
                          )}>
                            {opt.num}
                          </kbd>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Área del Botón Renderizado Dinámicamente */}
                <div className="space-y-3 pt-3">
                  <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Estilo: <strong className="text-amber-300">{activeBtn.name}</strong></span>
                    <span className="text-slate-500">{activeBtn.hoverDesc}</span>
                  </div>

                  {!checked ? (
                    <DynamicButtonRenderer
                      variant={activeBtn}
                      disabled={!selectedOpt}
                      onClick={() => setChecked(true)}
                    />
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
      ) : (
        /* Modo 2: Galería Interactiva con las 100 Propuestas de Botones */
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-black text-white">
              Galería de las 100 Propuestas de Botones
            </h2>
            <span className="font-mono text-xs text-slate-400">
              Mostrando {filteredButtons.length} de 100 botones
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredButtons.map((btn) => (
              <div
                key={btn.id}
                className={cn(
                  'rounded-2xl border p-4 bg-slate-900/60 backdrop-blur-xl space-y-3 flex flex-col justify-between transition-all duration-200',
                  activeBtnIndex === BUTTON_CATALOG.findIndex((b) => b.id === btn.id)
                    ? 'border-orange-500/90 shadow-[0_0_20px_rgba(255,106,0,0.25)] ring-1 ring-orange-500/50'
                    : 'border-slate-800 hover:border-slate-700'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-wider block">
                      {btn.num} · {btn.category}
                    </span>
                    <h3 className="font-bold text-white text-sm">{btn.name}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveBtnIndex(BUTTON_CATALOG.findIndex((b) => b.id === btn.id));
                      setViewMode('single');
                    }}
                    className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 hover:bg-orange-500 hover:text-slate-950 transition-colors shrink-0"
                  >
                    Probar en Workspace
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed min-h-[32px]">
                  {btn.description}
                </p>

                {/* Renderizado del botón interactivo */}
                <div className="pt-2">
                  <DynamicButtonRenderer
                    variant={btn}
                    disabled={false}
                    onClick={() => {
                      setActiveBtnIndex(BUTTON_CATALOG.findIndex((b) => b.id === btn.id));
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
};

/* =========================================================================
   RENDERIZADOR DINÁMICO DE LOS 100 BOTONES
   ========================================================================= */
function DynamicButtonRenderer({ variant, disabled, onClick }: { variant: ButtonVariantItem; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group relative inline-flex min-h-[50px] w-full items-center justify-center gap-2.5 px-6 font-mono text-xs select-none transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
        variant.className
      )}
      style={variant.style}
    >
      {/* Efectos de pseudo-elementos o animaciones internas */}
      {variant.innerGlow && (
        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
      )}

      {/* Icono del botón */}
      <ButtonIconRenderer iconType={variant.icon} />

      {/* Texto principal */}
      <span className={cn('font-bold tracking-wider', variant.textClassName)}>
        {variant.customText || 'Comprobar respuesta'}
      </span>

      {/* Keycap Badge */}
      <kbd className={cn(
        'hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all shadow-sm',
        variant.kbdClassName || 'border border-slate-950/30 bg-slate-950/15 text-slate-950 group-hover:bg-slate-950/25'
      )}>
        {variant.kbdText || 'Enter ↵'}
      </kbd>
    </button>
  );
}

function ButtonIconRenderer({ iconType }: { iconType?: string }) {
  switch (iconType) {
    case 'flame': return <Flame className="w-4 h-4" />;
    case 'lightning': return <Lightning className="w-4 h-4" />;
    case 'terminal': return <Terminal className="w-4 h-4" />;
    case 'target': return <Target className="w-4 h-4" />;
    case 'cpu': return <Cpu className="w-4 h-4" />;
    case 'code': return <Code className="w-4 h-4" />;
    case 'sparkle': return <Sparkle className="w-4 h-4" />;
    case 'shield': return <ShieldCheck className="w-4 h-4" />;
    case 'atom': return <Atom className="w-4 h-4" />;
    case 'pulse': return <Pulse className="w-4 h-4" />;
    case 'play': return <Play className="w-4 h-4" />;
    case 'crosshair': return <Crosshair className="w-4 h-4" />;
    case 'sliders': return <Sliders className="w-4 h-4" />;
    case 'fingerprint': return <Fingerprint className="w-4 h-4" />;
    case 'check': return <Check className="w-4 h-4" />;
    default: return <Flame className="w-4 h-4" />;
  }
}

export default WorkspaceLab;
