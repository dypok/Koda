'use client';

import React, { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  IconLayoutList,
  IconAffiliate,
  IconLayersIntersect,
  IconRadar2,
  IconFlame,
  IconBolt,
} from '@tabler/icons-react';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { CAREER_BRANCHES } from '@/models/roadmap/tracks/track-catalog';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

interface RoadmapTopHudProps {
  sectorTitle: string;
  progressPercent?: number;
  coursesDisplayMode?: 'pin-rail' | 'canvas' | 'fusion';
  onToggleCoursesDisplayMode?: (mode: 'pin-rail' | 'canvas' | 'fusion') => void;
}

/**
 * HUD Superior Táctico (Flight Command Canopy):
 * - Marco de cabina angular con escala micrométrica grabada y biseles.
 * - Telemetría cartográfica en vivo: radar orbital, coordenadas de enlace y kernel activo.
 * - Conmutador aeronáutico de 3 modos con diodos LED fósforo retroiluminados.
 * - Gatillo de ignición de hipersalto con corte angular chamfered y acento de advertencia táctica.
 * - Cero efectos de audio (sin WebAudio ni SFX).
 */
export function RoadmapTopHud({
  sectorTitle,
  progressPercent = 0,
  coursesDisplayMode = 'fusion',
  onToggleCoursesDisplayMode,
}: RoadmapTopHudProps) {
  const {
    viewMode,
    triggerRetreatToCourses,
    openCourseLessons,
    coursesDataset,
    activeNodeId,
    activeBranchId,
  } = useRoadmapStore();

  const activeBranch = useMemo(
    () => CAREER_BRANCHES.find((b) => b.id === activeBranchId) || CAREER_BRANCHES[0],
    [activeBranchId]
  );
  const branchColor = activeBranch.color;

  const activeNode = coursesDataset.nodes.find((n) => n.id === activeNodeId);
  const activeCourseId =
    activeNode?.targetCourseId ||
    coursesDataset.nodes.find((n) => n.isUnlocked)?.targetCourseId ||
    coursesDataset.nodes[0]?.targetCourseId ||
    '';

  const displayTitle = sectorTitle.replace(/^SECTOR\s+\d+:\s*/i, '');
  const headerRef = React.useRef<HTMLElement | null>(null);

  // Animación suave de inicialización de telemetría con GSAP
  React.useEffect(() => {
    if (!headerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }
      );
    }, headerRef);
    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={headerRef}
      className="h-16 px-4 sm:px-6 relative border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-between z-20 shrink-0 select-none"
    >
      {/* 1. Regla milimetrada micrométrica superior (Vernier Scale) */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-[2px] flex justify-between items-center px-8 pointer-events-none opacity-40 text-[7px] font-mono text-slate-500 overflow-hidden"
      >
        <span className="hidden sm:inline">SEC.00</span>
        <span className="hidden md:inline">||||||||||||</span>
        <span className="hidden sm:inline">COORD.25</span>
        <span className="hidden md:inline">||||||||||||</span>
        <span className="hidden sm:inline">RADAR.50</span>
        <span className="hidden md:inline">||||||||||||</span>
        <span className="hidden sm:inline">SYNC.75</span>
        <span className="hidden md:inline">||||||||||||</span>
        <span className="hidden sm:inline">SYS.100</span>
      </div>

      {/* Línea inferior de resplandor cuántico */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none transition-all duration-700"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${branchColor}40 25%, ${branchColor}80 50%, ${branchColor}40 75%, transparent 100%)`,
        }}
      />

      {/* 2. Flanco Izquierdo: Telemetría de Sector & Navegación */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {viewMode === 'lessons' ? (
          <button
            type="button"
            onClick={triggerRetreatToCourses}
            className="h-9 px-3 rounded-lg border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-400 font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            style={{
              clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Retornar a Cursos</span>
          </button>
        ) : null}

        {/* Antena de Radar y Telemetría Militar */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="relative w-7 h-7 rounded-lg border flex items-center justify-center shrink-0"
            style={{
              backgroundColor: `${branchColor}15`,
              borderColor: `${branchColor}40`,
            }}
          >
            <IconRadar2
              className="w-4 h-4 animate-spin text-white"
              style={{
                color: branchColor,
                animationDuration: '8s',
              }}
            />
            <span
              className="absolute w-1.5 h-1.5 rounded-full animate-ping"
              style={{ backgroundColor: branchColor }}
            />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase">
                SEC-0{activeBranchId === 'frontend' ? '1' : activeBranchId === 'backend' ? '2' : activeBranchId === 'devops' ? '3' : '4'} // CARTOGRAPHY
              </span>
              <span
                className="hidden md:inline-flex items-center gap-1 text-[8px] font-mono px-1.5 py-0.2 rounded border uppercase font-bold"
                style={{
                  backgroundColor: `${branchColor}15`,
                  borderColor: `${branchColor}35`,
                  color: branchColor,
                }}
              >
                ONLINE
              </span>
            </div>
            <h1 className="font-display text-xs sm:text-sm font-black tracking-wide text-white uppercase truncate drop-shadow-sm">
              {displayTitle}
            </h1>
          </div>
        </div>

        {/* 3. Centro: Conmutador de Modos Aeronáutico Encastrado */}
        {viewMode === 'courses' && onToggleCoursesDisplayMode && (
          <div
            className="hidden md:flex items-center p-1 rounded-xl bg-slate-950/90 border border-slate-800/90 text-xs font-mono ml-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]"
            role="tablist"
            aria-label="Selector de visualización táctica"
          >
            {/* Modo Pin Lateral */}
            <button
              type="button"
              role="tab"
              aria-selected={coursesDisplayMode === 'pin-rail'}
              onClick={() => onToggleCoursesDisplayMode('pin-rail')}
              className={cn(
                'relative px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer font-bold',
                coursesDisplayMode === 'pin-rail'
                  ? 'bg-slate-900 text-white border border-slate-700 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              )}
              title="Vista de cursos guiada estilo GSAP Lateral Pin"
            >
              <span
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-all',
                  coursesDisplayMode === 'pin-rail'
                    ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]'
                    : 'bg-slate-600'
                )}
              />
              <IconLayoutList className="w-3.5 h-3.5" />
              <span className="text-[11px]">Pin Lateral</span>
            </button>

            {/* Modo Constelación */}
            <button
              type="button"
              role="tab"
              aria-selected={coursesDisplayMode === 'canvas'}
              onClick={() => onToggleCoursesDisplayMode('canvas')}
              className={cn(
                'relative px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer font-bold',
                coursesDisplayMode === 'canvas'
                  ? 'bg-slate-900 text-white border border-slate-700 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              )}
              title="Lienzo libre de mapa estelar interactivo en pantalla completa"
            >
              <span
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-all',
                  coursesDisplayMode === 'canvas'
                    ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]'
                    : 'bg-slate-600'
                )}
              />
              <IconAffiliate className="w-3.5 h-3.5" />
              <span className="text-[11px]">Constelación</span>
            </button>

            {/* Modo Fusión Táctica */}
            <button
              type="button"
              role="tab"
              aria-selected={coursesDisplayMode === 'fusion'}
              onClick={() => onToggleCoursesDisplayMode('fusion')}
              className={cn(
                'relative px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer font-bold',
                coursesDisplayMode === 'fusion'
                  ? 'bg-slate-900 text-white border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              )}
              title="Fusión interactiva: Riel Lateral y Constelación espacial sincronizados"
            >
              <span
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-all',
                  coursesDisplayMode === 'fusion'
                    ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse'
                    : 'bg-slate-600'
                )}
              />
              <IconLayersIntersect className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] text-cyan-300">Fusión</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Flanco Derecho: Gatillo de Ignición de Hipersalto (Action CTA) */}
      <div className="flex items-center gap-3">
        {/* Gatillo de Ignición Cuántica */}
        <button
          type="button"
          onClick={() => activeCourseId && openCourseLessons(activeCourseId)}
          className="group relative h-10 px-4 sm:px-5 font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2.5 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
          style={{
            clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
            background: `linear-gradient(135deg, ${branchColor} 0%, #0f172a 100%)`,
            boxShadow: `0 0 20px ${branchColor}50, inset 0 1px 1px rgba(255,255,255,0.4)`,
          }}
        >
          {/* Luz de sobretensión */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity bg-white pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, #ffffff 0%, transparent 70%)`,
            }}
          />

          <IconBolt className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />

          <div className="flex flex-col text-left leading-none">
            <span className="text-[8px] opacity-75 font-mono tracking-widest text-slate-200">
              ENGAGE HYPER-DRIVE
            </span>
            <span className="text-[11px] font-bold text-white tracking-wide">
              {viewMode === 'courses' ? 'Continuar Curso →' : 'Saltar al Punto →'}
            </span>
          </div>

          {/* Patrón de rayas de advertencia táctica (Hazard Stripes) */}
          <div
            aria-hidden="true"
            className="hidden sm:block w-3 h-5 border-l border-white/20 pl-1 opacity-40 font-mono text-[8px] text-white tracking-tighter"
          >
            ///
          </div>
        </button>
      </div>
    </header>
  );
}
