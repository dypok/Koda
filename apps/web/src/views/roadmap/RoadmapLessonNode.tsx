'use client';

import React from 'react';
import { Check, Lock, Play, Star } from '@phosphor-icons/react';
import { RoadmapLesson } from '@/models/roadmap/roadmap.types';
import { cn } from '@/lib/utils';

interface RoadmapLessonNodeProps {
  lesson: RoadmapLesson;
  courseUnlocked: boolean;
  isLast?: boolean;
}

export const RoadmapLessonNode: React.FC<RoadmapLessonNodeProps> = ({
  lesson,
  courseUnlocked,
  isLast = false,
}) => {
  const isAvailable = courseUnlocked && lesson.isUnlocked;

  return (
    <div
      className={cn(
        'relative flex items-start gap-4 py-3 select-none group transition-all duration-200',
        !isAvailable && !lesson.isCompleted ? 'cursor-not-allowed opacity-75 hover:opacity-100' : 'cursor-pointer'
      )}
    >
      {!isLast && (
        <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-slate-800 group-hover:bg-slate-700 transition-colors" />
      )}

      <div
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 z-10',
          lesson.isCompleted
            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
            : isAvailable
            ? 'bg-orange-500/20 border-orange-400 text-orange-400 animate-pulse'
            : 'bg-slate-900 border-slate-800 text-slate-600 group-hover:border-rose-500/50 group-hover:text-rose-400 group-hover:bg-rose-950/30 group-hover:shadow-[0_0_12px_rgba(244,63,94,0.3)]'
        )}
      >
        {lesson.isCompleted ? (
          <Check className="w-5 h-5 stroke-[2.5]" />
        ) : isAvailable ? (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        ) : (
          <Lock className="w-4 h-4 transition-transform duration-200 group-hover:-rotate-12 group-hover:scale-110" />
        )}
      </div>

      <div className="flex-1 flex flex-wrap items-center justify-between gap-2 min-w-0 pt-1">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500">Clase {lesson.order}</span>
            <span className="text-xs text-slate-500">· {lesson.durationMinutes} min</span>
            <span className="text-xs font-semibold text-amber-500/90">+{lesson.xp} XP</span>
          </div>
          <h4 className={cn('text-sm sm:text-base font-bold truncate', isAvailable ? 'text-white' : 'text-slate-500')}>
            {lesson.title}
          </h4>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={starIdx}
              className={cn(
                'w-4 h-4 transition-colors',
                lesson.stars >= starIdx
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]'
                  : 'text-slate-800'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
