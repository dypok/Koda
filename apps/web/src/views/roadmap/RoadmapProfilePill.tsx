'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CaretDown } from '@phosphor-icons/react';
import { useAuthStore } from '@/stores/auth.store';
import { useAppearanceStore, ACCENT_PALETTES } from '@/stores/appearance.store';
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
  const { accentTheme } = useAppearanceStore();
  const palette = ACCENT_PALETTES[accentTheme] || ACCENT_PALETTES.amber;

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
      <div className="absolute right-2 sm:right-4 top-2 sm:top-4 z-40">
        {/* Trigger de la Píldora de Perfil */}
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          aria-expanded={dropdownOpen}
          aria-label="Menú de perfil y configuración"
          style={
            dropdownOpen
              ? {
                  borderColor: palette.primary,
                  boxShadow: `0 0 16px ${palette.glow}`,
                }
              : undefined
          }
          className={`group flex items-center gap-2 rounded-full border bg-slate-900/60 py-1 pl-1 pr-2.5 backdrop-blur-xl shadow-xl transition-all cursor-pointer ${
            dropdownOpen
              ? 'ring-2 bg-slate-900/90'
              : 'border-slate-700/60 hover:border-slate-500 hover:bg-slate-800/60'
          }`}
        >
          {/* Avatar del usuario con badge de nivel */}
          <span
            className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border bg-slate-800 shadow-md transition-colors"
            style={{ borderColor: palette.primary }}
          >
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
            <span
              className="hidden fallback:block font-mono text-[10px] font-bold"
              style={{ color: palette.light }}
            >
              {initials}
            </span>
            <span
              className="absolute -bottom-1 -right-1 rounded-md border bg-slate-950 px-1 font-mono text-[8px] font-bold leading-none shadow-sm transition-colors"
              style={{ borderColor: palette.primary, color: palette.light }}
            >
              {level}
            </span>
          </span>

          {/* Nombre / Chevron */}
          <span className="hidden sm:inline-block max-w-[90px] truncate text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
            {user?.fullName?.split(' ')[0] || 'Mi Perfil'}
          </span>

          <CaretDown
            className={`h-3 w-3 text-slate-400 transition-all duration-200 ${
              dropdownOpen ? 'rotate-180' : ''
            }`}
            style={dropdownOpen ? { color: palette.light } : undefined}
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
