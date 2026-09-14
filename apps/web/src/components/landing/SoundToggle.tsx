'use client';

import React, { useEffect, useState } from 'react';
import { SpeakerHigh, SpeakerX } from '@phosphor-icons/react';
import { isSoundEnabled, setSoundEnabled, sound } from '@/lib/sound';

/** Toggle de sonido opt-in (apagado por defecto), persiste en localStorage. */
export const SoundToggle: React.FC = () => {
  // false en el primer render a propósito (igual que el servidor) para no romper hidratación.
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(isSoundEnabled());
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    setSoundEnabled(next);
    if (next) sound.pop();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Silenciar sonidos' : 'Activar sonidos'}
      title={on ? 'Silenciar sonidos' : 'Activar sonidos'}
      className="inline-flex min-h-[32px] min-w-[32px] items-center justify-center rounded-full border border-slate-800 text-slate-500 transition-colors hover:border-amber-400/50 hover:text-amber-300"
    >
      {on ? <SpeakerHigh aria-hidden="true" className="w-3.5 h-3.5" /> : <SpeakerX aria-hidden="true" className="w-3.5 h-3.5" />}
    </button>
  );
};

export default SoundToggle;
