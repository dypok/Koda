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
  Play,
  Clock,
  Coins,
  Eye,
  GitBranch,
  Laptop,
  Command,
  Rows,
  DiamondsFour,
  X,
  MagnifyingGlass
} from '@phosphor-icons/react';
import { OrbitFieldBackground } from '@/components/landing/OrbitFieldBackground';
import { cn } from '@/lib/utils';
import { NAVBAR_CATALOG, NAVBAR_CATEGORIES, NavbarVariantItem } from './navbar-catalog-data';

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
  const [activeNavIndex, setActiveNavIndex] = useState(0); // N01 por defecto
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
        if (cat && NAVBAR_CATEGORIES.includes(cat)) {
          setActiveCategory(cat);
        }
      }
      if (params.get('nav')) {
        const n = parseInt(params.get('nav') || '1', 10) - 1;
        if (n >= 0 && n < NAVBAR_CATALOG.length) {
          setActiveNavIndex(n);
        }
      }
    }
  }, []);

  // Filtrado del catálogo
  const filteredNavbars = NAVBAR_CATALOG.filter((nav) => {
    const matchesCat = activeCategory === 'Todos (100)' || nav.category === activeCategory;
    const matchesSearch = 
      nav.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      nav.num.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nav.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nav.features.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeNav = NAVBAR_CATALOG[activeNavIndex] || NAVBAR_CATALOG[0];
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
        setActiveNavIndex((prev) => (prev + 1) % NAVBAR_CATALOG.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveNavIndex((prev) => (prev - 1 + NAVBAR_CATALOG.length) % NAVBAR_CATALOG.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="relative isolate min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden font-sans">
      <OrbitFieldBackground className="fixed inset-0 pointer-events-none -z-10 scale-[1.5]" />

      {/* Header Fijo de Control del Laboratorio */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl px-4 py-2.5 shadow-2xl">
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
              <span className="font-mono text-xs font-black uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                100 Navbar Lab
              </span>
              <span className="text-slate-600 font-mono">/</span>
              <span className="font-mono text-xs text-slate-300">
                <strong className="text-orange-400">{activeNav.num}</strong>: <span className="text-white font-semibold">{activeNav.name}</span>
              </span>
            </div>
          </div>

          {/* Selector de Modos y Buscador */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
            {/* Buscador */}
            <div className="relative flex items-center">
              <MagnifyingGlass className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar (ej. N01, pill, zen)..."
                className="pl-8 pr-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500/60 w-36 sm:w-48 transition-all"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-slate-500 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Switch Single / Galería */}
            <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-full p-0.5">
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
                Galería 100 ({filteredNavbars.length})
              </button>
            </div>

            {/* Controles Rápido Anterior / Siguiente */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveNavIndex((prev) => (prev - 1 + NAVBAR_CATALOG.length) % NAVBAR_CATALOG.length)}
                className="p-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 text-slate-300 hover:text-white hover:border-orange-500/50 cursor-pointer"
                title="Navbar anterior (←)"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-xs font-bold text-orange-400 px-1.5">
                {activeNav.num} / N100
              </span>
              <button
                type="button"
                onClick={() => setActiveNavIndex((prev) => (prev + 1) % NAVBAR_CATALOG.length)}
                className="p-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 text-slate-300 hover:text-white hover:border-orange-500/50 cursor-pointer"
                title="Siguiente navbar (→)"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Barra de Categorías */}
        <div className="mx-auto max-w-7xl pt-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 border-t border-slate-800/40 mt-2">
          {NAVBAR_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-3 py-0.5 rounded-full text-[11px] font-mono font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer',
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
        /* Modo 1: Workspace Integrado con el Navbar Activo */
        <main className="flex-1 p-4 md:p-6 lg:p-8 flex items-center justify-center">
          <div className="w-full max-w-6xl space-y-4">
            
            {/* Renderizado del Navbar Evaluado en Vivo */}
            <div className="w-full">
              <DynamicNavbarRenderer variant={activeNav} exercise={MOCK_EXERCISE} />
            </div>

            {/* Stepper Auxiliar de lección si el navbar es de estilo minimal sin stepper integrado */}
            {!['stepper_edge_to_edge', 'stepper_10_pills', 'stepper_battery_cells', 'stepper_liquid_gradient', 'hairline_stepper_line', 'pill_embedded_stepper', 'fusion_master_prime', 'fusion_prime_pill'].includes(activeNav.renderType) && (
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
            )}

            {/* Grid 50/50 del Workspace Real */}
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

              {/* Columna Derecha: Práctica & Botón D74 Tactile 3D */}
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-6 flex flex-col justify-between gap-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                      Desafío de Comprensión
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-300 border border-orange-500/30">
                      Atajos: 1-4 · Enter ↵
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

                {/* Botón D74 Tactile 3D (< / > C O M P R O B A R) */}
                <div className="space-y-3 pt-3">
                  {!checked ? (
                    <button
                      type="button"
                      disabled={!selectedOpt}
                      onClick={() => setChecked(true)}
                      className={cn(
                        'group relative inline-flex min-h-[50px] w-full items-center justify-center gap-3 px-6 font-mono text-xs select-none transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
                        'rounded-xl border-t border-x border-amber-300/60 border-b-[5px] border-b-orange-950 bg-gradient-to-b from-amber-400 via-orange-500 to-orange-600 text-slate-950 font-black shadow-[0_8px_20px_rgba(255,106,0,0.35)] hover:brightness-110 active:border-b-0 active:translate-y-1'
                      )}
                    >
                      <Code className="w-4 h-4 text-slate-950" />
                      <span className="tracking-[0.25em] font-black uppercase text-[11px]">
                        &lt; / &gt; C O M P R O B A R
                      </span>
                      <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all shadow-sm border border-slate-950/40 bg-slate-950/20 text-slate-950 group-hover:bg-slate-950/30">
                        Enter ↵
                      </kbd>
                    </button>
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
                          Reiniciar
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

            {/* Ficha Técnica de la Propuesta Seleccionada */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-orange-400 font-bold">{activeNav.num}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-white font-semibold">{activeNav.name}</span>
                  <span className="text-slate-500 text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700/50">
                    {activeNav.category}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {activeNav.description}
                </p>
              </div>
              <div className="text-[11px] text-amber-300/80 shrink-0 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
                <span>{activeNav.features}</span>
              </div>
            </div>

          </div>
        </main>
      ) : (
        /* Modo 2: Galería Interactiva con las 100 Propuestas de Navbars */
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <h2 className="font-display text-2xl font-black text-white flex items-center gap-2">
                <span>Catálogo de los 100 Navbars Minimalistas</span>
                <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                  {filteredNavbars.length} / 100
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Explora cada propuesta en vivo. Haz clic en "Probar en Workspace" para montarla en el ejercicio real.
              </p>
            </div>
            
            <div className="text-xs font-mono text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg">
              Atajos: <span className="text-orange-400 font-bold">← / →</span> Navegar
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredNavbars.map((nav) => {
              const isActive = activeNavIndex === NAVBAR_CATALOG.findIndex((n) => n.id === nav.id);
              return (
                <div
                  key={nav.id}
                  className={cn(
                    'rounded-2xl border p-4 bg-slate-900/70 backdrop-blur-xl space-y-3.5 flex flex-col justify-between transition-all duration-200',
                    isActive
                      ? 'border-orange-500/90 shadow-[0_0_24px_rgba(255,106,0,0.25)] ring-1 ring-orange-500/50'
                      : 'border-slate-800 hover:border-slate-700'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                          {nav.num}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {nav.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-sm mt-1">{nav.name}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveNavIndex(NAVBAR_CATALOG.findIndex((n) => n.id === nav.id));
                        setViewMode('single');
                      }}
                      className={cn(
                        'text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg border transition-all shrink-0 cursor-pointer',
                        isActive
                          ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-[0_0_10px_rgba(255,106,0,0.4)]'
                          : 'border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-orange-500 hover:text-slate-950 hover:border-orange-400'
                      )}
                    >
                      Probar en Workspace
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {nav.description}
                  </p>

                  {/* Preview Renderizado del Navbar */}
                  <div className="pt-2 pb-1 border-t border-slate-800/60 bg-slate-950/50 -mx-4 px-4 py-3 rounded-b-xl overflow-hidden">
                    <DynamicNavbarRenderer variant={nav} exercise={MOCK_EXERCISE} isPreview />
                  </div>

                  <div className="text-[10px] font-mono text-amber-300/70">
                    ✦ {nav.features}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}
    </div>
  );
};

/* =========================================================================
   RENDERIZADOR DINÁMICO DE LOS 100 NAVBARS
   ========================================================================= */
interface DynamicNavbarRendererProps {
  variant: NavbarVariantItem;
  exercise: typeof MOCK_EXERCISE;
  isPreview?: boolean;
}

function DynamicNavbarRenderer({ variant, exercise, isPreview = false }: DynamicNavbarRendererProps) {
  const { renderType } = variant;

  // 1. FAMILIA: PÍLDORAS FLOTANTES
  if (renderType === 'floating_pill_full' || renderType === 'fusion_prime_pill') {
    return (
      <div className={cn(
        'group flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 rounded-full border border-slate-700/50 bg-slate-900/40 backdrop-blur-xl shadow-xl hover:border-orange-500/40 transition-all duration-300',
        variant.pillClassName
      )}>
        <div className="flex items-center gap-2 text-xs font-mono">
          <Link href="/app/ruta" className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
          <span className="text-slate-400 font-semibold">{exercise.courseTitle}</span>
          <span className="text-slate-600">›</span>
          <span className="text-orange-400 font-bold">{exercise.sectionTitle}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50">
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>1-4 · Enter</span>
          </div>
          <span className="font-mono text-xs font-bold text-orange-400 tabular-nums bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full">
            0{exercise.progressStep}/0{exercise.totalSteps}
          </span>
        </div>
      </div>
    );
  }

  if (renderType === 'micro_pill_dense') {
    return (
      <div className="flex items-center justify-between px-4 py-1.5 rounded-full border border-slate-800 bg-slate-950/70 backdrop-blur-md shadow-md text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <ArrowLeft className="w-3 h-3 text-slate-400" />
          <span className="text-slate-300">{exercise.courseTitle}</span>
          <span className="text-slate-600">/</span>
          <span className="text-orange-400 font-bold">{exercise.sectionTitle}</span>
        </div>
        <span className="text-orange-400 font-bold">0{exercise.progressStep}/0{exercise.totalSteps}</span>
      </div>
    );
  }

  if (renderType === 'split_dual_pills' || renderType === 'fusion_dual_capsules') {
    return (
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700/60 bg-slate-900/60 backdrop-blur-xl shadow-lg text-xs font-mono">
          <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-300 font-medium">{exercise.courseTitle}</span>
          <span className="text-slate-600">›</span>
          <span className="text-orange-400 font-bold">{exercise.sectionTitle}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700/60 bg-slate-900/60 backdrop-blur-xl shadow-lg text-xs font-mono">
          <span className="text-slate-400">Paso</span>
          <span className="text-orange-400 font-bold">0{exercise.progressStep}/0{exercise.totalSteps}</span>
        </div>
      </div>
    );
  }

  if (renderType === 'dynamic_island_hover') {
    return (
      <div className="group mx-auto max-w-fit flex items-center gap-3 px-5 py-2 rounded-full border border-slate-700/60 bg-slate-900/80 backdrop-blur-xl shadow-2xl hover:px-7 hover:border-orange-500/60 transition-all duration-300 cursor-pointer">
        <ArrowLeft className="w-3.5 h-3.5 text-orange-400" />
        <span className="text-xs font-mono font-bold text-white">{exercise.sectionTitle}</span>
        <div className="hidden group-hover:flex items-center gap-2 text-[11px] font-mono text-slate-400 border-l border-slate-700 pl-3 transition-all">
          <span>{exercise.courseTitle}</span>
          <span className="text-orange-400">0{exercise.progressStep}/0{exercise.totalSteps}</span>
        </div>
      </div>
    );
  }

  if (renderType === 'frosted_glass_pill') {
    return (
      <div className="flex items-center justify-between px-5 py-2.5 rounded-full border border-amber-500/20 bg-slate-900/30 backdrop-blur-2xl shadow-[0_0_20px_rgba(255,106,0,0.1)]">
        <div className="flex items-center gap-2 text-xs font-mono">
          <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-300">{exercise.courseTitle}</span>
          <span className="text-slate-600">›</span>
          <span className="text-amber-400 font-bold">{exercise.sectionTitle}</span>
        </div>
        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
          0{exercise.progressStep}/0{exercise.totalSteps}
        </span>
      </div>
    );
  }

  if (renderType === 'fire_glow_pill') {
    return (
      <div className="flex items-center justify-between px-5 py-2.5 rounded-full border-t border-amber-400/60 border-x border-b border-slate-800 bg-slate-950/80 shadow-[0_0_15px_rgba(255,106,0,0.25)]">
        <div className="flex items-center gap-2 text-xs font-mono">
          <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
          <span className="text-white font-bold">{exercise.sectionTitle}</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-orange-400 font-bold">
          <span>Paso 0{exercise.progressStep}/0{exercise.totalSteps}</span>
        </div>
      </div>
    );
  }

  if (renderType === 'pill_embedded_stepper') {
    return (
      <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-xl p-3 shadow-xl space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-300 font-bold">{exercise.sectionTitle}</span>
          </div>
          <span className="text-orange-400 font-bold">0{exercise.progressStep}/0{exercise.totalSteps}</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className={cn('h-1 flex-1 rounded-full', i === 0 ? 'bg-orange-400 shadow-[0_0_6px_rgba(255,106,0,0.8)]' : 'bg-slate-800')} />
          ))}
        </div>
      </div>
    );
  }

  if (renderType === 'chamfer_pill') {
    return (
      <div className="flex items-center justify-between px-5 py-2.5 border border-slate-700/80 bg-slate-950/90 backdrop-blur-xl [clip-path:polygon(12px_0%,calc(100%-12px)_0%,100%_12px,100%_calc(100%-12px),calc(100%-12px)_100%,12px_100%,0%_calc(100%-12px),0%_12px)] shadow-xl text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-orange-400 font-black">[SYS]</span>
          <span className="text-white font-bold">{exercise.sectionTitle}</span>
        </div>
        <span className="text-orange-400 font-bold">0{exercise.progressStep}/0{exercise.totalSteps}</span>
      </div>
    );
  }

  if (renderType === 'pill_radial_donut' || renderType === 'fusion_pill_radial') {
    return (
      <div className="flex items-center justify-between px-5 py-2 rounded-full border border-slate-700/60 bg-slate-900/60 backdrop-blur-xl shadow-lg text-xs font-mono">
        <div className="flex items-center gap-2">
          <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-white font-bold">{exercise.sectionTitle}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-7 h-7 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#1e293b" strokeWidth="3" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#ff6a00" strokeWidth="3" strokeDasharray="88" strokeDashoffset="79" strokeLinecap="round" />
            </svg>
            <span className="absolute text-[9px] font-bold text-orange-400">10%</span>
          </div>
        </div>
      </div>
    );
  }

  if (renderType === 'tri_modular_pills') {
    return (
      <div className="flex items-center justify-between gap-2">
        <div className="p-2 rounded-full border border-slate-800 bg-slate-900/70 text-slate-300">
          <ArrowLeft className="w-3.5 h-3.5" />
        </div>
        <div className="px-4 py-2 rounded-full border border-slate-800 bg-slate-900/70 text-xs font-mono font-bold text-white">
          {exercise.sectionTitle}
        </div>
        <div className="px-3 py-2 rounded-full border border-slate-800 bg-slate-900/70 text-xs font-mono font-bold text-orange-400">
          0{exercise.progressStep}/0{exercise.totalSteps}
        </div>
      </div>
    );
  }

  // 2. FAMILIA: HAIRLINE MINIMAL
  if (renderType.startsWith('hairline_')) {
    return (
      <div className="w-full border-b border-slate-800/80 pb-2.5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <Link href="/app/ruta" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
          <span className="text-slate-400">{exercise.courseTitle}</span>
          <span className="text-slate-600">/</span>
          <span className="text-orange-400 font-bold">{exercise.sectionTitle}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500">1-4 · Enter</span>
          <span className="text-orange-400 font-bold tabular-nums">0{exercise.progressStep}/0{exercise.totalSteps}</span>
        </div>
      </div>
    );
  }

  // 3. FAMILIA: TERMINAL STATUSLINE
  if (renderType.startsWith('statusline_')) {
    return (
      <div className="w-full bg-slate-950/90 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center justify-between text-xs font-mono shadow-inner">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-orange-500 text-slate-950 font-black text-[10px]">
            NORMAL
          </span>
          <span className="text-slate-500">lua/</span>
          <span className="text-slate-200 font-bold">leccion_01.lua</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          <span className="text-emerald-400 font-bold">[utf-8]</span>
          <span className="text-orange-400 font-bold">0{exercise.progressStep}/0{exercise.totalSteps}</span>
        </div>
      </div>
    );
  }

  // 4. FAMILIA: MICRO-NOTCH & ISLAND
  if (renderType.startsWith('notch_')) {
    return (
      <div className="mx-auto max-w-sm border-b border-x border-slate-700/60 bg-slate-900/90 backdrop-blur-xl rounded-b-2xl px-5 py-2 shadow-2xl flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <ArrowLeft className="w-3 h-3 text-slate-400" />
          <span className="text-white font-bold">{exercise.sectionTitle}</span>
        </div>
        <span className="text-orange-400 font-bold">0{exercise.progressStep}/0{exercise.totalSteps}</span>
      </div>
    );
  }

  // 5. FAMILIA: STEPPER-FIRST
  if (renderType.startsWith('stepper_')) {
    return (
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-300 font-bold">{exercise.sectionTitle}</span>
          </div>
          <span className="text-orange-400 font-bold">0{exercise.progressStep} de 0{exercise.totalSteps} completados</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden flex">
          <div className="w-[10%] h-full bg-gradient-to-r from-orange-500 to-amber-400 shadow-[0_0_10px_rgba(255,106,0,0.8)]" />
        </div>
      </div>
    );
  }

  // 6. FAMILIA: BREADCRUMBS CLAROS
  if (renderType.startsWith('breadcrumb_')) {
    return (
      <div className="w-full flex items-center justify-between text-xs font-mono py-1">
        <div className="flex items-center gap-2">
          <Link href="/app/ruta" className="p-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
          <span className="px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold text-[10px]">
            LUA
          </span>
          <span className="text-slate-400 font-medium">{exercise.courseTitle}</span>
          <CaretRight className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-white font-bold">{exercise.sectionTitle}</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-2.5 py-1 rounded-full">
          <span className="text-orange-400 font-bold">0{exercise.progressStep}/0{exercise.totalSteps}</span>
        </div>
      </div>
    );
  }

  // 7. FAMILIA: INSIGNIAS EN ESQUINAS
  if (renderType.startsWith('corners_')) {
    return (
      <div className="w-full flex items-center justify-between">
        <Link href="/app/ruta" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 text-xs font-mono text-slate-300 hover:border-orange-500/50">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Ruta</span>
        </Link>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 text-xs font-mono text-orange-300 font-bold">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>0{exercise.progressStep}/0{exercise.totalSteps}</span>
        </div>
      </div>
    );
  }

  // 8. FAMILIA: CYBER & SCI-FI
  if (renderType.startsWith('cyber_')) {
    return (
      <div className="w-full border border-cyan-500/30 bg-slate-950/80 rounded-lg px-4 py-2 flex items-center justify-between text-xs font-mono shadow-[0_0_15px_rgba(6,182,212,0.15)]">
        <div className="flex items-center gap-2 text-cyan-400">
          <Crosshair className="w-4 h-4" />
          <span className="font-bold">SYS://{exercise.sectionTitle.toUpperCase().replace(/\s+/g, '_')}</span>
        </div>
        <div className="flex items-center gap-2 text-orange-400 font-bold">
          <span className="text-[10px] text-slate-500">[0ms]</span>
          <span>STEP_0{exercise.progressStep}</span>
        </div>
      </div>
    );
  }

  // 9. FAMILIA: ZERO-UI ZEN
  if (renderType.startsWith('zen_')) {
    return (
      <div className="w-full flex items-center justify-between text-xs font-mono text-slate-500 hover:text-slate-200 transition-colors py-1">
        <div className="flex items-center gap-2">
          <ArrowLeft className="w-3 h-3 text-slate-600" />
          <span>{exercise.sectionTitle}</span>
        </div>
        <span>0{exercise.progressStep} / 0{exercise.totalSteps}</span>
      </div>
    );
  }

  // 10. FAMILIA: FUSIONES MAESTRAS (N100 MASTER PRIME)
  return (
    <div className="group flex items-center justify-between gap-4 px-6 py-2.5 rounded-full border border-slate-700/60 bg-slate-900/40 backdrop-blur-2xl shadow-[0_0_20px_rgba(255,106,0,0.15)] hover:border-orange-500/50 transition-all duration-300">
      <div className="flex items-center gap-3 text-xs font-mono">
        <Link
          href="/app/ruta"
          className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
        <span className="text-slate-400 font-medium">{exercise.courseTitle}</span>
        <span className="text-slate-600">›</span>
        <span className="text-orange-400 font-bold tracking-tight">{exercise.sectionTitle}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1 font-mono text-[11px] text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50">
          <Key className="w-3.5 h-3.5 text-amber-400" />
          <span>1-4 · Enter ↵</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full shadow-inner">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>0{exercise.progressStep}/0{exercise.totalSteps}</span>
        </div>
      </div>
    </div>
  );
}

export default WorkspaceLab;
