'use client';

import React from 'react';
import { IconPlus, IconMinus, IconGitBranch } from '@tabler/icons-react';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { GradientButton } from '@/components/ui/gradient-button';

export function RoadmapCanvasControls() {
  const { zoomLevel, zoomIn, zoomOut, resetZoom, toggleViewMode, viewMode } = useRoadmapStore();

  return (
    <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
      <div className="flex items-center bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-lg p-1 text-slate-300 font-mono text-xs shadow-lg">
        <button
          onClick={zoomIn}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800 hover:text-white transition-colors"
          title="Zoom In"
        >
          <IconPlus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={zoomOut}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800 hover:text-white transition-colors"
          title="Zoom Out"
        >
          <IconMinus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={resetZoom}
          className="px-2.5 h-7 flex items-center justify-center hover:bg-slate-800 hover:text-white transition-colors text-[11px]"
          title="Reset Zoom"
        >
          {zoomLevel}%
        </button>
      </div>

      <GradientButton
        variant="secondary"
        size="sm"
        onClick={toggleViewMode}
        className="h-9 px-3.5 text-xs font-mono tracking-wider uppercase gap-2"
      >
        <IconGitBranch className="w-3.5 h-3.5 text-amber-400" />
        <span>{viewMode === 'courses' ? 'Ver Clases' : 'Ver Cursos'}</span>
      </GradientButton>
    </div>
  );
}
