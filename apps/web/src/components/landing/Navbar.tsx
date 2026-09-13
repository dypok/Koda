'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { LanguageSelector } from './LanguageSelector';
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
        <Link href="/" className="flex shrink-0 items-center focus:outline-none" aria-label="Koda - inicio">
          <Image
            src="/brand/logo.svg"
            alt="Koda"
            width={498}
            height={185}
            className="h-6 sm:h-7 w-auto object-contain select-none"
            priority
          />
        </Link>

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
          <Link
            href="/register"
            className="hidden sm:inline-flex min-h-[44px] items-center rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 transition-all hover:bg-amber-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Comenzar gratis
          </Link>
          <LanguageSelector />
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
