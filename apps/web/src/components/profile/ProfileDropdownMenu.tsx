'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gear,
  Sparkle,
  Palette,
  Trophy,
  SignOut,
  CaretRight,
  ShieldCheck,
} from '@phosphor-icons/react';
import type { AuthUser } from '@/stores/auth.store';
import type { SettingsTab } from './ProfileSettingsModal';

interface ProfileDropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser | null;
  onOpenSettings: (tab: SettingsTab) => void;
  onLogout: () => void;
}

export const ProfileDropdownMenu: React.FC<ProfileDropdownMenuProps> = ({
  isOpen,
  onClose,
  user,
  onOpenSettings,
  onLogout,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click afuera
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'KD';

  const avatarSrc = user?.avatarUrl || '/avatars/koda-classic.svg';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="absolute right-0 top-12 z-50 w-72 origin-top-right rounded-2xl border border-slate-700/70 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-2xl"
        >
          {/* Header del Usuario */}
          <div className="flex items-center gap-3 rounded-xl bg-slate-950/60 p-3">
            <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full border-2 border-amber-500/60 bg-slate-800 p-0.5 shadow-inner">
              <img
                src={avatarSrc}
                alt={user?.fullName || 'Usuario Koda'}
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/avatars/koda-classic.svg';
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-xs font-bold text-slate-100">
                  {user?.fullName || 'Estudiante Koda'}
                </span>
                <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0 text-amber-400" weight="fill" />
              </div>
              <p className="truncate text-[11px] text-slate-400 font-mono">
                {user?.email || 'estudiante@koda.academy'}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded-md border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-300">
                  NIVEL {user?.level || 1}
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  {user?.totalXp || 0} XP
                </span>
              </div>
            </div>
          </div>

          <div className="my-1.5 h-px bg-slate-800/80" />

          {/* Opciones del Menú */}
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSettings('profile');
              }}
              className="group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-amber-500/15 hover:text-amber-300 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Gear className="h-4 w-4 text-slate-400 group-hover:text-amber-300 transition-colors" />
                <span>Configuración de Perfil</span>
              </div>
              <CaretRight className="h-3 w-3 text-slate-500 group-hover:text-amber-300 transition-colors" />
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSettings('avatars');
              }}
              className="group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-amber-500/15 hover:text-amber-300 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Sparkle className="h-4 w-4 text-slate-400 group-hover:text-amber-300 transition-colors" />
                <span>Selector de Avatares</span>
              </div>
              <CaretRight className="h-3 w-3 text-slate-500 group-hover:text-amber-300 transition-colors" />
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSettings('appearance');
              }}
              className="group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-amber-500/15 hover:text-amber-300 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Palette className="h-4 w-4 text-slate-400 group-hover:text-amber-300 transition-colors" />
                <span>Fondo y Temas</span>
              </div>
              <CaretRight className="h-3 w-3 text-slate-500 group-hover:text-amber-300 transition-colors" />
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSettings('metrics');
              }}
              className="group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-amber-500/15 hover:text-amber-300 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Trophy className="h-4 w-4 text-slate-400 group-hover:text-amber-300 transition-colors" />
                <span>Métricas en Vivo</span>
              </div>
              <CaretRight className="h-3 w-3 text-slate-500 group-hover:text-amber-300 transition-colors" />
            </button>
          </div>

          <div className="my-1.5 h-px bg-slate-800/80" />

          {/* Cerrar Sesión */}
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-400 transition-colors hover:bg-rose-500/15 hover:text-rose-300 cursor-pointer"
          >
            <SignOut className="h-4 w-4 text-rose-400" />
            <span>Cerrar sesión</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileDropdownMenu;
