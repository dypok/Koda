import React from 'react';
import { ModalCategory, InfoModalTab } from '@/models/landing/info-modal.model';
import { cn } from '@/lib/utils';

interface InfoModalSidebarProps {
  categories: ModalCategory[];
  activeTab: InfoModalTab;
  onSelectTab: (tab: InfoModalTab) => void;
}

export const InfoModalSidebar: React.FC<InfoModalSidebarProps> = ({
  categories,
  activeTab,
  onSelectTab,
}) => (
  <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800/80 bg-slate-950/40 p-4 overflow-x-auto md:overflow-y-auto shrink-0 space-y-4">
    {categories.map((category) => (
      <div key={category.name} className="space-y-1.5">
        <span className="hidden md:block text-[11px] font-display font-bold uppercase tracking-wider text-slate-500 px-2.5">
          {category.name}
        </span>
        <div className="flex md:flex-col gap-1">
          {category.items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-sans font-medium transition-all duration-200 cursor-pointer text-left shrink-0 md:w-full',
                  isActive
                    ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                )}
              >
                <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-amber-400' : 'text-slate-500')} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    ))}
  </aside>
);
