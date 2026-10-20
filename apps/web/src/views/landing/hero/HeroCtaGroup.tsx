import React, { useState, useEffect } from 'react';
import { TransitionLink } from '@/components/ui/transition-link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, SignIn, Sparkle } from '@phosphor-icons/react';
import { WipeButton } from '@/components/ui/wipe-button';
import { Magnetic } from '@/components/ui/magnetic';
import { useHeroStrings } from '@/lib/i18n';
import { getAppUrl, hasSessionCookie } from '@/lib/domain';

export const HeroCtaGroup: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const t = useHeroStrings();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(hasSessionCookie());
  }, []);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="pt-2 flex flex-col items-center lg:items-start gap-3.5 w-full sm:w-auto transform-gpu"
    >
      <Magnetic className="w-full sm:w-72 max-w-xs sm:max-w-none">
        <WipeButton
          href={getAppUrl(isLoggedIn ? '/' : '/register')}
          LinkComponent={TransitionLink}
          ariaLabel={isLoggedIn ? 'Continuar mi aprendizaje en Koda' : 'Comenzar ahora gratis en Koda'}
          size="lg"
          className="w-full gap-2.5 px-8 py-4 text-base justify-center group"
        >
          {isLoggedIn ? 'Continuar aprendiendo' : t.ctaPrimary}
          {isLoggedIn ? (
            <Sparkle
              aria-hidden="true"
              className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 text-amber-300"
            />
          ) : (
            <ArrowRight
              aria-hidden="true"
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5"
            />
          )}
        </WipeButton>
      </Magnetic>

      <WipeButton
        href={getAppUrl(isLoggedIn ? '/' : '/login')}
        LinkComponent={TransitionLink}
        ariaLabel={isLoggedIn ? 'Ir a mi Roadmap interactivo' : 'Entrar a mi cuenta de Koda'}
        tone="ghost"
        size="md"
        className="w-full sm:w-72 max-w-xs sm:max-w-none gap-2.5 px-6 text-sm justify-center font-bold group"
      >
        <SignIn
          aria-hidden="true"
          className="w-5 h-5 text-amber-400/90 transition-transform duration-300 group-hover:scale-110"
        />
        {isLoggedIn ? 'Ir a mi Roadmap' : t.ctaSecondary}
      </WipeButton>

      <p className="text-xs sm:text-sm text-slate-300">
        {t.trust}
      </p>
    </motion.div>
  );
};
