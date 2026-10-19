'use client';

import { useCallback, useMemo, useState } from 'react';
import { ContentExercise, shuffled } from '@/lib/content';
import { runPython } from '@/lib/python-runner';

export type AnswerResult = {
  correct: boolean;
  recovered: boolean;
  xp: number;
  feedback: string;
  hint?: string;
  output?: string;
  error?: string;
};

function setsEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
}

/**
 * Motor local de lección: intentos, XP (+5 primer acierto, +2 recuperado),
 * cola de repaso sin spoilers y barajado determinista.
 */
export function useLessonEngine(exercises: ContentExercise[], seed = 42) {
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

  const check = useCallback(() => {
    if (!current || selected.length === 0 || result) return null;
    const ok = setsEqual(selected, current.correct_answer_ids);
    const tries = (attempts[current.id] ?? 0) + 1;
    setAttempts((p) => ({ ...p, [current.id]: tries }));
    if (ok) {
      const recovered = Boolean(failedFirst[current.id]);
      const gained = recovered ? 2 : 5;
      setXp((x) => x + gained);
      const res: AnswerResult = {
        correct: true,
        recovered,
        xp: gained,
        feedback: current.explanation ?? '¡Correcto! +5 XP.',
      };
      setResult(res);
      return res;
    }
    setFailedFirst((p) => ({ ...p, [current.id]: true }));
    // Sin spoilers: pista + reencola al final con opciones barajadas.
    setOrder((o) => [...o, current.id]);
    const res: AnswerResult = {
      correct: false,
      recovered: false,
      xp: 0,
      feedback: 'Todavía no. Lee la pista e inténtalo de nuevo.',
      hint: current.hints?.[0],
    };
    setResult(res);
    return res;
  }, [current, selected, result, attempts, failedFirst]);

  /**
   * Evalúa un ejercicio de consola (`write_code`): ejecuta el código del
   * alumno y compara la salida real con la esperada. Permite reintentar en el
   * sitio mientras la última respuesta haya sido incorrecta.
   */
  const submitCode = useCallback(
    async (code: string): Promise<AnswerResult | null> => {
      if (!current || current.type !== 'write_code') return null;
      if (result && result.correct) return null;

      const tries = (attempts[current.id] ?? 0) + 1;
      setAttempts((p) => ({ ...p, [current.id]: tries }));

      const run = await runPython(code);
      const output = run.output ?? '';
      const error = run.error;

      const normalize = (value: string) => value.replace(/\r/g, '').trim();
      const expected = current.accepted_answers ?? [];
      const tokens = current.accepted_tokens ?? [];
      const outputMatches =
        expected.length === 0 || expected.some((value) => normalize(value) === normalize(output));
      const tokensPresent = tokens.every((token) => code.includes(token));
      const ok = !error && outputMatches && tokensPresent;

      if (ok) {
        const recovered = Boolean(failedFirst[current.id]);
        const gained = recovered ? 2 : 5;
        setXp((x) => x + gained);
        const res: AnswerResult = {
          correct: true,
          recovered,
          xp: gained,
          feedback: current.explanation ?? '¡Correcto! Tu código hace lo que pedíamos.',
          output,
        };
        setResult(res);
        return res;
      }

      setFailedFirst((p) => ({ ...p, [current.id]: true }));
      const res: AnswerResult = {
        correct: false,
        recovered: false,
        xp: 0,
        feedback: error
          ? 'Tu código dio un error. Léelo en la consola, corrígelo e inténtalo otra vez.'
          : 'La salida no es la que esperábamos. Revisa la pista e inténtalo otra vez.',
        hint: current.hints?.[0],
        output,
        error,
      };
      setResult(res);
      return res;
    },
    [current, result, attempts, failedFirst]
  );

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

  return { current, selected, result, toggle, check, submitCode, next, prev, resetSelection, done, index, total: order.length, xp };
}
