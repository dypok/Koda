'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  IconArrowRight,
  IconLock,
  IconCheck,
  IconStar,
  IconSparkles,
  IconChevronUp,
  IconChevronDown,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconLayoutSidebarRightCollapse,
  IconLayoutSidebarRightExpand,
} from '@tabler/icons-react';
import { GraphDataset, GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { CAREER_BRANCHES } from '@/models/roadmap/tracks/track-catalog';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { useRoadmapPanZoom } from './useRoadmapPanZoom';
import { RoadmapSvgPaths } from './RoadmapSvgPaths';
import { RoadmapGraphNode } from './RoadmapGraphNode';
import { RoadmapAmbientStars } from './RoadmapAmbientStars';
import { RoadmapTacticalGrid } from './RoadmapTacticalGrid';
import { RoadmapCanvasControls } from './RoadmapCanvasControls';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

interface RoadmapFusionViewProps {
  dataset: GraphDataset;
  onDeploy: (node: GraphNode) => void;
}

/**
 * Vista Fusionada: Combina el mapa de constelación estelar 2D interactivo
 * con el riel lateral de cursos estilo GSAP y la tarjeta táctica 3D.
 * - Fondo espacial interactivo con estrellas, líneas láser y nodos.
 * - Flanco izquierdo: Riel holográfico con puntero láser vertical.
 * - Flanco derecho: Baraja de tarjetas tácticas 3D fijadas con diamantes GSAP y números gigantes.
 * - Cámara reactiva: Al seleccionar un curso en el riel, la cámara espacial viaja hacia la estrella.
 * - Cero efectos de audio (sin WebAudio ni SFX).
 */
export const RoadmapFusionView: React.FC<RoadmapFusionViewProps> = ({ dataset, onDeploy }) => {
  const {
    activeBranchId,
    activeNodeId,
    setActiveNode,
    animatingConnectionId,
    unlockingNodeId,
    setPanOffset,
  } = useRoadmapStore();

  const nodes = dataset.nodes;

  const activeBranch = useMemo(
    () => CAREER_BRANCHES.find((b) => b.id === activeBranchId) || CAREER_BRANCHES[0],
    [activeBranchId]
  );
  const branchColor = activeBranch.color;

  // Estado de visibilidad de los paneles laterales (permite colapsar para explorar el cosmos)
  const [showLeftRail, setShowLeftRail] = useState(true);
  const [showRightCard, setShowRightCard] = useState(true);

  // Sincronización del índice activo
  const activeIndex = useMemo(() => {
    const idx = nodes.findIndex((n) => n.id === activeNodeId);
    return idx >= 0 ? idx : 0;
  }, [nodes, activeNodeId]);

  const activeNode = nodes[activeIndex] || nodes[0];

  // Pan y Zoom espacial del lienzo
  const {
    isDragging,
    hasMovedRecently,
    panOffset,
    zoomLevel,
    containerRef,
    containerProps,
  } = useRoadmapPanZoom();

  // Cámara reactiva: Al cambiar de curso, viajar suavemente en el espacio para enfocar el nodo
  useEffect(() => {
    if (!activeNode) return;
    // Centro del SVG viewBox (1150 x 620) es (575, 310)
    // Desplazamiento compensado para situar el nodo visible en el área despejada
    const targetX = Math.round((575 - activeNode.x) * 0.7);
    const targetY = Math.round((310 - activeNode.y) * 0.7);

    // Animación suave de cámara espacial
    gsap.to(
      {},
      {
        duration: 0.6,
        ease: 'power2.out',
        onUpdate: function () {
          const progress = this.progress();
          setPanOffset({
            x: panOffset.x + (targetX - panOffset.x) * progress * 0.35,
            y: panOffset.y + (targetY - panOffset.y) * progress * 0.35,
          });
        },
      }
    );
  }, [activeNode?.id]);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(nodes.length - 1, index));
      const targetNode = nodes[clamped];
      if (targetNode) {
        setActiveNode(targetNode.id);
      }
    },
    [nodes, setActiveNode]
  );

  // Control por rueda de ratón con aceleración amortiguada
  const lastWheelTime = useRef(0);
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      // Si el cursor está sobre la constelación y el usuario no presiona ctrl, navega entre cursos
      const target = e.target as HTMLElement | null;
      if (target?.closest('.no-course-scroll')) return;

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

  // Navegación con teclado
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

  // Medición dinámica del puntero láser del riel lateral
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [laserStyle, setLaserStyle] = useState({ top: 8, height: 36 });

  useEffect(() => {
    const activeEl = itemRefs.current[activeIndex];
    if (activeEl) {
      setLaserStyle({
        top: activeEl.offsetTop + 4,
        height: Math.max(26, activeEl.offsetHeight - 8),
      });
    }
  }, [activeIndex, nodes]);

  // Selección directa tocando una estrella en el mapa espacial
  const handleSelectConstellationNode = (node: GraphNode) => {
    if (hasMovedRecently()) return;
    setActiveNode(node.id);
  };

  const progressPercent = Math.round(((activeIndex + 1) / Math.max(1, nodes.length)) * 100);

  return (
    <div
      onWheel={handleWheel}
      className="relative w-full h-full overflow-hidden select-none"
    >
      {/* 1. CAPA BASE: Lienzo espacial interactivo de la Constelación */}
      <div
        ref={containerRef}
        {...containerProps}
        className={cn(
          'absolute inset-0 flex items-center justify-center touch-none',
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        )}
      >
        <RoadmapCanvasControls />

        {/* Resplandor ambiental acorde a la especialidad */}
        <div
          className="absolute w-[800px] h-[600px] rounded-full blur-3xl opacity-15 pointer-events-none transition-all duration-700"
          style={{
            background: `radial-gradient(circle, ${branchColor} 0%, transparent 70%)`,
            transform: `translate3d(${panOffset.x * 0.2}px, ${panOffset.y * 0.2}px, 0)`,
          }}
        />

        {/* Contenedor transformable del SVG con Pan y Zoom */}
        <div
          className="w-full h-full flex items-center justify-center will-change-transform transition-transform duration-150 ease-out"
          style={{
            transformOrigin: 'center center',
            transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(${zoomLevel / 100})`,
          }}
        >
          <svg
            viewBox="0 0 1150 620"
            className="w-full h-full max-w-7xl max-h-[88vh] drop-shadow-2xl pointer-events-auto"
            style={{ overflow: 'visible' }}
          >
            {/* Retícula de cartografía estelar */}
            <RoadmapTacticalGrid />

            {/* Estrellas ambientales decorativas */}
            <RoadmapAmbientStars />

            {/* Conexiones láser entre cursos */}
            <RoadmapSvgPaths
              connections={dataset.connections}
              animatingConnectionId={animatingConnectionId}
              highlightFromId={activeNodeId}
              nodes={dataset.nodes}
            />

            {/* Anillo táctico de mira espacial alrededor del nodo activo */}
            {activeNode && (
              <g className="pointer-events-none transition-all duration-500">
                {/* Anillo exterior rotatorio discontinuo */}
                <circle
                  cx={activeNode.x}
                  cy={activeNode.y}
                  r={48}
                  fill="none"
                  stroke={branchColor}
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  opacity={0.85}
                  className="animate-spin"
                  style={{ animationDuration: '10s' }}
                />
                {/* Halo de pulso brillante */}
                <circle
                  cx={activeNode.x}
                  cy={activeNode.y}
                  r={56}
                  fill="none"
                  stroke={branchColor}
                  strokeWidth="1"
                  opacity={0.3}
                  className="animate-ping"
                  style={{ animationDuration: '3s' }}
                />
                {/* Cruces de telemetría */}
                <line
                  x1={activeNode.x - 62}
                  y1={activeNode.y}
                  x2={activeNode.x - 52}
                  y2={activeNode.y}
                  stroke={branchColor}
                  strokeWidth="2"
                />
                <line
                  x1={activeNode.x + 52}
                  y1={activeNode.y}
                  x2={activeNode.x + 62}
                  y2={activeNode.y}
                  stroke={branchColor}
                  strokeWidth="2"
                />
              </g>
            )}

            {/* Nodos interactivos de la constelación */}
            {dataset.nodes.map((node) => (
              <RoadmapGraphNode
                key={node.id}
                node={node}
                onSelectNode={handleSelectConstellationNode}
                isUnlocking={unlockingNodeId === node.id}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* 2. FLANCO IZQUIERDO: Riel Lateral Pinned (Panel Holográfico Flotante) */}
      <div
        className={cn(
          'absolute left-4 sm:left-6 top-4 sm:top-6 bottom-4 sm:bottom-6 z-20 flex flex-col transition-all duration-400 ease-out pointer-events-none',
          showLeftRail ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        )}
      >
        <div className="w-72 sm:w-80 h-full rounded-3xl border border-slate-800/80 bg-slate-950/80 backdrop-blur-xl shadow-2xl p-5 flex flex-col justify-between pointer-events-auto overflow-y-auto no-course-scroll">
          <div className="space-y-4">
            {/* Cabecera del Riel */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="space-y-0.5">
                <div
                  className="flex items-center gap-1.5 text-[9px] font-mono font-bold tracking-widest uppercase"
                  style={{ color: branchColor }}
                >
                  <IconSparkles className="w-3 h-3" />
                  <span>{activeBranch.title}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-white leading-tight">
                  Trayecto Táctico
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLeftRail(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
                title="Colapsar panel lateral"
              >
                <IconLayoutSidebarLeftCollapse className="w-4 h-4" />
              </button>
            </div>

            {/* Riel con puntero láser sincronizado */}
            <div className="relative pl-5 flex flex-col space-y-2" role="tablist">
              {/* Guía vertical */}
              <div
                className="absolute left-1.5 top-2 bottom-2 w-[2px] bg-slate-800/80 rounded-full"
                aria-hidden="true"
              />

              {/* Láser deslizante activo */}
              <div
                className="absolute left-[0px] w-[3.5px] rounded-full transition-all duration-400 ease-out pointer-events-none"
                style={{
                  top: `${laserStyle.top}px`,
                  height: `${laserStyle.height}px`,
                  backgroundColor: branchColor,
                  boxShadow: `0 0 12px ${branchColor}, 0 0 3px #ffffff`,
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
                      'group text-left transition-all duration-300 flex flex-col py-2 px-2.5 rounded-xl focus:outline-none cursor-pointer',
                      isSelected
                        ? 'bg-slate-900/85 translate-x-1 border border-slate-800/90 shadow-md'
                        : 'opacity-45 hover:opacity-90 hover:bg-slate-900/30'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="font-mono text-[11px] font-bold tracking-wider"
                        style={{ color: isSelected ? branchColor : '#94a3b8' }}
                      >
                        {node.code}
                      </span>
                      <span
                        className={cn(
                          'font-display text-xs sm:text-sm font-bold tracking-tight truncate',
                          isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                        )}
                      >
                        {node.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 pl-6 mt-0.5">
                      <span className="text-[9px] font-mono text-slate-500 truncate">
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

          <div className="pt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span>MODO COCKPIT</span>
            <span style={{ color: branchColor }}>ENLACE ACTIVO</span>
          </div>
        </div>
      </div>

      {/* Botón flotante para reabrir el panel izquierdo si está colapsado */}
      {!showLeftRail && (
        <button
          type="button"
          onClick={() => setShowLeftRail(true)}
          className="absolute left-4 top-6 z-20 p-2.5 rounded-xl border border-slate-800/90 bg-slate-950/80 backdrop-blur-md text-slate-300 hover:text-white shadow-xl hover:scale-105 transition-all cursor-pointer"
          title="Abrir riel de cursos"
        >
          <IconLayoutSidebarLeftExpand className="w-4 h-4" />
        </button>
      )}

      {/* 3. FLANCO DERECHO: Tarjeta Táctica 3D Pinned (Estilo GSAP) */}
      <div
        className={cn(
          'absolute right-4 sm:right-6 top-4 sm:top-6 bottom-4 sm:bottom-6 z-20 flex flex-col justify-center transition-all duration-400 ease-out pointer-events-none perspective-[1200px]',
          showRightCard ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        )}
      >
        <div className="relative w-80 sm:w-96 max-w-full aspect-[1/1.38] pointer-events-auto">
          {/* Botón para colapsar tarjeta 3D */}
          <button
            type="button"
            onClick={() => setShowRightCard(false)}
            className="absolute -left-3 top-4 z-30 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900/90 border border-slate-800 shadow-md transition-colors cursor-pointer"
            title="Colapsar tarjeta"
          >
            <IconLayoutSidebarRightCollapse className="w-3.5 h-3.5" />
          </button>

          {nodes.map((node, index) => {
            const isCurrent = activeIndex === index;
            const isLocked = !node.isUnlocked;

            return (
              <div
                key={node.id}
                className={cn(
                  'w-full h-full rounded-[30px] p-6 flex flex-col justify-between relative shadow-2xl backdrop-blur-2xl transition-all duration-600 ease-out transform-gpu',
                  isCurrent
                    ? 'opacity-100 z-20 pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.9)]'
                    : 'opacity-0 z-0 pointer-events-none absolute inset-0'
                )}
                style={{
                  background: `linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(2,6,23,0.98) 100%)`,
                  border: `1.5px solid ${isCurrent ? branchColor : '#334155'}80`,
                  boxShadow: isCurrent
                    ? `0 0 35px ${branchColor}30, inset 0 1px 2px ${branchColor}50`
                    : 'none',
                  transform: isCurrent
                    ? 'rotateY(0deg) scale(1) translateY(0px) translateZ(0px)'
                    : index < activeIndex
                    ? 'rotateY(-28deg) scale(0.9) translateY(-25px) translateZ(-80px)'
                    : 'rotateY(28deg) scale(0.9) translateY(25px) translateZ(-80px)',
                }}
              >
                {/* Cabecera Superior de Tarjeta */}
                <div className="flex items-center justify-between z-10">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                    MISIÓN // {node.code}
                  </span>
                  <span
                    className={cn(
                      'text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full border',
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
                  className="absolute top-10 left-8 w-6 h-6 rotate-45 rounded-md pointer-events-none opacity-85"
                  style={{
                    background: `linear-gradient(135deg, #ffffff 0%, ${branchColor} 100%)`,
                    boxShadow: `0 0 18px ${branchColor}80`,
                  }}
                />

                {/* Diamante Inferior Derecho Flotante (Icono insignia GSAP) */}
                <div
                  className="absolute bottom-16 right-8 w-7 h-7 rotate-45 rounded-lg pointer-events-none opacity-85"
                  style={{
                    background: `linear-gradient(135deg, ${branchColor} 0%, #020617 100%)`,
                    boxShadow: `0 0 20px ${branchColor}70`,
                  }}
                />

                {/* Centro: Gran Número Táctico + Título */}
                <div className="flex flex-col items-center justify-center my-auto py-2 relative z-10 text-center">
                  <span
                    className="font-mono font-black text-8xl tracking-tighter select-none leading-none"
                    style={{
                      background: `linear-gradient(180deg, #ffffff 20%, ${branchColor} 85%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: `drop-shadow(0 0 25px ${branchColor}45)`,
                    }}
                  >
                    {node.code}
                  </span>

                  <h3 className="font-display text-lg sm:text-xl font-black tracking-tight text-white mt-2 leading-snug px-3">
                    {node.label}
                  </h3>

                  {node.subtitle && (
                    <p className="font-mono text-[10px] text-slate-400 mt-1 tracking-wider uppercase px-3 line-clamp-2">
                      {node.subtitle}
                    </p>
                  )}

                  {/* Metadatos Tácticos (XP & Estrellas) */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      +{node.xp ?? 100} XP
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                      <IconStar className="w-3 h-3 fill-cyan-400" />
                      <span>★ {node.stars ?? 0}/{node.maxStars ?? 9}</span>
                    </span>
                  </div>
                </div>

                {/* Pie de Tarjeta: Botón de Acción */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 z-10">
                  <div className="text-[9px] font-mono text-slate-400">
                    <span>ESTADO: </span>
                    <span className={isLocked ? 'text-rose-400' : 'text-emerald-400 font-bold'}>
                      {isLocked ? 'BLOQUEADO' : 'HABILITADO'}
                    </span>
                  </div>

                  {isLocked ? (
                    <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 font-mono text-[11px] font-bold">
                      <IconLock className="w-3 h-3" />
                      <span>Restringido</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onDeploy(node)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold text-slate-950 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                      style={{
                        backgroundColor: branchColor,
                        boxShadow: `0 0 14px ${branchColor}60`,
                      }}
                    >
                      <span>Iniciar Protocolo</span>
                      <IconArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Texto Espejado Inferior (Estilo GSAP) */}
                <div className="text-center pt-1 select-none pointer-events-none opacity-20">
                  <span className="text-[7px] font-mono uppercase tracking-widest text-slate-400 rotate-180 inline-block">
                    KODA ACADEMY • {node.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botón flotante para reabrir la tarjeta derecha si está colapsada */}
      {!showRightCard && (
        <button
          type="button"
          onClick={() => setShowRightCard(true)}
          className="absolute right-4 top-6 z-20 p-2.5 rounded-xl border border-slate-800/90 bg-slate-950/80 backdrop-blur-md text-slate-300 hover:text-white shadow-xl hover:scale-105 transition-all cursor-pointer"
          title="Abrir tarjeta táctica"
        >
          <IconLayoutSidebarRightExpand className="w-4 h-4" />
        </button>
      )}

      {/* 4. NAVEGADOR INFERIOR FLOTANTE: Stepper + Barra de Progreso + Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-3 px-4 py-2 rounded-2xl border border-slate-800/90 bg-slate-950/85 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-2.5 pointer-events-auto">
          <span className="font-mono text-xs font-bold tabular-nums" style={{ color: branchColor }}>
            0{activeIndex + 1} / 0{nodes.length}
          </span>
          <div
            role="progressbar"
            aria-label={`Curso ${activeIndex + 1} de ${nodes.length}`}
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="w-20 sm:w-28 h-[3px] rounded-full bg-slate-800 overflow-hidden"
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

        <div className="flex items-center gap-1 pointer-events-auto">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Curso anterior"
            className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <IconChevronUp className="w-3.5 h-3.5" />
          </button>

          {nodes.map((n, i) => (
            <button
              key={n.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir al curso ${n.label}`}
              className={cn(
                'h-1.5 rounded-full transition-all cursor-pointer',
                i === activeIndex ? 'w-5' : 'w-1.5 bg-slate-700 hover:bg-slate-500'
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
            <IconChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
