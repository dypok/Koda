import React from 'react';
import { UserCheck, CircleCheck } from 'lucide-react';

export const DataRightsTab: React.FC = () => (
  <div className="space-y-6 animate-fadeIn">
    <div>
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 mb-2 font-sans">
        <UserCheck className="w-3.5 h-3.5" />
        Control de Tus Datos
      </div>
      <h4 className="font-display text-2xl font-bold text-white tracking-tight">
        No Vender ni Compartir mi Información
      </h4>
      <p className="text-xs text-slate-400 mt-1">Conformidad con regulaciones de privacidad GDPR, CCPA / CPRA.</p>
    </div>

    <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-200 font-sans space-y-2">
      <p className="font-bold text-white text-sm">Declaración de No Comercialización:</p>
      <p>
        KodaAcademy no "vende" ni "comparte" tu información personal en los términos definidos por la Ley de Privacidad del Consumidor de California (CCPA) ni por el Reglamento General de Protección de Datos (GDPR) de la Unión Europea.
      </p>
    </div>

    <div className="space-y-3 text-xs text-slate-300">
      <h5 className="font-bold text-white text-sm">Tus Derechos Fundamentales:</h5>
      <ul className="space-y-2 font-sans">
        <li className="flex items-center gap-2">
          <CircleCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Derecho a descargar una copia completa de tu historial y progreso en formato JSON.</span>
        </li>
        <li className="flex items-center gap-2">
          <CircleCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Derecho al olvido y eliminación definitiva de tu cuenta y datos con un solo clic.</span>
        </li>
        <li className="flex items-center gap-2">
          <CircleCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Desactivación total de cookies analíticas no esenciales en cualquier momento.</span>
        </li>
      </ul>
    </div>
  </div>
);
