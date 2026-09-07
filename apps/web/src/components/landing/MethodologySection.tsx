'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  IconFlame,
  IconRoute,
  IconTerminal2,
  IconBulb,
  IconChevronDown,
} from '@tabler/icons-react';
import { MiniSkillTree } from './MiniSkillTree';
import { AnimatedCounter } from '@/components/ui/animated-counter';

export const MethodologySection: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="metodologia" className="bg-slate-950">
      {/* Cabecera Principal de Metodología: Hub de Transición Conectado */}
      <section className="pt-24 pb-20 md:pt-32 md:pb-28 relative overflow-hidden border-t border-slate-800/80 bg-gradient-to-b from-[#070b14] via-slate-950 to-slate-950">
        {/* Resplandor ambiental cálido de transición */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.14),rgba(245,158,11,0.05),transparent_70%)] blur-3xl pointer-events-none" />

        {/* Línea vertical de entrada y transición desde la sección anterior */}
        <div className="flex flex-col items-center mb-8 pointer-events-none">
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-amber-500/50 to-amber-400" />
          <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b] -mt-1 animate-pulse" />
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-12">
          {/* Textos principales */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4 max-w-3xl mx-auto"
          >
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]">
              ¿Por qué nuestro método{' '}
              <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                es el mejor
              </span>
              ?
            </h2>
            <p className="text-slate-400 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto font-sans">
              Cuatro principios diseñados para dominar la programación de verdad: constancia diaria, ruta clara, práctica activa y razonamiento guiado.
            </p>
          </motion.div>

          {/* Tira interactiva de los 4 pilares conectados (Pathway Hub) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-4xl mx-auto"
          >
            {/* Línea conectora horizontal sutil detrás de los 4 hitos en pantallas medianas/grandes */}
            <div className="hidden md:block absolute top-7 inset-x-16 h-[1px] border-t border-dashed border-slate-800 -z-10" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {/* Pilar 1: Rachas */}
              <button
                onClick={() => scrollTo('rachas')}
                className="group flex flex-col items-center text-center p-2 rounded-xl transition-all duration-300 cursor-pointer"
              >
                <div className="w-13 h-13 rounded-2xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-400 group-hover:scale-110 group-hover:border-orange-400 group-hover:bg-orange-500/20 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all duration-300 mb-2.5">
                  <IconFlame className="w-6 h-6" />
                </div>
                <span className="font-display text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  Rachas Diarias
                </span>
                <span className="text-xs text-slate-400 mt-0.5 font-sans">
                  15 min al día
                </span>
              </button>

              {/* Pilar 2: Roadmap */}
              <button
                onClick={() => scrollTo('roadmap')}
                className="group flex flex-col items-center text-center p-2 rounded-xl transition-all duration-300 cursor-pointer"
              >
                <div className="w-13 h-13 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:border-amber-400 group-hover:bg-amber-500/20 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 mb-2.5">
                  <IconRoute className="w-6 h-6" />
                </div>
                <span className="font-display text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  Roadmap Claro
                </span>
                <span className="text-xs text-slate-400 mt-0.5 font-sans">
                  Paso a paso
                </span>
              </button>

              {/* Pilar 3: Código Real */}
              <button
                onClick={() => scrollTo('codigo-real')}
                className="group flex flex-col items-center text-center p-2 rounded-xl transition-all duration-300 cursor-pointer"
              >
                <div className="w-13 h-13 rounded-2xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-400 group-hover:scale-110 group-hover:border-orange-400 group-hover:bg-orange-500/20 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all duration-300 mb-2.5">
                  <IconTerminal2 className="w-6 h-6" />
                </div>
                <span className="font-display text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  Código Real
                </span>
                <span className="text-xs text-slate-400 mt-0.5 font-sans">
                  Retención 4x
                </span>
              </button>

              {/* Pilar 4: Pistas */}
              <button
                onClick={() => scrollTo('pistas')}
                className="group flex flex-col items-center text-center p-2 rounded-xl transition-all duration-300 cursor-pointer"
              >
                <div className="w-13 h-13 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:border-amber-400 group-hover:bg-amber-500/20 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 mb-2.5">
                  <IconBulb className="w-6 h-6" />
                </div>
                <span className="font-display text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  Pistas Guiadas
                </span>
                <span className="text-xs text-slate-400 mt-0.5 font-sans">
                  Sin spoilers
                </span>
              </button>
            </div>
          </motion.div>

          {/* Guía conectora descendente hacia la Sección 01 */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center pt-4"
          >
            <button
              onClick={() => scrollTo('rachas')}
              className="inline-flex items-center gap-2 text-xs font-sans text-slate-400 hover:text-amber-400 transition-colors cursor-pointer group"
            >
              <span>Descubre cómo funciona</span>
              <IconChevronDown className="w-4 h-4 animate-bounce text-amber-400" />
            </button>
            <div className="w-[1px] h-10 bg-gradient-to-b from-amber-500/40 to-transparent mt-3" />
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          SECCIÓN 01: Rachas (Texto a la Izquierda / Stat a la Derecha)
          ========================================================= */}
      <section id="rachas" className="py-24 md:py-32 relative overflow-hidden border-t border-slate-900/80 bg-gradient-to-b from-slate-950 via-[#0d0f17] to-slate-950">
        {/* Resplandor ígneo ambiental de fondo */}
        <div className="absolute top-1/2 right-4 lg:right-20 -translate-y-1/2 w-[520px] h-[360px] bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.16),rgba(249,115,22,0.06),transparent_70%)] blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-orange-950/15 via-transparent to-transparent pointer-events-none" />

        {/* Ascuas vivas de fuego flotantes (Living Embers) */}
        <div className="absolute right-8 lg:right-28 bottom-6 w-72 h-72 pointer-events-none overflow-hidden select-none">
          <span className="absolute bottom-4 left-8 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-[emberRise_4.5s_ease-out_infinite]" style={{ animationDelay: '0s' }} />
          <span className="absolute bottom-2 left-24 w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_10px_#f97316] animate-[emberRise_5.2s_ease-out_infinite]" style={{ animationDelay: '1.2s' }} />
          <span className="absolute bottom-6 left-44 w-1 h-1 rounded-full bg-amber-300 shadow-[0_0_6px_#fbbf24] animate-[emberRise_3.8s_ease-out_infinite]" style={{ animationDelay: '2.1s' }} />
          <span className="absolute bottom-0 left-16 w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_#ea580c] animate-[emberRise_6s_ease-out_infinite]" style={{ animationDelay: '0.8s' }} />
          <span className="absolute bottom-5 left-36 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-[emberRise_4.8s_ease-out_infinite]" style={{ animationDelay: '3.3s' }} />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Texto Izquierda */}
            <motion.div
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-5 text-left"
            >
              <h3 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                Rachas que encienden tu hábito diario
              </h3>

              <p className="text-slate-400 text-base sm:text-lg lg:text-xl leading-relaxed font-sans max-w-xl">
                15 minutos al día son suficientes. La constancia diaria vence a cualquier maratón de fin de semana y convierte la programación en una segunda naturaleza.
              </p>
            </motion.div>

            {/* Métrica Derecha */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 flex flex-col items-start lg:items-end justify-center text-left lg:text-right space-y-2"
            >
              <AnimatedCounter
                to={15}
                suffix="m"
                duration={1.6}
                delay={0.2}
                className="font-display text-7xl sm:text-8xl lg:text-9xl font-black bg-gradient-to-br from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent leading-none select-none"
              />
              <span className="text-sm sm:text-base font-display font-bold text-white uppercase tracking-wider">
                Al día para crear el hábito
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECCIÓN 02: Roadmap (Invertido: Mini Skill Tree Izquierda / Texto Derecha)
          ========================================================= */}
      <section id="roadmap" className="py-24 md:py-32 relative overflow-hidden border-t border-slate-900/80 bg-gradient-to-b from-slate-950 via-[#0a0d16] to-slate-950">
        {/* Foco cenital de estudio fotográfico suave sobre el árbol (Estilo Apple / Linear) */}
        <div className="absolute -top-24 left-1/4 -translate-x-1/2 w-[650px] h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.14),rgba(245,158,11,0.03),transparent_70%)] blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-80 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 right-12 -translate-y-1/2 w-[450px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.05),transparent_70%)] blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Visual Skill Tree Teaser Izquierda */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 order-2 lg:order-1 flex justify-center lg:justify-start w-full"
            >
              <MiniSkillTree />
            </motion.div>

            {/* Texto Derecha */}
            <motion.div
              initial={{ opacity: 0, x: 35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 order-1 lg:order-2 space-y-5 text-left"
            >
              <h3 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                Un roadmap claro, paso a paso
              </h3>

              <p className="text-slate-400 text-base sm:text-lg lg:text-xl leading-relaxed font-sans max-w-xl">
                Sabes exactamente qué aprender hoy y qué sigue mañana. Una ruta secuencial estructurada desde las bases hasta escribir tus propios programas sin perderte en tutoriales infinitos.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECCIÓN 03: Código Real (Texto a la Izquierda / Stat 4X a la Derecha)
          ========================================================= */}
      <section id="codigo-real" className="py-24 md:py-32 relative overflow-hidden border-t border-slate-900/80 bg-gradient-to-b from-slate-950 via-[#100c19] to-slate-950">
        {/* Resplandor de compilador dual: Ámbar cálido y Violeta profundo */}
        <div className="absolute top-1/2 right-4 lg:right-20 -translate-y-1/2 w-[520px] h-[360px] bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.15),rgba(168,85,247,0.06),transparent_70%)] blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-10 -translate-y-1/2 w-[400px] h-[280px] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.08),transparent_70%)] blur-3xl pointer-events-none" />

        {/* Flujo de código de terminal continuo en segundo plano */}
        <div className="absolute inset-y-0 right-0 w-full sm:w-1/2 max-w-xl pointer-events-none overflow-hidden select-none opacity-[0.04] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
          <div className="font-mono text-[11px] text-amber-200 leading-6 space-y-1 animate-[codeStream_30s_linear_infinite]">
            <p>def solve_challenge(data: list) -&gt; bool:</p>
            <p>&nbsp;&nbsp;pivot = partition(data)</p>
            <p>&nbsp;&nbsp;return verify_runtime(pivot)</p>
            <p>async fn execute_sandbox() -&gt; Result:</p>
            <p>&nbsp;&nbsp;let mem = allocate(256);</p>
            <p>&nbsp;&nbsp;compile_and_run(mem).await</p>
            <p>const buffer = new Uint8Array(4096);</p>
            <p>while (pointer &lt; buffer.length) &#123;</p>
            <p>&nbsp;&nbsp;eval_bytecode(pointer++);</p>
            <p>&#125;</p>
            <p>// RETENCIÓN ACTIVA 4X</p>
            <p>assert(output.is_valid() === true);</p>
            <p>def solve_challenge(data: list) -&gt; bool:</p>
            <p>&nbsp;&nbsp;pivot = partition(data)</p>
            <p>&nbsp;&nbsp;return verify_runtime(pivot)</p>
            <p>async fn execute_sandbox() -&gt; Result:</p>
            <p>&nbsp;&nbsp;let mem = allocate(256);</p>
            <p>&nbsp;&nbsp;compile_and_run(mem).await</p>
            <p>const buffer = new Uint8Array(4096);</p>
            <p>while (pointer &lt; buffer.length) &#123;</p>
            <p>&nbsp;&nbsp;eval_bytecode(pointer++);</p>
            <p>&#125;</p>
            <p>// RETENCIÓN ACTIVA 4X</p>
            <p>assert(output.is_valid() === true);</p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Texto Izquierda */}
            <motion.div
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-5 text-left"
            >
              <h3 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                1 concepto = 1 reto en código real
              </h3>

              <p className="text-slate-400 text-base sm:text-lg lg:text-xl leading-relaxed font-sans max-w-xl">
                Nadie aprende a programar mirando videos pasivamente. Cada explicación dura 2 minutos y te reta a escribir y ejecutar código en vivo directamente en tu navegador.
              </p>
            </motion.div>

            {/* Métrica 4X Derecha */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 flex flex-col items-start lg:items-end justify-center text-left lg:text-right space-y-2"
            >
              <AnimatedCounter
                to={4}
                suffix="x"
                duration={1.2}
                delay={0.2}
                className="font-display text-7xl sm:text-8xl lg:text-9xl font-black bg-gradient-to-br from-amber-400 via-orange-400 to-orange-600 bg-clip-text text-transparent leading-none select-none"
              />
              <span className="text-sm sm:text-base font-display font-bold text-white uppercase tracking-wider">
                Mayor retención activa
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECCIÓN 04: Pistas Inteligentes (Centrado Amplio y Contundente)
          ========================================================= */}
      <section id="pistas" className="py-28 md:py-36 relative overflow-hidden border-t border-slate-900/80 bg-gradient-to-b from-slate-950 via-[#110e14] to-slate-950">
        {/* Resplandor solar dorado de claridad mental (Aura of Insight) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[480px] bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.16),rgba(245,158,11,0.06),transparent_70%)] blur-3xl pointer-events-none" />

        {/* Ondas concéntricas de pensamiento e insight (Synaptic Ripples) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[340px] pointer-events-none select-none">
          <div className="absolute top-1/2 left-1/2 w-[280px] h-[160px] rounded-full border border-amber-400/25 animate-[ripplePulse_4s_ease-out_infinite]" style={{ animationDelay: '0s' }} />
          <div className="absolute top-1/2 left-1/2 w-[440px] h-[240px] rounded-full border border-amber-400/20 animate-[ripplePulse_4s_ease-out_infinite]" style={{ animationDelay: '1.3s' }} />
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[320px] rounded-full border border-amber-400/15 animate-[ripplePulse_4s_ease-out_infinite]" style={{ animationDelay: '2.6s' }} />
        </div>

        {/* Partículas de polvo estelar / bokeh dorado flotando */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <span className="absolute top-1/4 left-1/5 w-1.5 h-1.5 rounded-full bg-amber-400/40 blur-[0.5px] animate-pulse" />
          <span className="absolute top-3/4 left-1/3 w-1 h-1 rounded-full bg-amber-300/35 animate-pulse" style={{ animationDuration: '3s' }} />
          <span className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-yellow-400/35 animate-pulse" style={{ animationDuration: '4s' }} />
          <span className="absolute bottom-1/4 right-1/3 w-2 h-2 rounded-full bg-amber-400/25 blur-[1px] animate-pulse" style={{ animationDuration: '5s' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6 relative"
        >
          <h3 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] max-w-3xl mx-auto">
            Pistas que te enseñan a pensar, no spoilers
          </h3>

          <p className="text-slate-400 text-base sm:text-xl leading-relaxed font-sans max-w-2xl mx-auto">
            Si te equivocas, Koda no te regala la respuesta ni te deja frustrado con un error incomprensible. Te orienta con preguntas guía para que descubras la lógica por ti mismo y pienses como ingeniero.
          </p>

          <div className="pt-4 max-w-md mx-auto">
            <p className="text-xs sm:text-sm font-sans italic text-slate-400/80 border-t border-slate-900 pt-4">
              "El objetivo no es que copies código, es que entiendas cómo resolverlo."
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default MethodologySection;
