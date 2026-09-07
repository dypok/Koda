import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/animated-counter';

export const LiveCodeSection: React.FC = () => (
  <section id="codigo-real" className="py-24 md:py-32 relative overflow-hidden border-t border-slate-900/80 bg-gradient-to-b from-slate-950 via-[#100c19] to-slate-950">
    <div className="absolute top-1/2 right-4 lg:right-20 -translate-y-1/2 w-[520px] h-[360px] bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.15)_0%,rgba(168,85,247,0.05)_45%,transparent_70%)] pointer-events-none transform-gpu contain-paint" />
    <div className="absolute top-1/2 left-10 -translate-y-1/2 w-[400px] h-[280px] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.08)_0%,transparent_70%)] pointer-events-none transform-gpu contain-paint" />

    {/* Flujo de código de terminal continuo (GPU Layer) */}
    <div className="absolute inset-y-0 right-0 w-full sm:w-1/2 max-w-xl pointer-events-none overflow-hidden select-none opacity-[0.04] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
      <div className="font-mono text-[11px] text-amber-200 leading-6 space-y-1 animate-code-stream transform-gpu will-change-transform">
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
        <motion.div
          initial={{ opacity: 0, x: -35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: '-40px' }}
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

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, margin: '-40px' }}
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
);
