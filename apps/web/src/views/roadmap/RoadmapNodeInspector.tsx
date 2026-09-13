'use client';

import React from 'react';
import { GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { IconBolt, IconLock, IconLockOpen, IconCheck, IconX, IconSparkles, IconCrosshair } from '@tabler/icons-react';
import gsap from 'gsap';

interface RoadmapNodeInspectorProps {
  node: GraphNode | null;
  onClose: () => void;
  onDeploy: (node: GraphNode) => void;
}

export function RoadmapNodeInspector({ node, onClose, onDeploy }: RoadmapNodeInspectorProps) {
  const cardRef = React.useRef<HTMLElement | null>(null);
  const { toggleNodeLock } = useRoadmapStore();

  // Animación de entrada holográfica usando GSAP
  React.useEffect(() => {
    if (!node || !cardRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 20,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.28,
          ease: 'power3.out',
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, [node]);

  if (!node) return null;

  const isUnlocked = node.isUnlocked;
  const isBoss = node.variant === 'boss';
  const isActive = node.variant === 'active';
  const isCompleted = node.variant === 'completed';

  return (
    <aside
      ref={cardRef}
      aria-label="Inspector de Telemetría Táctica"
      className="absolute bottom-16 right-6 z-30 w-80 sm:w-96 rounded-lg bg-slate-950/90 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] text-slate-100 overflow-hidden"
    >
      {/* HUD Scanner Top Bar with Telemetry & Quick Lock Switch */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-cyan-400">
          <IconCrosshair className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
          <span className="font-bold tracking-wider">DRONE SCANNER // {node.code}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => toggleNodeLock(node.id)}
            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 transition-all border ${
              isUnlocked
                ? 'bg-rose-950/40 border-rose-500/50 text-rose-300 hover:bg-rose-900/50'
                : 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/50'
            }`}
            title={isUnlocked ? 'Bloquear este módulo' : 'Desbloquear este módulo'}
          >
            {isUnlocked ? <IconLock className="w-3 h-3" /> : <IconLockOpen className="w-3 h-3" />}
            <span>{isUnlocked ? 'Bloquear' : 'Desbloquear'}</span>
          </button>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Cerrar Inspector"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Body Info */}
      <div className="p-5 space-y-4 font-mono">
        {/* Header Title & Status */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                isActive
                  ? 'bg-amber-400 animate-ping'
                  : isBoss
                    ? 'bg-rose-500 animate-pulse'
                    : isCompleted
                      ? 'bg-cyan-400'
                      : 'bg-slate-600'
              }`}
            />
            <span
              className={`text-[10px] tracking-widest uppercase font-bold ${
                isActive
                  ? 'text-amber-400'
                  : isBoss
                    ? 'text-rose-400'
                    : isCompleted
                      ? 'text-cyan-400'
                      : 'text-slate-400'
              }`}
            >
              {isBoss
                ? 'CHALLENGE GATE PROTOCOL'
                : isCompleted
                  ? 'SECTOR EXPLORADO'
                  : isActive
                    ? 'MISIÓN EN CURSO'
                    : 'FRECUENCIA BLOQUEADA'}
            </span>
          </div>
          <h3 className="text-lg font-bold font-sans tracking-tight text-white flex items-center gap-2">
            {node.label}
          </h3>
          {node.subtitle && (
            <p className="text-xs text-slate-400 mt-0.5 font-sans leading-relaxed">
              {node.subtitle}
            </p>
          )}
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded p-2.5">
            <span className="text-[10px] text-slate-400 block mb-0.5">RECOMPENSA XP</span>
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <IconSparkles className="w-3.5 h-3.5" />
              <span>+{node.xp || 150} XP</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded p-2.5">
            <span className="text-[10px] text-slate-400 block mb-0.5">ESTRELLAS</span>
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <span>★ {node.stars ?? 0} / {node.maxStars ?? 9}</span>
            </div>
          </div>
        </div>

        {/* Requirements / Status Box */}
        <div className="p-2.5 rounded bg-slate-900/40 border border-slate-800 text-[11px] space-y-1">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
            Requisito de Operación:
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            {isUnlocked ? (
              <>
                <IconCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Canal de telemetría sincronizado</span>
              </>
            ) : (
              <>
                <IconLock className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-rose-300">Requiere completar el sector anterior</span>
              </>
            )}
          </div>
        </div>

        {/* Action & Override Buttons */}
        <div className="space-y-2">
          {isUnlocked ? (
            <button
              onClick={() => onDeploy(node)}
              className={`w-full py-2.5 px-4 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                isBoss
                  ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-950/50'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black shadow-cyan-950/50'
              }`}
            >
              <IconBolt className="w-4 h-4 fill-current" />
              <span>{isBoss ? 'DESAFIAR APEX GATE →' : 'INICIAR PROTOCOLO →'}</span>
            </button>
          ) : (
            <div className="w-full py-2 px-3 rounded bg-slate-900/80 border border-rose-900/40 text-rose-400/80 text-center text-[10px] tracking-wide font-mono">
              [ ACCESO RESTRINGIDO POR EL SISTEMA ]
            </div>
          )}

          {/* Botón táctico para bloquear o desbloquear manualmente el nodo */}
          <button
            onClick={() => toggleNodeLock(node.id)}
            className={`w-full py-1.5 px-3 rounded text-[10px] font-mono uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all border ${
              isUnlocked
                ? 'bg-slate-900/60 hover:bg-rose-950/40 border-slate-700/60 hover:border-rose-500/50 text-slate-400 hover:text-rose-300'
                : 'bg-cyan-950/40 hover:bg-cyan-900/50 border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
            }`}
            title={isUnlocked ? 'Bloquear este módulo manualmente' : 'Desbloquear este módulo manualmente'}
          >
            {isUnlocked ? (
              <>
                <IconLock className="w-3 h-3 text-rose-400" />
                <span>Bloquear Módulo</span>
              </>
            ) : (
              <>
                <IconLockOpen className="w-3 h-3 text-cyan-400" />
                <span>Desbloquear Módulo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
