'use client';

import React from 'react';
import { Plus, Minus, Crosshair } from '@phosphor-icons/react';
import { useRoadmapStore } from '@/stores/roadmap.store';

export function RoadmapCanvasControls() {
  const { zoomLevel, zoomIn, zoomOut, resetZoom } = useRoadmapStore();

  return (
    <div
      className="absolute bottom-20 sm:bottom-6 right-3 sm:right-6 z-30 flex items-center no-drag"
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl p-0.5 sm:p-1 text-slate-300 font-mono text-xs shadow-2xl gap-0.5 sm:gap-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            zoomIn();
          }}
          aria-label="Acercar"
          className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-300 hover:bg-orange-500/20 hover:text-orange-400 border border-transparent hover:border-orange-500/40 active:scale-90 transition-all cursor-pointer"
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
          className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-300 hover:bg-orange-500/20 hover:text-orange-400 border border-transparent hover:border-orange-500/40 active:scale-90 transition-all cursor-pointer"
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
          className="px-2.5 min-h-[40px] flex items-center gap-1.5 rounded-lg text-slate-300 hover:bg-orange-500/20 hover:text-orange-300 border border-transparent hover:border-orange-500/40 active:scale-95 transition-all text-[11px] font-bold cursor-pointer"
          title="Recentrar y Restablecer Zoom"
        >
          <Crosshair aria-hidden="true" className="w-3.5 h-3.5 text-orange-400 pointer-events-none" />
          <span className="pointer-events-none tabular-nums text-orange-400/90">{zoomLevel}%</span>
        </button>
      </div>
    </div>
  );
}
