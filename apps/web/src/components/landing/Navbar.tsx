'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IconLogin } from '@tabler/icons-react';
import { GradientButton } from '@/components/ui/gradient-button';

interface NavbarProps {
  onOpenLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-transparent border-b border-transparent -mb-16">
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
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                KodaAcademy
              </span>
            </div>
          </div>
        </Link>

        {/* Right: CTA Iniciar Sesión */}
        <div className="flex items-center gap-3">
          <GradientButton
            onClick={onOpenLogin}
            size="sm"
            className="gap-2 shadow-none"
          >
            <IconLogin className="w-4 h-4" />
            Iniciar Sesión
          </GradientButton>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
