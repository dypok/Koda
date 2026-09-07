import React from 'react';
import { motion } from 'framer-motion';
import { IconCheck } from '@tabler/icons-react';

const TRUST_POINTS = [
  '100% Gratuito',
  'Sin tarjeta ni suscripción',
  'Práctica en navegador',
];

export const CtaTrustPoints: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: false, margin: '-30px' }}
    transition={{ duration: 0.6, delay: 0.35 }}
    className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-sans font-medium"
  >
    {TRUST_POINTS.map((text) => (
      <span key={text} className="flex items-center gap-1.5">
        <IconCheck className="w-4 h-4 text-orange-400" />
        {text}
      </span>
    ))}
  </motion.div>
);
