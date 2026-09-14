'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { SquaresFour, Terminal } from '@phosphor-icons/react';
import { getGsap, prefersReducedMotion } from '@/lib/gsap';
import { LanguageOption, TechCategory } from '@/models/register/register.model';
import { LanguageCard } from './LanguageCard';
import { TerminalLanguagePicker } from './TerminalLanguagePicker';
import { cn } from '@/lib/utils';

interface LanguageSelectionStepProps {
  languages: LanguageOption[];
  categories: { id: TechCategory; label: string }[];
  selectedCategory: TechCategory;
  onSelectCategory: (cat: TechCategory) => void;
  selectedLanguageId: string;
  onSelectLanguage: (id: string) => void;
}

export const LanguageSelectionStep: React.FC<LanguageSelectionStepProps> = ({
  languages, categories, selectedCategory, onSelectCategory,
  selectedLanguageId, onSelectLanguage,
}) => {
  const reduceMotion = useReducedMotion();
  const [view, setView] = useState<'grid' | 'terminal'>('grid');
  const gridRef = useRef<HTMLDivElement>(null);

  // Stagger GSAP de entrada cada vez que cambia el filtro.
  useLayoutEffect(() => {
    if (view !== 'grid' || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.from(gridRef.current?.querySelectorAll('[data-vrow]') ?? [], {
        y: 14,
        opacity: 0,
        duration: 0.45,
        stagger: 0.04,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
    }, gridRef);
    return () => ctx.revert();
  }, [languages, view]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('koda-lang-view');
      if (saved === 'terminal' || saved === 'grid') setView(saved);
    } catch {
      // sin almacenamiento, grid por defecto
    }
  }, []);

  const switchView = (next: 'grid' | 'terminal') => {
    setView(next);
    try {
      window.localStorage.setItem('koda-lang-view', next);
    } catch {
      // solo sesión
    }
  };

  return (
  <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-6 space-y-6 animate-fadeIn">
    {/* Koda Welcome & Header */}
    <div className="flex items-center gap-4 text-left">
      <div className="relative shrink-0 flex flex-col items-center">
        <div className="relative h-14 w-14 sm:h-16 sm:w-16">
          <Image
            src="/brand/koda-mascot-cartoon-2d.svg"
            alt="Koda, tu guía de registro"
            width={64}
            height={64}
            className="object-contain"
            style={{ width: 'auto', height: 'auto' }}
            priority
          />
        </div>
        <span aria-hidden="true" className="mt-1 max-w-[120px] rounded-xl rounded-tl-sm border border-amber-400/30 bg-amber-400/10 px-2 py-1 text-center text-[10px] font-bold leading-tight text-amber-200">
          ¡Elige tu arma! 🐍
        </span>
      </div>
      <div className="space-y-0.5">
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          ¿Qué tecnología quieres aprender?
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Aprende desde cero o potencia tu stack con lecciones interactivas.
        </p>
      </div>
    </div>

    {/* Category Pills + vista */}
    <div className="flex items-center justify-between gap-2">
    <div role="tablist" aria-label="Filtrar por categoría" className="flex flex-1 items-center gap-2 overflow-x-auto pb-1">
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          role="tab"
          aria-selected={selectedCategory === cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className={cn(
            'px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border',
            selectedCategory === cat.id
              ? 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.35)]'
              : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:text-white hover:border-slate-600'
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
      <div role="group" aria-label="Vista de selección" className="flex shrink-0 items-center gap-1 rounded-full border border-slate-800 bg-slate-900/60 p-1 ml-2">
        {(
          [
            { id: 'grid', label: 'Cuadrícula', Icon: SquaresFour },
            { id: 'terminal', label: 'Terminal', Icon: Terminal },
          ] as const
        ).map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => switchView(id)}
            aria-pressed={view === id}
            aria-label={`Vista ${label}`}
            title={label}
            className={cn(
              'inline-flex min-h-[32px] min-w-[32px] items-center justify-center rounded-full transition-colors',
              view === id ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            )}
          >
            <Icon aria-hidden="true" className="w-4 h-4" />
          </button>
        ))}
      </div>
    </div>

    {view === 'terminal' ? (
      <TerminalLanguagePicker
        languages={languages}
        selectedLanguageId={selectedLanguageId}
        onSelectLanguage={onSelectLanguage}
      />
    ) : (
    /* Grid of Technologies ampliado horizontalmente */
    <div ref={gridRef}>
    <motion.div layout={reduceMotion ? false : true} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
      <AnimatePresence mode="popLayout">
        {languages.map((item) => (
          <motion.div
            key={item.id}
            data-vrow
            layout={reduceMotion ? false : true}
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
          >
            <LanguageCard
              option={item}
              isSelected={selectedLanguageId === item.id}
              onSelect={onSelectLanguage}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
    </div>
    )}
  </div>
  );
};
