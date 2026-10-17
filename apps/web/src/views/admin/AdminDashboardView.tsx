'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Cube,
  FileText,
  Terminal,
  Plus,
  Trash,
  PencilSimple,
  ChartBar,
  Sparkle,
  CheckCircle,
  Warning,
  ArrowRight,
  ShieldCheck,
} from '@phosphor-icons/react';
import { useAdminCurriculumStore } from '@/stores/admin-curriculum.store';
import { AddSelectorModal } from '@/components/admin/AddSelectorModal';
import { DeleteSelectorModal } from '@/components/admin/DeleteSelectorModal';

export const AdminDashboardView: React.FC = () => {
  const {
    draftTracks,
    draftModules,
    draftSections,
    draftLessons,
    selectedTrackSlug,
    selectTrack,
    selectModule,
    selectSection,
  } = useAdminCurriculumStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Estadisticas globales calculadas
  const totalTracks = draftTracks.length;
  const totalModules = draftModules.length;
  const totalSections = draftSections.length;
  const totalLessons = draftLessons.length;
  const totalExercises = totalLessons * 3; // Consola + Quiz + Prediccion por leccion

  // Modulos de la ruta activa
  const trackModules = draftModules.filter((m) => m.course_slug === selectedTrackSlug);

  return (
    <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-slate-950 text-slate-100 select-none">
      {/* Bienvenida y Estado del Cockpit */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Koda Mission Control :: Administracion Central</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Panel de Control Curricular
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Supervisa, crea, modifica y administra las rutas de formacion, modulos y contenidos didacticos.
          </p>
        </div>

        {/* Acciones Rápidas Primarias */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Nuevo...</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-500/20 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 font-mono text-xs transition-all cursor-pointer"
          >
            <Trash className="w-4 h-4" />
            <span>Eliminar...</span>
          </button>
        </div>
      </div>

      {/* METRICAS PRINCIPALES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Rutas Formativas</span>
            <Compass className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{totalTracks}</div>
          <div className="text-[11px] text-slate-500 font-mono">Tracks activos en produccion</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Modulos Totales</span>
            <Cube className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{totalModules}</div>
          <div className="text-[11px] text-slate-500 font-mono">Bloques tematicos secuenciados</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Secciones Didacticas</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{totalSections}</div>
          <div className="text-[11px] text-slate-500 font-mono">Unidades de aprendizaje evaluables</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Desafios & Preguntas</span>
            <Terminal className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{totalExercises}</div>
          <div className="text-[11px] text-slate-500 font-mono">Consola + Quizzes + Prediccion</div>
        </div>
      </div>

      {/* EXPLORADOR JERARQUICO Y ACCIONES EN LA RUTA SELECCIONADA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda (2/3): Jerarquia de Contenidos */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Cube className="w-5 h-5 text-amber-400" />
              <span>Estructura de la Ruta Activa</span>
            </h2>

            <div className="text-xs font-mono text-slate-400">
              {trackModules.length} modulos vinculados
            </div>
          </div>

          <div className="space-y-3">
            {trackModules.map((module) => {
              const moduleSections = draftSections.filter((s) => s.module_slug === module.slug);

              return (
                <div
                  key={module.slug}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-bold">
                          POS #{module.position}
                        </span>
                        <h3 className="text-sm font-bold text-white">{module.title}</h3>
                      </div>
                      <p className="text-xs text-slate-400">{module.objective}</p>
                    </div>

                    <Link
                      href={`/app/curso/${module.course_slug || 'py-basic'}/seccion/${module.slug}`}
                      onClick={() => selectModule(module.slug)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-colors shrink-0"
                    >
                      <PencilSimple className="w-3.5 h-3.5 text-amber-400" />
                      <span>Editar Modulo</span>
                    </Link>
                  </div>

                  {/* Secciones del modulo */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wide">
                      Secciones Didacticas ({moduleSections.length}):
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {moduleSections.map((sec) => (
                        <Link
                          key={sec.slug}
                          href={`/app/curso/${module.course_slug || 'py-basic'}/seccion/${sec.slug}`}
                          onClick={() => {
                            selectModule(module.slug);
                            selectSection(sec.slug);
                          }}
                          className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/60 border border-slate-800/80 hover:border-amber-500/40 text-left transition-all group flex items-center justify-between"
                        >
                          <div className="space-y-0.5 pr-2">
                            <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 transition-colors truncate">
                              {sec.title}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500">
                              {sec.total_lessons} sesiones · {sec.xp_reward} XP
                            </div>
                          </div>
                          <PencilSimple className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha (1/3): Sugerencias y Telemetria */}
        <div className="space-y-6">
          {/* Card: Asistente IA (Gemini) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/30 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkle className="w-5 h-5" />
              <h3 className="text-sm font-bold font-mono">IA Curriculum Copilot</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Genera borradores completos respetando la regla didactica canónica de 3 pasos, 4 opciones de quiz con distractores calibrados y test cases de consola.
            </p>
            <Link
              href="/admin/copilot"
              className="inline-flex items-center gap-2 text-xs font-mono text-indigo-300 hover:text-white font-bold"
            >
              <span>Abrir Asistente Copilot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card: Telemetria de Friccion Pedagógica */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
                <Warning className="w-4 h-4" />
                <span>Monitoreo de Friccion (SM-2)</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Tiempo Real</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="truncate">py-m01-s01: Print y Consola</span>
                  <span className="text-emerald-400">92% Exito</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="truncate">py-m01-s02: Numeros y Calculos</span>
                  <span className="text-amber-400">78% Exito</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '78%' }} />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Ningun estudiante ha reportado errores bloqueantes en el ultimo ciclo de 24 horas.
            </p>
          </div>

          {/* Card: Sandbox Runner */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
              <Terminal className="w-4 h-4" />
              <span>Judge0 Live Sandbox Runner</span>
            </div>
            <p className="text-xs text-slate-300">
              Prueba los test cases y las soluciones propuestas por los autores de contenido en contenedores aislados antes de publicar a produccion.
            </p>
            <div className="text-[11px] font-mono text-slate-500">
              Latencia promedio: 34ms · Tiempo limite: 3000ms
            </div>
          </div>
        </div>
      </div>

      {/* Modales Requeridos */}
      <AddSelectorModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <DeleteSelectorModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
    </div>
  );
};
