'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LanguageOption } from '@/models/register/register.model';
import { techAvailability } from '@/models/register/register.constants';
import { cn } from '@/lib/utils';

interface TerminalLanguagePickerProps {
  languages: LanguageOption[];
  selectedLanguageId: string;
  onSelectLanguage: (id: string) => void;
}

/** Picker estilo terminal: `$ koda use ▊` con filtrado y flechas. */
export const TerminalLanguagePicker: React.FC<TerminalLanguagePickerProps> = ({
  languages,
  selectedLanguageId,
  onSelectLanguage,
}) => {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? languages.filter(
          (l) => l.name.toLowerCase().includes(q) || l.slug.toLowerCase().includes(q)
        )
      : languages.slice(0, 8);
    return list.slice(0, 8);
  }, [query, languages]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(results.length - 1, c + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
    } else if (e.key === 'Enter') {
      const chosen = results[cursor];
      if (chosen && techAvailability(chosen.id).isAvailable) onSelectLanguage(chosen.id);
    }
  };

  return (
    <div
      className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 font-mono text-sm"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
        <span aria-hidden="true" className="text-emerald-400 select-none">$</span>
        <span aria-hidden="true" className="text-slate-400 select-none">koda use</span>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="python…"
          aria-label="Buscar tecnología: escribe y usa flechas más Enter"
          autoComplete="off"
          spellCheck={false}
          className="flex-1 bg-transparent text-amber-300 placeholder:text-slate-600 focus:outline-none min-h-[32px]"
        />
        <span aria-hidden="true" className="inline-block w-[8px] h-[18px] bg-amber-400 animate-pulse" />
      </div>
      <ul role="listbox" aria-label="Tecnologías coincidentes" className="pt-2 space-y-0.5">
        {results.map((lang, i) => {
          const { isAvailable } = techAvailability(lang.id);
          const active = i === cursor;
          return (
            <li key={lang.id}>
              <button
                type="button"
                role="option"
                aria-selected={selectedLanguageId === lang.id}
                disabled={!isAvailable}
                onClick={() => onSelectLanguage(lang.id)}
                onMouseEnter={() => setCursor(i)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 min-h-[40px] text-left transition-colors',
                  !isAvailable && 'opacity-50 cursor-not-allowed',
                  active ? 'bg-amber-400/10 text-white' : 'text-slate-300'
                )}
              >
                <span aria-hidden="true" className={active ? 'text-amber-400' : 'text-slate-600'}>
                  {active ? '▸' : '·'}
                </span>
                <span className="flex-1">
                  {lang.name}
                  <span className="text-slate-500"> · {lang.slug}</span>
                </span>
                {selectedLanguageId === lang.id && (
                  <span className="text-[10px] font-bold text-emerald-300">ACTIVO</span>
                )}
                {!isAvailable && (
                  <span className="text-[10px] font-bold uppercase text-slate-500">Pronto</span>
                )}
              </button>
            </li>
          );
        })}
        {results.length === 0 && (
          <li className="px-3 py-2 text-slate-500">Sin coincidencias. Prueba “python”.</li>
        )}
      </ul>
    </div>
  );
};

export default TerminalLanguagePicker;
