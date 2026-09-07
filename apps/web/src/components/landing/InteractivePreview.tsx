'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  IconGift,
  IconTrophy,
  IconTerminal2,
  IconPlayerPlay,
  IconSparkles,
  IconCheck,
  IconLoader2,
} from '@tabler/icons-react';
import { BorderGlow } from '@/components/ui/border-glow';

interface CodeSnippet {
  id: 'universal' | 'javascript' | 'python';
  label: string;
  filename: string;
  code: string[];
  output: string;
}

const SNIPPETS: CodeSnippet[] = [
  {
    id: 'universal',
    label: 'Lógica Universal',
    filename: 'algoritmo.koda',
    code: [
      '// Reto 01: Retorno de valor y lógica pura',
      'funcion validarProgreso(diasRacha, xp) {',
      '  si (diasRacha >= 15) {',
      '    retornar "Retención 4x activada • Nivel " + (xp / 100);',
      '  }',
      '  retornar "Sigue practicando hoy";',
      '}',
      '',
      'imprimir(validarProgreso(15, 450));',
    ],
    output: 'Retención 4x activada • Nivel 4',
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    filename: 'main.js',
    code: [
      '// Reto 01: Práctica activa en tiempo real',
      'function validarProgreso(diasRacha, xp) {',
      '  if (diasRacha >= 15) {',
      '    return `Retención 4x activada • Nivel ${Math.floor(xp / 100)}`;',
      '  }',
      '  return "Sigue practicando hoy";',
      '}',
      '',
      'console.log(validarProgreso(15, 450));',
    ],
    output: 'Retención 4x activada • Nivel 4',
  },
  {
    id: 'python',
    label: 'Python',
    filename: 'main.py',
    code: [
      '# Reto 01: Ejecución directa en navegador',
      'def validar_progreso(dias_racha: int, xp: int) -> str:',
      '    if dias_racha >= 15:',
      '        return f"Retención 4x activada • Nivel {xp // 100}"',
      '    return "Sigue practicando hoy"',
      '',
      'print(validar_progreso(15, 450))',
    ],
    output: 'Retención 4x activada • Nivel 4',
  },
];

const VALUE_PILLARS = [
  {
    number: '01',
    title: '100% Gratuito',
    description:
      'Educación tecnológica de alta calidad accesible para todos. Acceso libre a lecciones, retos y proyectos sin costo alguno.',
    icon: IconGift,
    color: 'from-orange-500/20 to-amber-500/10',
    borderColor: 'border-orange-500/30 group-hover:border-orange-500/60',
    iconColor: 'text-orange-400',
    badge: 'Sin costo ni muros de pago',
  },
  {
    number: '02',
    title: 'Los Mejores Resultados',
    description:
      'La práctica deliberada con código real genera una retención hasta 4x superior a mirar tutoriales pasivos en video.',
    icon: IconTrophy,
    color: 'from-amber-500/20 to-yellow-500/10',
    borderColor: 'border-amber-500/30 group-hover:border-amber-500/60',
    iconColor: 'text-amber-400',
    badge: 'Retención activa 4x',
  },
  {
    number: '03',
    title: 'Código Real en Vivo',
    description:
      'Consola y motor de ejecución en tu navegador. Comprueba de inmediato el funcionamiento de tu lógica sin instalaciones.',
    icon: IconTerminal2,
    color: 'from-orange-600/20 to-rose-500/10',
    borderColor: 'border-orange-500/30 group-hover:border-orange-500/60',
    iconColor: 'text-orange-400',
    badge: 'Ejecución en navegador',
  },
];

export const InteractivePreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'universal' | 'javascript' | 'python'>('universal');
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(true);

  const currentSnippet = SNIPPETS.find((s) => s.id === activeTab) || SNIPPETS[0];

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 280);
  };

  const handleSelectTab = (id: 'universal' | 'javascript' | 'python') => {
    setActiveTab(id);
    setHasRun(true);
  };

  return (
    <section
      id="propuesta-valor"
      className="py-24 md:py-32 relative overflow-hidden border-t border-slate-900/80 bg-gradient-to-b from-slate-950 via-[#080d1a] to-slate-950"
    >
      {/* Resplandor ambiental de fondo cálido */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[520px] bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.13),rgba(245,158,11,0.04),transparent_70%)] blur-3xl pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-orange-950/10 via-transparent to-transparent pointer-events-none" />

      {/* Línea sutil superior de horizonte */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />

      {/* Rejilla cibernética tenue integrada al flujo visual */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_80%)]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(245, 158, 11, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(245, 158, 11, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Estructura Split-Screen en Grid de 12 Columnas (Misma estructura de las demás secciones) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* =========================================================
              COLUMNA IZQUIERDA: Narrativa Editorial & Secuencia de Pilares
              ========================================================= */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Cabecera de la sección */}
            <motion.div
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: '-40px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold tracking-wider uppercase">
                <IconSparkles className="w-3.5 h-3.5 text-amber-400" />
                Propuesta de Valor Oficial
              </div>

              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                Aprende{' '}
                <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                  100% gratis
                </span>{' '}
                con los mejores resultados
              </h2>

              <p className="text-slate-400 text-base sm:text-lg lg:text-xl leading-relaxed font-sans max-w-xl">
                Sin suscripciones ocultas ni muros de pago. Un método interactivo de micro-lecciones y práctica deliberada diseñado para que domines la lógica de programación y alcances tu máximo potencial.
              </p>
            </motion.div>

            {/* Secuencia de 3 Pilares en Stack Vertical */}
            <div className="space-y-4 relative">
              {/* Línea conectora sutil vertical de la secuencia */}
              <div className="absolute left-[26px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-orange-500/40 via-amber-500/25 to-orange-500/10 hidden sm:block pointer-events-none" />

              {VALUE_PILLARS.map((pillar, idx) => {
                const IconComponent = pillar.icon;
                return (
                  <motion.div
                    key={pillar.number}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: '-40px' }}
                    transition={{
                      duration: 0.65,
                      delay: 0.15 + idx * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`group relative rounded-2xl border ${pillar.borderColor} bg-slate-900/50 backdrop-blur-md p-5 sm:p-6 transition-all duration-300 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-orange-500/5`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Número & Icono */}
                      <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 group-hover:border-amber-500/50 transition-colors shadow-sm">
                        <IconComponent className={`w-6 h-6 ${pillar.iconColor} transition-transform duration-300 group-hover:scale-110`} />
                        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-bold text-slate-950 shadow-sm">
                          {pillar.number}
                        </span>
                      </div>

                      {/* Contenido textual exacto */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
                            {pillar.title}
                          </h3>
                          <span className="text-[11px] font-semibold text-amber-400/90 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                            {pillar.badge}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* =========================================================
              COLUMNA DERECHA: Consola Interactiva de Código en Vivo (Sandbox)
              ========================================================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, margin: '-40px' }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-center w-full"
          >
            <BorderGlow
              borderRadius={22}
              backgroundColor="#090d18"
              glowColor="28 95 60"
              colors={['#F97316', '#F59E0B', '#EA580C']}
              className="w-full shadow-2xl"
              contentClassName="rounded-[21px] p-5 sm:p-6 flex flex-col gap-4"
            >
              {/* Header de la Consola con pestañas de lenguajes */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                {/* Botones de ventana macOS */}
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="text-xs font-mono text-slate-400 ml-2">
                    {currentSnippet.filename}
                  </span>
                </div>

                {/* Tabs de Selección de Lenguaje */}
                <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
                  {SNIPPETS.map((snippet) => (
                    <button
                      key={snippet.id}
                      onClick={() => handleSelectTab(snippet.id)}
                      className={`px-2.5 py-1 text-xs rounded-md font-sans transition-all cursor-pointer ${
                        activeTab === snippet.id
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {snippet.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor de Código */}
              <div className="bg-[#060911] rounded-xl p-4 font-mono text-xs leading-relaxed border border-slate-800/60 overflow-x-auto min-h-[170px] select-text">
                {currentSnippet.code.map((line, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-slate-600 select-none text-right w-4 font-mono text-[11px]">
                      {i + 1}
                    </span>
                    <span
                      className={`${
                        line.startsWith('//') || line.startsWith('#')
                          ? 'text-slate-500 italic'
                          : line.includes('function') ||
                            line.includes('funcion') ||
                            line.includes('def')
                          ? 'text-amber-400 font-semibold'
                          : line.includes('return') || line.includes('retornar')
                          ? 'text-orange-400'
                          : line.includes('console.log') ||
                            line.includes('imprimir') ||
                            line.includes('print')
                          ? 'text-cyan-400'
                          : 'text-slate-300'
                      }`}
                    >
                      {line}
                    </span>
                  </div>
                ))}
              </div>

              {/* Barra de Acción: Botón Ejecutar */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500 font-sans">
                  Ejecución directa en WebAssembly
                </span>
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-display font-bold text-xs shadow-md shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-75"
                >
                  {isRunning ? (
                    <>
                      <IconLoader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Ejecutando...</span>
                    </>
                  ) : (
                    <>
                      <IconPlayerPlay className="w-3.5 h-3.5 fill-current" />
                      <span>Ejecutar Código</span>
                    </>
                  )}
                </button>
              </div>

              {/* Consola de Salida en Vivo */}
              <div className="bg-black/60 rounded-xl p-3.5 border border-slate-800/90 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 pb-1.5 border-b border-slate-800/70 text-[11px]">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Consola del Navegador
                  </span>
                  <span className="text-slate-500 text-[10px]">Latencia: 12ms</span>
                </div>

                {hasRun && (
                  <div className="space-y-1">
                    <p className="text-emerald-400 font-semibold flex items-center gap-1.5 text-xs">
                      <IconCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      Resultado de ejecución:
                    </p>
                    <p className="text-amber-200 text-xs font-mono bg-slate-950/80 px-2.5 py-1.5 rounded border border-slate-800/80">
                      &gt; {currentSnippet.output}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 border-t border-slate-800/50">
                  <span className="text-amber-400 font-semibold">Costo: $0.00</span>
                  <span>Sin instalaciones</span>
                  <span className="text-emerald-400">100% Interactivo</span>
                </div>
              </div>
            </BorderGlow>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InteractivePreview;

