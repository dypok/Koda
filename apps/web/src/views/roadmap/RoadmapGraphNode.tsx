'use client';

import React from 'react';
import { GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { RoadmapNodeRings } from './RoadmapNodeRings';
import { RoadmapNodeIcon } from './RoadmapNodeIcon';

interface RoadmapGraphNodeProps {
  node: GraphNode;
  onSelectNode: (node: GraphNode) => void;
}

export function RoadmapGraphNode({ node, onSelectNode }: RoadmapGraphNodeProps) {
  const isClickable = true;

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      onClick={() => onSelectNode(node)}
      className={`group transition-all duration-200 cursor-pointer ${
        node.isUnlocked ? '' : 'opacity-75 hover:opacity-100'
      }`}
    >
      {/* Outer luminous rings & tactical brackets */}
      <RoadmapNodeRings variant={node.variant} />

      {/* Centered Node Icon with tactile micro-hover */}
      <foreignObject x="-14" y="-14" width="28" height="28" className="pointer-events-none">
        <div className="w-full h-full flex items-center justify-center text-white">
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

      {/* Stars Badge: Repositioned as a compact floating tactical pill above or right below without colliding */}
      {node.stars !== undefined && node.maxStars !== undefined && (
        <g transform="translate(0, 38)">
          {/* Subtle dark pill background for stars */}
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

      {/* Tactical Badge & Subtitle Typography (Structured HUD Card Layout) */}
      <g transform={`translate(0, ${node.stars !== undefined ? 58 : 44})`}>
        {/* Module Code Badge & Label */}
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

        {/* Status telemetry pill */}
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
