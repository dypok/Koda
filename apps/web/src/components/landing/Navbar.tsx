'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { LanguageSelector } from './LanguageSelector';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onOpenLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin }) => {
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
        {/* Left: Brand Logo */}
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
              <span className="font-display text-2xl font-bold tracking-tight bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                KodaAcademy
              </span>
            </div>
          </div>
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
