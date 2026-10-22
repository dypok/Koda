'use client';

import React, { useState } from 'react';
import { Gear, CheckCircle, FloppyDisk } from '@phosphor-icons/react';

export default function AdminConfiguracionPage() {
  const [xpPerSection, setXpPerSection] = useState(50);
  const [quizThreshold, setQuizThreshold] = useState(70);
  const [examThreshold, setExamThreshold] = useState(80);
  const [freezeCost, setFreezeCost] = useState(150);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-slate-950 text-slate-100 select-none">
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
          <Gear className="w-4 h-4" />
          <span>Parametros Globales del Sistema</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Configuracion Curricular y Gamificacion
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Modifica los valores de economia y criterios de aprobacion sin requerir despliegue de codigo.
        </p>
      </div>

      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-amber-400">
            Economia de XP y Rachas
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                XP Base por Seccion Completada
              </label>
              <input
                type="number"
                value={xpPerSection}
                onChange={(e) => setXpPerSection(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Costo en XP de Congelador de Racha
              </label>
              <input
                type="number"
                value={freezeCost}
                onChange={(e) => setFreezeCost(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-emerald-400">
            Umbrales de Evaluacion Automatica
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Porcentaje Minimo de Aprobacion de Quiz (%)
              </label>
              <input
                type="number"
                min={50}
                max={100}
                value={quizThreshold}
                onChange={(e) => setQuizThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Porcentaje Minimo de Aprobacion de Examen (%)
              </label>
              <input
                type="number"
                min={60}
                max={100}
                value={examThreshold}
                onChange={(e) => setExamThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle className="w-4 h-4" />
              <span>Parametros actualizados correctamente.</span>
            </div>
          ) : (
            <div />
          )}

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <FloppyDisk className="w-4 h-4" />
            <span>Guardar Parametros</span>
          </button>
        </div>
      </form>
    </div>
  );
}
