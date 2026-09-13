import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';

const TRUST_POINTS = [
  '100% Gratuito',
  'Sin tarjeta ni suscripción',
  'Práctica en navegador',
];

export const CtaTrustPoints: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
  <motion.div
    initial={reduceMotion ? false : { opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, margin: '-30px' }}
    transition={{ duration: 0.6, delay: 0.35 }}
    className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-sans font-medium"
  >
    {TRUST_POINTS.map((text) => (
      <span key={text} className="flex items-center gap-1.5">
        <Check aria-hidden="true" className="w-4 h-4 text-orange-400" />
        {text}
      </span>
    ))}
  </motion.div>
  );
};
