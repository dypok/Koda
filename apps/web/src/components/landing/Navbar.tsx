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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo (k{}da wordmark) */}
        <Link href="/" className="flex items-center focus:outline-none" aria-label="Koda">
          <Image
            src="/brand/logo.svg"
            alt="Koda"
            width={498}
            height={185}
            className="h-6 sm:h-7 w-auto object-contain select-none"
            priority
          />
        </Link>

        {/* Right: Selector de idioma desplegable */}
        <div className="flex items-center gap-3">
          <LanguageSelector />
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
