import React from 'react';
import { IconShieldLock } from '@tabler/icons-react';

export const PrivacyTab: React.FC = () => (
  <div className="space-y-6 animate-fadeIn">
    <div>
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 mb-2 font-sans">
        <IconShieldLock className="w-3.5 h-3.5" />
        Privacidad y Seguridad
      </div>
      <h4 className="font-display text-2xl font-bold text-white tracking-tight">Política de Privacidad</h4>
      <p className="text-xs text-slate-400 mt-1">Transparencia total sobre cómo cuidamos y protegemos tus datos.</p>
    </div>

    <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
      <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/30 space-y-2">
        <h5 className="font-bold text-white text-sm">Cero Venta de Información</h5>
        <p className="text-slate-400">Nunca vendemos, alquilamos ni compartimos tus datos de contacto con corredores de datos ni plataformas publicitarias de terceros.</p>
      </div>

      <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/30 space-y-2">
        <h5 className="font-bold text-white text-sm">Datos Mínimos Necesarios</h5>
        <p className="text-slate-400">Solo almacenamos tu correo de acceso, tu progreso en el roadmap, rachas acumuladas y los certificados emitidos.</p>
      </div>

      <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/30 space-y-2">
        <h5 className="font-bold text-white text-sm">Cifrado de Extremo a Extremo</h5>
        <p className="text-slate-400">Todas las comunicaciones entre tu navegador y nuestra infraestructura viajan bajo conexiones HTTPS con cifrado TLS 1.3.</p>
      </div>
    </div>
  </div>
);
