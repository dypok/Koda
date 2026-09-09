'use client';

import React from 'react';
import { IconFlame, IconStar } from '@tabler/icons-react';
import { HeroSkyBackground } from '@/components/landing/HeroSkyBackground';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { useAuthStore } from '@/stores/auth.store';
import { RoadmapSidebar } from './RoadmapSidebar';
import { RoadmapCourseHeader } from './RoadmapCourseHeader';
import { RoadmapLessonNode } from './RoadmapLessonNode';
import { RoadmapFrameworkBranch } from './RoadmapFrameworkBranch';

export const StudentRoadmapView: React.FC = () => {
  const { user } = useAuthStore();
  const { currentTrack, getTotalEarnedStars, getTotalPossibleStars } = useRoadmapStore();

  const totalEarned = getTotalEarnedStars();
  const totalPossible = getTotalPossibleStars();

  return (
    <div className="relative isolate min-h-screen bg-transparent text-slate-100 flex selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
      <HeroSkyBackground starCount={140} interactive={true} className="fixed inset-0 pointer-events-none -z-10" />

      {/* Asidebar de Navegación Lateral para cambiar de lenguaje */}
      <RoadmapSidebar />

      {/* Contenedor Principal del Roadmap */}
      <main className="flex-1 min-h-screen p-4 sm:p-8 lg:p-12 max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Cabecera del Lenguaje Activo */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/60 select-none">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ruta Activa</span>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span>{currentTrack.name}</span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                ⭐ {totalEarned} / {totalPossible} estrellas acumuladas
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-orange-400">
              <IconFlame className="w-4 h-4 fill-orange-500" />
              Racha: {user?.streak || 1} días
            </span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <IconStar className="w-4 h-4 fill-amber-400" />
              Nivel {user?.level || 1} ({user?.totalXp || 50} XP)
            </span>
          </div>
        </div>

        {/* Eje Central Principal: Cursos Secuenciales (Básico, Intermedio, Avanzado) */}
        <div className="space-y-10">
          {currentTrack.mainCourses.map((course, idx) => (
            <section key={course.id} className="space-y-4">
              <RoadmapCourseHeader course={course} index={idx} />
              <div className="pl-2 sm:pl-4 space-y-1">
                {course.lessons.map((lesson, lIdx) => (
                  <RoadmapLessonNode
                    key={lesson.id}
                    lesson={lesson}
                    courseUnlocked={course.isUnlocked}
                    isLast={lIdx === course.lessons.length - 1}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* 2 Líneas de Especialización: Frameworks (FastAPI, Django, Flask) */}
        {currentTrack.frameworkBranches.length > 0 && (
          <RoadmapFrameworkBranch branches={currentTrack.frameworkBranches} />
        )}
      </main>
    </div>
  );
};
