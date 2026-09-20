'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CaretDown } from '@phosphor-icons/react';
import { useAuthStore } from '@/stores/auth.store';
import { ProfileDropdownMenu } from '@/components/profile/ProfileDropdownMenu';
import { ProfileSettingsModal, SettingsTab } from '@/components/profile/ProfileSettingsModal';

/**
 * Píldora flotante superior derecha en la ruta.
 * Muestra el avatar real del usuario y nivel, y al hacer clic despliega
 * el menú con acceso a Configuración, Selector de Avatares, Temas y Cerrar Sesión.
 */
export const RoadmapProfilePill: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('profile');

  const avatarSrc = user?.avatarUrl || '/avatars/koda-classic.svg';
  const level = user?.level || 1;
  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'KD';

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    router.replace('/login');
  };

  const handleOpenSettings = (tab: SettingsTab) => {
    setDropdownOpen(false);
    setSettingsTab(tab);
    setSettingsOpen(true);
  };

  return (
    <>
      <div className="absolute right-4 top-4 z-20">
        {/* Trigger de la Píldora de Perfil */}
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          aria-expanded={dropdownOpen}
          aria-label="Menú de perfil y configuración"
          className={`group flex items-center gap-2 rounded-full border bg-slate-900/60 py-1 pl-1 pr-2.5 backdrop-blur-xl shadow-xl transition-all cursor-pointer ${
            dropdownOpen
              ? 'border-amber-400/80 ring-2 ring-amber-500/20 bg-slate-900/90'
              : 'border-slate-700/60 hover:border-amber-500/50 hover:bg-slate-800/60'
          }`}
        >
          {/* Avatar del usuario con badge de nivel */}
          <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-amber-500/50 bg-slate-800 shadow-md">
            <img
              src={avatarSrc}
              alt={user?.fullName || 'Avatar del usuario'}
              className="h-full w-full object-contain"
              onError={(e) => {
                // Fallback a iniciales si falla la carga
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.classList.add('fallback-initials');
              }}
            />
            <span className="hidden fallback:block font-mono text-[10px] font-bold text-amber-300">
              {initials}
            </span>
            <span className="absolute -bottom-1 -right-1 rounded-md border border-amber-500/70 bg-slate-950 px-1 font-mono text-[8px] font-bold leading-none text-amber-400 shadow-sm">
              {level}
            </span>
          </span>

          {/* Nombre / Chevron */}
          <span className="hidden sm:inline-block max-w-[90px] truncate text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition-colors">
            {user?.fullName?.split(' ')[0] || 'Mi Perfil'}
          </span>

          <CaretDown
            className={`h-3 w-3 text-slate-400 transition-transform duration-200 group-hover:text-amber-300 ${
              dropdownOpen ? 'rotate-180 text-amber-400' : ''
            }`}
          />
        </button>

        {/* Menú Desplegable Popover */}
        <ProfileDropdownMenu
          isOpen={dropdownOpen}
          onClose={() => setDropdownOpen(false)}
          user={user}
          onOpenSettings={handleOpenSettings}
          onLogout={handleLogout}
        />
      </div>

      {/* Modal de Configuración y Perfil */}
      <ProfileSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        initialTab={settingsTab}
      />
    </>
  );
};

export default RoadmapProfilePill;
