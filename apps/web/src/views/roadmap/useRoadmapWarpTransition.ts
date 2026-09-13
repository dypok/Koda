'use client';

import React, { useRef, useState } from 'react';
import { GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { useRoadmapStore } from '@/stores/roadmap.store';
import gsap from 'gsap';

export function useRoadmapWarpTransition(canvasSvgWrapperRef: React.RefObject<HTMLDivElement | null>) {
  const { openCourseLessons, returnToCourses } = useRoadmapStore();
  const [isWarping, setIsWarping] = useState(false);
  const flashOverlayRef = useRef<HTMLDivElement | null>(null);

  /**
   * Ejecuta la transición de hiperespacio hacia las lecciones de un curso:
   * 1. Centra y enfoca la cámara SVG hacia las coordenadas (node.x, node.y).
   * 2. Realiza zoom hiperespacial (scale 2.2x) con power3.in.
   * 3. Dispara flash cuántico cyan.
   * 4. Cambia el dataset en Zustand.
   * 5. Vuelve a abrir la cámara suavemente en el nuevo mapa.
   */
  const diveIntoCourse = (node: GraphNode) => {
    if (isWarping || !canvasSvgWrapperRef.current) return;
    setIsWarping(true);

    const targetCourseId = node.targetCourseId || node.id;
    const wrapper = canvasSvgWrapperRef.current;
    const flash = flashOverlayRef.current;

    // Calcular desplazamiento para que (node.x, node.y) quede en el centro de la pantalla
    // El SVG tiene centro nominal en 575, 310
    const deltaX = (575 - node.x) * 1.5;
    const deltaY = (310 - node.y) * 1.5;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsWarping(false);
      },
    });

    // Fase 1: Enfoque y Aceleración Warp hacia el nodo
    tl.to(wrapper, {
      x: deltaX,
      y: deltaY,
      scale: 2.2,
      opacity: 0.2,
      filter: 'blur(4px)',
      duration: 0.45,
      ease: 'power3.in',
    });

    // Fase 2: Flash cuántico cyan
    if (flash) {
      tl.fromTo(
        flash,
        { opacity: 0 },
        { opacity: 0.85, duration: 0.2, ease: 'power2.in' },
        '-=0.2'
      );
    }

    // Fase 3: Conmutación de datos en el pico del salto
    tl.add(() => {
      openCourseLessons(targetCourseId);
    });

    // Fase 4: Desaceleración y revelación en el nuevo sistema
    tl.to(wrapper, {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.5,
      ease: 'power3.out',
    });

    if (flash) {
      tl.to(
        flash,
        { opacity: 0, duration: 0.35, ease: 'power2.out' },
        '-=0.4'
      );
    }
  };

  /**
   * Ejecuta el retroceso de cámara al volver al mapa maestro de cursos:
   */
  const retreatToCourses = () => {
    if (isWarping || !canvasSvgWrapperRef.current) return;
    setIsWarping(true);

    const wrapper = canvasSvgWrapperRef.current;
    const flash = flashOverlayRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsWarping(false);
      },
    });

    // Fase 1: Retroceso y desvanecimiento
    tl.to(wrapper, {
      scale: 0.75,
      opacity: 0.15,
      filter: 'blur(3px)',
      duration: 0.35,
      ease: 'power2.in',
    });

    if (flash) {
      tl.fromTo(
        flash,
        { opacity: 0 },
        { opacity: 0.6, duration: 0.18, ease: 'power1.in' },
        '-=0.15'
      );
    }

    // Fase 2: Conmutar de vuelta a cursos
    tl.add(() => {
      returnToCourses();
    });

    // Fase 3: Re-estabilización de cámara
    tl.to(wrapper, {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.45,
      ease: 'power3.out',
    });

    if (flash) {
      tl.to(
        flash,
        { opacity: 0, duration: 0.3, ease: 'power2.out' },
        '-=0.35'
      );
    }
  };

  return {
    isWarping,
    flashOverlayRef,
    diveIntoCourse,
    retreatToCourses,
  };
}
