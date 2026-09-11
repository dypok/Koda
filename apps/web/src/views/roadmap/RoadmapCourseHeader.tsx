import React from 'react';
import { IconLock, IconStar, IconCircleCheck } from '@tabler/icons-react';
import { RoadmapCourse } from '@/models/roadmap/roadmap.types';

interface RoadmapCourseHeaderProps {
  course: RoadmapCourse;
  index: number;
}

export const RoadmapCourseHeader: React.FC<RoadmapCourseHeaderProps> = ({ course, index }) => {
  const percent = course.totalStars > 0 ? Math.round((course.earnedStars / course.totalStars) * 100) : 0;

  return (
    <div className="space-y-2 py-4 border-b border-slate-800/60 select-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-amber-500/80">0{index + 1}</span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {course.title}
          </h2>
          {course.isCompleted && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <IconCircleCheck className="w-3.5 h-3.5" /> Completado
            </span>
          )}
        </div>

        {/* Reconteo de estrellas por curso */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/60 text-xs font-bold text-amber-300 shadow-sm">
          <IconStar className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{course.earnedStars} / {course.totalStars} estrellas</span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">{course.description}</p>

      {!course.isUnlocked && course.prerequisite && (
        <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 pt-1">
          <IconLock className="w-3.5 h-3.5 text-slate-500" />
          <span>Bloqueado: {course.prerequisite}</span>
        </div>
      )}

      {course.isUnlocked && (
        <div className="pt-1 flex items-center gap-3 max-w-xs">
          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full" style={{ width: `${percent}%` }} />
          </div>
          <span className="text-[11px] font-bold text-slate-400">{percent}%</span>
        </div>
      )}
    </div>
  );
};
