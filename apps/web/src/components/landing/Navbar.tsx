'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Menu, X, BookOpen, Layers, HelpCircle, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <span className="text-xl select-none" role="img" aria-label="Zorro Koda">🦊</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                Koda
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30">
                Python 3.12
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Aprende programando</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => scrollTo('metodologia')}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            Método Koda
          </button>
          <button
            onClick={() => scrollTo('temario')}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <Layers className="w-4 h-4 text-slate-400" />
            12 Módulos
          </button>
          <button
            onClick={() => scrollTo('demo-interactiva')}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Demo en Vivo
          </button>
          <button
            onClick={() => scrollTo('faq')}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            Preguntas Frecuentes
          </button>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => scrollTo('waitlist')}
            className="relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all bg-[length:200%_auto] hover:bg-right"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            Acceso Anticipado
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-850 transition-colors"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 py-5 space-y-4">
          <nav className="flex flex-col space-y-3 text-base font-medium text-slate-200">
            <button
              onClick={() => scrollTo('metodologia')}
              className="flex items-center gap-2.5 py-2 text-left hover:text-amber-400"
            >
              <BookOpen className="w-5 h-5 text-amber-400" />
              Método Koda
            </button>
            <button
              onClick={() => scrollTo('temario')}
              className="flex items-center gap-2.5 py-2 text-left hover:text-amber-400"
            >
              <Layers className="w-5 h-5 text-amber-400" />
              Ruta de 12 Módulos
            </button>
            <button
              onClick={() => scrollTo('demo-interactiva')}
              className="flex items-center gap-2.5 py-2 text-left hover:text-amber-400"
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
              Demo Interactiva
            </button>
            <button
              onClick={() => scrollTo('faq')}
              className="flex items-center gap-2.5 py-2 text-left hover:text-amber-400"
            >
              <HelpCircle className="w-5 h-5 text-amber-400" />
              Preguntas Frecuentes
            </button>
          </nav>
          <div className="pt-2">
            <button
              onClick={() => scrollTo('waitlist')}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-sm font-bold text-slate-950 shadow-md shadow-orange-500/20"
            >
              <Sparkles className="w-4 h-4" />
              Unirme a la Lista de Espera
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
