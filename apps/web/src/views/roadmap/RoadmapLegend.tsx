'use client';

import React from 'react';

const LEGEND_ITEMS = [
  { label: 'Completado (3)', color: 'bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.7)]' },
  { label: 'Activo Nexus (1)', color: 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]' },
  { label: 'Desbloqueado (1)', color: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]' },
  { label: 'Sellado / Req (3)', color: 'bg-slate-600' },
  { label: 'Apex Gate (1)', color: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]' },
];

export function RoadmapLegend() {
  return (
    <footer className="h-12 border-t border-slate-900/90 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between text-xs font-mono text-slate-400 z-20 shrink-0">
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-1">
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-2 shrink-0">
            <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
            <span className="text-[11px] tracking-wide">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-500">
        <span>INTERACTIVE SKILL MATRIX</span>
        <span>•</span>
        <span className="text-cyan-400/80">KODA ENGINE v2.0</span>
      </div>
    </footer>
  );
}
