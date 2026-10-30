'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkle,
  Flame,
  Lightning,
  User,
  Shield,
  Trophy,
  Star,
  BookOpen,
  ShieldCheck,
  Crown,
  Medal,
  CheckCircle,
  LockKey,
} from '@phosphor-icons/react';
import type { AchievementItem, AchievementCategory } from '@koda/types';

interface AchievementCardProps {
  achievement: AchievementItem;
  onClick?: () => void;
}

const CATEGORY_CONFIG: Record<
  AchievementCategory,
  {
    label: string;
    badgeBg: string;
    badgeText: string;
    glowBorder: string;
    iconBg: string;
    iconColor: string;
    progressBar: string;
  }
> = {
  streak: {
    label: 'Racha',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-400',
    glowBorder: 'border-amber-500/30 hover:border-amber-500/60 shadow-amber-500/10',
    iconBg: 'bg-gradient-to-br from-amber-500/25 to-orange-600/30',
    iconColor: 'text-amber-400',
    progressBar: 'bg-amber-500',
  },
  xp: {
    label: 'Experiencia',
    badgeBg: 'bg-purple-500/15',
    badgeText: 'text-purple-400',
    glowBorder: 'border-purple-500/30 hover:border-purple-500/60 shadow-purple-500/10',
    iconBg: 'bg-gradient-to-br from-purple-500/25 to-indigo-600/30',
    iconColor: 'text-purple-400',
    progressBar: 'bg-purple-500',
  },
  curriculum: {
    label: 'Currículo',
    badgeBg: 'bg-cyan-500/15',
    badgeText: 'text-cyan-400',
    glowBorder: 'border-cyan-500/30 hover:border-cyan-500/60 shadow-cyan-500/10',
    iconBg: 'bg-gradient-to-br from-cyan-500/25 to-blue-600/30',
    iconColor: 'text-cyan-400',
    progressBar: 'bg-cyan-500',
  },
  mastery: {
    label: 'Maestría',
    badgeBg: 'bg-yellow-500/15',
    badgeText: 'text-yellow-400',
    glowBorder: 'border-yellow-500/30 hover:border-yellow-500/60 shadow-yellow-500/10',
    iconBg: 'bg-gradient-to-br from-yellow-500/25 to-amber-600/30',
    iconColor: 'text-yellow-400',
    progressBar: 'bg-yellow-500',
  },
  speed: {
    label: 'Velocidad',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-400',
    glowBorder: 'border-emerald-500/30 hover:border-emerald-500/60 shadow-emerald-500/10',
    iconBg: 'bg-gradient-to-br from-emerald-500/25 to-teal-600/30',
    iconColor: 'text-emerald-400',
    progressBar: 'bg-emerald-500',
  },
};

function renderAchievementIcon(iconName: string, className: string) {
  switch (iconName?.toLowerCase()) {
    case 'sparkle':
      return <Sparkle className={className} weight="fill" />;
    case 'flame':
      return <Flame className={className} weight="fill" />;
    case 'lightning':
      return <Lightning className={className} weight="fill" />;
    case 'user':
      return <User className={className} weight="fill" />;
    case 'shield':
      return <Shield className={className} weight="fill" />;
    case 'trophy':
      return <Trophy className={className} weight="fill" />;
    case 'star':
      return <Star className={className} weight="fill" />;
    case 'bookopen':
      return <BookOpen className={className} weight="fill" />;
    case 'shieldcheck':
      return <ShieldCheck className={className} weight="fill" />;
    case 'crown':
      return <Crown className={className} weight="fill" />;
    case 'medal':
    default:
      return <Medal className={className} weight="fill" />;
  }
}

function formatDate(isoString?: string): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  onClick,
}) => {
  const isUnlocked = achievement.is_unlocked;
  const categoryConfig =
    CATEGORY_CONFIG[achievement.category] || CATEGORY_CONFIG.curriculum;
  const progress = achievement.progress_percentage ?? 0;
  const currentValue = achievement.current_value ?? 0;
  const targetValue = achievement.target_value ?? 1;

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.18 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border p-4.5 transition-all duration-200 backdrop-blur-xl ${
        isUnlocked
          ? `bg-slate-900/90 ${categoryConfig.glowBorder} shadow-lg cursor-pointer`
          : 'bg-slate-950/70 border-slate-800/70 opacity-75 grayscale-[25%]'
      }`}
    >
      {/* Resplandor decorativo de fondo para logros desbloqueados */}
      {isUnlocked && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-20 blur-2xl"
          style={{
            background:
              achievement.category === 'streak'
                ? '#f59e0b'
                : achievement.category === 'mastery'
                ? '#eab308'
                : achievement.category === 'xp'
                ? '#a855f7'
                : achievement.category === 'speed'
                ? '#10b981'
                : '#06b6d4',
          }}
        />
      )}

      <div className="flex items-start gap-4">
        {/* Medalla / Icono circular */}
        <div
          className={`relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border shadow-inner ${
            isUnlocked
              ? `${categoryConfig.iconBg} border-white/20 shadow-lg`
              : 'bg-slate-900 border-slate-800'
          }`}
        >
          {renderAchievementIcon(
            achievement.icon_name,
            `h-7 w-7 transition-transform ${
              isUnlocked ? `${categoryConfig.iconColor} drop-shadow-md` : 'text-slate-600'
            }`
          )}

          {/* Indicador de candado o check en miniatura */}
          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-slate-900 bg-slate-950 shadow-md">
            {isUnlocked ? (
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400" weight="fill" />
            ) : (
              <LockKey className="h-3 w-3 text-slate-500" weight="bold" />
            )}
          </div>
        </div>

        {/* Información central */}
        <div className="min-w-0 flex-1">
          {/* Header de la tarjeta: Categoría y XP */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider ${
                isUnlocked
                  ? `${categoryConfig.badgeBg} ${categoryConfig.badgeText}`
                  : 'bg-slate-800/80 text-slate-400'
              }`}
            >
              {categoryConfig.label}
            </span>

            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-mono font-bold ${
                isUnlocked
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-800/60 text-slate-400 border border-slate-700/50'
              }`}
            >
              +{achievement.xp_reward} XP
            </span>
          </div>

          {/* Título y Descripción */}
          <h3
            className={`mt-1.5 truncate text-sm font-bold tracking-tight ${
              isUnlocked ? 'text-slate-100' : 'text-slate-300'
            }`}
          >
            {achievement.title}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-xs text-slate-400 leading-relaxed">
            {achievement.description}
          </p>

          {/* Pie de tarjeta: Estado de desbloqueo o Barra de progreso */}
          <div className="mt-3">
            {isUnlocked ? (
              <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400/90">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" weight="fill" />
                  Desbloqueado
                </span>
                {achievement.unlocked_at && (
                  <span className="text-[10px] text-slate-500">
                    {formatDate(achievement.unlocked_at)}
                  </span>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>
                    Progreso: {currentValue} / {targetValue}
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full transition-all duration-300 ${categoryConfig.progressBar}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
