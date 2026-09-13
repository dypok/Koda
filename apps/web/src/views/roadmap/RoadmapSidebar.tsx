'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RoadmapSidebarTacticalTrack } from './RoadmapSidebarTacticalTrack';
import { RoadmapSidebarGoal } from './RoadmapSidebarGoal';
import { RoadmapSidebarKoda } from './RoadmapSidebarKoda';
import { RoadmapSidebarFooter } from './RoadmapSidebarFooter';

export const RoadmapSidebar: React.FC = () => {
  return (
    <aside className="w-16 sm:w-20 lg:w-72 shrink-0 h-screen border-r border-slate-800/40 flex flex-col justify-between p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md z-20 select-none">
      {/* Brand Header */}
      <div className="flex items-center px-2 py-1 mb-3 shrink-0">
        <Link
          href="/"
          aria-label="Koda - volver a la landing"
          className="focus:outline-none rounded-lg"
        >
          <Image
            src="/brand/logo.svg"
            alt="Koda"
            width={498}
            height={185}
            className="h-7 w-auto object-contain transition-opacity hover:opacity-80"
            priority
          />
        </Link>
      </div>

      {/* Main Scrollable Telemetry Body */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {/* Trayecto Táctico: Cursos de la rama activa con indicador láser y selector de especialidad */}
        <RoadmapSidebarTacticalTrack />

        {/* Daily Study Habit Goal & Next Milestone */}
        <RoadmapSidebarGoal />

        {/* Holographic Koda Pedagogical Console */}
        <RoadmapSidebarKoda />
      </div>

      {/* Student Profile Footer */}
      <div className="shrink-0 mt-3">
        <RoadmapSidebarFooter />
      </div>
    </aside>
  );
};
