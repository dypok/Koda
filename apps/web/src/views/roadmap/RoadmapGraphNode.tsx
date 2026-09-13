'use client';

import React, { useRef, useEffect } from 'react';
import { GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { RoadmapNodeRings } from './RoadmapNodeRings';
import { RoadmapNodeIcon } from './RoadmapNodeIcon';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { IconLock, IconLockOpen } from '@tabler/icons-react';
import gsap from 'gsap';

interface RoadmapGraphNodeProps {
  node: GraphNode;
  onSelectNode: (node: GraphNode) => void;
  isUnlocking?: boolean;
}

export function RoadmapGraphNode({ node, onSelectNode, isUnlocking }: RoadmapGraphNodeProps) {
  const nodeGroupRef = useRef<SVGGElement | null>(null);
  const iconWrapperRef = useRef<HTMLDivElement | null>(null);
  const lockShatterGlowRef = useRef<SVGCircleElement | null>(null);
  const quickToggleRef = useRef<SVGGElement | null>(null);
  const shardsRef = useRef<SVGGElement | null>(null);

  const { toggleNodeLock, unlockNodeWithCinematic } = useRoadmapStore();
  const zoomLevel = useRoadmapStore((s) => s.zoomLevel);
  // Contreescala el texto para que no crezca con el zoom del canvas.
  const textScale = 100 / Math.max(50, zoomLevel);

  // Micro-animación GSAP al hacer hover sobre el nodo
  const handleMouseEnter = () => {
    if (!nodeGroupRef.current) return;
    gsap.to(nodeGroupRef.current, {
      scale: 1.06,
      duration: 0.25,
      ease: 'power2.out',
    });
    if (quickToggleRef.current) {
      gsap.to(quickToggleRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        ease: 'back.out(1.7)',
      });
    }
  };

  const handleMouseLeave = () => {
    if (!nodeGroupRef.current) return;
    gsap.to(nodeGroupRef.current, {
      scale: 1,
      duration: 0.25,
      ease: 'power2.out',
    });
    if (quickToggleRef.current) {
      gsap.to(quickToggleRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.15,
        ease: 'power2.in',
      });
    }
  };

  // Alternar bloqueo/desbloqueo directo con pulso GSAP (el desbloqueo usa cinemática)
  const handleQuickToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!node.isUnlocked) {
      unlockNodeWithCinematic(node.id);
      return;
    }
    const group = nodeGroupRef.current;
    if (group) {
      gsap.timeline()
        .to(group, { scale: 0.92, duration: 0.1, ease: 'power2.in' })
        .to(group, { scale: 1.08, duration: 0.2, ease: 'back.out(2)' })
        .to(group, { scale: 1, duration: 0.15, ease: 'power2.out' });
    }
    toggleNodeLock(node.id);
  };

  // Animación GSAP de ruptura de candado y encendido de baliza
  useEffect(() => {
    if (!isUnlocking) return;
    const group = nodeGroupRef.current;
    const icon = iconWrapperRef.current;
    const glow = lockShatterGlowRef.current;
    if (!group || !icon) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Vibración de sobrecarga energética sobre el candado
      tl.to(icon, {
        x: '+=3',
        yoyo: true,
        repeat: 7,
        duration: 0.05,
        ease: 'power1.inOut',
      });

      // 2. Destello de sobretensión en el núcleo
      if (glow) {
        tl.fromTo(
          glow,
          { r: 10, opacity: 0 },
          { r: 48, opacity: 0.9, duration: 0.25, ease: 'power2.out' },
          '-=0.15'
        );
        tl.to(glow, { opacity: 0, r: 60, duration: 0.3, ease: 'power1.out' });
      }

      // 3. Estallido cuántico: Dispersión radial de esquirlas de cristal
      if (shardsRef.current) {
        const shardElements = shardsRef.current.querySelectorAll('.lock-shard');
        tl.set(shardsRef.current, { opacity: 1 }, '-=0.2');
        shardElements.forEach((shard, idx) => {
          const rad = (idx * 60 * Math.PI) / 180;
          const dist = 32 + (idx % 2) * 10;
          tl.fromTo(
            shard,
            { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
            {
              x: Math.cos(rad) * dist,
              y: Math.sin(rad) * dist,
              rotation: idx % 2 === 0 ? 120 : -120,
              scale: 0.1,
              opacity: 0,
              duration: 0.55,
              ease: 'power3.out',
            },
            '-=0.45'
          );
        });
      }

      // 4. Estallido y disipación del icono de candado
      tl.to(
        icon,
        {
          scale: 0,
          rotation: 45,
          opacity: 0,
          duration: 0.2,
          ease: 'back.in(2)',
        },
        '-=0.3'
      );

      // 5. Salto de escala de la baliza y reaparición del icono como nodo activo
      tl.fromTo(
        group,
        { scale: 0.9 },
        { scale: 1.15, duration: 0.3, ease: 'back.out(2)' }
      );
      tl.to(group, { scale: 1.0, duration: 0.25, ease: 'power2.out' });

      // 6. El nuevo icono se manifiesta con rebote
      tl.fromTo(
        icon,
        { scale: 0, rotation: -90, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.35, ease: 'back.out(2)' },
        '-=0.3'
      );
    }, group);

    return () => ctx.revert();
  }, [isUnlocking]);

  return (
    <g
      ref={nodeGroupRef}
      transform={`translate(${node.x}, ${node.y})`}
      data-node-id={node.id}
      role="button"
      tabIndex={0}
      aria-label={`${node.code}: ${node.label}${node.statusText ? `. ${node.statusText}` : ''}${node.isUnlocked ? '' : '. Bloqueado'}`}
      onClick={() => onSelectNode(node)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectNode(node);
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group cursor-pointer select-none focus-visible:outline-none focus-visible:drop-shadow-[0_0_10px_rgba(34,211,238,0.9)] ${
        node.isUnlocked ? '' : 'opacity-80 hover:opacity-100'
      }`}
    >
      {node.variant === 'boss' && !node.isUnlocked ? (
        <title>Desafío final bloqueado: completa todos los sectores anteriores para abrir el Apex Gate</title>
      ) : null}
      {/* Hit-area táctil generosa */}
      <circle r="32" fill="transparent" />
      {/* Shockwave circle for lock shattering */}
      <circle
        ref={lockShatterGlowRef}
        r="0"
        fill="none"
        stroke="#38BDF8"
        strokeWidth="3"
        opacity="0"
        className="pointer-events-none"
      />

      {/* Quantum crystal shards dispersed upon unlocking */}
      <g ref={shardsRef} className="pointer-events-none opacity-0">
        {[0, 60, 120, 180, 240, 300].map((deg, idx) => (
          <polygon
            key={idx}
            className="lock-shard"
            points="-3,-5 4,-2 2,5 -4,2"
            fill="#38BDF8"
            stroke="#BAE6FD"
            strokeWidth="0.75"
          />
        ))}
      </g>

      {/* Outer luminous rings & tactical brackets */}
      <RoadmapNodeRings variant={node.variant} />

      {/* Tactical Glass Core Scanline Glaze */}
      <circle
        r={node.variant === 'boss' ? 28 : 26}
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="0.75"
        strokeDasharray="1 3"
        className="pointer-events-none"
      />

      {/* Centered Node Icon with tactile micro-hover */}
      <foreignObject x="-14" y="-14" width="28" height="28" className="pointer-events-none">
        <div
          ref={iconWrapperRef}
          className="w-full h-full flex items-center justify-center text-white will-change-transform"
        >
          <RoadmapNodeIcon
            iconType={!node.isUnlocked && node.variant !== 'boss' ? 'lock' : node.iconType}
            className={`w-4 h-4 transition-all duration-300 ${
              !node.isUnlocked
                ? 'text-slate-400 group-hover:text-rose-400 group-hover:scale-110'
                : node.variant === 'active'
                  ? 'text-slate-950 font-black scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                  : node.variant === 'boss'
                    ? 'text-rose-200 group-hover:scale-125 transition-transform'
                    : 'text-slate-200 group-hover:scale-115'
            }`}
          />
        </div>
      </foreignObject>

      {/* Direct Individual Lock/Unlock Holographic Toggle Badge */}
      <g
        ref={quickToggleRef}
        transform="translate(24, -24)"
        onClick={handleQuickToggle}
        className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-within:opacity-100 cursor-pointer pointer-events-auto transition-opacity"
      >
        <title>{node.isUnlocked ? 'Clic para bloquear este círculo' : 'Clic para desbloquear este círculo'}</title>
        <circle
          r="11"
          fill={node.isUnlocked ? '#0F172A' : '#083344'}
          stroke={node.isUnlocked ? '#F43F5E' : '#22D3EE'}
          strokeWidth="1.5"
          className="drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] hover:scale-125 transition-transform"
        />
        <foreignObject x="-6" y="-6" width="12" height="12" className="pointer-events-none">
          <div className="w-full h-full flex items-center justify-center">
            {node.isUnlocked ? (
              <IconLock className="w-2.5 h-2.5 text-rose-400" />
            ) : (
              <IconLockOpen className="w-2.5 h-2.5 text-cyan-300" />
            )}
          </div>
        </foreignObject>
      </g>

      {/* Stars Badge: Repositioned as a compact floating tactical pill */}
      {node.stars !== undefined && node.maxStars !== undefined && (
        <g transform={`translate(0, 38) scale(${textScale})`}>
          <rect
            x="-28"
            y="-11"
            width="56"
            height="18"
            rx="4"
            fill="#090D16"
            stroke="#1E293B"
            strokeWidth="0.75"
            className="opacity-90"
          />
          {node.maxStars <= 3 ? (
            <text textAnchor="middle" y="1" fontSize="9" letterSpacing="2">
              <tspan fill="#FBBF24">{'★'.repeat(node.stars)}</tspan>
              <tspan fill="#334155">{'★'.repeat(Math.max(0, node.maxStars - node.stars))}</tspan>
            </text>
          ) : (
            <text textAnchor="middle" y="1" fill="#FBBF24" fontSize="9" fontFamily="monospace" fontWeight="bold">
              ★ {node.stars}/{node.maxStars}
            </text>
          )}
        </g>
      )}

      {/* Tactical Badge & Subtitle Typography */}
      <g transform={`translate(0, ${node.stars !== undefined ? 58 : 44}) scale(${textScale})`}>
        <text
          textAnchor="middle"
          y="0"
          fill="#F1F5F9"
          fontSize="12.5"
          fontFamily="monospace"
          fontWeight="bold"
          letterSpacing="0.75"
          className="transition-colors group-hover:fill-cyan-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        >
          {node.code} • {node.label}
        </text>

        {node.statusText ? (
          <g transform="translate(0, 15)">
            <text
              textAnchor="middle"
              y="0"
              fill={
                node.variant === 'active'
                  ? '#FB923C'
                  : node.variant === 'boss'
                    ? '#F87171'
                    : '#64748B'
              }
              fontSize="9.5"
              fontFamily="monospace"
              fontWeight="600"
              letterSpacing="0.5"
              className={!node.isUnlocked ? 'transition-colors duration-200 group-hover:fill-rose-400' : ''}
            >
              {node.statusText}
            </text>
          </g>
        ) : null}
      </g>
    </g>
  );
}
