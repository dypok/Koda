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

  const { toggleNodeLock } = useRoadmapStore();

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

  // Alternar bloqueo/desbloqueo directo con pulso GSAP
  const handleQuickToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
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

      // 3. Estallido y disipación del candado
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

      // 4. Salto de escala de la baliza y reaparición del icono como nodo activo
      tl.fromTo(
        group,
        { scale: 0.9 },
        { scale: 1.15, duration: 0.3, ease: 'back.out(2)' }
      );
      tl.to(group, { scale: 1.0, duration: 0.25, ease: 'power2.out' });

      // 5. El nuevo icono se manifiesta con rebote
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
      onClick={() => onSelectNode(node)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group cursor-pointer select-none ${
        node.isUnlocked ? '' : 'opacity-80 hover:opacity-100'
      }`}
    >
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

      {/* Outer luminous rings & tactical brackets */}
      <RoadmapNodeRings variant={node.variant} />

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
        className="opacity-0 cursor-pointer pointer-events-auto transition-opacity"
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
        <g transform="translate(0, 38)">
          <rect
            x="-24"
            y="-10"
            width="48"
            height="14"
            rx="3"
            fill="#090D16"
            stroke="#1E293B"
            strokeWidth="0.75"
            className="opacity-90"
          />
          {node.maxStars <= 3 ? (
            <text textAnchor="middle" y="0" fontSize="9" letterSpacing="2">
              <tspan fill="#FBBF24">{'★'.repeat(node.stars)}</tspan>
              <tspan fill="#334155">{'★'.repeat(Math.max(0, node.maxStars - node.stars))}</tspan>
            </text>
          ) : (
            <text textAnchor="middle" y="0" fill="#FBBF24" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
              ★ {node.stars}/{node.maxStars}
            </text>
          )}
        </g>
      )}

      {/* Tactical Badge & Subtitle Typography */}
      <g transform={`translate(0, ${node.stars !== undefined ? 58 : 44})`}>
        <text
          textAnchor="middle"
          y="0"
          fill="#F1F5F9"
          fontSize="11"
          fontFamily="monospace"
          fontWeight="bold"
          letterSpacing="0.75"
          className="transition-colors group-hover:fill-cyan-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        >
          {node.code} • {node.label}
        </text>

        {node.statusText ? (
          <g transform="translate(0, 14)">
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
              fontSize="8.5"
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
