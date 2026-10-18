'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ShieldCheck, Trophy, Sparkle, X, Check, ArrowRight } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface RoadmapStreakPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  xp: number;
  longestStreak: number;
  streakFreezeCount: number;
  isActiveToday: boolean;
  onContinue?: () => void;
}

const WEEK_DAYS = [
  { key: 'mon', label: 'L', full: 'Lunes' },
  { key: 'tue', label: 'M', full: 'Martes' },
  { key: 'wed', label: 'M', full: 'Miércoles' },
  { key: 'thu', label: 'J', full: 'Jueves' },
  { key: 'fri', label: 'V', full: 'Viernes' },
  { key: 'sat', label: 'S', full: 'Sábado' },
  { key: 'sun', label: 'D', full: 'Domingo' },
];

export const RoadmapStreakPopover: React.FC<RoadmapStreakPopoverProps> = ({
  isOpen,
  onClose,
  streak,
  xp,
  longestStreak,
  streakFreezeCount,
  isActiveToday,
  onContinue,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  // Determinar el índice del día actual en la semana (0 = Lunes, 6 = Domingo)
  const currentDayIndex = (() => {
    const jsDay = new Date().getDay(); // 0 = Domingo, 1 = Lunes, ...
    return jsDay === 0 ? 6 : jsDay - 1;
  })();

  // Cierre por click outside y teclado Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (popoverRef.current && !popoverRef.current.contains(target)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, y: 12, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Detalle de racha diaria y progreso de aprendizaje"
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40 w-[92vw] max-w-sm rounded-3xl border border-slate-700/70 bg-slate-950/90 p-5 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-slate-100 select-none no-drag"
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
        >
          {/* Botón cerrar */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana de racha"
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Encabezado con Fuego */}
          <div className="flex items-center gap-3.5 mb-4">
            <div className="relative flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 shadow-[0_0_20px_rgba(255,106,0,0.25)]">
              <Flame
                weight="fill"
                className={cn(
                  'h-7 w-7 transition-transform',
                  isActiveToday
                    ? 'text-orange-500 drop-shadow-[0_0_12px_rgba(255,106,0,0.85)] animate-pulse'
                    : 'text-slate-500'
                )}
              />
              {isActiveToday && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-slate-950" />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xl font-black tracking-tight text-white">
                  {streak} {streak === 1 ? 'Día' : 'Días'}
                </span>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wide uppercase border',
                    isActiveToday
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  )}
                >
                  {isActiveToday ? 'Activa hoy' : 'Pendiente hoy'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isActiveToday
                  ? '¡Fuego encendido! Has completado tu práctica de hoy.'
                  : 'Completa una lección para mantener tu racha viva.'}
              </p>
            </div>
          </div>

          {/* Tracker Semanal de Racha (L M M J V S D) */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3.5 mb-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5 font-mono font-medium">
              <span>Semana en curso</span>
              <span className="text-[11px] text-orange-400/90 font-bold">
                {isActiveToday ? 'Al día' : 'Meta diaria: 1 lección'}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5" role="list" aria-label="Progreso semanal de racha">
              {WEEK_DAYS.map((day, idx) => {
                const isPast = idx < currentDayIndex;
                const isCurrent = idx === currentDayIndex;
                const isCompleted = isCurrent ? isActiveToday : (isPast && streak > (currentDayIndex - idx));

                return (
                  <div key={day.key} className="flex flex-col items-center gap-1.5" role="listitem">
                    <span
                      className={cn(
                        'text-[10px] font-mono font-bold',
                        isCurrent ? 'text-orange-400' : 'text-slate-400'
                      )}
                    >
                      {day.label}
                    </span>
                    <div
                      className={cn(
                        'h-8 w-8 rounded-full flex items-center justify-center transition-all',
                        isCompleted
                          ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(255,106,0,0.5)]'
                          : isCurrent
                          ? 'border-2 border-dashed border-orange-500/80 bg-orange-500/10 text-orange-400 animate-pulse'
                          : 'border border-slate-800 bg-slate-900/40 text-slate-600'
                      )}
                      title={`${day.full}: ${isCompleted ? 'Completado' : isCurrent ? 'Pendiente' : 'Sin actividad'}`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : isCurrent ? (
                        <Flame weight="fill" className="w-4 h-4 text-orange-400/70" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Métricas O(1) de Gamificación */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {/* Protectores de racha */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-cyan-400 text-[10px] font-mono font-bold uppercase mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Freeze</span>
              </div>
              <span className="font-mono text-base font-extrabold text-white">
                {streakFreezeCount}/2
              </span>
              <p className="text-[9px] text-slate-400 leading-tight mt-0.5">Protectores</p>
            </div>

            {/* Récord histórico */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400 text-[10px] font-mono font-bold uppercase mb-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>Récord</span>
              </div>
              <span className="font-mono text-base font-extrabold text-white">
                {longestStreak}D
              </span>
              <p className="text-[9px] text-slate-400 leading-tight mt-0.5">Histórico</p>
            </div>

            {/* Total XP */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-orange-400 text-[10px] font-mono font-bold uppercase mb-1">
                <Sparkle className="w-3.5 h-3.5" />
                <span>XP</span>
              </div>
              <span className="font-mono text-base font-extrabold text-white">
                +{xp}
              </span>
              <p className="text-[9px] text-slate-400 leading-tight mt-0.5">Puntos</p>
            </div>
          </div>

          {/* Botón CTA para continuar */}
          {onContinue && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onContinue();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-mono text-xs font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 shadow-[0_0_15px_rgba(255,106,0,0.35)] hover:shadow-[0_0_20px_rgba(255,106,0,0.55)] transition-all cursor-pointer"
            >
              <span>{isActiveToday ? 'Continuar aprendiendo' : 'Comenzar lección de hoy'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
