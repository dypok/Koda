'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SignOut, Gear, Shield } from '@phosphor-icons/react';
import { useAuthStore } from '@/stores/auth.store';

export function RoadmapSidebarFooter() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'KD';

  const userLevel = user?.level || 2;
  const getRankTitle = (lvl: number) => {
    if (lvl <= 1) return 'Cadete Espacial';
    if (lvl <= 3) return 'Explorador de Código';
    if (lvl <= 6) return 'Navegante de Algoritmos';
    return 'Comandante FullStack';
  };

  const rankTitle = getRankTitle(userLevel);

  return (
    <div className="pt-3 border-t border-slate-800/40 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2.5 min-w-0 relative group">
        {/* Avatar with Orbital Level Pill */}
        <div className="relative shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-slate-950 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.15)] group-hover:border-cyan-400/80 transition-colors">
            {initials}
          </div>
          <span
            className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-md bg-slate-950 border border-amber-500/60 text-[8px] font-mono font-bold text-amber-400 leading-none shadow-sm"
            title={`Nivel ${userLevel}`}
          >
            L{userLevel}
          </span>
        </div>

        {/* Collapsed Mode Popover Tooltip for < lg screens */}
        <div className="lg:hidden absolute left-full ml-3 bottom-0 px-3 py-2 rounded-xl bg-slate-950/95 border border-slate-700/80 shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 whitespace-nowrap backdrop-blur-md">
          <p className="text-xs font-mono font-bold text-slate-100">{user?.fullName || 'Estudiante'}</p>
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-0.5">
            <span className="text-cyan-400">{rankTitle}</span>
            <span>•</span>
            <span className="text-amber-400">Nivel {userLevel}</span>
          </div>
        </div>

        {/* Full Details on lg screens */}
        <div className="hidden lg:flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-xs font-bold text-slate-200 font-mono">
              {user?.fullName || 'Estudiante'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Sesión activa en línea" />
          </div>
          <div className="flex items-center gap-1 text-[9px] font-mono text-cyan-400/90 truncate">
            <Shield className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
            <span className="truncate">{rankTitle}</span>
          </div>
        </div>
      </div>

      {/* Quick Action Controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-300 hover:bg-slate-900/80 border border-transparent hover:border-slate-800 transition-all cursor-pointer"
          title="Ajustes de Perfil"
          aria-label="Ajustes de perfil"
        >
          <Gear className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/30 transition-all cursor-pointer"
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
        >
          <SignOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

