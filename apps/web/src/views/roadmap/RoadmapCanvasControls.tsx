'use client';

import React from 'react';
import { Plus, Minus, Crosshair } from '@phosphor-icons/react';
import { useRoadmapStore } from '@/stores/roadmap.store';

export function RoadmapCanvasControls() {
  const { zoomLevel, zoomIn, zoomOut, resetZoom } = useRoadmapStore();

  return (
    <div
      className="absolute bottom-6 right-6 z-30 flex items-center no-drag"
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 rounded-lg p-1 text-slate-300 font-mono text-xs shadow-[0_0_15px_rgba(0,0,0,0.6)] gap-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            zoomIn();
          }}
          aria-label="Acercar"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded hover:bg-cyan-950/60 hover:text-cyan-300 border border-transparent hover:border-cyan-500/40 active:scale-90 transition-all cursor-pointer"
          title="Acercar (Zoom In)"
        >
          <Plus aria-hidden="true" className="w-4 h-4 pointer-events-none" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            zoomOut();
          }}
          aria-label="Alejar"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded hover:bg-cyan-950/60 hover:text-cyan-300 border border-transparent hover:border-cyan-500/40 active:scale-90 transition-all cursor-pointer"
          title="Alejar (Zoom Out)"
        >
          <Minus aria-hidden="true" className="w-4 h-4 pointer-events-none" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            resetZoom();
          }}
          aria-label={`Restablecer zoom y centrar (actual ${zoomLevel}%)`}
          className="px-2.5 min-h-[44px] flex items-center gap-1.5 rounded hover:bg-cyan-950/60 hover:text-cyan-300 border border-transparent hover:border-cyan-500/40 active:scale-95 transition-all text-[11px] font-bold cursor-pointer"
          title="Recentrar y Restablecer Zoom"
        >
          <Crosshair aria-hidden="true" className="w-3.5 h-3.5 text-cyan-400 pointer-events-none" />
          <span className="pointer-events-none tabular-nums">{zoomLevel}%</span>
        </button>
      </div>
    </div>
  );
}
