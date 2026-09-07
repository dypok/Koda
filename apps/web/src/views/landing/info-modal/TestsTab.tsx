import React from 'react';
import { IconAward, IconCheck } from '@tabler/icons-react';

export const TestsTab: React.FC = () => (
  <div className="space-y-6 animate-fadeIn">
    <div>
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 mb-2 font-sans">
        <IconAward className="w-3.5 h-3.5" />
        Acreditación Verificable
      </div>
      <h4 className="font-display text-2xl font-bold text-white tracking-tight">
        Certificación & Evaluaciones Koda
      </h4>
      <p className="text-xs text-slate-400 mt-1">
        Demuestra tus habilidades técnicas con credenciales oficiales con código QR.
      </p>
    </div>

    <p className="text-xs text-slate-300 leading-relaxed">
      Al completar todos los módulos de un track de lenguaje y aprobar el proyecto integrador final, KodaAcademy emite un certificado digital oficial con identificador único y código QR.
    </p>

    <div className="space-y-3">
      <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-800 bg-slate-900/30 text-xs">
        <IconCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white">Validación Criptográfica:</span> Cualquier reclutador o institución educativa puede escanear el QR o ingresar a <span className="text-amber-400">/verificar</span> para constatar la autenticidad.
        </div>
      </div>
      <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-800 bg-slate-900/30 text-xs">
        <IconCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white">100% Práctico:</span> El certificado acredita la resolución efectiva de problemas en código real, no solo memorización de conceptos.
        </div>
      </div>
    </div>
  </div>
);
