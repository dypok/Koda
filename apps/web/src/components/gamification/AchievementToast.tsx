'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Trophy, X, Sparkle, ArrowRight } from '@phosphor-icons/react';
import { useAchievementStore } from '@/stores/achievement.store';

export const AchievementToast: React.FC = () => {
  const router = useRouter();
  const achievement = useAchievementStore((s) => s.recentUnlockedToast);
  const dismissToast = useAchievementStore((s) => s.dismissToast);

  // Auto-descartar después de 6.5 segundos
  useEffect(() => {
    if (!achievement) return;
    const timer = setTimeout(() => {
      dismissToast();
    }, 6500);
    return () => clearTimeout(timer);
  }, [achievement, dismissToast]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="fixed bottom-6 right-6 z-[100] max-w-sm overflow-hidden rounded-2xl border border-amber-500/50 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-2xl ring-1 ring-amber-500/30"
        >
          {/* Resplandor animado de fondo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-amber-500/20 blur-2xl"
          />

          <div className="flex items-start gap-3.5">
            {/* Medalla animada */}
            <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-400/30 via-amber-500/20 to-orange-600/30 text-amber-300 shadow-lg">
              <Trophy className="h-6 w-6 text-amber-300 drop-shadow-md animate-bounce" weight="fill" />
              <Sparkle
                className="absolute -right-1 -top-1 h-3.5 w-3.5 text-yellow-200 animate-spin"
                weight="fill"
              />
            </div>

            {/* Contenido */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  ¡Logro Desbloqueado!
                </span>
                <button
                  type="button"
                  onClick={dismissToast}
                  aria-label="Cerrar notificación"
                  className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <h4 className="mt-0.5 truncate text-sm font-bold text-slate-100">
                {achievement.title}
              </h4>
              <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">
                {achievement.description}
              </p>

              <div className="mt-2.5 flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                  +{achievement.xp_reward} XP
                </span>

                <button
                  type="button"
                  onClick={() => {
                    dismissToast();
                    router.push('/app/logros');
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 transition-colors hover:text-amber-300 hover:underline cursor-pointer"
                >
                  <span>Ver vitrina</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
