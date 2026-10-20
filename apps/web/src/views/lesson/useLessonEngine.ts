'use client';

import { useCallback, useMemo, useState } from 'react';
import { ContentExercise, shuffled } from '@/lib/content';

export type AnswerResult = {
  correct: boolean;
  recovered: boolean;
  xp: number;
  feedback: string;
  hint?: string;
};

function setsEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
}

function normalizeText(value: string, caseSensitive: boolean): string {
  const trimmed = value.trim();
  return caseSensitive ? trimmed : trimmed.toLowerCase();
}

export function evaluateExercise(current: ContentExercise, selected: string[]): boolean {
  if (selected.length === 0) return false;

  const correctIds =
    current.correct_answer_ids && current.correct_answer_ids.length > 0
      ? current.correct_answer_ids
      : (current.answers ?? []).filter((a) => a.is_correct).map((a) => a.id);

  const type = current.type || 'single_choice';

  if (type === 'order_lines') {
    const expectedOrder =
      current.correct_order && current.correct_order.length > 0
        ? current.correct_order
        : (current.blocks ?? [])
            .slice()
            .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
            .map((b) => b.id);
    if (expectedOrder.length === 0) return selected.length > 0;
    return (
      selected.length === expectedOrder.length &&
      selected.every((val, idx) => val === expectedOrder[idx])
    );
  }

  if (type === 'matching') {
    const expectedPairs = (current.pairs ?? []).map((p) => `${p.left.id}:${p.right.id}`);
    if (expectedPairs.length === 0) return setsEqual(selected, correctIds);
    return setsEqual(selected, expectedPairs);
  }

  if (type === 'fill_blank' || type === 'predict_output' || type === 'small_problem') {
    // 1. Si seleccionó mediante ID de opción y coincide con correctIds
    if (correctIds.length > 0 && setsEqual(selected, correctIds)) {
      return true;
    }

    // 2. Evaluación como texto libre / numérico
    const rawInput = selected[0] ?? '';
    const caseSensitive = current.case_sensitive ?? false;
    const normInput = normalizeText(rawInput, caseSensitive);
    if (!normInput) return false;

    const correctBodies = (current.answers ?? [])
      .filter((a) => a.is_correct || correctIds.includes(a.id))
      .map((a) => a.body);

    const candidates = [
      ...(current.accepted_answers ?? []),
      ...(current.aliases ?? []),
      ...correctBodies,
    ];

    for (const candidate of candidates) {
      if (normalizeText(candidate, caseSensitive) === normInput) {
        return true;
      }
      if (type === 'small_problem' && typeof current.epsilon === 'number') {
        const numInput = Number(rawInput.trim());
        const numExpected = Number(candidate.trim());
        if (!Number.isNaN(numInput) && !Number.isNaN(numExpected)) {
          if (Math.abs(numInput - numExpected) <= current.epsilon) {
            return true;
          }
        }
      }
    }

    return false;
  }

  if (type === 'write_code') {
    if (correctIds.length > 0 && setsEqual(selected, correctIds)) {
      return true;
    }
    const rawCode = (selected[0] ?? '').trim();
    if (!rawCode) return false;

    const caseSensitive = current.case_sensitive ?? false;
    const normCode = normalizeText(rawCode, caseSensitive);

    // Si coincide exactamente con algún alias o respuesta aceptada
    const directCandidates = [
      ...(current.accepted_answers ?? []),
      ...(current.aliases ?? []),
      ...(current.answers ?? [])
        .filter((a) => a.is_correct || correctIds.includes(a.id))
        .map((a) => a.body),
    ];
    if (directCandidates.some((c) => normalizeText(c, caseSensitive) === normCode)) {
      return true;
    }

    // Verificar tokens requeridos en el código escrito
    if (current.accepted_tokens && current.accepted_tokens.length > 0) {
      return current.accepted_tokens.every((token) =>
        normCode.includes(normalizeText(token, caseSensitive))
      );
    }

    return false;
  }

  // Por defecto: single_choice, true_false, multiple_choice, find_error, select_code
  return setsEqual(selected, correctIds);
}

/**
 * Motor local de lección: intentos, XP (+5 primer acierto, +2 recuperado),
 * cola de repaso sin spoilers y barajado determinista.
 */
export function useLessonEngine(
  exercises: ContentExercise[],
  seed = 42,
  rewardXp = 5,
  requeueOnFail = false
) {
  const queue = useMemo(() => shuffled(exercises.map((e) => e.id), seed), [exercises, seed]);
  const byId = useMemo(() => new Map(exercises.map((e) => [e.id, e])), [exercises]);
  const [order, setOrder] = useState<string[]>(queue);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [xp, setXp] = useState(0);
  const [failedFirst, setFailedFirst] = useState<Record<string, boolean>>({});

  const current = order[index] ? byId.get(order[index]) ?? null : null;
  const done = index >= order.length;
  const failedExerciseIds = useMemo(() => Object.keys(failedFirst), [failedFirst]);

  const toggle = useCallback(
    (answerId: string) => {
      if (result || !current) return;
      const multi = current.type === 'multiple_choice';
      setSelected((prev) =>
        multi
          ? prev.includes(answerId)
            ? prev.filter((id) => id !== answerId)
            : [...prev, answerId]
          : [answerId]
      );
    },
    [result, current]
  );

  const setCustomAnswer = useCallback(
    (val: string | string[]) => {
      if (result || !current) return;
      if (Array.isArray(val)) {
        setSelected(val);
      } else {
        setSelected(val.trim().length > 0 ? [val] : []);
      }
    },
    [result, current]
  );

  const check = useCallback(() => {
    if (!current || selected.length === 0 || result) return null;
    const ok = evaluateExercise(current, selected);
    const tries = (attempts[current.id] ?? 0) + 1;
    setAttempts((p) => ({ ...p, [current.id]: tries }));
    if (ok) {
      const recovered = Boolean(failedFirst[current.id]);
      const gained = rewardXp <= 0 ? 0 : (recovered ? Math.max(1, Math.round(rewardXp * 0.4)) : rewardXp);
      setXp((x) => x + gained);
      const res: AnswerResult = {
        correct: true,
        recovered,
        xp: gained,
        feedback:
          current.explanation ||
          (gained === 0 ? '¡Correcto! +0 XP (Repaso).' : `¡Correcto! +${gained} XP.`),
      };
      setResult(res);
      return res;
    }
    setFailedFirst((p) => ({ ...p, [current.id]: true }));
    if (requeueOnFail) {
      setOrder((o) => [...o, current.id]);
    }
    const res: AnswerResult = {
      correct: false,
      recovered: false,
      xp: 0,
      feedback: 'Todavía no. Lee la pista e inténtalo de nuevo.',
      hint: current.hints?.[0],
    };
    setResult(res);
    return res;
  }, [current, selected, result, attempts, failedFirst, rewardXp, requeueOnFail]);

  const next = useCallback(() => {
    setSelected([]);
    setResult(null);
    setIndex((i) => i + 1);
  }, []);

  const prev = useCallback(() => {
    setSelected([]);
    setResult(null);
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const resetSelection = useCallback(() => {
    setSelected([]);
    setResult(null);
  }, []);

  return {
    current,
    selected,
    result,
    toggle,
    setCustomAnswer,
    check,
    next,
    prev,
    resetSelection,
    done,
    index,
    total: order.length,
    xp,
    failedExerciseIds,
  };
}
