'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LanguageSelector } from './LanguageSelector';
import { KodaLogo } from './KodaLogo';
import { WipeButton } from '@/components/ui/wipe-button';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300 ease-out -mb-16',
        isScrolled
          ? 'bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-md shadow-black/50'
          : 'bg-transparent border-b border-transparent shadow-none'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo (k{}da wordmark) */}
        <KodaLogo imgClassName="h-6 w-auto sm:h-7" />

        {/* Center: Desktop nav */}
        <nav aria-label="Principal" className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
          <Link
            href="#metodologia"
            className="rounded-lg px-3 py-2 transition-colors hover:text-white hover:bg-slate-800/60"
          >
            Metodología
          </Link>
          <Link
            href="#vista-previa"
            className="rounded-lg px-3 py-2 transition-colors hover:text-white hover:bg-slate-800/60"
          >
            Vista previa
          </Link>
        </nav>

        {/* Right: CTA + Selector de idioma desplegable */}
        <div className="flex items-center gap-2 sm:gap-3">
          <WipeButton
            href="/register"
            size="sm"
            className="hidden sm:inline-flex px-4 font-bold"
          >
            Comenzar gratis
          </WipeButton>
          <LanguageSelector />
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
