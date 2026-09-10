'use client';

import React from 'react';
import { GraphDataset, GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { RoadmapSvgPaths } from './RoadmapSvgPaths';
import { RoadmapGraphNode } from './RoadmapGraphNode';
import { RoadmapCanvasControls } from './RoadmapCanvasControls';
import { RoadmapAmbientStars } from './RoadmapAmbientStars';
import { useRoadmapStore } from '@/stores/roadmap.store';

interface RoadmapCanvasProps {
  dataset: GraphDataset;
}

export function RoadmapCanvas({ dataset }: RoadmapCanvasProps) {
  const { zoomLevel, openCourseLessons, setActiveNode } = useRoadmapStore();

  const handleSelectNode = (node: GraphNode) => {
    if (!node.isUnlocked) return;
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
          {/* Ambient micro-constellation decorative dots */}
          <RoadmapAmbientStars />

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
