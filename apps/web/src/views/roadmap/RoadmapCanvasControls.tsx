'use client';

import React from 'react';
import { IconPlus, IconMinus, IconFocusCentered } from '@tabler/icons-react';
import { useRoadmapStore } from '@/stores/roadmap.store';

export function RoadmapCanvasControls() {
  const { zoomLevel, zoomIn, zoomOut, resetZoom } = useRoadmapStore();

  return (
    <div className="absolute top-6 right-6 z-20 flex items-center">
      <div className="flex items-center bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-lg p-1 text-slate-300 font-mono text-xs shadow-lg gap-0.5">
        <button
          onClick={zoomIn}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800 hover:text-white transition-colors"
          title="Acercar (Zoom In)"
        >
          <IconPlus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={zoomOut}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800 hover:text-white transition-colors"
          title="Alejar (Zoom Out)"
        >
          <IconMinus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={resetZoom}
          className="px-2 h-7 flex items-center gap-1 rounded hover:bg-slate-800 hover:text-white transition-colors text-[11px]"
          title="Recentrar y Restablecer Zoom"
        >
          <IconFocusCentered className="w-3 h-3 text-cyan-400" />
          <span>{zoomLevel}%</span>
        </button>
      </div>
    </div>
  );
}
