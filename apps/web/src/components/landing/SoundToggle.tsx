'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, sound } from '@/lib/sound';

/** Toggle de sonido opt-in (apagado por defecto), persiste en localStorage. */
export const SoundToggle: React.FC = () => {
  const [on, setOn] = useState(isSoundEnabled());

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
      {on ? <Volume2 aria-hidden="true" className="w-3.5 h-3.5" /> : <VolumeX aria-hidden="true" className="w-3.5 h-3.5" />}
    </button>
  );
};

export default SoundToggle;
