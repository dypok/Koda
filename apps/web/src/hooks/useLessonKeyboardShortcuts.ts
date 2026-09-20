'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

export interface UseLessonKeyboardShortcutsOptions {
  optionsCount: number;
  onSelectOption?: (index: number) => void;
  onSubmit?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  isSubmitted?: boolean;
  canSubmit?: boolean;
  disabled?: boolean;
}

export interface UseLessonKeyboardShortcutsReturn {
  pressedIndex: number | null;
  pressedAction: 'submit' | 'next' | 'prev' | null;
}

/**
 * Hook para control ergonómico por teclado en lecciones y quizzes:
 * - 1, 2, 3, 4 o A, B, C, D: Seleccionar opción
 * - Enter / Espacio: Validar (si hay selección) o Continuar (si ya está validado)
 * - ArrowRight: Continuar / Siguiente lección
 * - ArrowLeft: Lección anterior
 */
export function useLessonKeyboardShortcuts({
  optionsCount,
  onSelectOption,
  onSubmit,
  onNext,
  onPrev,
  isSubmitted = false,
  canSubmit = false,
  disabled = false,
}: UseLessonKeyboardShortcutsOptions): UseLessonKeyboardShortcutsReturn {
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);
  const [pressedAction, setPressedAction] = useState<'submit' | 'next' | 'prev' | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerPressFeedback = useCallback(
    (index: number | null, action: 'submit' | 'next' | 'prev' | null) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setPressedIndex(index);
      setPressedAction(action);
      timerRef.current = setTimeout(() => {
        setPressedIndex(null);
        setPressedAction(null);
      }, 150);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar si el usuario está enfocado en un campo de texto editable
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      // No interceptar combinaciones del sistema (Ctrl, Cmd, Alt)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toLowerCase();

      // 1. Selección por número (1-4)
      if (['1', '2', '3', '4', '5', '6'].includes(key)) {
        const idx = parseInt(key, 10) - 1;
        if (idx < optionsCount && !isSubmitted) {
          e.preventDefault();
          triggerPressFeedback(idx, null);
          onSelectOption?.(idx);
        }
        return;
      }

      // 2. Selección por letra (A-F)
      if (['a', 'b', 'c', 'd', 'e', 'f'].includes(key)) {
        const idx = key.charCodeAt(0) - 97;
        if (idx < optionsCount && !isSubmitted) {
          e.preventDefault();
          triggerPressFeedback(idx, null);
          onSelectOption?.(idx);
        }
        return;
      }

      // 3. Enter o Barra Espaciadora para Validar / Continuar
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (isSubmitted) {
          triggerPressFeedback(null, 'next');
          onNext?.();
        } else if (canSubmit) {
          triggerPressFeedback(null, 'submit');
          onSubmit?.();
        }
        return;
      }

      // 4. Flecha derecha para avanzar
      if (e.key === 'ArrowRight') {
        if (isSubmitted || !onSubmit) {
          e.preventDefault();
          triggerPressFeedback(null, 'next');
          onNext?.();
        }
        return;
      }

      // 5. Flecha izquierda para retroceder
      if (e.key === 'ArrowLeft' && onPrev) {
        e.preventDefault();
        triggerPressFeedback(null, 'prev');
        onPrev();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    optionsCount,
    onSelectOption,
    onSubmit,
    onNext,
    onPrev,
    isSubmitted,
    canSubmit,
    disabled,
    triggerPressFeedback,
  ]);

  return {
    pressedIndex,
    pressedAction,
  };
}
