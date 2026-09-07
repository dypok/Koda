import React from 'react';
import { IconSchool, IconCircleCheck } from '@tabler/icons-react';

export const SchoolsTab: React.FC = () => (
  <div className="space-y-6 animate-fadeIn">
    <div>
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20 mb-2 font-sans">
        <IconSchool className="w-3.5 h-3.5" />
        Educación en Aulas
      </div>
      <h4 className="font-display text-2xl font-bold text-white tracking-tight">Koda para Escuelas y Docentes</h4>
      <p className="text-xs text-slate-400 mt-1">Potencia tus clases de informática con ejercicios guiados y corrección automática.</p>
    </div>

    <p className="text-xs text-slate-300 leading-relaxed">
      KodaAcademy está concebido para integrarse en aulas de secundaria, bachillerato y universidades. Los docentes pueden asignar lecciones, seguir las rachas de sus estudiantes y detectar conceptos que requieran refuerzo.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-1.5">
        <div className="flex items-center gap-2 text-white font-bold text-xs">
          <IconCircleCheck className="w-4 h-4 text-emerald-400" />
          <span>Cero Costo por Estudiante</span>
        </div>
        <p className="text-[11px] text-slate-400">Acceso libre ilimitado para colegios públicos y privados.</p>
      </div>

      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-1.5">
        <div className="flex items-center gap-2 text-white font-bold text-xs">
          <IconCircleCheck className="w-4 h-4 text-emerald-400" />
          <span>Retroalimentación Inmediata</span>
        </div>
        <p className="text-[11px] text-slate-400">Corrección automática con pistas sin dar la respuesta.</p>
      </div>
    </div>

    <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-200">
      ¿Eres docente o directivo escolar? Escríbenos a <span className="font-bold text-white underline">educacion@kodaacademy.org</span> para activar herramientas de grupo.
    </div>
  </div>
);
