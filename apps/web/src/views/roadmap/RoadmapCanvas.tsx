'use client';

import React from 'react';
import { GraphDataset, GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { RoadmapSvgPaths } from './RoadmapSvgPaths';
import { RoadmapGraphNode } from './RoadmapGraphNode';
import { RoadmapCanvasControls } from './RoadmapCanvasControls';
import { RoadmapAmbientStars } from './RoadmapAmbientStars';
import { RoadmapTacticalGrid } from './RoadmapTacticalGrid';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { useRoadmapPanZoom } from './useRoadmapPanZoom';

interface RoadmapCanvasProps {
  dataset: GraphDataset;
}

export function RoadmapCanvas({ dataset }: RoadmapCanvasProps) {
  const { openCourseLessons, setActiveNode } = useRoadmapStore();
  const { isDragging, hasMovedRecently, panOffset, zoomLevel, containerRef, containerProps } = useRoadmapPanZoom();

  const handleSelectNode = (node: GraphNode) => {
    if (!node.isUnlocked || hasMovedRecently()) return;
    setActiveNode(node.id);
    if (node.targetCourseId) {
      openCourseLessons(node.targetCourseId);
    }
  };

  return (
    <div
      ref={containerRef}
      {...containerProps}
      className={`relative w-full h-full overflow-hidden flex items-center justify-center select-none touch-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      <RoadmapCanvasControls />

      <div
        className={`w-full h-full flex items-center justify-center will-change-transform ${
          isDragging ? '' : 'transition-transform duration-200 ease-out'
        }`}
        style={{
          transformOrigin: 'center center',
          transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(${zoomLevel / 100})`,
        }}
      >
        <svg
          viewBox="0 0 1150 620"
          className="w-full h-full max-w-7xl max-h-[85vh] drop-shadow-2xl pointer-events-auto"
          style={{ overflow: 'visible' }}
        >
          {/* Tactical starmap cartography coordinates & grid */}
          <RoadmapTacticalGrid />

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
