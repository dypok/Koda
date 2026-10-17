'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Cube, FileText } from '@phosphor-icons/react';
import { GraphNode } from '@/models/roadmap/roadmap-graph.types';

interface DragToAddManagerProps {
  viewMode: 'courses' | 'lessons';
  nodes: GraphNode[];
  onDropNewItem: (type: 'module' | 'section', targetIndex: number, clientX: number, clientY: number) => void;
  disabled?: boolean;
}

export const DragToAddManager: React.FC<DragToAddManagerProps> = ({
  viewMode,
  nodes,
  onDropNewItem,
  disabled = false,
}) => {
  const isCourses = viewMode === 'courses';
  const itemType = isCourses ? 'module' : 'section';
  const itemLabel = isCourses ? 'Modulo' : 'Seccion';

  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [targetIndex, setTargetIndex] = useState<number>(nodes.length);
  const dragPosRef = useRef({ x: 0, y: 0 });

  const calculateTargetIndex = (clientX: number): number => {
    if (!nodes || nodes.length === 0) return 0;
    // Encontrar dónde cae clientX respecto al centro de los nodos en pantalla
    // Calculamos distancias al x de cada elemento o posición relativa
    // Los nodos van de izquierda a derecha.
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const paddingLeft = 120;
    const paddingRight = screenWidth - 120;
    const usableWidth = Math.max(200, paddingRight - paddingLeft);
    const step = usableWidth / Math.max(1, nodes.length);

    const relativeX = clientX - paddingLeft;
    const index = Math.round(relativeX / step);
    return Math.max(0, Math.min(nodes.length, index));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    dragPosRef.current = { x: startX, y: startY };
    setDragPos({ x: startX, y: startY });
    setIsDragging(true);

    const onPointerMove = (ev: PointerEvent) => {
      dragPosRef.current = { x: ev.clientX, y: ev.clientY };
      setDragPos({ x: ev.clientX, y: ev.clientY });
      const idx = calculateTargetIndex(ev.clientX);
      setTargetIndex(idx);
    };

    const onPointerUp = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      setIsDragging(false);

      // Si se soltó dentro del área del lienzo (por debajo del HUD superior)
      if (ev.clientY > 80 && ev.clientY < window.innerHeight - 30) {
        const finalIdx = calculateTargetIndex(ev.clientX);
        onDropNewItem(itemType, finalIdx, ev.clientX, ev.clientY);
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return (
    <>
      {/* Botón / Icono Arrastrable en la barra HUD superior */}
      <div
        onPointerDown={handlePointerDown}
        className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/50 text-amber-300 font-mono text-xs font-bold transition-all cursor-grab active:cursor-grabbing shadow-sm hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] select-none shrink-0"
        title={`Arrastra este icono hacia el grafo para situar un nuevo ${itemLabel}`}
      >
        <div className="w-4 h-4 rounded-md bg-amber-500/30 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
          {isCourses ? <Cube className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
        </div>
        <span>Arrastrar +{itemLabel}</span>
      </div>

      {/* Indicador Flotante mientras se arrastra */}
      {isDragging && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {/* Avatar del nodo fantasma que sigue el puntero */}
          <div
            className="fixed -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
            style={{ left: dragPos.x, top: dragPos.y }}
          >
            <div className="w-14 h-14 rounded-full bg-slate-950/90 border-2 border-amber-400 text-amber-400 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.8)] animate-pulse">
              {isCourses ? <Cube className="w-7 h-7" /> : <FileText className="w-7 h-7" />}
            </div>
            <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-amber-500/50 text-amber-300 font-mono text-[11px] font-bold shadow-lg whitespace-nowrap">
              Situar {itemLabel}: {targetIndex === 0 ? 'Al Inicio' : targetIndex >= nodes.length ? 'Al Final' : `Posicion ${targetIndex + 1}`}
            </div>
          </div>

          {/* Guía visual drop-target en el lienzo */}
          <div className="fixed bottom-12 left-1/2 -translate-x-1/2 px-6 py-2 rounded-2xl bg-slate-900/95 border border-amber-500/40 text-amber-300 font-mono text-xs shadow-2xl flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span>Suelta en el punto de la ruta donde deseas situar este nuevo {itemLabel}</span>
          </div>
        </div>
      )}
    </>
  );
};
