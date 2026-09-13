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
  IconLayoutSidebarRightCollapse,
  IconLayoutSidebarRightExpand,
  IconSkull,
  IconAlertTriangle,
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
 * Vista Fusionada Premium (Pack Táctico Sci-Fi):
 * 1. Haz Umbilical Láser Conector (Ray-Beam): Conecta la estrella de la constelación con la tarjeta 3D.
 * 2. Retícula Táctica de Telemetría: HUD rotatorio, coordenadas orbitales y cruces de mira sobre la estrella.
 * 3. Mouse Tilt 3D Parallax: Giro dinámico reactivo al cursor con reflejo especular en diamantes.
 * 4. Modo Alerta Roja / Boss Gate: Transformación carmesí de emergencia para nodos Boss (Ω APEX GATE).
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

  // Estado de visibilidad del panel derecho de la tarjeta 3D
  const [showRightCard, setShowRightCard] = useState(true);

  // Sincronización del índice activo
  const activeIndex = useMemo(() => {
    const idx = nodes.findIndex((n) => n.id === activeNodeId);
    return idx >= 0 ? idx : 0;
  }, [nodes, activeNodeId]);

  const activeNode = nodes[activeIndex] || nodes[0];
  const isBossNode = activeNode.variant === 'boss';

  // Color de acento dinámico (carmesí si es jefe, color de rama de lo contrario)
  const themeAccentColor = isBossNode ? '#F43F5E' : branchColor;

  // Pan y Zoom espacial del lienzo
  const {
    isDragging,
    hasMovedRecently,
    panOffset,
    zoomLevel,
    containerRef,
    containerProps,
  } = useRoadmapPanZoom();

  // Cámara reactiva espacial: al cambiar de nodo, viajar suavemente en el cosmos
  useEffect(() => {
    if (!activeNode) return;
    const targetX = Math.round((575 - activeNode.x) * 0.7);
    const targetY = Math.round((310 - activeNode.y) * 0.7);

    gsap.to(
      {},
      {
        duration: 0.65,
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

  // Control por rueda de ratón amortiguada
  const lastWheelTime = useRef(0);
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
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

  // Selección directa en la constelación
  const handleSelectConstellationNode = (node: GraphNode) => {
    if (hasMovedRecently()) return;
    setActiveNode(node.id);
  };

  // -------------------------------------------------------------
  // 🌟 MOUSE PARALLAX 3D TILT EN LA TARJETA
  // -------------------------------------------------------------
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardContainerRef.current) return;
    const rect = cardContainerRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    // Inclinación máxima de ±8 grados
    const rotateY = (px - 0.5) * 16;
    const rotateX = (0.5 - py) * 16;
    setCardTilt({ x: rotateX, y: rotateY });
  };

  const handleCardMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
  };

  // -------------------------------------------------------------
  // ⚡ HAZ UMBILICAL LÁSER CONECTOR (RAY-BEAM LINK)
  // -------------------------------------------------------------
  const [beamCoords, setBeamCoords] = useState<{
    starX: number;
    starY: number;
    cardX: number;
    cardY: number;
    visible: boolean;
  }>({ starX: 0, starY: 0, cardX: 0, cardY: 0, visible: false });

  const updateBeamPosition = useCallback(() => {
    if (!showRightCard || !cardContainerRef.current) {
      setBeamCoords((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }

    const starEl = document.querySelector(`[data-node-id="${activeNode.id}"]`);
    if (!starEl || !cardContainerRef.current) {
      setBeamCoords((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }

    const starRect = starEl.getBoundingClientRect();
    const cardRect = cardContainerRef.current.getBoundingClientRect();

    setBeamCoords({
      starX: Math.round(starRect.left + starRect.width / 2),
      starY: Math.round(starRect.top + starRect.height / 2),
      cardX: Math.round(cardRect.left),
      cardY: Math.round(cardRect.top + cardRect.height * 0.42),
      visible: true,
    });
  }, [activeNode.id, showRightCard]);

  // Actualizar la trayectoria del rayo con el pan, zoom y resize
  useEffect(() => {
    updateBeamPosition();
    const id = requestAnimationFrame(updateBeamPosition);
    return () => cancelAnimationFrame(id);
  }, [panOffset, zoomLevel, activeIndex, updateBeamPosition]);

  useEffect(() => {
    window.addEventListener('resize', updateBeamPosition);
    return () => window.removeEventListener('resize', updateBeamPosition);
  }, [updateBeamPosition]);

  const progressPercent = Math.round(((activeIndex + 1) / Math.max(1, nodes.length)) * 100);

  // Cálculo del SVG Path curvado del rayo
  const beamPath = useMemo(() => {
    if (!beamCoords.visible) return '';
    const { starX, starY, cardX, cardY } = beamCoords;
    const midX = (starX + cardX) / 2;
    return `M ${starX} ${starY} C ${midX} ${starY}, ${midX} ${cardY}, ${cardX} ${cardY}`;
  }, [beamCoords]);

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

        {/* Resplandor ambiental de nebulosa */}
        <div
          className="absolute w-[850px] h-[650px] rounded-full blur-3xl opacity-15 pointer-events-none transition-all duration-700"
          style={{
            background: `radial-gradient(circle, ${themeAccentColor} 0%, transparent 70%)`,
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

            {/* -------------------------------------------------------- */}
            {/* 🎯 RETÍCULA TÁCTICA HOLOGRÁFICA (HEADS-UP TARGETING) */}
            {/* -------------------------------------------------------- */}
            {activeNode && (
              <g className="pointer-events-none transition-all duration-500">
                {/* 1. Anillo exterior rotatorio discontinuo */}
                <circle
                  cx={activeNode.x}
                  cy={activeNode.y}
                  r={52}
                  fill="none"
                  stroke={themeAccentColor}
                  strokeWidth={isBossNode ? '2' : '1.5'}
                  strokeDasharray={isBossNode ? '8 4' : '6 4'}
                  opacity={isBossNode ? 0.95 : 0.8}
                  className="animate-spin"
                  style={{ animationDuration: isBossNode ? '6s' : '12s' }}
                />

                {/* 2. Anillo secundario contra-rotatorio */}
                <circle
                  cx={activeNode.x}
                  cy={activeNode.y}
                  r={42}
                  fill="none"
                  stroke={themeAccentColor}
                  strokeWidth="1"
                  strokeDasharray="4 8"
                  opacity={0.5}
                  className="animate-spin"
                  style={{ animationDuration: '18s', animationDirection: 'reverse' }}
                />

                {/* 3. Halo de pulso resonante */}
                <circle
                  cx={activeNode.x}
                  cy={activeNode.y}
                  r={64}
                  fill="none"
                  stroke={themeAccentColor}
                  strokeWidth="1"
                  opacity={isBossNode ? 0.45 : 0.25}
                  className="animate-ping"
                  style={{ animationDuration: isBossNode ? '2s' : '3.5s' }}
                />

                {/* 4. Brackets esquineros de mira táctica (HUD Corner Brackets) */}
                <path
                  d={`
                    M ${activeNode.x - 58} ${activeNode.y - 40} L ${activeNode.x - 58} ${activeNode.y - 58} L ${activeNode.x - 40} ${activeNode.y - 58}
                    M ${activeNode.x + 40} ${activeNode.y - 58} L ${activeNode.x + 58} ${activeNode.y - 58} L ${activeNode.x + 58} ${activeNode.y - 40}
                    M ${activeNode.x - 58} ${activeNode.y + 40} L ${activeNode.x - 58} ${activeNode.y + 58} L ${activeNode.x - 40} ${activeNode.y + 58}
                    M ${activeNode.x + 40} ${activeNode.y + 58} L ${activeNode.x + 58} ${activeNode.y + 58} L ${activeNode.x + 58} ${activeNode.y + 40}
                  `}
                  fill="none"
                  stroke={themeAccentColor}
                  strokeWidth="2"
                  opacity={0.85}
                />

                {/* 5. Cruces horizontales y verticales de telemetría */}
                <line
                  x1={activeNode.x - 68}
                  y1={activeNode.y}
                  x2={activeNode.x - 56}
                  y2={activeNode.y}
                  stroke={themeAccentColor}
                  strokeWidth="2"
                />
                <line
                  x1={activeNode.x + 56}
                  y1={activeNode.y}
                  x2={activeNode.x + 68}
                  y2={activeNode.y}
                  stroke={themeAccentColor}
                  strokeWidth="2"
                />
                <line
                  x1={activeNode.x}
                  y1={activeNode.y - 68}
                  x2={activeNode.x}
                  y2={activeNode.y - 56}
                  stroke={themeAccentColor}
                  strokeWidth="2"
                />
                <line
                  x1={activeNode.x}
                  y1={activeNode.y + 56}
                  x2={activeNode.x}
                  y2={activeNode.y + 68}
                  stroke={themeAccentColor}
                  strokeWidth="2"
                />

                {/* 6. Etiqueta flotante con coordenadas y telemetría espacial */}
                <g transform={`translate(${activeNode.x + 58}, ${activeNode.y - 32})`}>
                  <rect
                    x="0"
                    y="-12"
                    width="128"
                    height="24"
                    rx="4"
                    fill="#020617"
                    fillOpacity="0.85"
                    stroke={themeAccentColor}
                    strokeWidth="1"
                    strokeOpacity="0.7"
                  />
                  <text
                    x="8"
                    y="4"
                    fill={themeAccentColor}
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                    letterSpacing="1px"
                  >
                    {isBossNode ? '⚠️ APEX GATE' : `X:${activeNode.x} Y:${activeNode.y}`}
                  </text>
                </g>
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

      {/* ------------------------------------------------------------- */}
      {/* ⚡ HAZ UMBILICAL LÁSER CONECTOR (RAY-BEAM OVERLAY) */}
      {/* ------------------------------------------------------------- */}
      {beamCoords.visible && showRightCard && (
        <svg className="fixed inset-0 w-full h-full pointer-events-none z-15 overflow-visible">
          <defs>
            <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={themeAccentColor} stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor={themeAccentColor} stopOpacity="0.8" />
            </linearGradient>
            <filter id="beamGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Resplandor exterior difuminado del haz */}
          <path
            d={beamPath}
            fill="none"
            stroke={themeAccentColor}
            strokeWidth={isBossNode ? '6' : '4'}
            opacity="0.25"
            filter="url(#beamGlow)"
          />

          {/* Haz láser central de energía cuántica */}
          <path
            d={beamPath}
            fill="none"
            stroke="url(#beamGradient)"
            strokeWidth={isBossNode ? '2.5' : '2'}
            strokeDasharray="8 6"
            className="animate-pulse"
          />

          {/* Nodo emisor en la estrella */}
          <circle
            cx={beamCoords.starX}
            cy={beamCoords.starY}
            r="4.5"
            fill={themeAccentColor}
            className="animate-ping"
            style={{ animationDuration: '2s' }}
          />

          {/* Receptor de energía en el borde de la tarjeta 3D */}
          <circle
            cx={beamCoords.cardX}
            cy={beamCoords.cardY}
            r="5"
            fill="#ffffff"
            stroke={themeAccentColor}
            strokeWidth="2"
            filter="url(#beamGlow)"
          />
        </svg>
      )}

      {/* 2. FLANCO DERECHO: Tarjeta Táctica 3D Pinned con Mouse Tilt & Boss Mode */}
      <div
        className={cn(
          'absolute right-4 sm:right-6 top-4 sm:top-6 bottom-4 sm:bottom-6 z-20 flex flex-col justify-center transition-all duration-400 ease-out pointer-events-none perspective-[1200px]',
          showRightCard ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        )}
      >
        <div
          ref={cardContainerRef}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          className="relative w-80 sm:w-96 max-w-full aspect-[1/1.38] pointer-events-auto"
        >
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
            const isBoss = node.variant === 'boss';

            return (
              <div
                key={node.id}
                className={cn(
                  'w-full h-full rounded-[30px] p-6 flex flex-col justify-between relative shadow-2xl backdrop-blur-2xl transition-all duration-500 ease-out transform-gpu',
                  isCurrent
                    ? 'opacity-100 z-20 pointer-events-auto shadow-[0_0_60px_rgba(0,0,0,0.92)]'
                    : 'opacity-0 z-0 pointer-events-none absolute inset-0'
                )}
                style={{
                  background: isBoss
                    ? 'linear-gradient(150deg, rgba(30,10,20,0.96) 0%, rgba(10,3,7,0.98) 100%)'
                    : 'linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(2,6,23,0.98) 100%)',
                  border: isBoss
                    ? '1.5px solid rgba(244,63,94,0.8)'
                    : `1.5px solid ${isCurrent ? branchColor : '#334155'}80`,
                  boxShadow: isCurrent
                    ? isBoss
                      ? '0 0 50px rgba(244,63,94,0.45), inset 0 1px 2px rgba(244,63,94,0.7)'
                      : `0 0 35px ${branchColor}30, inset 0 1px 2px ${branchColor}50`
                    : 'none',
                  transform: isCurrent
                    ? `rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg) scale(1) translateY(0px) translateZ(0px)`
                    : index < activeIndex
                    ? 'rotateY(-28deg) scale(0.9) translateY(-25px) translateZ(-80px)'
                    : 'rotateY(28deg) scale(0.9) translateY(25px) translateZ(-80px)',
                }}
              >
                {/* Cabecera Superior de Tarjeta */}
                <div className="flex items-center justify-between z-10">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
                    {isBoss ? (
                      <>
                        <IconAlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                        <span className="text-rose-400 font-black">AMENAZA OMEGA // {node.code}</span>
                      </>
                    ) : (
                      <span>MISIÓN // {node.code}</span>
                    )}
                  </span>
                  <span
                    className={cn(
                      'text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full border',
                      isBoss
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse'
                        : isLocked
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                        : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                    )}
                  >
                    {isBoss ? 'JEFE DE SECTOR' : isLocked ? 'RESTRINGIDO' : node.statusText || 'ACTIVO'}
                  </span>
                </div>

                {/* Diamante Superior Izquierdo Flotante (Icono insignia GSAP con Parallax) */}
                <div
                  className="absolute top-10 left-8 w-6 h-6 rotate-45 rounded-md pointer-events-none opacity-85 transition-transform duration-200"
                  style={{
                    background: isBoss
                      ? 'linear-gradient(135deg, #ffffff 0%, #F43F5E 100%)'
                      : `linear-gradient(135deg, #ffffff 0%, ${branchColor} 100%)`,
                    boxShadow: isBoss
                      ? '0 0 20px rgba(244,63,94,0.9)'
                      : `0 0 18px ${branchColor}80`,
                    transform: `translate3d(${cardTilt.y * 1.2}px, ${-cardTilt.x * 1.2}px, 20px) rotate(45deg)`,
                  }}
                />

                {/* Diamante Inferior Derecho Flotante (Icono insignia GSAP con Parallax) */}
                <div
                  className="absolute bottom-16 right-8 w-7 h-7 rotate-45 rounded-lg pointer-events-none opacity-85 transition-transform duration-200"
                  style={{
                    background: isBoss
                      ? 'linear-gradient(135deg, #F43F5E 0%, #020617 100%)'
                      : `linear-gradient(135deg, ${branchColor} 0%, #020617 100%)`,
                    boxShadow: isBoss
                      ? '0 0 24px rgba(244,63,94,0.8)'
                      : `0 0 20px ${branchColor}70`,
                    transform: `translate3d(${-cardTilt.y * 1.2}px, ${cardTilt.x * 1.2}px, 20px) rotate(45deg)`,
                  }}
                />

                {/* Centro: Gran Número Táctico + Título */}
                <div className="flex flex-col items-center justify-center my-auto py-2 relative z-10 text-center">
                  <span
                    className="font-mono font-black text-8xl tracking-tighter select-none leading-none transition-transform duration-200"
                    style={{
                      background: isBoss
                        ? 'linear-gradient(180deg, #ffffff 20%, #F43F5E 85%)'
                        : `linear-gradient(180deg, #ffffff 20%, ${branchColor} 85%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: isBoss
                        ? 'drop-shadow(0 0 30px rgba(244,63,94,0.65))'
                        : `drop-shadow(0 0 25px ${branchColor}45)`,
                      transform: `translate3d(${cardTilt.y * 0.8}px, ${-cardTilt.x * 0.8}px, 15px)`,
                    }}
                  >
                    {node.code}
                  </span>

                  <h3
                    className={cn(
                      'font-display text-lg sm:text-xl font-black tracking-tight mt-2 leading-snug px-3',
                      isBoss ? 'text-rose-200' : 'text-white'
                    )}
                  >
                    {node.label}
                  </h3>

                  {node.subtitle && (
                    <p className="font-mono text-[10px] text-slate-400 mt-1 tracking-wider uppercase px-3 line-clamp-2">
                      {node.subtitle}
                    </p>
                  )}

                  {/* Metadatos Tácticos (XP & Estrellas) */}
                  <div className="flex items-center gap-2 mt-3">
                    <span
                      className={cn(
                        'text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border',
                        isBoss
                          ? 'text-rose-300 bg-rose-500/20 border-rose-500/40'
                          : 'text-amber-300 bg-amber-500/10 border-amber-500/20'
                      )}
                    >
                      +{node.xp ?? 500} XP
                    </span>
                    {!isBoss && (
                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                        <IconStar className="w-3 h-3 fill-cyan-400" />
                        <span>★ {node.stars ?? 0}/{node.maxStars ?? 9}</span>
                      </span>
                    )}
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
                      <span>{isBoss ? 'Desafío Bloqueado' : 'Restringido'}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onDeploy(node)}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer',
                        isBoss
                          ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.6)]'
                          : 'text-slate-950 shadow-md'
                      )}
                      style={{
                        backgroundColor: isBoss ? undefined : branchColor,
                        boxShadow: isBoss ? undefined : `0 0 14px ${branchColor}60`,
                      }}
                    >
                      <span>{isBoss ? 'Enfrentar Apex' : 'Iniciar Protocolo'}</span>
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

      {/* Botón flotante para reabrir la tarjeta derecha */}
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
          <span className="font-mono text-xs font-bold tabular-nums" style={{ color: themeAccentColor }}>
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
                backgroundColor: themeAccentColor,
                boxShadow: `0 0 8px ${themeAccentColor}`,
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
                backgroundColor: i === activeIndex ? (n.variant === 'boss' ? '#F43F5E' : branchColor) : undefined,
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
