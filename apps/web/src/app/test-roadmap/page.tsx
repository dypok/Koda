'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface EndpointConfig {
  id: string;
  name: string;
  category: 'Supabase Graph' | 'MongoDB Curriculum' | 'Prisma / System';
  method: 'GET' | 'POST';
  getPath: (params: { lang: string; courseId: string; lessonId: string }) => string;
  description: string;
}

interface TestResult {
  status: 'idle' | 'loading' | 'success' | 'error';
  httpStatus?: number;
  latencyMs?: number;
  isRealBackend?: boolean;
  data?: unknown;
  error?: string;
  testedAt?: string;
}

const ENDPOINTS: EndpointConfig[] = [
  {
    id: 'courses-graph',
    name: 'Grafo Visual de Cursos (DAG)',
    category: 'Supabase Graph',
    method: 'GET',
    getPath: (p) => `/roadmap/${p.lang}/courses`,
    description: 'Nodos de cursos con coordenadas (x, y), variantes, estado de candado y aristas vectoriales.',
  },
  {
    id: 'lessons-graph',
    name: 'Grafo Visual de Lecciones (DAG)',
    category: 'Supabase Graph',
    method: 'GET',
    getPath: (p) => `/roadmap/courses/${p.courseId}/lessons`,
    description: 'Nodos de micro-lecciones dentro de un curso con posiciones, aristas y estados.',
  },
  {
    id: 'learning-roadmap',
    name: 'Árbol Curricular Completo',
    category: 'MongoDB Curriculum',
    method: 'GET',
    getPath: (p) => `/learning/roadmap/${p.lang}`,
    description: '12 módulos secuenciales, subsecciones, cálculo de maestría y estrellas acumuladas.',
  },
  {
    id: 'lesson-detail',
    name: 'Detalle de Micro-lección & Tríada',
    category: 'MongoDB Curriculum',
    method: 'GET',
    getPath: (p) => `/learning/lessons/${p.lessonId}`,
    description: 'Contenido atómico: teoría, consola de ejecución, quiz A/B/C/D y predicción.',
  },
  {
    id: 'content-tracks',
    name: 'Catálogo de Pistas Profesionales',
    category: 'MongoDB Curriculum',
    method: 'GET',
    getPath: () => '/content/tracks',
    description: 'Pistas curriculares activas (Python, Frontend, Backend, DevOps).',
  },
  {
    id: 'content-track-detail',
    name: 'Cursos en DAG de Pista Profesional',
    category: 'MongoDB Curriculum',
    method: 'GET',
    getPath: (p) => `/content/tracks/${p.lang}`,
    description: 'Pista profesional con cursos ordenados por tier/lane y aristas con efectos visuales de GPU.',
  },
  {
    id: 'content-course-detail',
    name: 'Estructura Modular del Curso',
    category: 'MongoDB Curriculum',
    method: 'GET',
    getPath: (p) => `/content/courses/${p.courseId}`,
    description: 'Módulos, secciones y objetivos pedagógicos ordenados para el curso seleccionado.',
  },
  {
    id: 'content-visual-effects',
    name: 'Presets de Efectos Visuales (GPU)',
    category: 'MongoDB Curriculum',
    method: 'GET',
    getPath: () => '/content/visual-effects',
    description: 'Catálogo de presets de aristas de plasma, láser y partículas aceleradas por hardware.',
  },
  {
    id: 'languages-catalog',
    name: 'Catálogo de Lenguajes',
    category: 'Prisma / System',
    method: 'GET',
    getPath: () => '/languages',
    description: 'Lenguajes habilitados en la base de datos relacional PostgreSQL con sus colores y slugs.',
  },
];

export default function TestRoadmapPage() {
  const defaultBaseUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

  const [baseUrl, setBaseUrl] = useState(defaultBaseUrl);
  const [lang, setLang] = useState('python');
  const [courseId, setCourseId] = useState('python-core');
  const [lessonId, setLessonId] = useState('py-m01-s01-l01');

  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [activeTab, setActiveTab] = useState<'all' | 'Supabase Graph' | 'MongoDB Curriculum' | 'Prisma / System'>('all');
  const [expandedJson, setExpandedJson] = useState<Record<string, boolean>>({});
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const cleanUrl = baseUrl.replace(/\/$/, '');

  const runSingleTest = useCallback(
    async (endpoint: EndpointConfig) => {
      setResults((prev) => ({
        ...prev,
        [endpoint.id]: { status: 'loading' },
      }));

      const fullPath = `${cleanUrl}${endpoint.getPath({ lang, courseId, lessonId })}`;
      const startTime = performance.now();

      try {
        const response = await fetch(fullPath, {
          method: endpoint.method,
          headers: {
            Accept: 'application/json',
          },
          cache: 'no-store',
        });

        const latencyMs = Math.round(performance.now() - startTime);
        const data = await response.json();

        if (response.ok) {
          setResults((prev) => ({
            ...prev,
            [endpoint.id]: {
              status: 'success',
              httpStatus: response.status,
              latencyMs,
              isRealBackend: true,
              data,
              testedAt: new Date().toLocaleTimeString(),
            },
          }));
        } else {
          setResults((prev) => ({
            ...prev,
            [endpoint.id]: {
              status: 'error',
              httpStatus: response.status,
              latencyMs,
              isRealBackend: true,
              error: `HTTP ${response.status}: ${JSON.stringify(data)}`,
              data,
              testedAt: new Date().toLocaleTimeString(),
            },
          }));
        }
      } catch (err) {
        const latencyMs = Math.round(performance.now() - startTime);
        const errorMsg = err instanceof Error ? err.message : String(err);
        setResults((prev) => ({
          ...prev,
          [endpoint.id]: {
            status: 'error',
            httpStatus: 0,
            latencyMs,
            isRealBackend: false,
            error: `Conexión fallida: ${errorMsg}. ¿Está corriendo el backend en ${cleanUrl}?`,
            testedAt: new Date().toLocaleTimeString(),
          },
        }));
      }
    },
    [cleanUrl, lang, courseId, lessonId]
  );

  const runAllTests = useCallback(async () => {
    for (const ep of ENDPOINTS) {
      void runSingleTest(ep);
    }
  }, [runSingleTest]);

  // Ejecutar prueba inicial automática al montar
  useEffect(() => {
    void runAllTests();
  }, [runAllTests]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(id);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const toggleJson = (id: string) => {
    setExpandedJson((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const testedCount = Object.keys(results).length;
  const successCount = Object.values(results).filter((r) => r.status === 'success').length;
  const errorCount = Object.values(results).filter((r) => r.status === 'error').length;
  const avgLatency =
    testedCount > 0
      ? Math.round(
          Object.values(results)
            .filter((r) => r.latencyMs !== undefined)
            .reduce((acc, r) => acc + (r.latencyMs || 0), 0) / (testedCount || 1)
        )
      : 0;

  const filteredEndpoints =
    activeTab === 'all'
      ? ENDPOINTS
      : ENDPOINTS.filter((ep) => ep.category === activeTab);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8 border-b border-slate-800 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🦊</span>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Roadmap API Workbench
              </h1>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                Diagnóstico Directo
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Verificador en vivo de endpoints de roadmap para reemplazar mocks por datos reales del backend.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/app/ruta"
              className="text-xs px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Ir a /app/ruta
            </Link>
            <Link
              href="/preview-roadmap"
              className="text-xs px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Ir a /preview-roadmap
            </Link>
            <button
              onClick={runAllTests}
              className="text-xs font-semibold px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950 flex items-center gap-2 transition"
            >
              <span>🚀</span> Probar Todos
            </button>
          </div>
        </div>

        {/* Barra de Parámetros */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-lg text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Backend Base URL:</label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 px-2 py-1 rounded text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Lenguaje / Pista (:lang):</label>
            <div className="flex gap-1">
              <input
                type="text"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 px-2 py-1 rounded text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
              />
              <button
                onClick={() => setLang('python')}
                className={`px-2 py-1 rounded text-[10px] font-mono ${lang === 'python' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}
              >
                py
              </button>
              <button
                onClick={() => setLang('frontend')}
                className={`px-2 py-1 rounded text-[10px] font-mono ${lang === 'frontend' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}
              >
                fe
              </button>
              <button
                onClick={() => setLang('backend')}
                className={`px-2 py-1 rounded text-[10px] font-mono ${lang === 'backend' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}
              >
                be
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Curso ID (:courseId):</label>
            <div className="flex gap-1">
              <input
                type="text"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 px-2 py-1 rounded text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
              />
              <button
                onClick={() => setCourseId('python-core')}
                className={`px-2 py-1 rounded text-[10px] font-mono ${courseId === 'python-core' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}
              >
                core
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Lección ID (:lessonId):</label>
            <div className="flex gap-1">
              <input
                type="text"
                value={lessonId}
                onChange={(e) => setLessonId(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 px-2 py-1 rounded text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
              />
              <button
                onClick={() => setLessonId('py-m01-s01-l01')}
                className={`px-2 py-1 rounded text-[10px] font-mono ${lessonId === 'py-m01-s01-l01' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}
              >
                l01
              </button>
            </div>
          </div>
        </div>

        {/* Métricas Globales */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-lg">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Endpoints</span>
            <span className="text-xl font-bold text-slate-100">{ENDPOINTS.length} configurados</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-lg">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Estado Conexión</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`h-2.5 w-2.5 rounded-full ${successCount > 0 && errorCount === 0 ? 'bg-emerald-400 animate-pulse' : errorCount > 0 ? 'bg-rose-500' : 'bg-slate-500'}`} />
              <span className="text-base font-semibold text-slate-200">
                {successCount}/{ENDPOINTS.length} OK
              </span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-lg">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Latencia Media</span>
            <span className="text-xl font-bold font-mono text-amber-400">{avgLatency} ms</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-lg">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Origen de Datos</span>
            <span className="text-xs font-semibold text-emerald-400 block mt-1">
              {successCount > 0 ? '✓ Backend API Activo' : 'Esperando respuesta...'}
            </span>
          </div>
        </div>

        {/* Selector de Pestañas / Filtro */}
        <div className="flex gap-2 mt-6 border-b border-slate-800">
          {(['all', 'Supabase Graph', 'MongoDB Curriculum', 'Prisma / System'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-1 text-xs font-medium border-b-2 transition ${
                activeTab === tab
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'all' ? 'Todos los Endpoints' : tab}
            </button>
          ))}
        </div>
      </header>

      {/* Lista de Endpoints */}
      <main className="max-w-6xl mx-auto space-y-6">
        {filteredEndpoints.map((ep) => {
          const res = results[ep.id];
          const path = ep.getPath({ lang, courseId, lessonId });
          const isExp = !!expandedJson[ep.id];

          return (
            <div
              key={ep.id}
              className={`border rounded-xl transition bg-slate-900/70 ${
                res?.status === 'success'
                  ? 'border-emerald-500/40'
                  : res?.status === 'error'
                  ? 'border-rose-500/40'
                  : 'border-slate-800'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    {ep.method}
                  </span>
                  <code className="text-sm font-mono text-slate-200 font-semibold">{path}</code>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {ep.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {res?.latencyMs !== undefined && (
                    <span className="text-xs font-mono text-slate-400">{res.latencyMs} ms</span>
                  )}

                  {res?.status === 'loading' && (
                    <span className="text-xs px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 animate-pulse border border-amber-500/30">
                      Conectando...
                    </span>
                  )}

                  {res?.status === 'success' && (
                    <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono font-semibold border border-emerald-500/30 flex items-center gap-1">
                      <span>●</span> {res.httpStatus} OK
                    </span>
                  )}

                  {res?.status === 'error' && (
                    <span className="text-xs px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 font-mono font-semibold border border-rose-500/30 flex items-center gap-1">
                      <span>✕</span> {res.httpStatus ? `HTTP ${res.httpStatus}` : 'Error'}
                    </span>
                  )}

                  <button
                    onClick={() => runSingleTest(ep)}
                    className="text-xs px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700"
                  >
                    Probar
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-4 text-xs">
                <p className="text-slate-400">{ep.description}</p>

                {res?.error && (
                  <div className="p-3 rounded bg-rose-950/40 border border-rose-800 text-rose-300 font-mono text-xs">
                    {res.error}
                  </div>
                )}

                {/* Visualizador de Contenido según Endpoint */}
                {res?.status === 'success' && res.data != null ? (
                  <EndpointDataVisualizer endpointId={ep.id} data={res.data} />
                ) : null}

                {/* Barra de Acciones del JSON */}
                {res?.data != null ? (
                  <div className="pt-2 flex items-center justify-between border-t border-slate-800/60">
                    <button
                      onClick={() => toggleJson(ep.id)}
                      className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 font-mono transition"
                    >
                      <span>{isExp ? '▼' : '▶'}</span> {isExp ? 'Ocultar JSON' : 'Ver JSON crudo'}
                    </button>

                    <button
                      onClick={() => copyToClipboard(JSON.stringify(res.data, null, 2), ep.id)}
                      className="text-slate-400 hover:text-slate-200 text-xs transition"
                    >
                      {copyFeedback === ep.id ? '✓ Copiado' : 'Copiar JSON'}
                    </button>
                  </div>
                ) : null}

                {/* Visor JSON Colapsable */}
                {isExp && res?.data != null ? (
                  <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-72">
                    {JSON.stringify(res.data, null, 2)}
                  </pre>
                ) : null}
              </div>
            </div>
          );
        })}
      </main>

      <footer className="max-w-6xl mx-auto mt-12 text-center text-xs text-slate-500 pb-8">
        Koda Learning Platform • Entorno de Validación API para Desacople de Mocks
      </footer>
    </div>
  );
}

/** Componente auxiliar para resumir y presentar los datos vivos de forma limpia y legible */
function EndpointDataVisualizer({ endpointId, data }: { endpointId: string; data: unknown }) {
  const d = data as Record<string, unknown>;

  // 1. Grafo de Cursos o Lecciones
  if (endpointId === 'courses-graph' || endpointId === 'lessons-graph') {
    const dataset = d?.dataset as
      | {
          sectorTitle?: string;
          progressPercent?: number;
          nodes?: Array<{
            id: string;
            code: string;
            label: string;
            variant: string;
            stars?: number;
            xp?: number;
            isUnlocked: boolean;
            x: number;
            y: number;
          }>;
          connections?: Array<{ id: string; fromId: string; toId: string; color: string }>;
        }
      | undefined;

    const nodes = dataset?.nodes || [];
    const conns = dataset?.connections || [];

    return (
      <div className="space-y-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
        <div className="flex flex-wrap gap-4 text-slate-300 text-xs font-mono">
          <span>
            <strong>Sector:</strong> {dataset?.sectorTitle || 'N/A'}
          </span>
          <span>
            <strong>Progreso:</strong> {dataset?.progressPercent ?? 0}%
          </span>
          <span>
            <strong>Nodos:</strong> {nodes.length}
          </span>
          <span>
            <strong>Conexiones:</strong> {conns.length}
          </span>
        </div>

        {nodes.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px]">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-1 px-2">Código</th>
                  <th className="py-1 px-2">Etiqueta</th>
                  <th className="py-1 px-2">Estado</th>
                  <th className="py-1 px-2">Coords (X, Y)</th>
                  <th className="py-1 px-2">XP</th>
                  <th className="py-1 px-2">Candado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {nodes.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-900/50">
                    <td className="py-1 px-2 text-amber-400 font-bold">{n.code}</td>
                    <td className="py-1 px-2 text-slate-200">{n.label}</td>
                    <td className="py-1 px-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] ${
                          n.variant === 'active'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : n.variant === 'locked'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {n.variant}
                      </span>
                    </td>
                    <td className="py-1 px-2 text-slate-400">
                      ({n.x}, {n.y})
                    </td>
                    <td className="py-1 px-2 text-amber-300">+{n.xp ?? 0} XP</td>
                    <td className="py-1 px-2">
                      {n.isUnlocked ? '🔓 Libre' : '🔒 Bloqueado'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // 2. Learning Roadmap (MongoDB)
  if (endpointId === 'learning-roadmap') {
    const modules = (d?.modules as Array<{
      id: string;
      code: string;
      title: string;
      order_index: number;
      is_unlocked: boolean;
      mastery_percentage: number;
      sections?: Array<{ id: string; title: string }>;
    }>) || [];

    const langInfo = d?.language as { name?: string; total_modules?: number } | undefined;

    return (
      <div className="space-y-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
        <div className="flex flex-wrap gap-4 text-slate-300 text-xs font-mono">
          <span>
            <strong>Pista:</strong> {langInfo?.name || 'Python'}
          </span>
          <span>
            <strong>Total Módulos:</strong> {modules.length}
          </span>
          <span>
            <strong>Progreso Global:</strong> {String(d?.overall_progress_percentage ?? 0)}%
          </span>
          <span>
            <strong>Estrellas Posibles:</strong> {String(d?.max_possible_stars ?? 0)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {modules.map((m) => (
            <div
              key={m.id}
              className="p-2 rounded bg-slate-900 border border-slate-800/80 flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold block">
                  {m.code} (Orden {m.order_index})
                </span>
                <span className="text-xs text-slate-200 line-clamp-1">{m.title}</span>
                <span className="text-[10px] text-slate-400">
                  {m.sections?.length ?? 0} secciones • {m.mastery_percentage}% maestría
                </span>
              </div>
              <span className="text-xs ml-2">
                {m.is_unlocked ? '🔓' : '🔒'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. Detalle de Lección (MongoDB)
  if (endpointId === 'lesson-detail') {
    const triad = (d?.evaluation_triad as {
      item_1_console?: { instruction?: string; solution_code?: string };
      item_2_options?: { prompt?: string };
      item_3_prediction?: { prompt?: string; expected_output?: string };
    }) || {};

    return (
      <div className="space-y-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs">
        <div className="font-semibold text-slate-200 flex items-center gap-2">
          <span>📖</span> {String(d?.title || 'Lección')}
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
            {String(d?.id)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-sky-400 font-bold uppercase block">1. Consola Interactiva</span>
            <p className="text-slate-300 text-[11px] line-clamp-2 mt-1">
              {triad.item_1_console?.instruction || 'Sin instrucción'}
            </p>
          </div>

          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-amber-400 font-bold uppercase block">2. Quiz Opción Múltiple</span>
            <p className="text-slate-300 text-[11px] line-clamp-2 mt-1">
              {triad.item_2_options?.prompt || 'Sin pregunta'}
            </p>
          </div>

          <div className="p-2 rounded bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">3. Predicción de Salida</span>
            <p className="text-slate-300 text-[11px] line-clamp-2 mt-1">
              {triad.item_3_prediction?.prompt || 'Sin predicción'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 4. Pistas de Carrera
  if (endpointId === 'content-tracks') {
    const tracks = (d?.tracks as Array<{
      slug: string;
      name: string;
      description: string;
      color: string;
      badge: string;
    }>) || [];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
        {tracks.map((t) => (
          <div key={t.slug} className="p-2 rounded bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 text-xs">{t.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                {t.badge}
              </span>
            </div>
            <p className="text-slate-400 text-[11px] mt-1">{t.description}</p>
            <span className="text-[10px] font-mono text-slate-500 mt-1 block">slug: {t.slug}</span>
          </div>
        ))}
      </div>
    );
  }

  // 5. Cursos en DAG de Pista Profesional
  if (endpointId === 'content-track-detail') {
    const track = d?.track as { name?: string; badge?: string } | undefined;
    const courses = (d?.courses as Array<{
      slug: string;
      name: string;
      topology?: { tier: number; lane: number };
      edges?: Array<{ targetCourseSlug: string; edgeColor: string }>;
    }>) || [];

    return (
      <div className="space-y-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-200">
          <strong>Pista:</strong> {track?.name} ({track?.badge}) • <strong>{courses.length} cursos en topología DAG</strong>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          {courses.map((c) => (
            <div key={c.slug} className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-amber-400 font-bold block">{c.name}</span>
              <span className="text-[10px] text-slate-400">
                Tier: {c.topology?.tier ?? 0} | Lane: {c.topology?.lane ?? 0} | {c.edges?.length ?? 0} aristas salientes
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. Estructura Modular del Curso
  if (endpointId === 'content-course-detail') {
    const course = d?.course as { name?: string } | undefined;
    const modules = (d?.modules as Array<{
      module: { title: string; slug: string; position: number };
      sections?: Array<{ title: string; slug: string; position: number; totalLessons: number }>;
    }>) || [];

    return (
      <div className="space-y-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs">
        <div className="font-semibold text-slate-200">
          Curso: {course?.name || 'Curso'} ({modules.length} módulos)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          {modules.map((m) => (
            <div key={m.module.slug} className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-mono text-amber-400 font-bold block">
                Módulo {m.module.position}: {m.module.title}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {m.sections?.length ?? 0} secciones • {m.sections?.reduce((acc, s) => acc + (s.totalLessons || 0), 0) ?? 0} lecciones totales
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 7. Presets de Efectos Visuales
  if (endpointId === 'content-visual-effects') {
    const effects = (d?.effects as Array<{
      code: string;
      name: string;
      preset: string;
      defaultColor: string;
      animationSpeed: number;
    }>) || [];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs">
        {effects.map((e) => (
          <div key={e.code} className="p-2 rounded bg-slate-900 border border-slate-800 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.defaultColor }} />
              <span className="font-bold text-slate-200 text-[11px]">{e.name}</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              {e.code} • vel: {e.animationSpeed}x
            </span>
          </div>
        ))}
      </div>
    );
  }

  // 8. Catálogo de Lenguajes
  if (endpointId === 'languages-catalog') {
    const langs = Array.isArray(data) ? (data as Array<{ id: string; slug: string; name: string; is_active: boolean }>) : [];

    return (
      <div className="flex flex-wrap gap-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
        {langs.map((l) => (
          <div key={l.slug} className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 flex items-center gap-2">
            <span className="text-xs font-bold text-slate-200">{l.name}</span>
            <span className="text-[10px] font-mono text-slate-400">({l.slug})</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
              Activo
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
