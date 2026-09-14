'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { getGsap, prefersReducedMotion } from '@/lib/gsap';
import { LanguageOption, TechCategory } from '@/models/register/register.model';
import { LanguageCard } from './LanguageCard';
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
  const gridRef = useRef<HTMLDivElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return languages;
    return languages.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.slug.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q)
    );
  }, [query, languages]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery('');
  };

  // Stagger GSAP de entrada cada vez que cambia el filtro.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
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
  }, [languages]);

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

    {/* Category Pills */}
    <div className="flex items-center gap-2">
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
    </div>

    {/* Buscador expandible debajo de las categorías */}
    <motion.div
        layout={reduceMotion ? false : true}
        animate={{ width: searchOpen ? '100%' : '11rem' }}
        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
        className={cn(
          'flex items-center gap-2 overflow-hidden rounded-[8px] border bg-slate-950 font-mono text-xs',
          searchOpen ? 'border-amber-400/50 px-3 py-2' : 'border-slate-800 px-3 py-2 cursor-pointer hover:border-slate-600'
        )}
        onClick={() => !searchOpen && setSearchOpen(true)}
        role={searchOpen ? undefined : 'button'}
        tabIndex={searchOpen ? undefined : 0}
        aria-label={searchOpen ? undefined : 'Abrir búsqueda'}
        onKeyDown={(e) => !searchOpen && (e.key === 'Enter' || e.key === ' ') && setSearchOpen(true)}
      >
        {searchOpen ? (
          <>
            <span aria-hidden="true" className="text-emerald-400 select-none">$</span>
            <input
              ref={searchInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && closeSearch()}
              placeholder="buscar tecnología…"
              aria-label="Buscar tecnología en el grid"
              autoComplete="off"
              spellCheck={false}
              className="flex-1 bg-transparent text-amber-300 placeholder:text-slate-600 focus:outline-none min-h-[28px]"
            />
            <span aria-hidden="true" className="text-[11px] text-slate-600 select-none">
              {visible.length}/{languages.length}
            </span>
            <button
              type="button"
              onClick={closeSearch}
              aria-label="Cerrar búsqueda"
              className="inline-flex min-h-[28px] min-w-[28px] items-center justify-center rounded-[6px] text-slate-400 transition-colors hover:text-white"
            >
              <X aria-hidden="true" className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <>
            <MagnifyingGlass aria-hidden="true" className="w-4 h-4 shrink-0 text-slate-500" />
            <span className="text-slate-500 select-none">$ buscar…</span>
          </>
        )}
      </motion.div>

    {/* Grid of Technologies ampliado horizontalmente */}
    <div ref={gridRef}>
    <motion.div layout={reduceMotion ? false : true} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
      <AnimatePresence mode="popLayout">
        {visible.map((item) => (
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
    {visible.length === 0 && (
      <p className="rounded-[8px] border border-dashed border-slate-800 px-4 py-6 text-center font-mono text-xs text-slate-500">
        {'// sin coincidencias para "'}{query.trim()}{'" — prueba "python"'}
      </p>
    )}
    </div>
  </div>
  );
};
