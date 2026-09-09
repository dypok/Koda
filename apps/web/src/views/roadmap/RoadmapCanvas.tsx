'use client';

import React from 'react';
import { GraphDataset, GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { RoadmapSvgPaths } from './RoadmapSvgPaths';
import { RoadmapGraphNode } from './RoadmapGraphNode';
import { RoadmapCanvasControls } from './RoadmapCanvasControls';
import { useRoadmapStore } from '@/stores/roadmap.store';

interface RoadmapCanvasProps {
  dataset: GraphDataset;
}

export function RoadmapCanvas({ dataset }: RoadmapCanvasProps) {
  const { zoomLevel, openCourseLessons, setActiveNode } = useRoadmapStore();

  const handleSelectNode = (node: GraphNode) => {
    setActiveNode(node.id);
    if (node.targetCourseId) {
      openCourseLessons(node.targetCourseId);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center select-none">
      <RoadmapCanvasControls />

      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{ transform: `scale(${zoomLevel / 100})` }}
      >
        <svg
          viewBox="0 0 1150 620"
          className="w-full h-full max-w-7xl max-h-[85vh] drop-shadow-2xl"
          style={{ overflow: 'visible' }}
        >
          {/* Sector Badge floating pill */}
          <g transform="translate(130, 90)">
            <rect x="0" y="0" width="310" height="26" rx="6" fill="#0B132B" stroke="#0284C7" strokeWidth="1" strokeOpacity="0.6" />
            <text x="15" y="17" fill="#38BDF8" fontSize="9" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
              ✓ {dataset.sectorTag}
            </text>
          </g>

          {/* Ambient micro-constellation decorative dots */}
          <g className="opacity-30 pointer-events-none" fill="#94A3B8" fontSize="8" fontFamily="monospace">
            <text x="140" y="180">+</text>
            <text x="350" y="140">+</text>
            <text x="630" y="80">+</text>
            <text x="920" y="130">+</text>
            <text x="240" y="490">+</text>
            <text x="520" y="520">+</text>
            <text x="880" y="470">+</text>
            <circle cx="210" cy="160" r="1.5" fill="#38BDF8" />
            <circle cx="490" cy="110" r="1.5" fill="#F97316" />
            <circle cx="790" cy="90" r="1.5" fill="#A855F7" />
            <circle cx="330" cy="510" r="1.5" fill="#10B981" />
            <circle cx="680" cy="540" r="1.5" fill="#F59E0B" />
          </g>

          {/* Glowing laser connections between nodes */}
          <RoadmapSvgPaths connections={dataset.connections} />

          {/* Interactive Graph Nodes */}
          {dataset.nodes.map((node) => (
            <RoadmapGraphNode
              key={node.id}
              node={node}
              onSelectNode={handleSelectNode}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
