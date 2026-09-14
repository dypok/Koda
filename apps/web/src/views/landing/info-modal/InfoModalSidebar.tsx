import React, { useRef } from 'react';
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
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const tabs = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]') ?? []);
    if (tabs.length === 0) return;
    const current = tabs.indexOf(document.activeElement as HTMLElement);
    let next = current;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (current + 1) % tabs.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (current - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = tabs.length - 1;
    tabs[next]?.focus();
    tabs[next]?.click();
  };

  return (
    <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800/80 bg-slate-950/40 p-4 overflow-x-auto md:overflow-y-auto shrink-0 space-y-4">
      <div ref={listRef} role="tablist" aria-label="Secciones de información" onKeyDown={onKeyDown} className="space-y-4">
        {categories.map((category) => (
          <div key={category.name} role="group" aria-label={category.name} className="space-y-1.5">
            <span aria-hidden="true" className="hidden md:block text-[11px] font-display font-bold uppercase tracking-wider text-slate-500 px-2.5">
              {category.name}
            </span>
            <div className="flex md:flex-col gap-1 overflow-x-auto snap-x md:overflow-visible pb-1 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
              {category.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`info-panel-${item.id}`}
                    id={`info-tab-${item.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => onSelectTab(item.id)}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-sans font-medium transition-all duration-200 cursor-pointer text-left shrink-0 snap-start md:w-full',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60',
                      isActive
                        ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent'
                    )}
                  >
                    <Icon aria-hidden="true" className={cn('w-4 h-4 shrink-0', isActive ? 'text-amber-400' : 'text-slate-500')} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
