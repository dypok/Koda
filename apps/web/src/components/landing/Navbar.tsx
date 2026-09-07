'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, BookOpen, Layers, HelpCircle, Terminal, LogIn } from 'lucide-react';

interface NavbarProps {
  onOpenLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLoginClick = () => {
    setMobileMenuOpen(false);
    if (onOpenLogin) {
      onOpenLogin();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#182030] border border-slate-800 shadow-md shadow-orange-500/10 group-hover:scale-105 group-hover:border-amber-500/40 transition-all overflow-hidden">
            <Image
              src="/logo.png"
              alt="KodaAcademy Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                Koda<span className="text-amber-400">Academy</span>
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
            <Terminal className="w-4 h-4 text-slate-400" />
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

        {/* Desktop CTA: Iniciar Sesión */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={handleLoginClick}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <LogIn className="w-4 h-4 text-slate-950" />
            Iniciar Sesión
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
              <Terminal className="w-5 h-5 text-amber-400" />
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
              onClick={handleLoginClick}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-sm font-bold text-slate-950 shadow-md shadow-orange-500/20"
            >
              <LogIn className="w-4 h-4" />
              Iniciar Sesión
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
