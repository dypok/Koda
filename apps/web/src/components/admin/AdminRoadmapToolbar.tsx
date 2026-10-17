'use client';

import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Plus,
  Trash,
  FloppyDisk,
  ArrowCounterClockwise,
  Eye,
  EyeSlash,
  CheckCircle,
  WarningCircle,
  List,
  Cube,
  FileText,
  PencilSimple,
} from '@phosphor-icons/react';
import { useAdminCurriculumStore } from '@/stores/admin-curriculum.store';
import { GraphNode } from '@/models/roadmap/roadmap-graph.types';

interface AdminRoadmapToolbarProps {
  onOpenAddModal: () => void;
  onOpenDeleteModal: () => void;
  onModifyNode?: () => void;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  onToggleDashboard?: () => void;
  viewMode?: 'courses' | 'lessons';
  nodes?: GraphNode[];
  nodesCount?: number;
  onDropNewItem?: (type: 'module' | 'section', targetIndex: number, clientX: number, clientY: number) => void;
}

export const AdminRoadmapToolbar: React.FC<AdminRoadmapToolbarProps> = ({
  onOpenAddModal,
  onOpenDeleteModal,
  onModifyNode,
  isPreviewMode,
  onTogglePreview,
  onToggleDashboard,
  viewMode = 'courses',
  nodes = [],
  nodesCount = 0,
  onDropNewItem,
}) => {
  const {
    isDirty,
    pendingChangesCount,
    saveChanges,
    discardChanges,
  } = useAdminCurriculumStore();

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const activeNodesCount = nodes.length > 0 ? nodes.length : nodesCount;

  // Estado del gesto dual de arrastrar / click
  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [targetIndex, setTargetIndex] = useState<number>(activeNodesCount);
  const pointerStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const hasMovedPastThresholdRef = useRef(false);

  const isCourses = viewMode === 'courses';
  const itemType = isCourses ? 'module' : 'section';
  const itemLabel = isCourses ? 'Modulo' : 'Seccion';

  /**
   * Calcula con alta precision el indice de insercion en base a las posiciones reales de los nodos en pantalla.
   * Si el puntero esta entre nodo i y nodo i+1, retorna i+1.
   */
  const calculateTargetIndex = (clientX: number): number => {
    if (activeNodesCount <= 0) return 0;

    // 1. Si RoadmapPixiGraph expuso la proyeccion exacta en pantalla
    const getScreenPos = typeof window !== 'undefined'
      ? (window as unknown as { __kodaGetNodeScreenPos?: (x: number, y: number) => { x: number; y: number } }).__kodaGetNodeScreenPos
      : undefined;

    let projectedX: number[] = [];

    if (getScreenPos && nodes && nodes.length > 0) {
      projectedX = nodes.map((n) => {
        try {
          return getScreenPos(n.x, n.y).x;
        } catch {
          return 0;
        }
      });
    }

    // 2. Fallback de proyeccion si no se obtuvo por Pixi directamente
    if (projectedX.length === 0 || projectedX.some((v) => !Number.isFinite(v) || v === 0)) {
      const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
      if (nodes && nodes.length > 0) {
        const minCanvasX = Math.min(...nodes.map((n) => n.x));
        const maxCanvasX = Math.max(...nodes.map((n) => n.x));
        const span = Math.max(1, maxCanvasX - minCanvasX);
        const paddingLeft = Math.max(100, screenWidth * 0.12);
        const paddingRight = screenWidth - Math.max(100, screenWidth * 0.12);
        const usableWidth = paddingRight - paddingLeft;

        projectedX = nodes.map((n) => paddingLeft + ((n.x - minCanvasX) / span) * usableWidth);
      } else {
        const paddingLeft = 140;
        const paddingRight = screenWidth - 140;
        const step = (paddingRight - paddingLeft) / Math.max(1, activeNodesCount);
        projectedX = Array.from({ length: activeNodesCount }, (_, idx) => paddingLeft + (idx + 0.5) * step);
      }
    }

    const n = projectedX.length;
    if (n === 0) return 0;
    if (n === 1) {
      return clientX < projectedX[0] ? 0 : 1;
    }

    // Si está a la izquierda del primer nodo
    if (clientX < projectedX[0]) {
      return 0;
    }

    // Si está a la derecha del último nodo
    if (clientX >= projectedX[n - 1]) {
      return n;
    }

    // Buscar en qué intervalo [projectedX[i], projectedX[i+1]] cae clientX
    for (let i = 0; i < n - 1; i++) {
      const leftNodeX = projectedX[i];
      const rightNodeX = projectedX[i + 1];

      // El punto de corte entre la ranura anterior y la siguiente
      if (clientX >= leftNodeX && clientX < rightNodeX) {
        return i + 1;
      }
    }

    return n;
  };

  const handlePointerDownAdd = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;

    pointerStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    hasMovedPastThresholdRef.current = false;
    setDragPos({ x: e.clientX, y: e.clientY });

    const onPointerMove = (ev: PointerEvent) => {
      if (!pointerStartRef.current) return;
      const dx = ev.clientX - pointerStartRef.current.x;
      const dy = ev.clientY - pointerStartRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Umbral para distinguir click de arrastre
      if (distance > 6 && !hasMovedPastThresholdRef.current) {
        hasMovedPastThresholdRef.current = true;
        setIsDragging(true);
      }

      if (hasMovedPastThresholdRef.current) {
        setDragPos({ x: ev.clientX, y: ev.clientY });
        setTargetIndex(calculateTargetIndex(ev.clientX));
      }
    };

    const onPointerUp = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      if (hasMovedPastThresholdRef.current) {
        setIsDragging(false);
        // Si se solto en el lienzo de la ruta
        if (ev.clientY > 70 && ev.clientY < window.innerHeight - 30) {
          const finalIdx = calculateTargetIndex(ev.clientX);
          if (onDropNewItem) {
            onDropNewItem(itemType, finalIdx, ev.clientX, ev.clientY);
          } else {
            onOpenAddModal();
          }
        }
      } else {
        // Click simple directo
        onOpenAddModal();
      }

      pointerStartRef.current = null;
      hasMovedPastThresholdRef.current = false;
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const handleSave = () => {
    const result = saveChanges();
    setNotification({
      message: result.message,
      type: result.success ? 'success' : 'error',
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDiscard = () => {
    if (window.confirm('Descartar las modificaciones no guardadas?')) {
      discardChanges();
      setNotification({ message: 'Cambios descartados.', type: 'success' });
      setTimeout(() => setNotification(null), 2500);
    }
  };

  // Texto contextual explicativo de la conexión que se formará
  const targetLabelPreview = (() => {
    if (targetIndex === 0) {
      const nextNode = nodes[0];
      return nextNode ? `Al Inicio (se conectara antes de ${nextNode.label})` : 'Al Inicio de la ruta';
    }
    if (targetIndex >= activeNodesCount) {
      const prevNode = nodes[activeNodesCount - 1];
      return prevNode ? `Al Final (se conectara despues de ${prevNode.label})` : 'Al Final de la ruta';
    }
    const prevNode = nodes[targetIndex - 1];
    const nextNode = nodes[targetIndex];
    if (prevNode && nextNode) {
      return `Entre ${prevNode.label} y ${nextNode.label}`;
    }
    return `Posicion intermedia ${targetIndex + 1}`;
  })();

  return (
    <>
      <div className="fixed top-2 sm:top-3 inset-x-0 z-50 flex justify-center pointer-events-none px-4 pl-12 sm:pl-20">
        <div className="pointer-events-auto flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-slate-950/95 border border-slate-800 backdrop-blur-xl shadow-2xl select-none w-max max-w-full overflow-x-auto no-scrollbar relative">
        {/* Badge de Rol */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px] sm:text-xs font-bold shrink-0">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="inline font-bold">ADMIN</span>
        </div>

        {/* Boton para abrir la Dashboard deslizable */}
        {onToggleDashboard && (
          <button
            type="button"
            onClick={onToggleDashboard}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-mono text-[11px] sm:text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-[1.02] shrink-0"
            title="Abrir Dashboard deslizable con todas las opciones"
          >
            <List className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
        )}

        {/* Accion: Añadir (Boton con gesto de arrastrar para situar en la ruta) */}
        <button
          type="button"
          onPointerDown={handlePointerDownAdd}
          className="group flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/50 text-amber-300 font-mono text-[11px] sm:text-xs font-bold transition-all cursor-grab active:cursor-grabbing shadow-sm hover:scale-[1.02] shrink-0"
          title="Toca para abrir configuracion o manten presionado y arrastra para situar en la ruta"
        >
          <Plus className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-90 transition-transform" />
          <span>Añadir</span>
        </button>

        {/* Accion: Modificar elemento activo */}
        {onModifyNode && (
          <button
            type="button"
            onClick={onModifyNode}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-mono text-[11px] sm:text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-[1.02] shrink-0"
            title="Modificar contenido y fases didacticas del elemento seleccionado"
          >
            <PencilSimple className="w-3.5 h-3.5 text-amber-400" />
            <span>Modificar</span>
          </button>
        )}

        {/* Accion: Eliminar */}
        <button
          type="button"
          onClick={onOpenDeleteModal}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-900 hover:bg-rose-500/20 border border-slate-700/80 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 font-mono text-[11px] sm:text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0"
          title="Eliminar modulos o rutas"
        >
          <Trash className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Eliminar</span>
        </button>

        {/* Separador */}
        <div className="w-px h-4 sm:h-5 bg-slate-800 shrink-0" />

        {/* Buffer de Guardado Explicito */}
        {isDirty ? (
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 p-0.5 sm:p-1 rounded-lg sm:rounded-xl animate-fadeIn shrink-0">
            <button
              type="button"
              onClick={handleDiscard}
              title="Descartar cambios no guardados"
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ArrowCounterClockwise className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-mono transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <FloppyDisk className="w-3.5 h-3.5" />
              <span>Guardar</span>
              <span className="bg-slate-950 text-amber-300 text-[10px] px-1.5 rounded-full font-bold">
                {pendingChangesCount}
              </span>
            </button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono text-slate-500 shrink-0">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            <span>Guardado</span>
          </div>
        )}

        {/* Alternador de Vista (Modo Alumno / Modo Admin) */}
        <button
          type="button"
          onClick={onTogglePreview}
          className={`flex items-center justify-center gap-1.5 px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-mono font-bold transition-all cursor-pointer border shrink-0 shadow-sm ${
            isPreviewMode
              ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
          }`}
          title={isPreviewMode ? 'Desactivar vista previa de alumno' : 'Ver como alumno real'}
        >
          {isPreviewMode ? <EyeSlash className="w-3.5 h-3.5 shrink-0" /> : <Eye className="w-3.5 h-3.5 shrink-0 text-slate-400" />}
          <span className="inline-block whitespace-nowrap">{isPreviewMode ? 'Vista Alumno' : 'Modo Editor'}</span>
        </button>

        {/* Notificacion de Guardado */}
        {notification && (
          <div
            className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl border text-xs font-mono shadow-xl animate-fadeIn flex items-center gap-1.5 whitespace-nowrap ${
              notification.type === 'success'
                ? 'bg-slate-900 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border-rose-500/40 text-rose-300'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <WarningCircle className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span>{notification.message}</span>
          </div>
        )}
        </div>
      </div>

      {/* Indicador Flotante que sigue suavemente el mouse mientras se arrastra */}
      {isDragging && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div
            className="fixed -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 transition-transform duration-75 ease-out"
            style={{ left: dragPos.x, top: dragPos.y }}
          >
            <div className="w-14 h-14 rounded-full bg-slate-950/95 border-2 border-amber-400 text-amber-400 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.85)] animate-pulse">
              {isCourses ? <Cube className="w-7 h-7" /> : <FileText className="w-7 h-7" />}
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-slate-900/95 border border-amber-500/60 text-amber-300 font-mono text-[11px] font-bold shadow-2xl whitespace-nowrap">
              Situar {itemLabel}: {targetLabelPreview}
            </div>
          </div>

          {/* Banner de orientacion inferior con ranura activa */}
          <div className="fixed bottom-12 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-2xl bg-slate-900/95 border border-amber-500/50 text-amber-300 font-mono text-xs shadow-2xl flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span>Ranura seleccionada: <strong className="text-white font-bold">{targetLabelPreview}</strong>. Suelta para configurar.</span>
          </div>
        </div>
      )}
    </>
  );
};
