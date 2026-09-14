import React from 'react';
import { FileText } from 'lucide-react';

export const TermsTab: React.FC = () => (
  <div className="space-y-6 animate-fadeIn">
    <div>
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 mb-2 font-sans">
        <FileText className="w-3.5 h-3.5" />
        Marco Legal
      </div>
      <h4 className="font-display text-2xl font-bold text-white tracking-tight">Términos de Servicio</h4>
      <p className="text-xs text-slate-400 mt-1">Condiciones de uso de la plataforma educativa KodaAcademy.</p>
    </div>

    <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
      <p>
        <strong>1. Uso de la Plataforma:</strong> KodaAcademy provee lecciones, editores interactivos y herramientas de certificación con fines pedagógicos y de capacitación personal.
      </p>
      <p>
        <strong>2. Propiedad Intelectual de tu Código:</strong> Todo el código que escribas, crees o diseñes durante las lecciones y proyectos es 100% de tu propiedad. KodaAcademy no reclama derechos sobre tus soluciones.
      </p>
      <p>
        <strong>3. Sandbox Seguro:</strong> Queda prohibido utilizar el entorno de ejecución web para actividades maliciosas, ataques de denegación de servicio o explotación de vulnerabilidades.
      </p>
      <p>
        <strong>4. Gratuidad del Servicio:</strong> El núcleo formativo de KodaAcademy permanece gratuito de por vida para el acceso individual del estudiante.
      </p>
    </div>
  </div>
);
