import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, LogIn } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';
import { Magnetic } from '@/components/ui/magnetic';

export const HeroCtaGroup: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="pt-2 flex flex-col items-center lg:items-start gap-3.5 w-full sm:w-auto transform-gpu"
    >
      <Magnetic className="w-full sm:w-72 max-w-xs sm:max-w-none">
      <GradientButton
        asChild
        size="lg"
        className="w-full gap-2.5 px-8 py-4 text-base justify-center group"
      >
        <Link href="/register" aria-label="Comenzar ahora gratis en Koda">
          Comenzar Ahora
          <ArrowRight
            aria-hidden="true"
            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5"
          />
        </Link>
      </GradientButton>
      </Magnetic>

      <GradientButton
        asChild
        variant="secondary"
        size="lg"
        className="w-full sm:w-72 max-w-xs sm:max-w-none gap-2.5 px-8 py-4 text-base justify-center font-bold border border-slate-700/80 hover:border-amber-400/50 group"
      >
        <Link href="/login" aria-label="Entrar a mi cuenta de Koda">
          <LogIn
            aria-hidden="true"
            className="w-5 h-5 text-amber-400/90 transition-transform duration-300 group-hover:scale-110"
          />
          Ya tengo una cuenta
        </Link>
      </GradientButton>

      <p className="text-xs sm:text-sm text-slate-400">
        Gratis · Sin instalación · Python 3.12 · +10 XP por sección
      </p>
    </motion.div>
  );
};
