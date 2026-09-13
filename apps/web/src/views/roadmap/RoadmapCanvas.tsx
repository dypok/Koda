'use client';

import React from 'react';
import { GraphDataset, GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { RoadmapSvgPaths } from './RoadmapSvgPaths';
import { RoadmapGraphNode } from './RoadmapGraphNode';
import { RoadmapCanvasControls } from './RoadmapCanvasControls';
import { RoadmapAmbientStars } from './RoadmapAmbientStars';
import { RoadmapTacticalGrid } from './RoadmapTacticalGrid';
import { RoadmapNodeInspector } from './RoadmapNodeInspector';
import { RoadmapMinimap } from './RoadmapMinimap';
import { useRoadmapWarpTransition } from './useRoadmapWarpTransition';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { useRoadmapPanZoom } from './useRoadmapPanZoom';

interface RoadmapCanvasProps {
  dataset: GraphDataset;
}

export function RoadmapCanvas({ dataset }: RoadmapCanvasProps) {
  const {
    openCourseLessons,
    setActiveNode,
    activeNodeId,
    viewMode,
    retreatTrigger,
    animatingConnectionId,
    unlockingNodeId,
  } = useRoadmapStore();
  const { isDragging, hasMovedRecently, panOffset, zoomLevel, containerRef, containerProps } = useRoadmapPanZoom();
  const [inspectedNode, setInspectedNode] = React.useState<GraphNode | null>(null);

  const warpWrapperRef = React.useRef<HTMLDivElement | null>(null);
  const { isWarping, flashOverlayRef, diveIntoCourse, retreatToCourses } = useRoadmapWarpTransition(warpWrapperRef);

  // Escuchar evento de retorno desde el HUD superior
  React.useEffect(() => {
    if (retreatTrigger > 0) {
      retreatToCourses();
    }
  }, [retreatTrigger]);

  // Inicializar o sincronizar el nodo inspeccionado con el nodo activo por defecto
  React.useEffect(() => {
    if (activeNodeId) {
      const active = dataset.nodes.find((n) => n.id === activeNodeId);
      if (active) setInspectedNode(active);
    } else {
      const active = dataset.nodes.find((n) => n.variant === 'active') || dataset.nodes[0];
      if (active) setInspectedNode(active);
    }
  }, [dataset, activeNodeId]);

  const handleSelectNode = (node: GraphNode) => {
    if (hasMovedRecently() || isWarping) return;
    setInspectedNode(node);
    setActiveNode(node.id);
  };

  const handleDeploy = (node: GraphNode) => {
    if (!node.isUnlocked || isWarping) return;
    if (viewMode === 'courses') {
      diveIntoCourse(node);
    } else if (node.targetCourseId) {
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

      {/* Radar Minimap Tracking Viewport with GSAP Sweep */}
      <RoadmapMinimap dataset={dataset} />

      {/* Drone Scanner / Tactical Telemetry Inspector */}
      <RoadmapNodeInspector
        node={inspectedNode}
        onClose={() => setInspectedNode(null)}
        onDeploy={handleDeploy}
      />

      {/* Quantum Warp Flash Overlay */}
      <div
        ref={flashOverlayRef}
        className="absolute inset-0 bg-cyan-400/20 pointer-events-none opacity-0 z-40 backdrop-blur-xs transition-opacity"
      />

      <div
        ref={warpWrapperRef}
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
          <RoadmapSvgPaths
            connections={dataset.connections}
            animatingConnectionId={animatingConnectionId}
          />

          {/* Interactive Graph Nodes */}
          {dataset.nodes.map((node) => (
            <RoadmapGraphNode
              key={node.id}
              node={node}
              onSelectNode={handleSelectNode}
              isUnlocking={unlockingNodeId === node.id}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
