'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SignOut } from '@phosphor-icons/react';
import { useAuthStore } from '@/stores/auth.store';

/** Píldora flotante de perfil: avatar, nivel y salida. */
export const RoadmapProfilePill: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'KD';
  const level = user?.level || 2;

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <div className="absolute right-4 top-4 z-20 flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950/90 py-1.5 pl-1.5 pr-1 backdrop-blur-md">
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-cyan-500/40 bg-slate-900 font-mono text-[11px] font-bold text-cyan-300">
        {initials}
        <span className="absolute -bottom-1 -right-1 rounded-md border border-amber-500/60 bg-slate-950 px-1 font-mono text-[8px] font-bold leading-none text-amber-400">
          {level}
        </span>
      </span>
      <button
        type="button"
        onClick={handleLogout}
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-800 hover:text-rose-400 cursor-pointer"
      >
        <SignOut className="h-4 w-4" />
      </button>
    </div>
  );
};

export default RoadmapProfilePill;
