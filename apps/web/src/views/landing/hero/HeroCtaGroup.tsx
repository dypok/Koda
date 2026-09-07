import React from 'react';
import { motion } from 'framer-motion';
import { IconArrowRight, IconLogin } from '@tabler/icons-react';
import { GradientButton } from '@/components/ui/gradient-button';

export const HeroCtaGroup: React.FC<{ onOpenLogin?: () => void }> = ({ onOpenLogin }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, amount: 0.2 }}
    transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
    className="pt-2 flex flex-col items-center lg:items-start gap-3.5 w-full sm:w-auto transform-gpu"
  >
    <GradientButton
      onClick={onOpenLogin}
      size="lg"
      className="w-full sm:w-72 max-w-xs sm:max-w-none gap-2.5 px-8 py-4 text-base shadow-none justify-center font-black group"
    >
      Comenzar Ahora
      <IconArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
    </GradientButton>

    <GradientButton
      onClick={onOpenLogin}
      variant="secondary"
      size="lg"
      className="w-full sm:w-72 max-w-xs sm:max-w-none gap-2.5 px-8 py-4 text-base shadow-none justify-center font-bold border border-slate-700/80 hover:border-amber-400/50 group"
    >
      <IconLogin className="w-5 h-5 text-amber-400/90 transition-transform duration-300 group-hover:scale-110" />
      Ya tengo una cuenta
    </GradientButton>
  </motion.div>
);
