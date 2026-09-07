'use client';

import React from 'react';
import Image from 'next/image';
import { IconX, IconSparkles, IconCircleCheck } from '@tabler/icons-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl space-y-5 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          aria-label="Cerrar ventana"
        >
          <IconX className="w-5 h-5" />
        </button>

        {/* Brand Logo Badge */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#182030] border border-slate-800 overflow-hidden">
          <Image
            src="/logo.png"
            alt="KodaAcademy Logo"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30 mb-2">
            <IconSparkles className="w-3 h-3" />
            Próximamente
          </span>
          <h3 className="text-2xl font-extrabold text-white tracking-tight">
            Inicio de Sesión
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Campus Oficial de KodaAcademy · Python 3.12
          </p>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed text-left sm:text-center">
          El módulo de autenticación y acceso de estudiantes se encuentra en su fase final de pruebas técnicas y de seguridad. Estará habilitado próximamente para el inicio del programa de Python 3.12.
        </p>

        {/* Features Checklist */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-left space-y-2.5 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <IconCircleCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Sincronización de progreso y estrellas en la nube</span>
          </div>
          <div className="flex items-center gap-2">
            <IconCircleCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Cuaderno de errores persistente con remediación (+5 XP)</span>
          </div>
          <div className="flex items-center gap-2">
            <IconCircleCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Emisión de certificados oficiales verificables con QR</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 py-3 text-sm font-bold text-slate-950 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};
