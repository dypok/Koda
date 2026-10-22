'use client';

import React from 'react';
import { Compass, Warning, CheckCircle, ChartBar, Users } from '@phosphor-icons/react';

export default function AdminAnaliticaPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-slate-950 text-slate-100 select-none">
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
          <Compass className="w-4 h-4" />
          <span>Analitica de Friccion y Rendimiento</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Telemetria de Dificultad y Abandono
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Datos cruzados del motor evaluador y el cuaderno de errores SuperMemo SM-2.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Tasa de Aprobacion Global</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">87.4%</div>
          <div className="text-[11px] text-slate-500 font-mono">Primer intento en lecciones</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Frecuencia de Repaso SM-2</span>
            <Warning className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">14.2%</div>
          <div className="text-[11px] text-slate-500 font-mono">Ingresan al cuaderno de errores</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Estudiantes Evaluados</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">1,420</div>
          <div className="text-[11px] text-slate-500 font-mono">Ultimos 30 dias</div>
        </div>
      </div>

      {/* Heatmap de Cuellos de Botella */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
          <ChartBar className="w-4 h-4 text-amber-400" />
          <span>Lecciones con Mayor Tasa de Friccion Pedagógica</span>
        </h2>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-slate-200 font-bold">py-m01-s02-l02: Precedencia de Operadores</div>
              <div className="text-slate-500 text-[11px]">Distractor mas comun: Division entera vs float</div>
            </div>
            <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-bold">
              31% Error
            </span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-slate-200 font-bold">py-m01-s03-l01: Condicionales Anidados if/elif</div>
              <div className="text-slate-500 text-[11px]">Distractor mas comun: Indentacion inconsistente</div>
            </div>
            <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
              22% Error
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
