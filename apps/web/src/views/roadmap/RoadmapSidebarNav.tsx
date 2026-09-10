'use client';

import React from 'react';
import { IconRoute, IconTarget, IconTerminal2, IconTrophy } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { id: 'roadmap', label: 'Ruta de Aprendizaje', icon: IconRoute, active: true, badge: 'Live' },
  { id: 'quests', label: 'Misiones Diarias', icon: IconTarget, active: false, badge: '2 hoy' },
  { id: 'terminal', label: 'Consola & Playground', icon: IconTerminal2, active: false, badge: 'Sandbox' },
  { id: 'leaderboard', label: 'Liga de Código', icon: IconTrophy, active: false, badge: 'Top 5' },
];

export function RoadmapSidebarNav() {
  return (
    <div className="space-y-1">
      <div className="hidden lg:block px-3 pb-1 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
        Campus Virtual
      </div>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all text-xs font-semibold group',
              item.active
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            )}
          >
            <Icon className={cn('w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110', item.active ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300')} />
            <span className="hidden lg:block flex-1 truncate font-mono text-[11px] tracking-wide">{item.label}</span>
            {item.badge && (
              <span className={cn(
                'hidden lg:inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider',
                item.active ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-900 text-slate-500'
              )}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
