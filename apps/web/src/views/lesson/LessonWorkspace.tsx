'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, ArrowCounterClockwise, Trophy } from '@phosphor-icons/react';
import { ContentExercise, ContentLesson, ContentModule, loadBank, loadModule, shuffled } from '@/lib/content';
import { QuestionRenderer } from './QuestionRenderer';
import { useLessonEngine } from './useLessonEngine';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { cn } from '@/lib/utils';

interface LessonWorkspaceProps {
  courseId: string;
  sectionRef: string;
}

function parseCourse(courseId: string): { lang: string; moduleSlug: string } | null {
  if (courseId.startsWith('lua-')) return { lang: 'lua', moduleSlug: courseId.slice(4) };
  if (courseId.startsWith('py-')) return { lang: 'python', moduleSlug: 'fundamentos-de-python' };
  return null;
}

const QUIZ_COMPOSITION: Record<string, number> = {
  single_choice: 3,
  true_false: 2,
  predict_output: 2,
  fill_blank: 1,
  find_error: 1,
  select_code: 1,
};

function sampleQuiz(bank: ContentExercise[], seed: number): ContentExercise[] {
  const picked: ContentExercise[] = [];
  Object.entries(QUIZ_COMPOSITION).forEach(([type, n], ti) => {
    const pool = shuffled(
      bank.filter((q) => q.type === type),
      seed + ti
    );
    picked.push(...pool.slice(0, n));
  });
  return shuffled(picked, seed + 99);
}

export const LessonWorkspace: React.FC<LessonWorkspaceProps> = ({ courseId, sectionRef }) => {
  const parsed = useMemo(() => parseCourse(courseId), [courseId]);
  const [module, setModule] = useState<ContentModule | null>(null);
  const [bank, setBank] = useState<ContentExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [lessonIdx, setLessonIdx] = useState(0);
  const [mode, setMode] = useState<'lesson' | 'quiz' | 'done'>('lesson');
  const [quizScore, setQuizScore] = useState<{ ok: number; total: number } | null>(null);
  const completeSectionNode = useRoadmapStore((s) => s.completeSectionNode);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      if (!parsed) {
        if (alive) setLoading(false);
        return;
      }
      const [mod, questions] = await Promise.all([
        loadModule(parsed.lang, parsed.moduleSlug),
        loadBank(parsed.lang, parsed.moduleSlug),
      ]);
      if (alive) {
        setModule(mod);
        setBank(questions);
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [parsed]);

  const section = useMemo(() => {
    if (!module) return null;
    const bySlug = module.sections.find((s) => s.slug === sectionRef);
    if (bySlug) return bySlug;
    const m = /^s(\d+)$/.exec(sectionRef);
    if (m) return module.sections[Number(m[1]) - 1] ?? null;
    return module.sections[0] ?? null;
  }, [module, sectionRef]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p role="status" className="font-mono text-xs text-cyan-300 tracking-widest">CARGANDO SECCIÓN…</p>
      </div>
    );
  }

  if (!parsed || !module || !section) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="font-display text-2xl font-bold text-white">Sección no disponible todavía</p>
        <p className="text-sm text-slate-400 max-w-md">
          Este curso aún no tiene contenido interactivo. Vuelve al roadmap y sigue con Python o Lua publicados.
        </p>
        <Link href="/app/ruta" className="inline-flex min-h-[48px] items-center rounded-xl bg-amber-400 px-6 text-sm font-bold text-slate-950">
          Volver a la ruta
        </Link>
      </div>
    );
  }

  if (mode === 'quiz') {
    return (
      <QuizMode
        bank={bank}
        sectionTitle={section.title}
        onFinish={(ok, total) => {
          setQuizScore({ ok, total });
          setMode('done');
          if (ok / Math.max(1, total) >= 0.7) {
            const nodeId = `lua-${parsed.moduleSlug}-s${section.position}`;
            completeSectionNode(nodeId, ok === total ? 3 : 2);
          }
        }}
      />
    );
  }

  if (mode === 'done' && quizScore) {
    const passed = quizScore.ok / Math.max(1, quizScore.total) >= 0.7;
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 px-4 text-center">
        {passed ? (
          <Trophy aria-hidden="true" className="w-12 h-12 text-amber-400" />
        ) : null}
        <h1 className="font-display text-3xl sm:text-4xl font-black text-white">
          {passed ? 'Sección completada' : 'Casi lo logras'}
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Quiz: {quizScore.ok}/{quizScore.total} aciertos
          {passed ? ' · +10 XP de sección' : ' · necesitas 70% para avanzar'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          {!passed ? (
            <button
              type="button"
              onClick={() => {
                setQuizScore(null);
                setMode('quiz');
              }}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 text-sm font-bold text-slate-950"
            >
              <ArrowCounterClockwise aria-hidden="true" className="w-4 h-4" />
              Reintentar quiz
            </button>
          ) : null}
          <Link
            href="/app/ruta"
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-slate-700 px-6 text-sm font-bold text-white hover:border-amber-400/50"
          >
            Volver a la ruta
          </Link>
        </div>
      </div>
    );
  }

  const lesson = section.lessons[lessonIdx] ?? null;
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
          <Link href="/app/ruta" aria-label="Volver a la ruta" className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60">
            <ArrowLeft aria-hidden="true" className="w-5 h-5" />
          </Link>
          <nav aria-label="Miga de pan" className="text-xs text-slate-500 truncate">
            {module.title} › {section.title}
            {lesson ? <> › <span className="text-slate-300">{lesson.title}</span></> : null}
          </nav>
          <span className="ml-auto text-[11px] font-mono font-bold text-slate-400 tabular-nums">
            {lesson ? `${lessonIdx + 1}/${section.lessons.length}` : ''}
          </span>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-3 flex items-center gap-1.5" role="tablist" aria-label="Lecciones">
          {section.lessons.map((l, i) => (
            <button
              key={l.id}
              type="button"
              role="tab"
              aria-selected={i === lessonIdx}
              aria-label={`Lección ${i + 1}: ${l.title}`}
              onClick={() => setLessonIdx(i)}
              className={cn(
                'h-2 flex-1 rounded-full transition-colors',
                i < lessonIdx ? 'bg-emerald-400' : i === lessonIdx ? 'bg-amber-400' : 'bg-slate-800'
              )}
            />
          ))}
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6 grid gap-6 lg:grid-cols-2">
        {lesson ? (
          <LessonView
            key={lesson.id}
            lesson={lesson}
            onNext={() => {
              if (lessonIdx + 1 < section.lessons.length) setLessonIdx(lessonIdx + 1);
              else setMode('quiz');
            }}
            isLast={lessonIdx + 1 >= section.lessons.length}
          />
        ) : (
          <div className="lg:col-span-2 flex flex-col items-center gap-4 py-10 text-center">
            <p className="text-slate-400 text-sm">Esta sección no trae lecciones todavía.</p>
            <button
              type="button"
              onClick={() => setMode('quiz')}
              className="inline-flex min-h-[48px] items-center rounded-xl bg-amber-400 px-6 text-sm font-bold text-slate-950"
            >
              Ir al quiz
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

function LessonView({ lesson, onNext, isLast }: { lesson: ContentLesson; onNext: () => void; isLast: boolean }) {
  const exercise = lesson.exercises[0] ?? null;
  const engine = useLessonEngine(exercise ? [exercise] : [], lesson.position);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (!exercise) {
        if (e.key === 'Enter') onNext();
        return;
      }
      if (['1', '2', '3', '4'].includes(e.key) || ['a', 'b', 'c', 'd'].includes(e.key.toLowerCase())) {
        const idx = ['1', '2', '3', '4', 'a', 'b', 'c', 'd'].indexOf(e.key.toLowerCase()) % 4;
        const opt = exercise.answers[idx];
        if (opt && !engine.result) engine.toggle(opt.id);
      } else if (e.key === 'Enter') {
        if (!engine.result) engine.check();
        else onNext();
      } else if (e.key === 'ArrowRight' && engine.result) {
        onNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [exercise, engine, onNext]);

  return (
    <>
      <section aria-label="Teoría" className="space-y-4">
        <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">{lesson.title}</h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{lesson.explanation}</p>
        {lesson.examples.map((ex, i) => (
          <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <pre className="p-4 overflow-x-auto font-mono text-sm leading-relaxed text-slate-200">
              <code>{ex.code}</code>
            </pre>
            {ex.output ? (
              <div className="border-t border-slate-800 bg-slate-950 px-4 py-2.5 font-mono text-sm">
                <span className="text-slate-500 select-none">$ </span>
                <span className="text-emerald-300">{ex.output}</span>
              </div>
            ) : null}
            {ex.explanation ? (
              <p className="px-4 py-2.5 text-xs text-slate-400 border-t border-slate-800">{ex.explanation}</p>
            ) : null}
          </div>
        ))}
      </section>

      <section aria-label="Práctica" className="space-y-4">
        {!exercise ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <p className="text-sm text-slate-300">Lección de lectura. Cuando estés listo, continúa.</p>
            <button
              type="button"
              onClick={onNext}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-amber-400 px-6 text-sm font-bold text-slate-950"
            >
              {isLast ? 'Ir al quiz' : 'Siguiente lección'}
              <ArrowRight aria-hidden="true" className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <p className="text-sm sm:text-base font-semibold text-white">{exercise.prompt}</p>
            <QuestionRenderer
              exercise={exercise}
              selectedIds={engine.selected}
              onToggle={engine.toggle}
              disabled={Boolean(engine.result)}
            />
            {!engine.result ? (
              <button
                type="button"
                onClick={() => engine.check()}
                disabled={engine.selected.length === 0}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-amber-400 px-4 text-sm font-bold text-slate-950 disabled:opacity-40"
              >
                Comprobar
              </button>
            ) : (
              <div
                role={engine.result.correct ? 'status' : 'alert'}
                className={cn(
                  'rounded-xl border p-3.5 space-y-2',
                  engine.result.correct
                    ? 'border-emerald-400/30 bg-emerald-400/10'
                    : 'border-amber-400/30 bg-amber-400/10'
                )}
              >
                <p className={cn('text-sm font-bold flex items-center gap-2', engine.result.correct ? 'text-emerald-300' : 'text-amber-200')}>
                  {engine.result.correct ? <Check aria-hidden="true" className="w-4 h-4" /> : null}
                  {engine.result.correct ? `¡Correcto! +${engine.result.xp} XP` : 'Todavía no'}
                </p>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{engine.result.feedback}</p>
                {engine.result.hint ? (
                  <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">Pista: {engine.result.hint}</p>
                ) : null}
                <div className="flex gap-2 pt-1">
                  {!engine.result.correct ? (
                    <button
                      type="button"
                      onClick={engine.resetSelection}
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-700 px-4 text-sm font-semibold text-slate-200 hover:border-slate-500"
                    >
                      <ArrowCounterClockwise aria-hidden="true" className="w-4 h-4" />
                      Reintentar
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={engine.result.correct ? onNext : () => {}}
                    disabled={!engine.result.correct}
                    className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-400 px-4 text-sm font-bold text-slate-950 disabled:opacity-40"
                  >
                    {isLast ? 'Ir al quiz' : 'Siguiente'}
                    <ArrowRight aria-hidden="true" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}

function QuizMode({
  bank,
  sectionTitle,
  onFinish,
}: {
  bank: ContentExercise[];
  sectionTitle: string;
  onFinish: (ok: number, total: number) => void;
}) {
  const questions = useMemo(() => sampleQuiz(bank, sectionTitle.length * 7 + 3), [bank, sectionTitle]);
  const engine = useLessonEngine(questions, 7);
  const [okCount, setOkCount] = useState(0);
  const answered = engine.index;
  const total = engine.total;

  useEffect(() => {
    if (engine.done) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      onFinish(okCount, total);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine.done]);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="font-display text-2xl font-bold text-white">Quiz en camino</p>
        <p className="text-sm text-slate-400">Esta sección aún no tiene banco de preguntas.</p>
        <Link href="/app/ruta" className="inline-flex min-h-[48px] items-center rounded-xl bg-amber-400 px-6 text-sm font-bold text-slate-950">
          Volver a la ruta
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800/80">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-300">Quiz · {sectionTitle}</span>
          <span className="ml-auto text-[11px] font-mono text-slate-400 tabular-nums">
            {Math.min(answered + 1, total)}/{total}
          </span>
        </div>
        <div className="mx-auto max-w-3xl px-4 pb-3">
          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${(answered / Math.max(1, total)) * 100}%` }} />
          </div>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-6">
        {engine.current ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <p className="text-base font-semibold text-white">{engine.current.prompt}</p>
            <QuestionRenderer
              exercise={engine.current}
              selectedIds={engine.selected}
              onToggle={engine.toggle}
              disabled={Boolean(engine.result)}
            />
            {!engine.result ? (
              <button
                type="button"
                onClick={() => engine.check()}
                disabled={engine.selected.length === 0}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-amber-400 px-4 text-sm font-bold text-slate-950 disabled:opacity-40"
              >
                Responder
              </button>
            ) : (
              <div role={engine.result.correct ? 'status' : 'alert'} className="space-y-3">
                <p className={cn('text-sm font-bold', engine.result.correct ? 'text-emerald-300' : 'text-amber-200')}>
                  {engine.result.correct ? '¡Correcto!' : 'Anotado. Siguiente pregunta.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (engine.result?.correct) setOkCount((c) => c + 1);
                    engine.next();
                  }}
                  className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-slate-100 px-4 text-sm font-bold text-slate-950"
                >
                  Continuar
                </button>
              </div>
            )}
          </div>
        ) : null}
      </main>
    </div>
  );
}
