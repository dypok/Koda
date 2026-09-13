import React from 'react';
import Link from 'next/link';
import { TransitionLink } from '@/components/ui/transition-link';
import { motion, useReducedMotion } from 'framer-motion';
import { LogIn, Rocket } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';
import { Magnetic } from '@/components/ui/magnetic';

export const CtaActions: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
  <motion.div
    initial={reduceMotion ? false : { opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.65, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
    className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4"
  >
    <Magnetic className="w-full sm:w-auto">
    <GradientButton
      asChild
      size="lg"
      className="w-full px-8 py-3.5 text-base gap-2.5"
    >
      <TransitionLink href="/register" aria-label="Comenzar ahora gratis en Koda">
        <Rocket aria-hidden="true" className="w-5 h-5" />
        Comenzar Ahora — Es Gratis
      </TransitionLink>
    </GradientButton>
    </Magnetic>

    <GradientButton
      asChild
      variant="secondary"
      size="lg"
      className="w-full sm:w-auto px-8 py-3.5 text-base font-bold gap-2.5 border border-slate-700/80 hover:border-amber-400/50 group"
    >
      <Link href="/login" aria-label="Entrar a mi cuenta de Koda">
        <LogIn aria-hidden="true" className="w-5 h-5 text-amber-400 transition-transform duration-300 group-hover:scale-110" />
        Ya tengo una cuenta
      </Link>
    </GradientButton>
  </motion.div>
  );
};
