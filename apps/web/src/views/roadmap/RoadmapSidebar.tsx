'use client';

import React from 'react';
import Image from 'next/image';
import { RoadmapSidebarBranches } from './RoadmapSidebarBranches';
import { RoadmapSidebarGoal } from './RoadmapSidebarGoal';
import { RoadmapSidebarFooter } from './RoadmapSidebarFooter';

export const RoadmapSidebar: React.FC = () => {
  return (
    <aside className="w-16 sm:w-20 lg:w-72 shrink-0 h-screen border-r border-slate-800/40 flex flex-col justify-between p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md z-20 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-2 py-1 mb-3 shrink-0">
        <Image
          src="/brand/logo.svg"
          alt="Koda"
          width={498}
          height={185}
          className="h-7 w-auto object-contain"
          priority
        />
        <span className="hidden lg:inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 bg-slate-900 border border-slate-800">
          v2.4
        </span>
      </div>

      {/* Main Scrollable Telemetry Body */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {/* Career Branches: Frontend, Backend, DevOps */}
        <RoadmapSidebarBranches />

        {/* Daily Study Habit Goal & Next Milestone */}
        <RoadmapSidebarGoal />
      </div>

      {/* Student Profile Footer */}
      <div className="shrink-0 mt-3">
        <RoadmapSidebarFooter />
      </div>
    </aside>
  );
};
