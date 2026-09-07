'use client';

import React, { useState } from 'react';
import { PYTHON_MODULES, PythonModuleInfo } from '../../lib/python-modules';
import {
  IconCircleCheck,
  IconLock,
  IconAward,
  IconChevronRight,
  IconQrcode,
  IconBook2,
  IconStack2,
  IconArrowRight,
} from '@tabler/icons-react';

interface CurriculumSectionProps {
  onOpenLogin?: () => void;
}

export const CurriculumSection: React.FC<CurriculumSectionProps> = ({ onOpenLogin }) => {
  const [activeModule, setActiveModule] = useState<PythonModuleInfo>(PYTHON_MODULES[0]);

  return (
    <section id="temario" className="py-20 md:py-28 bg-slate-900/40 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-semibold text-amber-400">
            <IconStack2 className="w-3.5 h-3.5" />
            Catálogo Formativo · Track Inaugural
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Track Oficial: Fundamentos con Python 3.12
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Iniciamos con Python 3.12 como track piloto: 12 módulos progresivos que enseñan desde el primer <code className="text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded font-mono text-sm">print()</code> hasta proyectos estructurados, sentando las bases lógicas para los futuros tracks de la plataforma.
          </p>
        </div>

        {/* Multi-language Platform Roadmap Notice */}
        <div className="mb-10 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 shrink-0" />
            <span>
              <strong className="text-white font-semibold">Plataforma Multi-Lenguaje: </strong>
              <span className="text-slate-400">Track 01 (Python 3.12) disponible. Próximos tracks en preparación: JavaScript / TypeScript, Go y Rust.</span>
            </span>
          </div>
          <span className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 font-mono text-[10px] uppercase font-bold border border-slate-700">
            Roadmap 2026
          </span>
        </div>

        {/* 12 Modules Grid + Interactive Detail Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Grid: 12 Modules List (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {PYTHON_MODULES.map((mod) => {
              const isSelected = activeModule.id === mod.id;
              const isReady = mod.status === 'published';

              return (
                <div
                  key={mod.id}
                  onClick={() => setActiveModule(mod)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-gradient-to-br from-slate-900 to-amber-950/20 scale-[1.02]'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
                      Módulo {mod.position.toString().padStart(2, '0')}
                    </span>
                    {isReady ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/30">
                        <IconCircleCheck className="w-3 h-3" />
                        Disponible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                        <IconLock className="w-2.5 h-2.5" />
                        Planificado
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {mod.tagline}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Module Inspector & Final Certificate Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            {/* Selected Module Detail Card */}
            <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono text-amber-400 font-bold tracking-wider uppercase">
                    Detalle del Módulo {activeModule.position}
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-0.5">
                    {activeModule.title}
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <IconBook2 className="w-5 h-5" />
                </div>
              </div>

              <p className="text-slate-300 text-sm mt-4 leading-relaxed">
                {activeModule.description}
              </p>

              {/* Module Stats */}
              <div className="grid grid-cols-2 gap-3 my-5">
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center">
                  <span className="text-xs text-slate-400 block">Secciones</span>
                  <span className="text-lg font-bold text-white font-mono">{activeModule.totalSections}</span>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center">
                  <span className="text-xs text-slate-400 block">Micro-Lecciones</span>
                  <span className="text-lg font-bold text-amber-400 font-mono">{activeModule.totalLessons}</span>
                </div>
              </div>

              {/* Key Topics List */}
              <div className="space-y-2 mb-6">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Conceptos que aprenderás:
                </span>
                <ul className="space-y-1.5">
                  {activeModule.topics.map((t, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                      <IconChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Start Module CTA */}
              <button
                onClick={onOpenLogin}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 py-3 text-sm font-bold text-slate-950 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                Comenzar con este Módulo
                <IconArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Official Certificate Preview Card */}
            <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-900 p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                  <IconAward className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Certificado Oficial KodaAcademy</h4>
                  <span className="text-[11px] text-indigo-300">Emisión digital verificable con código QR</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Al completar los 12 módulos y aprobar el Proyecto Integrador, obtendrás tu diploma oficial de KodaAcademy con identificador correlativo <code className="text-amber-400 font-mono">KODA-PY-{'{SEQ}'}</code> y enlace de verificación pública para tu CV y LinkedIn.
              </p>

              <div className="flex items-center justify-between bg-slate-900/80 border border-indigo-500/20 rounded-2xl p-3">
                <div className="flex items-center gap-2.5">
                  <IconQrcode className="w-7 h-7 text-indigo-400" />
                  <div className="text-[11px]">
                    <span className="font-semibold text-white block">Escaneo QR ISO 18004</span>
                    <span className="text-slate-400">Verificable en koda.app/verificar</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-300 bg-indigo-400/10 px-2.5 py-1 rounded-lg border border-indigo-400/30">
                  Diploma Digital
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
