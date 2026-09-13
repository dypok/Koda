'use client';

import React, { useCallback, useRef, useState } from 'react';
import { IconArrowRight, IconLock, IconCheck, IconStar, IconBolt, IconSparkles } from '@tabler/icons-react';
import { GraphDataset, GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { CAREER_BRANCHES } from '@/models/roadmap/tracks/track-catalog';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { cn } from '@/lib/utils';

interface CoursePinRailProps {
  dataset: GraphDataset;
  onDeploy: (node: GraphNode) => void;
}

/**
 * Vista de cursos estilo GSAP 'Lateral pin indicator':
 * - Columna izquierda: Indicador lateral con lista de cursos y cursor láser vertical.
 * - Columna derecha: Tarjeta 3D fijada con grandes números (01, 02...), diamantes neón y botón de inicio de protocolo.
 */
export const CoursePinRail: React.FC<CoursePinRailProps> = ({ dataset, onDeploy }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const { activeBranchId } = useRoadmapStore();

  const activeBranch = CAREER_BRANCHES.find((b) => b.id === activeBranchId) || CAREER_BRANCHES[0];
  const branchColor = activeBranch.color;

  const nodes = dataset.nodes;

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const el = scrollRef.current;
      if (!el) return;
      const max = el.scrollHeight - el.clientHeight;
      const top = (index / Math.max(1, nodes.length - 1)) * max;
      el.scrollTo({ top, behavior: 'smooth' });
    },
    [nodes.length]
  );

  const activeIndex = Math.min(nodes.length - 1, Math.floor(progress * nodes.length));
  const activeNode = nodes[activeIndex] || nodes[0];

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="absolute inset-0 overflow-y-auto overscroll-contain select-none"
    >
      {/* Background ambient glow matching current career branch */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-3xl opacity-15 transition-all duration-700"
          style={{
            background: `radial-gradient(circle, ${branchColor} 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Desktop & Tablet: Sticky Pinned Stage */}
      <div className="relative max-lg:hidden" style={{ height: `${nodes.length * 100}vh` }}>
        <div className="sticky top-0 h-full flex items-center justify-center p-6 sm:p-10">
          <div className="max-w-6xl w-full grid grid-cols-12 gap-10 sm:gap-14 items-center">

            {/* 1. Left Column: Lateral Pin Indicator */}
            <div className="col-span-5 flex flex-col justify-center space-y-6 z-10">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest uppercase" style={{ color: branchColor }}>
                  <IconSparkles className="w-3.5 h-3.5" />
                  <span>{activeBranch.title}</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                  Trayecto de Cursos
                </h2>
                <p className="text-slate-400 text-xs font-mono">
                  Desplaza la vista para recorrer los módulos secuenciales.
                </p>
              </div>

              {/* Vertical Course Rail */}
              <div className="relative pl-7 flex flex-col space-y-4" role="tablist">
                {/* Vertical Rail Line */}
                <div
                  className="absolute left-2 top-2 bottom-2 w-[2px] bg-slate-800/80"
                  aria-hidden="true"
                />

                {/* Laser Pointer */}
                <div
                  className="absolute left-[1px] w-[4px] rounded-full transition-all duration-300 ease-out"
                  style={{
                    height: '32px',
                    top: `calc(${(activeIndex / Math.max(1, nodes.length - 1)) * 88}% + 4px)`,
                    backgroundColor: branchColor,
                    boxShadow: `0 0 12px ${branchColor}`,
                  }}
                  aria-hidden="true"
                />

                {nodes.map((node, index) => {
                  const isSelected = activeIndex === index;
                  const isUnlocked = node.isUnlocked;

                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => goTo(index)}
                      role="tab"
                      aria-selected={isSelected}
                      className={cn(
                        'group text-left transition-all duration-300 flex flex-col focus:outline-none cursor-pointer',
                        isSelected ? 'opacity-100 scale-[1.02]' : 'opacity-40 hover:opacity-80'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="font-mono text-xs font-bold tracking-wider"
                          style={{ color: isSelected ? branchColor : '#94a3b8' }}
                        >
                          {node.code}
                        </span>
                        <span
                          className={cn(
                            'font-display text-base sm:text-lg font-bold tracking-tight transition-colors truncate',
                            isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                          )}
                        >
                          {node.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 pl-7 mt-0.5">
                        <span className="text-[10px] font-mono text-slate-500 truncate">
                          {node.subtitle || (isUnlocked ? 'Disponible' : 'Bloqueado')}
                        </span>
                        {node.variant === 'completed' && (
                          <span className="text-[9px] font-mono font-bold text-emerald-400 flex items-center gap-0.5">
                            <IconCheck className="w-2.5 h-2.5" />
                            <span>100%</span>
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Right Column: Pinned 3D Interactive Card Deck */}
            <div className="col-span-7 flex items-center justify-center relative perspective-[1200px] min-h-[480px]">
              {nodes.map((node, index) => {
                const isCurrent = activeIndex === index;
                const isLocked = !node.isUnlocked;

                return (
                    <div
                      key={node.id}
                      className={cn(
                        'w-full max-w-[420px] aspect-[1/1.42] rounded-[32px] p-7 flex flex-col justify-between relative shadow-2xl backdrop-blur-xl transition-all duration-700 ease-out transform-gpu',
                        isCurrent
                          ? 'opacity-100 z-20 pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.8)]'
                          : 'opacity-0 z-0 pointer-events-none absolute inset-x-0 mx-auto'
                      )}
                      style={{
                        background: `linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(2,6,23,0.98) 100%)`,
                        border: `1.5px solid ${isCurrent ? branchColor : '#334155'}80`,
                        boxShadow: isCurrent ? `0 0 40px ${branchColor}30, inset 0 1px 1px ${branchColor}50` : 'none',
                        transform: isCurrent
                          ? 'rotateY(0deg) scale(1) translateY(0px)'
                          : index < activeIndex
                          ? 'rotateY(-22deg) scale(0.9) translateY(-30px)'
                          : 'rotateY(22deg) scale(0.9) translateY(30px)',
                      }}
                    >
                      {/* Top Mirrored Header Badge */}
                      <div className="flex items-center justify-between z-10">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                          MISIÓN TÁCTICA // {node.code}
                        </span>
                        <span
                          className={cn(
                            'text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border',
                            isLocked
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                              : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                          )}
                        >
                          {isLocked ? 'RESTRINGIDO' : (node.statusText || 'ACTIVO')}
                        </span>
                      </div>

                      {/* Floating Decorative Diamonds (exact GSAP demo motif) */}
                      <div
                        className="absolute top-16 left-8 w-8 h-8 rounded-sm rotate-45 pointer-events-none opacity-85 transition-transform duration-700"
                        style={{
                          background: `linear-gradient(135deg, ${branchColor} 0%, rgba(255,255,255,0.7) 100%)`,
                          boxShadow: `0 0 24px ${branchColor}`,
                        }}
                      />
                      <div
                        className="absolute bottom-28 right-8 w-8 h-8 rounded-sm rotate-45 pointer-events-none opacity-85 transition-transform duration-700"
                        style={{
                          background: `linear-gradient(135deg, ${branchColor} 0%, rgba(255,255,255,0.7) 100%)`,
                          boxShadow: `0 0 24px ${branchColor}`,
                        }}
                      />

                      {/* Central Big Number & Course Identity */}
                      <div className="flex flex-col items-center justify-center text-center my-auto z-10">
                        <span
                          className="font-display text-8xl sm:text-9xl font-black tracking-tighter leading-none select-none"
                          style={{
                            color: 'transparent',
                            WebkitTextStroke: `1.5px ${branchColor}90`,
                            textShadow: `0 0 30px ${branchColor}40`,
                          }}
                        >
                          {node.code}
                        </span>
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-3">
                          {node.label}
                        </h3>
                        <p className="text-slate-400 text-xs sm:text-sm font-sans mt-2 max-w-[280px] leading-relaxed">
                          {node.subtitle || 'Domina los conceptos fundamentales y supera las pruebas tácticas.'}
                        </p>

                        {/* Telemetry Metrics */}
                        <div className="flex items-center gap-3 mt-4">
                          <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            <IconBolt className="w-3.5 h-3.5 fill-amber-400" />
                            <span>+{node.xp ?? 90} XP</span>
                          </span>
                          <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                            <IconStar className="w-3.5 h-3.5 fill-cyan-400" />
                            <span>★ {node.stars ?? 0}/{node.maxStars ?? 9}</span>
                          </span>
                        </div>
                      </div>

                      {/* Card Footer: Metadata & Action CTA */}
                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 z-10">
                        <div className="text-[10px] font-mono text-slate-400">
                          <span>ESTADO: </span>
                          <span className={isLocked ? 'text-rose-400' : 'text-emerald-400 font-bold'}>
                            {isLocked ? 'BLOQUEADO' : 'HABILITADO'}
                          </span>
                        </div>

                        {isLocked ? (
                          <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 font-mono text-xs font-bold">
                            <IconLock className="w-3.5 h-3.5" />
                            <span>Bloqueado</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onDeploy(node)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono text-xs font-bold text-slate-950 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                            style={{
                              backgroundColor: branchColor,
                              boxShadow: `0 0 15px ${branchColor}50`,
                            }}
                          >
                            <span>Iniciar Protocolo</span>
                            <IconArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Bottom Mirrored Tagline (Reverse detail from GSAP demo) */}
                      <div className="text-center pt-2 select-none pointer-events-none opacity-20">
                        <span className="text-[8px] font-mono uppercase tracking-widest text-slate-400 rotate-180 inline-block">
                          KODA ACADEMY • {node.label}
                        </span>
                      </div>
                    </div>
                );
              })}
            </div>

          </div>

          {/* Bottom Floating Progress Indicator (GSAP demo style) */}
          <div className="absolute bottom-6 left-0 right-0 z-30 pointer-events-none flex justify-center">
            <div className="px-5 py-2 rounded-2xl border border-slate-800/90 bg-slate-950/80 backdrop-blur-md flex items-center gap-4 pointer-events-auto shadow-xl">
              <span className="font-mono text-xs font-bold tabular-nums" style={{ color: branchColor }}>
                0{activeIndex + 1} / 0{nodes.length}
              </span>
              <div
                role="progressbar"
                aria-label={`Curso ${activeIndex + 1} de ${nodes.length}`}
                aria-valuenow={Math.round(progress * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                className="w-36 h-[3px] rounded-full bg-slate-800 overflow-hidden"
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${progress * 100}%`,
                    backgroundColor: branchColor,
                    boxShadow: `0 0 8px ${branchColor}`,
                  }}
                />
              </div>
              <div className="flex items-center gap-1.5">
                {nodes.map((n, i) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Ir al curso ${n.label}`}
                    className={cn(
                      'h-2 rounded-full transition-all cursor-pointer',
                      i === activeIndex ? 'w-6' : 'w-2 bg-slate-700 hover:bg-slate-500'
                    )}
                    style={{
                      backgroundColor: i === activeIndex ? branchColor : undefined,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Vertical List Fallback */}
      <div className="lg:hidden p-4 sm:p-6 space-y-4">
        {nodes.map((node, i) => {
          const isLocked = !node.isUnlocked;
          return (
            <article
              key={`m-${node.id}`}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold" style={{ color: branchColor }}>
                  {node.code}
                </span>
                <span className={cn('text-[10px] font-mono font-bold', isLocked ? 'text-rose-400' : 'text-emerald-400')}>
                  {isLocked ? 'BLOQUEADO' : 'DESBLOQUEADO'}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-white">{node.label}</h3>
              {node.subtitle && <p className="text-xs text-slate-400">{node.subtitle}</p>}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-xs font-mono font-bold text-amber-400">+{node.xp ?? 90} XP</span>
                {isLocked ? (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                    <IconLock className="w-3.5 h-3.5" />
                    <span>Bloqueado</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onDeploy(node)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-950 text-xs font-mono font-bold cursor-pointer"
                    style={{ backgroundColor: branchColor }}
                  >
                    <span>Iniciar</span>
                    <IconArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
