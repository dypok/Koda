'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRoadmapStore } from '@/stores/roadmap.store';

export function useRoadmapPanZoom() {
  const { zoomLevel, panOffset, setPanOffset, setZoomLevel } = useRoadmapStore();
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startRef = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);
  const hasMovedRef = useRef(false);

  const clamp = useCallback((x: number, y: number, zoom: number) => {
    const scale = zoom / 100;
    const boundX = 550 * scale;
    const boundY = 380 * scale;
    return {
      x: Math.max(-boundX, Math.min(boundX, x)),
      y: Math.max(-boundY, Math.min(boundY, y)),
    };
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest('button, a, [role="button"], .no-drag')) return;
    startRef.current = { px: e.clientX, py: e.clientY, ox: panOffset.x, oy: panOffset.y };
    hasMovedRef.current = false;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [panOffset]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!startRef.current) return;
    const dx = e.clientX - startRef.current.px;
    const dy = e.clientY - startRef.current.py;
    if (Math.hypot(dx, dy) > 4) {
      hasMovedRef.current = true;
      setIsDragging(true);
      setPanOffset(clamp(startRef.current.ox + dx, startRef.current.oy + dy, zoomLevel));
    }
  }, [zoomLevel, clamp, setPanOffset]);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (startRef.current) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
    startRef.current = null;
    setTimeout(() => {
      setIsDragging(false);
      hasMovedRef.current = false;
    }, 50);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const step = e.deltaY < 0 ? 10 : -10;
      setZoomLevel((prev: number) => Math.max(50, Math.min(200, prev + step)));
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [setZoomLevel]);

  return {
    isDragging,
    hasMovedRecently: () => hasMovedRef.current,
    panOffset,
    zoomLevel,
    containerRef,
    containerProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  };
}
