'use client';

import React from 'react';
import { GraphDataset, GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { RoadmapSvgPaths } from './RoadmapSvgPaths';
import { RoadmapGraphNode } from './RoadmapGraphNode';
import { RoadmapCanvasControls } from './RoadmapCanvasControls';
import { RoadmapAmbientStars } from './RoadmapAmbientStars';
import { RoadmapTacticalGrid } from './RoadmapTacticalGrid';
import { RoadmapNodeInspector } from './RoadmapNodeInspector';
import { useRoadmapWarpTransition } from './useRoadmapWarpTransition';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { useRoadmapPanZoom } from './useRoadmapPanZoom';
import { useRoadmapKeyboardNav } from './useRoadmapKeyboardNav';
import { RoadmapProtocolModal } from './RoadmapProtocolModal';
import gsap from 'gsap';

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

  // Mantener sincronizado el nodo actualmente inspeccionado con el dataset (refleja cambios de bloqueo/desbloqueo al instante)
  // Compara por campos para no entrar en bucle si el dataset trae objetos nuevos.
  React.useEffect(() => {
    if (inspectedNode) {
      const refreshed = dataset.nodes.find((n) => n.id === inspectedNode.id);
      const same =
        refreshed &&
        refreshed.isUnlocked === inspectedNode.isUnlocked &&
        refreshed.variant === inspectedNode.variant &&
        refreshed.stars === inspectedNode.stars &&
        refreshed.label === inspectedNode.label;
      if (refreshed && !same) {
        setInspectedNode(refreshed);
      }
    } else if (activeNodeId) {
      const active = dataset.nodes.find((n) => n.id === activeNodeId);
      if (active) setInspectedNode(active);
    } else {
      const active = dataset.nodes.find((n) => n.variant === 'active') || dataset.nodes[0];
      if (active) setInspectedNode(active);
    }
  }, [dataset, activeNodeId, inspectedNode]);

  const handleSelectNode = (node: GraphNode) => {
    if (hasMovedRecently() || isWarping) return;
    // El boss bloqueado tiembla al intentarlo: presencia, no silencio.
    if (node.variant === 'boss' && !node.isUnlocked) {
      const el = containerRef.current?.querySelector(`[data-node-id="${node.id}"]`);
      if (el) {
        gsap.fromTo(el, { x: 0 }, { x: 6, duration: 0.05, repeat: 5, yoyo: true, clearProps: 'x' });
      }
    }
    setInspectedNode(node);
    setActiveNode(node.id);
  };

  // Red de seguridad: el pointer capture del pan puede retargetear el click;
  // en fase de captura resolvemos el nodo bajo el puntero aunque el click se pierda.
  const handlePointerUpCapture = (e: React.PointerEvent<HTMLDivElement>) => {
    if (hasMovedRecently() || isWarping) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest('button, a, [role="button"], .no-drag')) return;
    const el = document.elementFromPoint(e.clientX, e.clientY)?.closest?.('[data-node-id]');
    const id = el?.getAttribute('data-node-id');
    if (!id) return;
    const node = dataset.nodes.find((n) => n.id === id);
    if (node) handleSelectNode(node);
  };

  const [activeProtocolNode, setActiveProtocolNode] = React.useState<GraphNode | null>(null);

  const handleDeploy = (node: GraphNode) => {
    if (!node.isUnlocked || isWarping) return;
    if (viewMode === 'courses') {
      diveIntoCourse(node);
    } else if (node.targetCourseId) {
      openCourseLessons(node.targetCourseId);
    } else {
      setActiveProtocolNode(node);
    }
  };

  // Navegación espacial por teclado (Flechas, Enter, Escape, Espacio, Zoom)
  useRoadmapKeyboardNav({
    nodes: dataset.nodes,
    onSelectNode: handleSelectNode,
    onDeployNode: handleDeploy,
    onCloseInspector: () => setInspectedNode(null),
    inspectedNode,
  });

  return (
    <div
      ref={containerRef}
      {...containerProps}
      onPointerUpCapture={handlePointerUpCapture}
      className={`relative w-full h-full overflow-hidden flex items-center justify-center select-none touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
    >
      <RoadmapCanvasControls />

      {/* Drone Scanner / Tactical Telemetry Inspector */}
      <RoadmapNodeInspector
        node={inspectedNode}
        onClose={() => setInspectedNode(null)}
        onDeploy={handleDeploy}
      />

      {/* Modal Táctico de Misión / Triada de Evaluación */}
      <RoadmapProtocolModal
        node={activeProtocolNode}
        isOpen={Boolean(activeProtocolNode)}
        onClose={() => setActiveProtocolNode(null)}
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
            highlightFromId={activeNodeId}
            nodes={dataset.nodes}
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
