'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CaretDown, BookOpen } from '@phosphor-icons/react';
import { useAuthStore } from '@/stores/auth.store';
import { useAppearanceStore, ACCENT_PALETTES } from '@/stores/appearance.store';
import { useNotebookStore } from '@/stores/notebook.store';
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
  const [imgError, setImgError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { mistakes, fetchMistakes } = useNotebookStore();
  const pendingCount = mistakes.filter((m) => !m.is_resolved).length;

  useEffect(() => {
    if (user?.id) {
      fetchMistakes();
    }
  }, [user?.id, fetchMistakes]);

  const rawAvatar = user?.avatarUrl;
  const avatarSrc = (!rawAvatar || rawAvatar.includes('koda-mascot-cartoon-2d'))
    ? '/avatars/koda-classic.svg'
    : rawAvatar;

  useEffect(() => {
    setImgError(false);
  }, [avatarSrc]);

  // Cerrar al hacer clic fuera del contenedor (que engloba el botón y el menú)
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };

    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen]);

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
      <div ref={containerRef} className="absolute right-2 sm:right-4 top-2 sm:top-4 z-40 flex items-center gap-2">
        {/* Acceso Directo al Cuaderno de Errores */}
        <Link
          href="/cuaderno"
          className="group flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-900/60 py-1.5 px-3 backdrop-blur-xl shadow-xl transition-all hover:border-amber-500/50 hover:bg-slate-800/80 cursor-pointer"
          title="Abrir Cuaderno de Errores (SM-2)"
        >
          <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-amber-300 transition-colors" />
          <span className="hidden sm:inline font-mono text-[11px] font-bold text-slate-300 group-hover:text-amber-300 transition-colors">
            Cuaderno
          </span>
          {pendingCount > 0 ? (
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 font-mono text-[10px] font-black animate-pulse">
              {pendingCount}
            </span>
          ) : null}
        </Link>

        {/* Trigger de la Píldora de Perfil */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setDropdownOpen((prev) => !prev);
          }}
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
          <div className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center">
            <div
              className="h-full w-full overflow-hidden rounded-full border bg-slate-800 shadow-md transition-colors flex items-center justify-center"
              style={{ borderColor: palette.primary }}
            >
              {!imgError && avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user?.fullName || 'Avatar del usuario'}
                  className="h-full w-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span
                  className="font-mono text-[10px] font-bold"
                  style={{ color: palette.light }}
                >
                  {initials}
                </span>
              )}
            </div>
            {/* Badge de nivel (fuera del contenedor con overflow-hidden para evitar que se corte) */}
            <span
              className="absolute -bottom-1 -right-1 z-10 rounded-full border bg-slate-950 px-1 py-0.5 font-mono text-[8px] font-bold leading-none shadow-sm transition-colors"
              style={{ borderColor: palette.primary, color: palette.light }}
            >
              {level}
            </span>
          </div>

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
