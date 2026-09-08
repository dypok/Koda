import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IconLogin, IconRocket } from '@tabler/icons-react';
import { GradientButton } from '@/components/ui/gradient-button';

export const CtaActions: React.FC<{ onOpenLogin?: () => void }> = ({ onOpenLogin }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, margin: '-40px' }}
    transition={{ duration: 0.65, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
    className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4"
  >
    <GradientButton
      asChild
      size="lg"
      className="w-full sm:w-auto px-8 py-3.5 text-base gap-2.5"
    >
      <Link href="/register">
        <IconRocket className="w-5 h-5" />
        Comenzar Ahora — Es Gratis
      </Link>
    </GradientButton>


    <GradientButton
      variant="secondary"
      size="lg"
      onClick={onOpenLogin}
      className="w-full sm:w-auto px-8 py-3.5 text-base font-bold gap-2.5"
    >
      <IconLogin className="w-5 h-5 text-amber-400" />
      Ya tengo una cuenta
    </GradientButton>
  </motion.div>
);
