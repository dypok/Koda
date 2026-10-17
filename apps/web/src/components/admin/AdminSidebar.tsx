'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChartBar,
  Stack,
  PencilSimple,
  Compass,
  Terminal,
  Sparkle,
  Gear,
  Plus,
  Trash,
  Folder,
  Planet,
} from '@phosphor-icons/react';

interface AdminSidebarProps {
  onOpenAddModal?: () => void;
  onOpenDeleteModal?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onOpenAddModal, onOpenDeleteModal }) => {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Ruta Interactiva (Principal)',
      href: '/',
      icon: Planet,
      tag: 'Principal',
    },
    {
      label: 'Cockpit Dashboard',
      href: '/admin',
      icon: ChartBar,
    },
    {
      label: 'Rutas y Modulos',
      href: '/admin/rutas',
      icon: Stack,
    },
    {
      label: 'Analitica & Friccion',
      href: '/admin/analitica',
      icon: Compass,
      tag: 'Pro',
    },
    {
      label: 'Sandbox de Ejecucion',
      href: '/admin/sandbox',
      icon: Terminal,
      tag: 'Runner',
    },
    {
      label: 'IA Content Copilot',
      href: '/admin/copilot',
      icon: Sparkle,
      tag: 'Gemini',
    },
    {
      label: 'Configuracion',
      href: '/admin/configuracion',
      icon: Gear,
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/70 backdrop-blur-md flex flex-col justify-between p-4 shrink-0 select-none">
      <div className="space-y-6">
        {/* Acciones Rapidas Principales */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase px-2 font-bold">
            Operaciones Rapidas
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onOpenAddModal}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold text-xs transition-all cursor-pointer shadow-sm hover:shadow-amber-500/10"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir</span>
            </button>

            <button
              type="button"
              onClick={onOpenDeleteModal}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-semibold text-xs transition-all cursor-pointer shadow-sm hover:shadow-rose-500/10"
            >
              <Trash className="w-3.5 h-3.5" />
              <span>Eliminar</span>
            </button>
          </div>
        </div>

        {/* Menu de Navegacion */}
        <div className="space-y-1">
          <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase px-2 mb-2 font-bold">
            Navegacion Principal
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.tag && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700/60'
                    }`}
                  >
                    {item.tag}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Pie de Barra: Estado de Contenido */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span>Modo de Trabajo:</span>
            <span className="text-amber-400 font-bold">Borrador Vivo</span>
          </div>
          <div className="text-[10px] text-slate-500">
            Los cambios no afectan a produccion hasta presionar Guardar.
          </div>
        </div>

        <div className="text-[10px] font-mono text-slate-600 text-center">
          Koda Academy Admin :: v2.4.0
        </div>
      </div>
    </aside>
  );
};
