'use client';

import React from 'react';
import {
  IconBatteryCharging,
  IconHierarchy2,
  IconDeviceDesktopCode,
  IconPuzzle,
  IconCheck,
  IconLock,
  IconSparkles,
} from '@tabler/icons-react';

export const MethodologySection: React.FC = () => {
  return (
    <section id="metodologia" className="py-24 md:py-36 bg-slate-950 relative overflow-hidden border-t border-slate-850">
      {/* Luces ambientales sutiles en el fondo */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Encabezado Principal */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20 md:mb-28">
          <span className="text-xs font-mono uppercase tracking-widest text-orange-400 font-semibold px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
            El Sistema Koda
          </span>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            ¿Por qué nuestro método{' '}
            <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              es el mejor
            </span>
            ?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-sans">
            La mayoría de personas abandona la programación por falta de hábito o por perderse en tutoriales infinitos. Diseñamos un sistema que resuelve ambos problemas desde la raíz.
          </p>
        </div>

        {/* =========================================================
            BLOQUE 1: Ecosistema de Hábito y Ruta (Rachas + Roadmap)
            ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pb-24 border-b border-slate-850">
          {/* Narrativa (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Pilar 01 · Constancia y Dirección
            </div>

            <h3 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              Construye el hábito diario con un mapa donde siempre sabes qué sigue
            </h3>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-sans">
              Aprender a programar es como entrenar un músculo: 15 minutos al día superan por completo a un atracón de fin de semana. En Koda tienes una ruta paso a paso que elimina la parálisis y protege tu constancia día a día.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 shrink-0 mt-0.5">
                  <IconBatteryCharging className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Rachas que recargan tu motivación</h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Micro-sesiones de 10 a 15 minutos diseñadas para que no rompas la cadena y consolides el aprendizaje en memoria a largo plazo.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                  <IconHierarchy2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Roadmap secuencial sin saltos al vacío</h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Cada lección desbloquea la siguiente en orden lógico. Sabes exactamente qué aprender hoy, qué sigue mañana y hacia dónde te diriges.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Integrado en la Página: Racha + Árbol de Habilidades (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden shadow-2xl shadow-black/40">
            {/* Header del visualizador */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                <span className="font-mono text-xs text-slate-300 font-semibold">Tu Progreso Diario</span>
              </div>
              <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full font-bold">
                🔥 5 Días Seguidos
              </span>
            </div>

            {/* Streak Tracker semanal */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Racha Semanal Activa</span>
                <span className="text-orange-400 font-bold">+15 min hoy completados</span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {[
                  { day: 'Lun', active: true },
                  { day: 'Mar', active: true },
                  { day: 'Mié', active: true },
                  { day: 'Jue', active: true },
                  { day: 'Vie', active: true },
                  { day: 'Sáb', active: false },
                  { day: 'Dom', active: false },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`py-3 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${
                      item.active
                        ? 'bg-gradient-to-b from-orange-500/20 to-amber-500/10 border-orange-500/40 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.15)]'
                        : 'bg-slate-950/60 border-slate-850 text-slate-600'
                    }`}
                  >
                    <span className="text-[11px] font-mono uppercase font-bold">{item.day}</span>
                    {item.active ? (
                      <span className="text-xs">🔥</span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Roadmap Tree visual preview */}
            <div className="space-y-3 pt-6 border-t border-slate-800/80">
              <span className="text-xs font-mono text-slate-400 block">Ruta Guiada del Track</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Node 1 */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-orange-500/40 space-y-1 relative">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] text-orange-400 font-bold">NIVEL 01</span>
                    <IconCheck className="w-4 h-4 text-orange-400" />
                  </div>
                  <p className="text-xs font-bold text-white">Variables & Tipos</p>
                  <span className="text-[10px] text-orange-400/90 font-mono">100% Superado</span>
                </div>

                {/* Node 2 */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/50 space-y-1 relative shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] text-amber-400 font-bold">NIVEL 02</span>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  </div>
                  <p className="text-xs font-bold text-white">Control de Flujo</p>
                  <span className="text-[10px] text-amber-300 font-mono">En progreso (3/4)</span>
                </div>

                {/* Node 3 */}
                <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-850 space-y-1 opacity-60">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono text-[10px]">NIVEL 03</span>
                    <IconLock className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs font-bold text-slate-400">Funciones & Retos</p>
                  <span className="text-[10px] text-slate-500 font-mono">Desbloquea al completar 02</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            BLOQUE 2: Ecosistema de Práctica y Razonamiento (Código Real + Pistas)
            ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pt-24">
          {/* Visual Integrado en la Página: Terminal de Código + Pista Guiada (7 cols) */}
          <div className="lg:col-span-7 order-2 lg:order-1 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden shadow-2xl shadow-black/40">
            {/* Header del Editor */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-slate-400 ml-2">reto_descuento.py</span>
              </div>
              <span className="text-slate-500 text-[11px]">Runtime en Navegador</span>
            </div>

            {/* Código en vivo */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-850 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed mb-4 overflow-x-auto">
              <span className="text-slate-500 block mb-1"># Reto: calcular precio final con descuento</span>
              <div>
                <span className="text-amber-400">def</span> <span className="text-orange-300">calcular_total</span>(precio, desc):
              </div>
              <div className="pl-4 text-slate-300">
                descuento = precio * (desc / <span className="text-orange-400">100</span>)
              </div>
              <div className="pl-4 text-slate-300">
                <span className="text-amber-400">return</span> precio - descuento
              </div>
            </div>

            {/* Resultado de Test */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-xs font-mono mb-4 text-orange-300">
              <div className="flex items-center gap-2">
                <IconCheck className="w-4 h-4 text-orange-400 shrink-0" />
                <span>calcular_total(100, 20) → 80.0</span>
              </div>
              <span className="text-orange-400 font-bold font-sans">✓ Test Aprobado</span>
            </div>

            {/* Asistente Koda: Pista pedagógica */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/25 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <IconPuzzle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Mentor Pedagógico Koda</span>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                    Sin Spoilers
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  "¡Gran razonamiento! Para el siguiente nivel, ¿qué sucedería si el porcentaje es mayor a 100? Piensa en esa validación antes de continuar."
                </p>
              </div>
            </div>
          </div>

          {/* Narrativa (5 cols) */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-8">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Pilar 02 · Práctica y Razonamiento
            </div>

            <h3 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              Aprende programando desde el primer minuto y entrena tu lógica
            </h3>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-sans">
              Nadie aprende a nadar leyendo un manual ni a programar mirando videos pasivamente. En Koda cada lección dura menos de 2 minutos y te pide escribir y ejecutar código real de inmediato.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 shrink-0 mt-0.5">
                  <IconDeviceDesktopCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">1 Concepto = 1 Reto interactivo</h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Escribir y ejecutar código en vivo genera una retención hasta 4 veces superior a cualquier video pasivo.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                  <IconPuzzle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Pistas inteligentes que te enseñan a pensar</h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Cuando te equivocas, Koda no te regala la respuesta ni te deja frustrado: te hace preguntas orientadoras para que entrenes tu mente de ingeniero.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;
