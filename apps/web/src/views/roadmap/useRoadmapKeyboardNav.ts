'use client';

import { useEffect, useCallback } from 'react';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { GraphNode } from '@/models/roadmap/roadmap-graph.types';

interface UseRoadmapKeyboardNavOptions {
  nodes: GraphNode[];
  onSelectNode: (node: GraphNode) => void;
  onDeployNode: (node: GraphNode) => void;
  onCloseInspector: () => void;
  inspectedNode: GraphNode | null;
}

export function useRoadmapKeyboardNav({
  nodes,
  onSelectNode,
  onDeployNode,
  onCloseInspector,
  inspectedNode,
}: UseRoadmapKeyboardNavOptions) {
  const {
    activeNodeId,
    setActiveNode,
    toggleNodeLock,
    zoomIn,
    zoomOut,
    resetZoom,
  } = useRoadmapStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignorar si el foco está en un input, textarea o elemento editable
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      const currentNode =
        nodes.find((n) => n.id === activeNodeId) ||
        nodes.find((n) => n.id === inspectedNode?.id) ||
        nodes[0];

      if (!currentNode) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();

        let candidates: GraphNode[] = [];
        let computeScore: (n: GraphNode) => number;

        if (e.key === 'ArrowRight') {
          candidates = nodes.filter((n) => n.x > currentNode.x + 10);
          computeScore = (n) => {
            const dx = n.x - currentNode.x;
            const dy = n.y - currentNode.y;
            return Math.sqrt(dx * dx + (dy * 2.2) * (dy * 2.2));
          };
        } else if (e.key === 'ArrowLeft') {
          candidates = nodes.filter((n) => n.x < currentNode.x - 10);
          computeScore = (n) => {
            const dx = currentNode.x - n.x;
            const dy = n.y - currentNode.y;
            return Math.sqrt(dx * dx + (dy * 2.2) * (dy * 2.2));
          };
        } else if (e.key === 'ArrowDown') {
          candidates = nodes.filter((n) => n.y > currentNode.y + 10);
          computeScore = (n) => {
            const dx = n.x - currentNode.x;
            const dy = n.y - currentNode.y;
            return Math.sqrt((dx * 2.2) * (dx * 2.2) + dy * dy);
          };
        } else {
          // ArrowUp
          candidates = nodes.filter((n) => n.y < currentNode.y - 10);
          computeScore = (n) => {
            const dx = n.x - currentNode.x;
            const dy = currentNode.y - n.y;
            return Math.sqrt((dx * 2.2) * (dx * 2.2) + dy * dy);
          };
        }

        if (candidates.length > 0) {
          candidates.sort((a, b) => computeScore(a) - computeScore(b));
          const nextNode = candidates[0];
          setActiveNode(nextNode.id);
          onSelectNode(nextNode);
        } else {
          // Fallback secuencial si el árbol o ruta es lineal / vertical
          const currentIndex = nodes.findIndex((n) => n.id === currentNode.id);
          if (currentIndex !== -1) {
            if ((e.key === 'ArrowRight' || e.key === 'ArrowDown') && currentIndex < nodes.length - 1) {
              const nextNode = nodes[currentIndex + 1];
              setActiveNode(nextNode.id);
              onSelectNode(nextNode);
            } else if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && currentIndex > 0) {
              const prevNode = nodes[currentIndex - 1];
              setActiveNode(prevNode.id);
              onSelectNode(prevNode);
            }
          }
        }
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (inspectedNode && inspectedNode.isUnlocked) {
          onDeployNode(inspectedNode);
        } else if (currentNode) {
          onSelectNode(currentNode);
        }
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseInspector();
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        if (inspectedNode) {
          toggleNodeLock(inspectedNode.id);
        } else if (currentNode) {
          toggleNodeLock(currentNode.id);
        }
        return;
      }

      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        zoomIn();
        return;
      }

      if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        zoomOut();
        return;
      }

      if (e.key === '0') {
        e.preventDefault();
        resetZoom();
        return;
      }
    },
    [
      nodes,
      activeNodeId,
      inspectedNode,
      onSelectNode,
      onDeployNode,
      onCloseInspector,
      setActiveNode,
      toggleNodeLock,
      zoomIn,
      zoomOut,
      resetZoom,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
