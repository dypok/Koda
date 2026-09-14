'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Lock, Skull, CaretDown, Sparkle } from '@phosphor-icons/react';
import { CAREER_BRANCHES, CareerBranchId } from '@/models/roadmap/tracks/track-catalog';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { cn } from '@/lib/utils';

/**
 * Trayecto Táctico en la Barra Lateral:
 * Reemplaza la lista fija de ramas por el riel de cursos activo con puntero láser vertical,
 * incluyendo un selector compacto desplegable para alternar entre ramas de carrera.
 */
export function RoadmapSidebarTacticalTrack() {
  const {
    activeBranchId,
    setBranch,
    activeNodeId,
    setActiveNode,
    coursesDataset,
    isLoading,
  } = useRoadmapStore();

  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeBranch = useMemo(
    () => CAREER_BRANCHES.find((b) => b.id === activeBranchId) || CAREER_BRANCHES[0],
    [activeBranchId]
  );
  const BranchIcon = activeBranch.icon;
  const nodes = coursesDataset.nodes;

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsBranchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Medición dinámica del puntero láser vertical
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [laserStyle, setLaserStyle] = useState({ top: 4, height: 32 });

  const activeIndex = useMemo(() => {
    const idx = nodes.findIndex((n) => n.id === activeNodeId);
    return idx >= 0 ? idx : 0;
  }, [nodes, activeNodeId]);

  const activeNode = nodes[activeIndex] || nodes[0];

  useEffect(() => {
    const activeEl = itemRefs.current[activeIndex];
    if (activeEl) {
      setLaserStyle({
        top: activeEl.offsetTop + 3,
        height: Math.max(24, activeEl.offsetHeight - 6),
      });
    }
  }, [activeIndex, nodes]);

  const handleSelectBranch = (branchId: CareerBranchId) => {
    setBranch(branchId);
    setIsBranchDropdownOpen(false);
  };

  return (
    <div className="space-y-3 select-none" ref={dropdownRef}>
      {/* 1. Selector Compacto de Rama de Carrera */}
      <div className="relative">
        <div className="hidden lg:flex items-center px-1 pb-1 text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
          <span>Rama Activa</span>
        </div>

        <button
          type="button"
          onClick={() => setIsBranchDropdownOpen((prev) => !prev)}
          disabled={isLoading}
          aria-expanded={isBranchDropdownOpen}
          className={cn(
            'w-full flex items-center justify-between p-2 sm:p-2.5 rounded-xl transition-all duration-200 text-left border cursor-pointer',
            isBranchDropdownOpen
              ? 'bg-slate-900 border-slate-700 shadow-lg'
              : 'bg-slate-900/60 hover:bg-slate-900/90 border-slate-800/80 hover:border-slate-700/80'
          )}
          style={{
            boxShadow: `0 0 15px ${activeBranch.color}15`,
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
              style={{
                backgroundColor: `${activeBranch.color}20`,
                borderColor: `${activeBranch.color}50`,
                color: activeBranch.color,
              }}
            >
              <BranchIcon className="w-4 h-4" />
            </div>

            <div className="hidden lg:block min-w-0">
              <div className="text-xs font-mono font-bold text-white truncate flex items-center gap-1.5">
                <span>{activeBranch.title}</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400 truncate">
                {activeBranch.completedCourses}/{activeBranch.totalCourses} cursos • {activeBranch.progressPercent}%
              </div>
            </div>
          </div>

          <CaretDown
            className={cn(
              'hidden lg:block w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0',
              isBranchDropdownOpen && 'rotate-180 text-white'
            )}
          />
        </button>

        {/* Menú Desplegable Flotante de Selección de Ramas */}
        {isBranchDropdownOpen && (
          <div className="absolute left-0 right-0 top-full mt-1.5 p-1.5 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-xl z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2 py-1 text-[9px] font-mono text-slate-400 uppercase tracking-wider">
              Cambiar Especialidad
            </div>
            {CAREER_BRANCHES.map((b) => {
              const Icon = b.icon;
              const isCurrent = b.id === activeBranchId;

              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleSelectBranch(b.id)}
                  className={cn(
                    'w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer',
                    isCurrent
                      ? 'bg-slate-900 text-white border border-slate-700'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  )}
                >
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${b.color}20`,
                      color: b.color,
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-mono font-bold truncate">{b.title}</div>
                    <div className="text-[9px] font-mono text-slate-500 truncate">
                      {b.progressPercent}% completado
                    </div>
                  </div>
                  {isCurrent && (
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: b.color }} />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Trayecto Táctico: Riel Vertical de Cursos con Láser */}
      <div className="space-y-1.5 pt-1">
        <div className="hidden lg:flex items-center justify-between px-1 text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <Sparkle className="w-3 h-3" style={{ color: activeBranch.color }} />
            <span>Trayecto Táctico</span>
          </div>
          <span style={{ color: activeBranch.color }}>{coursesDataset.progressPercent}%</span>
        </div>

        {/* Riel Vertical */}
        <div className="relative pl-3.5 lg:pl-4 flex flex-col space-y-1" role="tablist">
          {/* Línea vertical de guía */}
          <div
            className="absolute left-1.5 top-1.5 bottom-1.5 w-[2px] bg-slate-800/80 rounded-full"
            aria-hidden="true"
          />

          {/* Cursor Láser Vertical Deslizante */}
          <div
            className="absolute left-[0px] w-[3px] rounded-full transition-all duration-300 ease-out pointer-events-none"
            style={{
              top: `${laserStyle.top}px`,
              height: `${laserStyle.height}px`,
              backgroundColor: activeNode?.variant === 'boss' ? '#F43F5E' : activeBranch.color,
              boxShadow: `0 0 10px ${activeNode?.variant === 'boss' ? '#F43F5E' : activeBranch.color}, 0 0 2px #ffffff`,
            }}
            aria-hidden="true"
          />

          {nodes.map((node, index) => {
            const isSelected = activeNodeId === node.id;
            const isUnlocked = node.isUnlocked;
            const isBoss = node.variant === 'boss';

            return (
              <button
                key={node.id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                type="button"
                onClick={() => setActiveNode(node.id)}
                role="tab"
                aria-selected={isSelected}
                className={cn(
                  'group text-left transition-all duration-200 flex flex-col py-1.5 px-2 rounded-xl focus:outline-none cursor-pointer',
                  isSelected
                    ? isBoss
                      ? 'bg-rose-950/40 border border-rose-500/50 shadow-sm translate-x-1'
                      : 'bg-slate-900/80 border border-slate-800/90 shadow-sm translate-x-1'
                    : 'opacity-40 hover:opacity-85 hover:bg-slate-900/30'
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-[10px] font-bold tracking-wider shrink-0"
                    style={{
                      color: isSelected
                        ? isBoss
                          ? '#F43F5E'
                          : activeBranch.color
                        : '#94a3b8',
                    }}
                  >
                    {node.code}
                  </span>

                  <span
                    className={cn(
                      'hidden lg:flex items-center gap-1 font-display text-xs font-bold tracking-tight truncate',
                      isSelected
                        ? isBoss
                          ? 'text-rose-300 font-black'
                          : 'text-white'
                        : 'text-slate-400 group-hover:text-slate-200'
                    )}
                  >
                    {isBoss && <Skull className="w-3 h-3 text-rose-400 shrink-0" />}
                    <span className="truncate">{node.label}</span>
                  </span>
                </div>

                <div className="hidden lg:flex items-center gap-2 pl-4 mt-0.5">
                  <span className="text-[8px] font-mono text-slate-500 truncate">
                    {node.subtitle || (isUnlocked ? 'Disponible' : 'Bloqueado')}
                  </span>
                  {node.variant === 'completed' && (
                    <span className="text-[8px] font-mono font-bold text-emerald-400 flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" />
                      <span>100%</span>
                    </span>
                  )}
                  {isBoss && (
                    <span className="text-[8px] font-mono font-bold text-rose-400">
                      JEFE
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
