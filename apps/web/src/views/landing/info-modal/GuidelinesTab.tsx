import React from 'react';
import { Users } from 'lucide-react';

export const GuidelinesTab: React.FC = () => (
  <div className="space-y-6 animate-fadeIn">
    <div>
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20 mb-2 font-sans">
        <Users className="w-3.5 h-3.5" />
        Convivencia y Aprendizaje
      </div>
      <h4 className="font-display text-2xl font-bold text-white tracking-tight">Normas de la Comunidad Koda</h4>
      <p className="text-xs text-slate-400 mt-1">Principios para construir un espacio seguro, solidario y enfocado en el crecimiento mutuo.</p>
    </div>

    <div className="space-y-3.5 text-xs text-slate-300">
      <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/30 space-y-1.5">
        <h5 className="font-bold text-white text-sm">1. Respeto y Empatía Primero</h5>
        <p className="text-slate-400">Todos empezamos desde cero. Nunca te burles de una duda o error de sintaxis; la curiosidad es el motor del buen programador.</p>
      </div>

      <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/30 space-y-1.5">
        <h5 className="font-bold text-white text-sm">2. Pistas Sí, Spoilers No</h5>
        <p className="text-slate-400">Si ayudas a un compañero en los debates, no le pegues la solución completa. Guíalo con preguntas para que experimente el momento de descubrimiento por sí mismo.</p>
      </div>

      <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/30 space-y-1.5">
        <h5 className="font-bold text-white text-sm">3. Código Limpio y Constructivo</h5>
        <p className="text-slate-400">Fomenta las buenas prácticas de nombrado, indentación y claridad conceptual en las revisiones comunitarias.</p>
      </div>
    </div>
  </div>
);
