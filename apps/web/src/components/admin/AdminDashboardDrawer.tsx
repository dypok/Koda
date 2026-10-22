'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChartBar,
  Stack,
  Compass,
  Terminal,
  Sparkle,
  Gear,
  X,
  Plus,
  Trash,
} from '@phosphor-icons/react';

interface AdminDashboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddModal: () => void;
  onOpenDeleteModal: () => void;
}

export const AdminDashboardDrawer: React.FC<AdminDashboardDrawerProps> = ({
  isOpen,
  onClose,
  onOpenAddModal,
  onOpenDeleteModal,
}) => {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Cockpit Dashboard',
      href: '/admin',
      icon: ChartBar,
      desc: 'Metricas globales y estructura curricular',
    },
    {
      label: 'Rutas y Modulos',
      href: '/admin/rutas',
      icon: Stack,
      desc: 'Gestion de tracks y secuencias',
    },
    {
      label: 'Analitica & Friccion',
      href: '/admin/analitica',
      icon: Compass,
      tag: 'Pro',
      desc: 'Telemetria SM-2 y tasa de aprobacion',
    },
    {
      label: 'Sandbox de Ejecucion',
      href: '/admin/sandbox',
      icon: Terminal,
      tag: 'Runner',
      desc: 'Ejecucion de codigo aislada',
    },
    {
      label: 'IA Content Copilot',
      href: '/admin/copilot',
      icon: Sparkle,
      tag: 'Gemini',
      desc: 'Generador didactico con IA',
    },
    {
      label: 'Configuracion',
      href: '/admin/configuracion',
      icon: Gear,
      desc: 'Parametros de XP y economia',
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none animate-fadeIn">
      {/* Backdrop con desenfoque */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel Deslizable Lateral */}
      <aside
        role="dialog"
        aria-label="Panel de Administrador Deslizable"
        className="relative w-full max-w-md h-full bg-slate-950/95 border-l border-slate-800 backdrop-blur-2xl p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto animate-slideLeft"
      >
        <div className="space-y-6">
          {/* Cabecera del Drawer */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ChartBar className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold font-mono text-white">ADMIN DASHBOARD</h2>
                <p className="text-[11px] text-slate-400 font-mono">Modulos y Opciones del Sistema</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Cerrar panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Operaciones Rapidas In-Situ */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">
              Operaciones Rápidas
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAddModal();
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-semibold text-xs transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDeleteModal();
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-semibold text-xs transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
              >
                <Trash className="w-3.5 h-3.5" />
                <span>Eliminar</span>
              </button>
            </div>
          </div>

          {/* Lista de Secciones y Opciones del Dashboard */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">
              Modulos de Administracion
            </div>

            <div className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-start justify-between p-3 rounded-xl transition-all group border ${
                      isActive
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm'
                        : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 group-hover:text-amber-400 transition-colors mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white group-hover:text-amber-200 transition-colors">
                            {item.label}
                          </span>
                          {item.tag && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded border bg-amber-500/10 text-amber-300 border-amber-500/30 font-bold uppercase">
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-normal">{item.desc}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer del Drawer */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono flex items-center justify-between">
            <span className="text-slate-400">Vista Principal:</span>
            <span className="text-emerald-400 font-bold">Ruta Interactiva Koda</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 text-center">
            Koda Mission Control :: v2.5.0
          </div>
        </div>
      </aside>
    </div>
  );
};
