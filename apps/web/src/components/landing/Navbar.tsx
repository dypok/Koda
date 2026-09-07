'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  IconMenu2,
  IconX,
  IconBook2,
  IconStack2,
  IconHelpCircle,
  IconTerminal2,
  IconLogin,
} from '@tabler/icons-react';
import { GradientButton } from '@/components/ui/gradient-button';

interface NavbarProps {
  onOpenLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    setMobileMenuOpen(false);
    if (onOpenLogin) {
      onOpenLogin();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#182030] border border-slate-800 group-hover:scale-105 group-hover:border-amber-500/40 transition-all overflow-hidden">
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
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                KodaAcademy
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => scrollTo('metodologia')}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <IconBook2 className="w-4 h-4 text-slate-400" />
            Metodología
          </button>
          <button
            onClick={() => scrollTo('temario')}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <IconStack2 className="w-4 h-4 text-slate-400" />
            Tracks & Temario
          </button>
          <button
            onClick={() => scrollTo('demo-interactiva')}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <IconTerminal2 className="w-4 h-4 text-slate-400" />
            Práctica en Vivo
          </button>
          <button
            onClick={() => scrollTo('faq')}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <IconHelpCircle className="w-4 h-4 text-slate-400" />
            Preguntas Frecuentes
          </button>
        </nav>

        {/* Desktop CTA: Iniciar Sesión */}
        <div className="hidden md:flex items-center gap-3">
          <GradientButton
            onClick={handleLoginClick}
            className="min-w-0 px-5 py-2.5 text-sm gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            <IconLogin className="w-4 h-4" />
            Iniciar Sesión
          </GradientButton>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-850 transition-colors"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <IconX className="w-6 h-6" /> : <IconMenu2 className="w-6 h-6" />}
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
              <IconBook2 className="w-5 h-5 text-amber-400" />
              Metodología
            </button>
            <button
              onClick={() => scrollTo('temario')}
              className="flex items-center gap-2.5 py-2 text-left hover:text-amber-400"
            >
              <IconStack2 className="w-5 h-5 text-amber-400" />
              Tracks & Temario
            </button>
            <button
              onClick={() => scrollTo('demo-interactiva')}
              className="flex items-center gap-2.5 py-2 text-left hover:text-amber-400"
            >
              <IconTerminal2 className="w-5 h-5 text-amber-400" />
              Práctica en Vivo
            </button>
            <button
              onClick={() => scrollTo('faq')}
              className="flex items-center gap-2.5 py-2 text-left hover:text-amber-400"
            >
              <IconHelpCircle className="w-5 h-5 text-amber-400" />
              Preguntas Frecuentes
            </button>
          </nav>
          <div className="pt-2">
            <GradientButton
              onClick={handleLoginClick}
              className="w-full text-sm gap-2 py-3"
            >
              <IconLogin className="w-4 h-4" />
              Iniciar Sesión
            </GradientButton>
          </div>
        </div>
      )}
    </header>
  );
};
