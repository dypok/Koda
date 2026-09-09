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
  const isClickable = node.isUnlocked;

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      onClick={() => isClickable && onSelectNode(node)}
      className={`group transition-all duration-200 ${isClickable ? 'cursor-pointer hover:brightness-125' : 'cursor-not-allowed opacity-75'}`}
    >

      {/* Outer luminous rings & circles */}
      <RoadmapNodeRings variant={node.variant} />

      {/* Centered Node Icon */}
      <foreignObject x="-14" y="-14" width="28" height="28" className="pointer-events-none">
        <div className="w-full h-full flex items-center justify-center text-white">
          <RoadmapNodeIcon
            iconType={node.iconType}
            className={`w-4 h-4 ${node.variant === 'active' ? 'text-slate-950 font-bold' : node.variant === 'boss' ? 'text-rose-200' : 'text-slate-200'}`}
          />
        </div>
      </foreignObject>

      {/* Stars row or course star indicator */}
      {node.stars !== undefined && node.maxStars !== undefined && (
        <g transform="translate(0, 36)">
          {node.maxStars <= 3 ? (
            <text textAnchor="middle" y="0" fontSize="11" letterSpacing="3">
              <tspan fill="#FBBF24">{'★'.repeat(node.stars)}</tspan>
              <tspan fill="#334155">{'★'.repeat(Math.max(0, node.maxStars - node.stars))}</tspan>
            </text>
          ) : (
            <text textAnchor="middle" y="0" fill="#FBBF24" fontSize="10" fontFamily="monospace" fontWeight="bold">
              ★ {node.stars}/{node.maxStars}
            </text>
          )}
        </g>
      )}

      {/* Title & subtitle typography */}
      <g transform={`translate(0, ${node.stars !== undefined ? 54 : 42})`}>
        <text textAnchor="middle" y="0" fill="#F8FAFC" fontSize="11" fontFamily="monospace" fontWeight="bold" letterSpacing="0.5">
          {node.code} • {node.label}
        </text>
        {node.statusText ? (
          <text textAnchor="middle" y="14" fill={node.variant === 'active' ? '#FB923C' : node.variant === 'boss' ? '#F87171' : '#94A3B8'} fontSize="9" fontFamily="monospace" fontWeight="500">
            {node.statusText}
          </text>
        ) : null}
      </g>
    </g>
  );
}
