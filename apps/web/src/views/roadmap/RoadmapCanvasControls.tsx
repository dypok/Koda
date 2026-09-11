'use client';

import React from 'react';
import { IconPlus, IconMinus, IconFocusCentered } from '@tabler/icons-react';
import { useRoadmapStore } from '@/stores/roadmap.store';

export function RoadmapCanvasControls() {
  const { zoomLevel, zoomIn, zoomOut, resetZoom } = useRoadmapStore();

  return (
    <div
      className="absolute top-6 right-6 z-30 flex items-center no-drag"
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-lg p-1 text-slate-300 font-mono text-xs shadow-lg gap-0.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            zoomIn();
          }}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          title="Acercar (Zoom In)"
        >
          <IconPlus className="w-3.5 h-3.5 pointer-events-none" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            zoomOut();
          }}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          title="Alejar (Zoom Out)"
        >
          <IconMinus className="w-3.5 h-3.5 pointer-events-none" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            resetZoom();
          }}
          className="px-2 h-7 flex items-center gap-1 rounded hover:bg-slate-800 hover:text-white transition-colors text-[11px] cursor-pointer"
          title="Recentrar y Restablecer Zoom"
        >
          <IconFocusCentered className="w-3 h-3 text-cyan-400 pointer-events-none" />
          <span className="pointer-events-none">{zoomLevel}%</span>
        </button>
      </div>
    </div>
  );
}
