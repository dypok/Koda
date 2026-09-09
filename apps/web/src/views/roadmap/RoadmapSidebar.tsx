'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { IconFlame, IconStar, IconLogout, IconLock } from '@tabler/icons-react';
import { SIDEBAR_LANGUAGES } from '@/models/roadmap/python-roadmap.mock';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';

export const RoadmapSidebar: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { selectedLanguageId, setLanguage } = useRoadmapStore();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <aside className="w-16 sm:w-20 lg:w-64 shrink-0 min-h-screen border-r border-slate-800/40 flex flex-col justify-between p-3 sm:p-4 bg-slate-950/40 backdrop-blur-[2px] z-20 select-none">
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2 py-1">
          <Image src="/brand/logo.svg" alt="Koda" width={498} height={185} className="h-7 w-auto object-contain" priority />
        </div>

        <div className="space-y-1.5">
          <div className="hidden lg:block px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Lenguajes
          </div>
          {SIDEBAR_LANGUAGES.map((lang) => {
            const Icon = lang.icon;
            const isSelected = selectedLanguageId === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => lang.isAvailable && setLanguage(lang.id)}
                disabled={!lang.isAvailable}
                className={cn(
                  'w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left text-xs font-semibold',
                  isSelected ? 'bg-amber-500/15 text-white border border-amber-500/40 shadow-sm'
                    : lang.isAvailable ? 'text-slate-300 hover:bg-slate-900/60 hover:text-white'
                    : 'text-slate-600 cursor-not-allowed opacity-60'
                )}
              >
                <div className="p-1.5 rounded-lg bg-slate-900/80 shrink-0" style={{ color: lang.color }}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="hidden lg:flex flex-col flex-1 min-w-0">
                  <span className="truncate">{lang.name}</span>
                  <span className="text-[10px] text-slate-500">
                    {lang.isAvailable ? `⭐ ${lang.earnedStars}/${lang.totalStars}` : 'Próximamente'}
                  </span>
                </div>
                {!lang.isAvailable && <IconLock className="hidden lg:block w-3.5 h-3.5 text-slate-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-800/40">
        <div className="hidden lg:flex items-center justify-between text-xs font-bold px-1">
          <span className="flex items-center gap-1 text-orange-400">
            <IconFlame className="w-3.5 h-3.5 fill-orange-500" />
            {user?.streak || 1}d
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <IconStar className="w-3.5 h-3.5 fill-amber-400" />
            {user?.totalXp || 50} XP
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
              {user?.fullName ? user.fullName.slice(0, 2).toUpperCase() : 'KD'}
            </div>
            <span className="hidden lg:block truncate text-xs font-semibold text-slate-300">{user?.fullName || 'Estudiante'}</span>
          </div>
          <button onClick={handleLogout} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900/60 transition-colors" title="Cerrar sesión">
            <IconLogout className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </aside>
  );
};
