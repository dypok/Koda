'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Flame, Star, SignOut, Code, ArrowRight } from '@phosphor-icons/react';
import { WipeButton } from '@/components/ui/wipe-button';
import { HeroSkyBackground } from '@/components/landing/HeroSkyBackground';
import { useAuthStore } from '@/stores/auth.store';

export const StudentDashboardView: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      <HeroSkyBackground starCount={120} interactive={true} className="fixed inset-0 pointer-events-none -z-10" />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-800/60 bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          <Image src="/brand/logo.svg" alt="Koda" width={498} height={185} className="h-7 w-auto object-contain" priority />

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold">
              <Flame className="w-4 h-4 fill-orange-500" />
              {user?.streak || 1} días
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              {user?.totalXp || 50} XP
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-slate-800/40 transition-colors"
              title="Cerrar sesión"
            >
              <SignOut className="w-4 h-4" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Student Campus Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 sm:py-12 space-y-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/60">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ¡Bienvenido al Campus, {user?.fullName || 'Estudiante'}! 🦊
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Tu ruta activa: <strong className="text-amber-400">Python 3.12</strong>. Continúa tu progreso.
            </p>
          </div>
          <WipeButton onClick={() => alert('Próximamente: Lección Interactiva')} className="py-2.5 px-5 text-sm gap-2">
            <span>Continuar Ruta</span>
            <ArrowRight className="w-4 h-4" />
          </WipeButton>
        </div>

        {/* Current Module Overview - Integrated into page, NO CARDS */}
        <div className="space-y-3 pb-6 border-b border-slate-800/60">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-2"><Code className="w-4 h-4 text-amber-400" /> Módulo 01: Fundamentos</span>
            <span className="text-emerald-400">En progreso · 35%</span>
          </div>
          <h2 className="text-xl font-bold text-white">Variables, tipos de datos y operadores en Python</h2>
          <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full" style={{ width: '35%' }} />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Lección 2 de 8</span>
            <span>Meta de hoy: 10 min de práctica diaria</span>
          </div>
        </div>
      </main>
    </div>
  );
};
