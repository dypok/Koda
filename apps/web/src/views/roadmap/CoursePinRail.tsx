'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Lock, Check, Star, Sparkle, CaretUp, CaretDown } from '@phosphor-icons/react';
import { GraphDataset, GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { CAREER_BRANCHES } from '@/models/roadmap/tracks/track-catalog';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { cn } from '@/lib/utils';

interface CoursePinRailProps {
  dataset: GraphDataset;
  onDeploy: (node: GraphNode) => void;
}

/**
 * Vista de cursos inspirada en la demo GSAP 'Lateral pin indicator':
 * - Columna Izquierda: Riel lateral con lista de cursos y puntero láser vertical sincronizado.
 * - Columna Derecha: Tarjeta 3D fijada con grandes números neón (01, 02...), diamantes reflectantes,
 *   detalles técnicos y botón de inicio de protocolo.
 * - Navegación: Rueda del ratón (wheel), gestos táctiles, teclas flecha arriba/abajo y clic directo.
 * - Cero efectos de audio (sin WebAudio ni SFX).
 */
export const CoursePinRail: React.FC<CoursePinRailProps> = ({ dataset, onDeploy }) => {
  const { activeBranchId, activeNodeId, setActiveNode } = useRoadmapStore();
  const nodes = dataset.nodes;

  const activeBranch = useMemo(
    () => CAREER_BRANCHES.find((b) => b.id === activeBranchId) || CAREER_BRANCHES[0],
    [activeBranchId]
  );
  const branchColor = activeBranch.color;

  // Sincronizar índice inicial según el nodo seleccionado
  const initialIndex = useMemo(() => {
    const idx = nodes.findIndex((n) => n.id === activeNodeId);
    return idx >= 0 ? idx : 0;
  }, [nodes, activeNodeId]);

  const [activeIndex, setActiveIndex] = useState(initialIndex);

  // Mantener sincronizado cuando cambie el nodo activo externamente
  useEffect(() => {
    const idx = nodes.findIndex((n) => n.id === activeNodeId);
    if (idx >= 0) {
      setActiveIndex(idx);
    }
  }, [activeNodeId, nodes]);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(nodes.length - 1, index));
      setActiveIndex(clamped);
      const targetNode = nodes[clamped];
      if (targetNode) {
        setActiveNode(targetNode.id);
      }
    },
    [nodes, setActiveNode]
  );

  // Navegación por rueda de ratón con aceleración controlada y enfriamiento
  const lastWheelTime = useRef(0);
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const now = Date.now();
      if (now - lastWheelTime.current < 280) return;

      if (e.deltaY > 20) {
        lastWheelTime.current = now;
        goTo(activeIndex + 1);
      } else if (e.deltaY < -20) {
        lastWheelTime.current = now;
        goTo(activeIndex - 1);
      }
    },
    [activeIndex, goTo]
  );

  // Navegación por teclado (Flechas Arriba/Abajo y AvPág/RePág)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        goTo(activeIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goTo(activeIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, goTo]);

  // Medición dinámica para la línea láser del indicador lateral
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [laserStyle, setLaserStyle] = useState({ top: 8, height: 36 });

  useEffect(() => {
    const activeEl = itemRefs.current[activeIndex];
    if (activeEl) {
      setLaserStyle({
        top: activeEl.offsetTop + 4,
        height: Math.max(28, activeEl.offsetHeight - 8),
      });
    }
  }, [activeIndex, nodes]);

  const activeNode = nodes[activeIndex] || nodes[0];
  const progressPercent = Math.round(((activeIndex + 1) / Math.max(1, nodes.length)) * 100);

  return (
    <div
      onWheel={handleWheel}
      className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 lg:p-10 select-none overflow-hidden"
    >
      {/* Resplandor ambiental de fondo acorde a la rama de carrera */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[520px] rounded-full blur-3xl opacity-20 transition-all duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${branchColor} 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Escenario Principal Central (Grid de 2 Columnas) */}
      <div className="flex-1 flex items-center justify-center max-w-7xl w-full mx-auto my-auto">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">

          {/* 1. Columna Izquierda: Lateral Pin Indicator Rail */}
          <div className="lg:col-span-5 flex flex-col space-y-6 z-10">
            <div className="space-y-1 text-left">
              <div
                className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest uppercase"
                style={{ color: branchColor }}
              >
                <Sparkle className="w-3.5 h-3.5" />
                <span>{activeBranch.title}</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                Trayecto de Cursos
              </h2>
              <p className="text-slate-400 text-xs font-mono">
                Usa el scroll, las teclas o haz clic en cualquier curso para explorar.
              </p>
            </div>

            {/* Riel Vertical de Cursos */}
            <div className="relative pl-6 flex flex-col space-y-2 sm:space-y-3" role="tablist">
              {/* Línea de guía vertical */}
              <div
                className="absolute left-2 top-2 bottom-2 w-[2px] bg-slate-800/80 rounded-full"
                aria-hidden="true"
              />

              {/* Cursor Láser Deslizante Activo (estilo GSAP) */}
              <div
                className="absolute left-[1px] w-[4px] rounded-full transition-all duration-400 ease-out pointer-events-none"
                style={{
                  top: `${laserStyle.top}px`,
                  height: `${laserStyle.height}px`,
                  backgroundColor: branchColor,
                  boxShadow: `0 0 14px ${branchColor}, 0 0 4px #ffffff`,
                }}
                aria-hidden="true"
              />

              {nodes.map((node, index) => {
                const isSelected = activeIndex === index;
                const isUnlocked = node.isUnlocked;

                return (
                  <button
                    key={node.id}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    type="button"
                    onClick={() => goTo(index)}
                    role="tab"
                    aria-selected={isSelected}
                    className={cn(
                      'group text-left transition-all duration-300 flex flex-col py-2 px-3 rounded-xl focus:outline-none cursor-pointer',
                      isSelected
                        ? 'opacity-100 bg-slate-900/60 translate-x-1.5'
                        : 'opacity-40 hover:opacity-85 hover:bg-slate-900/20'
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
                          'font-display text-sm sm:text-base font-bold tracking-tight transition-colors truncate',
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
                          <Check className="w-2.5 h-2.5" />
                          <span>100%</span>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Columna Derecha: Tarjeta Pinned 3D (Estilo exacto GSAP demo) */}
          <div className="lg:col-span-7 flex items-center justify-center relative perspective-[1200px] min-h-[440px] sm:min-h-[500px]">
            {nodes.map((node, index) => {
              const isCurrent = activeIndex === index;
              const isLocked = !node.isUnlocked;

              return (
                <div
                  key={node.id}
                  className={cn(
                    'w-full max-w-[420px] aspect-[1/1.42] rounded-[32px] p-7 flex flex-col justify-between relative shadow-2xl backdrop-blur-2xl transition-all duration-600 ease-out transform-gpu',
                    isCurrent
                      ? 'opacity-100 z-20 pointer-events-auto shadow-[0_0_60px_rgba(0,0,0,0.85)]'
                      : 'opacity-0 z-0 pointer-events-none absolute inset-x-0 mx-auto'
                  )}
                  style={{
                    background: `linear-gradient(150deg, rgba(15,23,42,0.96) 0%, rgba(2,6,23,0.98) 100%)`,
                    border: `1.5px solid ${isCurrent ? branchColor : '#334155'}80`,
                    boxShadow: isCurrent
                      ? `0 0 45px ${branchColor}35, inset 0 1px 2px ${branchColor}60`
                      : 'none',
                    transform: isCurrent
                      ? 'rotateY(0deg) scale(1) translateY(0px) translateZ(0px)'
                      : index < activeIndex
                      ? 'rotateY(-26deg) scale(0.9) translateY(-25px) translateZ(-80px)'
                      : 'rotateY(26deg) scale(0.9) translateY(25px) translateZ(-80px)',
                  }}
                >
                  {/* Cabecera Superior: Tag táctico + Badge de Estado */}
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
                      {isLocked ? 'RESTRINGIDO' : node.statusText || 'ACTIVO'}
                    </span>
                  </div>

                  {/* Diamante Superior Izquierdo Flotante (Icono insignia GSAP) */}
                  <div
                    className="absolute top-12 left-9 w-7 h-7 rotate-45 rounded-md pointer-events-none opacity-85 transition-transform duration-700"
                    style={{
                      background: `linear-gradient(135deg, #ffffff 0%, ${branchColor} 100%)`,
                      boxShadow: `0 0 20px ${branchColor}80`,
                    }}
                  />

                  {/* Diamante Inferior Derecho Flotante (Icono insignia GSAP) */}
                  <div
                    className="absolute bottom-20 right-9 w-8 h-8 rotate-45 rounded-lg pointer-events-none opacity-85 transition-transform duration-700"
                    style={{
                      background: `linear-gradient(135deg, ${branchColor} 0%, #020617 100%)`,
                      boxShadow: `0 0 25px ${branchColor}70`,
                    }}
                  />

                  {/* Texto decorativo vertical en los bordes (como GSAP demo) */}
                  <div
                    aria-hidden="true"
                    className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[8px] font-mono tracking-widest uppercase opacity-30 text-slate-400 pointer-events-none"
                  >
                    KODA PROTOCOL
                  </div>
                  <div
                    aria-hidden="true"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-[8px] font-mono tracking-widest uppercase opacity-30 text-slate-400 pointer-events-none"
                  >
                    KODA PROTOCOL
                  </div>

                  {/* Centro: Gran Número Táctico + Título + Subtítulo */}
                  <div className="flex flex-col items-center justify-center my-auto py-2 relative z-10 text-center">
                    <span
                      className="font-mono font-black text-8xl sm:text-9xl tracking-tighter select-none leading-none"
                      style={{
                        background: `linear-gradient(180deg, #ffffff 15%, ${branchColor} 85%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: `drop-shadow(0 0 25px ${branchColor}50)`,
                      }}
                    >
                      {node.code}
                    </span>

                    <h3 className="font-display text-xl sm:text-2xl font-black tracking-tight text-white mt-3 leading-snug px-4">
                      {node.label}
                    </h3>

                    {node.subtitle && (
                      <p className="font-mono text-[11px] text-slate-400 mt-1 tracking-wider uppercase px-4 line-clamp-2">
                        {node.subtitle}
                      </p>
                    )}

                    {/* Metadatos Tácticos (XP & Estrellas) */}
                    <div className="flex items-center gap-2 mt-4">
                      <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                        +{node.xp ?? 100} XP
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                        <Star className="w-3.5 h-3.5 fill-cyan-400" />
                        <span>★ {node.stars ?? 0}/{node.maxStars ?? 9}</span>
                      </span>
                    </div>
                  </div>

                  {/* Pie de Tarjeta: Estado & Botón de Acción CTA */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 z-10">
                    <div className="text-[10px] font-mono text-slate-400">
                      <span>ESTADO: </span>
                      <span className={isLocked ? 'text-rose-400' : 'text-emerald-400 font-bold'}>
                        {isLocked ? 'BLOQUEADO' : 'HABILITADO'}
                      </span>
                    </div>

                    {isLocked ? (
                      <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 font-mono text-xs font-bold">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Restringido</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onDeploy(node)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold text-slate-950 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                        style={{
                          backgroundColor: branchColor,
                          boxShadow: `0 0 16px ${branchColor}60`,
                        }}
                      >
                        <span>Iniciar Protocolo</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Texto Espejado Inferior (Detalle característico de la demo GSAP) */}
                  <div className="text-center pt-2 select-none pointer-events-none opacity-25">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-slate-400 rotate-180 inline-block">
                      KODA ACADEMY • {node.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* 3. Navegador Inferior Flotante (GSAP style navigator & dots) */}
      <div className="w-full max-w-2xl mx-auto z-30 pointer-events-none flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2.5 rounded-2xl border border-slate-800/90 bg-slate-950/85 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-3 pointer-events-auto">
          <span className="font-mono text-xs font-bold tabular-nums" style={{ color: branchColor }}>
            0{activeIndex + 1} / 0{nodes.length}
          </span>
          <div
            role="progressbar"
            aria-label={`Curso ${activeIndex + 1} de ${nodes.length}`}
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="w-24 sm:w-36 h-[3px] rounded-full bg-slate-800 overflow-hidden"
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: branchColor,
                boxShadow: `0 0 8px ${branchColor}`,
              }}
            />
          </div>
        </div>

        {/* Puntos de navegación clicables */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Curso anterior"
            className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <CaretUp className="w-4 h-4" />
          </button>

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

          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === nodes.length - 1}
            aria-label="Siguiente curso"
            className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <CaretDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
