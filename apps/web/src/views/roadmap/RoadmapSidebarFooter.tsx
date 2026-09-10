'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { IconLogout, IconSettings } from '@tabler/icons-react';
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

  return (
    <div className="pt-3 border-t border-slate-800/40 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
          {initials}
        </div>
        <div className="hidden lg:flex flex-col min-w-0">
          <span className="truncate text-xs font-bold text-slate-200 font-mono">
            {user?.fullName || 'Estudiante'}
          </span>
          <span className="text-[10px] font-mono text-slate-400 truncate">
            {user?.email || 'Sesión activa'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-900/60 transition-colors"
          title="Ajustes de Perfil"
        >
          <IconSettings className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900/60 transition-colors"
          title="Cerrar sesión"
        >
          <IconLogout className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
