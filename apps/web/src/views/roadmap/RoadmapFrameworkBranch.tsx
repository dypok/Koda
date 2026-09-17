import React from 'react';
import { IconGitBranch, IconLock, IconStar } from '@tabler/icons-react';
import { FrameworkBranch } from '@/models/roadmap/roadmap.types';

interface RoadmapFrameworkBranchProps {
  branches: FrameworkBranch[];
}

export const RoadmapFrameworkBranch: React.FC<RoadmapFrameworkBranchProps> = ({ branches }) => {
  return (
    <div className="space-y-6 pt-8 pb-12 select-none">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <IconGitBranch className="w-4 h-4" />
          <span>Líneas de Especialización (Frameworks)</span>
        </div>
        <p className="text-xs text-slate-400">
          Ramas avanzadas de desarrollo web y APIs. Desbloqueables al completar Python Intermedio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {branches.map((branch) => (
          <div key={branch.id} className="space-y-3 pb-4 border-b border-slate-800/60 md:border-b-0">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400/60" />
              {branch.name}
            </h3>
            <p className="text-xs text-slate-400">{branch.description}</p>

            <div className="space-y-2.5 pt-1">
              {branch.courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 text-xs"
                >
                  <div className="space-y-0.5 min-w-0">
                    <span className="font-bold text-slate-200 block truncate">{course.title}</span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <IconLock className="w-3 h-3 text-slate-600" />
                      {course.prerequisite}
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 shrink-0 text-amber-300 font-bold text-[11px]">
                    <IconStar className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{course.earnedStars}/{course.totalStars}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
