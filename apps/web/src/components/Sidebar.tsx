'use client';

import React from 'react';
import Image from 'next/image';
import {
  IconMap,
  IconBook2,
  IconTrophy,
  IconAward,
  IconSettings,
  IconFlame,
  IconBolt,
  IconShieldCheck,
} from '@tabler/icons-react';
import { useKodaStore } from '@/lib/store';
import { KodaMascot } from './KodaMascot';

export const Sidebar: React.FC = () => {
  const { totalXp, level, streak } = useKodaStore();

  const navItems = [
    { label: 'Ruta de Aprendizaje', icon: IconMap, active: true },
    { label: 'Cuaderno de Errores', icon: IconBook2, badge: '2', active: false },
    { label: 'Tabla de Posiciones', icon: IconTrophy, active: false },
    { label: 'Certificados Oficiales', icon: IconAward, active: false },
    { label: 'Configuración', icon: IconSettings, active: false },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 z-50">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="relative w-10 h-10 rounded-xl bg-[#182030] border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
            <Image
              src="/logo.png"
              alt="KodaAcademy Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tight bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              KodaAcademy
            </h1>
            <p className="text-xs text-slate-400">Aprende programando</p>
          </div>
        </div>

        {/* User Stats Pills */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-slate-850 border border-slate-800 rounded-lg p-2 flex flex-col items-center">
            <span className="flex items-center gap-1 text-xs text-orange-400 font-bold">
              <IconFlame size={13} className="fill-orange-400 animate-pulse" />
              {streak.current_streak}d
            </span>
            <span className="text-[10px] text-slate-400">Racha</span>
          </div>
          <div className="bg-slate-850 border border-slate-800 rounded-lg p-2 flex flex-col items-center">
            <span className="flex items-center gap-1 text-xs text-amber-400 font-bold">
              <IconBolt size={13} className="fill-amber-400" />
              {totalXp}
            </span>
            <span className="text-[10px] text-slate-400">XP</span>
          </div>
          <div className="bg-slate-850 border border-slate-800 rounded-lg p-2 flex flex-col items-center">
            <span className="flex items-center gap-1 text-xs text-indigo-400 font-bold">
              <IconShieldCheck size={13} />
              Nv.{level}
            </span>
            <span className="text-[10px] text-slate-400">Nivel</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  item.active
                    ? 'bg-gradient-to-r from-orange-500/15 to-transparent text-orange-400 border border-orange-500/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mascot Card */}
      <div className="bg-gradient-to-b from-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col items-center text-center relative overflow-hidden">
        <div className="w-full flex justify-center -my-2">
          <KodaMascot size={100} mood="idle" />
        </div>
        <p className="text-xs font-semibold text-slate-200 mt-1">¡Hola, programador!</p>
        <p className="text-[11px] text-slate-400">¿Listo para programar hoy?</p>
      </div>
    </aside>
  );
};
