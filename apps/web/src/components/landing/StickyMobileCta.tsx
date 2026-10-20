'use client';

import React, { useEffect, useState } from 'react';
import { TransitionLink } from '@/components/ui/transition-link';
import { WipeButton } from '@/components/ui/wipe-button';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { getAppUrl } from '@/lib/domain';

/** CTA pegajoso solo móvil, aparece tras pasar el hero. */
export const StickyMobileCta: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 48 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 inset-x-0 z-40 md:hidden border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 py-3"
        >
          <WipeButton
            href={getAppUrl('/register')}
            LinkComponent={TransitionLink}
            className="flex w-full"
          >
            Comenzar gratis — 2 min
          </WipeButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyMobileCta;
