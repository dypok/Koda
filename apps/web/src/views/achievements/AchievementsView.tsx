'use client';

import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Trophy,
  Medal,
  Sparkle,
  Flame,
  Lightning,
  BookOpen,
  ArrowsClockwise,
  CheckCircle,
  LockKey,
} from '@phosphor-icons/react';
import { useAchievementStore, type AchievementStatusFilter } from '@/stores/achievement.store';
import { AchievementCard } from '@/components/gamification/AchievementCard';
import { OrbitFieldBackground } from '@/components/landing/OrbitFieldBackground';
import type { AchievementCategory } from '@koda/types';

const CATEGORIES: { id: AchievementCategory | 'all'; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'Todos', icon: <Medal className="h-4 w-4" /> },
  { id: 'streak', label: 'Rachas', icon: <Flame className="h-4 w-4" /> },
  { id: 'xp', label: 'Experiencia', icon: <Lightning className="h-4 w-4" /> },
  { id: 'curriculum', label: 'Currículo', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'mastery', label: 'Maestría', icon: <Sparkle className="h-4 w-4" /> },
  { id: 'speed', label: 'Velocidad', icon: <Lightning className="h-4 w-4" /> },
];

export const AchievementsView: React.FC = () => {
  const {
    achievements,
    stats,
    isLoading,
    categoryFilter,
    statusFilter,
    fetchAchievements,
    checkAchievements,
    setCategoryFilter,
    setStatusFilter,
  } = useAchievementStore();

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  // Filtrado reactivo en cliente
  const filteredAchievements = useMemo(() => {
    return achievements.filter((ach) => {
      // Filtro de categoría
      if (categoryFilter !== 'all' && ach.category !== categoryFilter) {
        return false;
      }
      // Filtro de estado
      if (statusFilter === 'unlocked' && !ach.is_unlocked) {
        return false;
      }
      if (statusFilter === 'locked' && ach.is_unlocked) {
        return false;
      }
      return true;
    });
  }, [achievements, categoryFilter, statusFilter]);

  const totalCount = stats?.total ?? achievements.length;
  const unlockedCount = stats?.unlocked_count ?? achievements.filter((a) => a.is_unlocked).length;
  const totalXpEarned =
    stats?.total_xp_earned ??
    achievements.filter((a) => a.is_unlocked).reduce((sum, a) => sum + a.xp_reward, 0);
  const globalProgress = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Fondo estelar */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <OrbitFieldBackground />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Cabecera superior con navegación */}
        <header className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-amber-500/40 hover:text-amber-300 transition-colors shadow-sm"
              title="Volver al Roadmap"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="relative h-7 w-7">
                <Image
                  src="/brand/koda-logo-gradient.svg"
                  alt="Koda"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-mono text-xs tracking-wider text-slate-400 uppercase">
                Gamificación · Koda
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => checkAchievements()}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-all hover:border-amber-500/50 hover:bg-slate-800 hover:text-amber-300 disabled:opacity-50 cursor-pointer shadow-sm"
              title="Conciliar logros con el servidor"
            >
              <ArrowsClockwise
                className={`h-3.5 w-3.5 text-amber-400 ${isLoading ? 'animate-spin' : ''}`}
              />
              <span>Actualizar logros</span>
            </button>
          </div>
        </header>

        {/* Título de la página y Resumen */}
        <div className="mt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-mono font-medium text-amber-300">
              <Trophy className="h-3.5 w-3.5" weight="fill" />
              <span>Vitrina de Honor y Conquistas</span>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Logros y Medallas Desbloqueables
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400 leading-relaxed">
              Consigue hitos pedagógicos, mantén tus rachas y resuelve desafíos de código para
              acumular medallas exclusivas y bonificaciones directas de XP en tu perfil.
            </p>
          </div>

          {/* Tarjeta de métricas globales */}
          <div className="flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-xl">
            <div className="text-center">
              <span className="block text-2xl font-black text-amber-400 font-mono">
                {unlockedCount} / {totalCount}
              </span>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Desbloqueados ({globalProgress}%)
              </span>
            </div>
            <div className="h-10 w-px bg-slate-800" />
            <div className="text-center">
              <span className="block text-2xl font-black text-emerald-400 font-mono">
                +{totalXpEarned}
              </span>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                XP de Medallas
              </span>
            </div>
          </div>
        </div>

        {/* Barra de Progreso Global */}
        <div className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Progreso del Salón de la Fama</span>
            <span className="font-bold text-amber-400">{globalProgress}% completado</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${globalProgress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400"
            />
          </div>
        </div>

        {/* Barra de Controles: Filtros de Categoría y Estado */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          {/* Categorías */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => {
              const isActive = categoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'bg-slate-900/70 text-slate-400 border border-slate-800/80 hover:bg-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Filtros de Estado */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-800/90 bg-slate-900/80 p-1">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-800 text-slate-100 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos ({achievements.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('unlocked')}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === 'unlocked'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle className="h-3 w-3" />
              <span>Desbloqueados ({unlockedCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('locked')}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === 'locked'
                  ? 'bg-slate-800 text-amber-300 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LockKey className="h-3 w-3" />
              <span>En progreso ({totalCount - unlockedCount})</span>
            </button>
          </div>
        </div>

        {/* Grid de Medallas */}
        <div className="mt-8">
          {isLoading && achievements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ArrowsClockwise className="h-8 w-8 animate-spin text-amber-400" />
              <p className="mt-4 text-sm font-mono text-slate-400">
                Cargando tu vitrina de logros...
              </p>
            </div>
          ) : filteredAchievements.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-500">
                <Medal className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-200">
                No hay logros con los filtros seleccionados
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Prueba cambiando los filtros de categoría o estado arriba.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {filteredAchievements.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
