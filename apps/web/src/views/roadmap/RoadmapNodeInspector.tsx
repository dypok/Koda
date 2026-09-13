'use client';

import React from 'react';
import { GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { Bolt, Lock, LockOpen, Check, X, Sparkles, Crosshair } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import gsap from 'gsap';

interface RoadmapNodeInspectorProps {
  node: GraphNode | null;
  onClose: () => void;
  onDeploy: (node: GraphNode) => void;
}

export function RoadmapNodeInspector({ node, onClose, onDeploy }: RoadmapNodeInspectorProps) {
  const cardRef = React.useRef<HTMLElement | null>(null);
  const { toggleNodeLock, unlockingNodeId, getCurrentDataset, setActiveNode } = useRoadmapStore();
  const unlocking = unlockingNodeId === node?.id;
  const dataset = getCurrentDataset();

  // Buscar nodo prerrequisito y nodo siguiente en el DAG
  const prevConn = dataset.connections.find((c) => c.toId === node?.id);
  const prevNode = prevConn ? dataset.nodes.find((n) => n.id === prevConn.fromId) : null;

  const nextConn = dataset.connections.find((c) => c.fromId === node?.id);
  const nextNode = nextConn ? dataset.nodes.find((n) => n.id === nextConn.toId) : null;

  const handleLockToggle = () => {
    if (!node || unlocking) return;
    toggleNodeLock(node.id);
  };

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
  const starsEarned = node.stars ?? 0;

  return (
    <aside
      ref={cardRef}
      aria-label="Inspector de Telemetría Táctica"
      className="absolute bottom-16 right-6 z-30 w-84 sm:w-96 rounded-xl bg-slate-950/95 border border-cyan-500/40 backdrop-blur-2xl shadow-[0_0_35px_rgba(0,0,0,0.85)] text-slate-100 overflow-hidden font-mono"
    >
      {/* Marcadores de calibración Mil-Spec en las esquinas */}
      <span className="absolute top-1 left-1.5 text-[8px] text-cyan-500/40 pointer-events-none">[ + ]</span>
      <span className="absolute top-1 right-1.5 text-[8px] text-cyan-500/40 pointer-events-none">[ + ]</span>

      {/* Línea de escaneo láser al cambiar de nodo */}
      <div
        key={`scan-${node.id}`}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-[linear-gradient(to_bottom,transparent,rgba(34,211,238,0.22),transparent)] animate-[scanline_0.7s_ease-out_forwards]"
      />

      {/* HUD Scanner Top Bar con Sonar Radar 360° */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/90 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-cyan-400">
          {/* Sonar Radar SVG 360° */}
          <div className="relative w-4 h-4 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <circle cx="12" cy="12" r="10" fill="none" stroke="#0891B2" strokeWidth="1" strokeOpacity="0.4" />
              <circle cx="12" cy="12" r="6" fill="none" stroke="#06B6D4" strokeWidth="1" strokeOpacity="0.6" />
              <g className="animate-spin" style={{ transformOrigin: 'center', animationDuration: '2.5s' }}>
                <line x1="12" y1="12" x2="22" y2="12" stroke="#22D3EE" strokeWidth="1.5" strokeLinecap="round" />
              </g>
              <circle cx="15" cy="9" r="1.5" fill="#34D399" className="animate-ping" />
            </svg>
          </div>
          <span className="font-bold tracking-wider text-[11px]">DRONE SCANNER // {node.code}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleLockToggle}
            disabled={unlocking}
            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 transition-all border cursor-pointer ${
              isUnlocked
                ? 'bg-rose-950/40 border-rose-500/50 text-rose-300 hover:bg-rose-900/50'
                : 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
            }`}
            title={isUnlocked ? 'Bloquear este módulo' : 'Desbloquear este módulo'}
          >
            {isUnlocked ? <Lock aria-hidden="true" className="w-3 h-3" /> : <LockOpen aria-hidden="true" className="w-3 h-3" />}
            <span>{isUnlocked ? 'Bloquear' : unlocking ? 'Desbloqueando…' : 'Desbloquear'}</span>
          </button>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Cerrar Inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Body Info */}
      <div className="p-4 space-y-3.5">
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
          <h3 className="text-base sm:text-lg font-bold font-sans tracking-tight text-white flex items-center gap-2">
            {node.label}
          </h3>
          {node.subtitle && (
            <p className="text-xs text-slate-400 mt-0.5 font-sans leading-relaxed">
              {node.subtitle}
            </p>
          )}
        </div>

        {/* Micro-Diagrama DAG de Dependencias (Linaje Táctico) */}
        <div className="p-2 rounded bg-slate-900/60 border border-slate-800 text-[10px] flex items-center justify-between">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Linaje DAG:</div>
          <div className="flex items-center gap-1.5">
            {prevNode ? (
              <button
                type="button"
                onClick={() => setActiveNode(prevNode.id)}
                className="px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-cyan-950/60 hover:text-cyan-300 border border-slate-700/60 transition-colors text-[9px] cursor-pointer"
                title={`Ir al requisito anterior: ${prevNode.label}`}
              >
                RQ: {prevNode.code}
              </button>
            ) : (
              <span className="text-slate-600 text-[9px]">Raíz</span>
            )}
            <span className="text-cyan-500 font-bold">➔</span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 font-bold text-[9px]">
              {node.code}
            </span>
            <span className="text-slate-600 font-bold">➔</span>
            {nextNode ? (
              <button
                type="button"
                onClick={() => setActiveNode(nextNode.id)}
                className="px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-cyan-950/60 hover:text-cyan-300 border border-slate-700/60 transition-colors text-[9px] cursor-pointer"
                title={`Ver siguiente desbloqueo: ${nextNode.label}`}
              >
                {nextNode.code}
              </button>
            ) : (
              <span className="text-slate-600 text-[9px]">Fin</span>
            )}
          </div>
        </div>

        {/* Telemetry Metrics & Plasma Star Prisms */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded p-2.5">
            <span className="text-[10px] text-slate-400 block mb-0.5">RECOMPENSA XP</span>
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Sparkles aria-hidden="true" className="w-3.5 h-3.5" />
              <span className="flex items-center">
                +<AnimatedCounter to={node.xp || 150} duration={0.6} />&nbsp;XP
              </span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded p-2.5">
            <span className="text-[10px] text-slate-400 block mb-1">PRISMAS ESTELARES</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((starIndex) => {
                const isEarned = starsEarned >= starIndex;
                return (
                  <div
                    key={starIndex}
                    title={
                      starIndex === 1
                        ? '★1: Quiz Conceptual'
                        : starIndex === 2
                          ? '★2: Práctica de Código'
                          : '★3: Desafío sin Pistas'
                    }
                    className={`h-5 flex-1 rounded border flex items-center justify-center text-[10px] font-bold transition-all ${
                      isEarned
                        ? 'bg-amber-500/20 border-amber-400/80 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                        : 'bg-slate-950 border-slate-800 text-slate-600'
                    }`}
                  >
                    ★
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Requirements Box */}
        <div className="p-2.5 rounded bg-slate-900/40 border border-slate-800 text-[11px] space-y-1">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
            Requisito de Operación:
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            {isUnlocked ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Canal de telemetría sincronizado</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-rose-400" />
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
              className={`w-full py-2.5 px-4 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                isBoss
                  ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-950/50'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black shadow-cyan-950/50'
              }`}
            >
              <Bolt className="w-4 h-4 fill-current" />
              <span>{isBoss ? 'DESAFIAR APEX GATE →' : 'INICIAR PROTOCOLO →'}</span>
            </button>
          ) : (
            <div className="w-full py-2 px-3 rounded bg-slate-900/80 border border-rose-900/40 text-rose-400/80 text-center text-[10px] tracking-wide font-mono">
              [ ACCESO RESTRINGIDO POR EL SISTEMA ]
            </div>
          )}

          {/* Botón táctico para alternar bloqueo manual */}
          <button
            onClick={handleLockToggle}
            disabled={unlocking}
            className={`w-full py-1.5 px-3 rounded text-[10px] font-mono uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
              isUnlocked
                ? 'bg-slate-900/60 hover:bg-rose-950/40 border-slate-700/60 hover:border-rose-500/50 text-slate-400 hover:text-rose-300'
                : 'bg-cyan-950/40 hover:bg-cyan-900/50 border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
            }`}
            title={isUnlocked ? 'Bloquear este módulo manualmente' : 'Desbloquear este módulo manualmente'}
          >
            {isUnlocked ? (
              <>
                <Lock aria-hidden="true" className="w-3 h-3 text-rose-400" />
                <span>Bloquear Módulo</span>
              </>
            ) : (
              <>
                <LockOpen aria-hidden="true" className="w-3 h-3 text-cyan-400" />
                <span>{unlocking ? 'Desbloqueando…' : 'Desbloquear Módulo'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
