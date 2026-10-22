'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FloppyDisk,
  ArrowCounterClockwise,
  CheckCircle,
  WarningCircle,
  ShieldCheck,
  SignOut,
  Terminal,
  Compass,
  CaretDown,
} from '@phosphor-icons/react';
import { useAdminCurriculumStore } from '@/stores/admin-curriculum.store';
import { useAuthStore } from '@/stores/auth.store';

export const AdminTopHud: React.FC = () => {
  const { user, logout } = useAuthStore();
  const {
    draftTracks,
    selectedTrackSlug,
    selectTrack,
    isDirty,
    pendingChangesCount,
    saveChanges,
    discardChanges,
  } = useAdminCurriculumStore();

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSave = () => {
    const result = saveChanges();
    setNotification({
      message: result.message,
      type: result.success ? 'success' : 'error',
    });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleDiscard = () => {
    if (window.confirm('Deseas descartar todas las modificaciones pendientes en el borrador?')) {
      discardChanges();
      setNotification({ message: 'Modificaciones descartadas.', type: 'success' });
      setTimeout(() => setNotification(null), 2500);
    }
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Zona Izquierda: Identidad y Selector de Ruta Activa */}
      <div className="flex items-center gap-4 sm:gap-6">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-all">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-1.5">
              <span>Koda Cockpit</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded border border-amber-500/40 font-mono">
                ADMIN
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Panel de Control Curricular</div>
          </div>
        </Link>

        {/* Selector de Ruta Activa */}
        <div className="relative flex items-center">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline text-slate-500 text-[11px]">Ruta:</span>
            <select
              value={selectedTrackSlug}
              onChange={(e) => selectTrack(e.target.value)}
              className="bg-transparent text-white font-medium text-xs focus:outline-none cursor-pointer pr-1"
            >
              {draftTracks.map((track) => (
                <option key={track.slug} value={track.slug} className="bg-slate-900 text-white">
                  {track.name}
                </option>
              ))}
            </select>
            <CaretDown className="w-3 h-3 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Telemetria de Estado de Sistemas */}
        <div className="hidden xl:flex items-center gap-3 text-[11px] font-mono text-slate-400 border-l border-slate-800 pl-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Judge0 Sandbox: Activo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>DB: Sincronizada</span>
          </div>
        </div>
      </div>

      {/* Zona Derecha: Guardado Explícito y Perfil */}
      <div className="flex items-center gap-3">
        {/* Notificacion emergente de accion */}
        {notification && (
          <div
            className={`hidden md:flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg border animate-fadeIn ${
              notification.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <WarningCircle className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Controles de Guardado Explícito con Buffer de Cambios */}
        {isDirty ? (
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 p-1 rounded-xl animate-fadeIn">
            <button
              type="button"
              onClick={handleDiscard}
              title="Descartar modificaciones no guardadas"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
            >
              <ArrowCounterClockwise className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <FloppyDisk className="w-4 h-4" />
              <span>Guardar</span>
              <span className="bg-slate-950 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                {pendingChangesCount}
              </span>
            </button>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sin cambios pendientes</span>
          </div>
        )}

        {/* Selector de Modo y Perfil */}
        <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
          <Link
            href="/"
            title="Ver plataforma como estudiante"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-mono transition-colors"
          >
            <span>Ver Estudiante</span>
          </Link>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl p-1.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-mono font-bold text-xs">
              AD
            </div>
            <div className="hidden lg:block text-left pr-1">
              <div className="text-xs font-semibold text-white leading-tight">
                {user?.fullName || 'Admin Master'}
              </div>
              <div className="text-[10px] text-slate-500 font-mono leading-tight">
                {user?.email || 'admin@koda.academy'}
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Cerrar sesion"
              className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors"
            >
              <SignOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
