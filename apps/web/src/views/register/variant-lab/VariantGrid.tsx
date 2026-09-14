'use client';

import React, { useLayoutEffect, useRef } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Check, Lock } from '@phosphor-icons/react';
import { LanguageOption } from '@/models/register/register.model';
import { getGsap, prefersReducedMotion } from '@/lib/gsap';
import { cn } from '@/lib/utils';
import { VariantTokens } from './variant-styles';

interface VariantGridProps {
  variantId: string;
  tokens: VariantTokens;
  items: LanguageOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function Prefix({ kind, index }: { kind: VariantTokens['prefix']; index: number }) {
  if (kind === 'none') return null;
  const text = kind === 'prompt' ? '>' : kind === 'dollar' ? '$' : String(index + 1).padStart(2, '0');
  return (
    <span aria-hidden="true" className="text-[11px] font-bold text-slate-600">
      {text}
    </span>
  );
}

function IconBox({ option, kind }: { option: LanguageOption; kind: VariantTokens['iconBox'] }) {
  const Icon = option.icon;
  if (kind === 'hidden') return null;
  if (kind === 'float') {
    return <Icon aria-hidden="true" className="w-8 h-8 shrink-0" style={{ color: option.color }} />;
  }
  return (
    <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] border border-slate-700 bg-black">
      <Icon className="w-5 h-5" style={{ color: option.color }} />
    </span>
  );
}

function RowBody({
  option,
  tokens,
  selected,
}: {
  option: LanguageOption;
  tokens: VariantTokens;
  selected: boolean;
}) {
  const badge = (
    <span className={option.isAvailable ? tokens.badgeAvailable : tokens.badgeLocked}>
      {option.badge ?? (option.isAvailable ? 'Disponible' : 'Próximamente')}
    </span>
  );
  if (tokens.metaTable) {
    return (
      <span className="flex-1 min-w-0">
        <span className="flex items-baseline gap-2">
          <span className="text-sm font-bold text-white">{option.name}</span>
          <span aria-hidden="true" className="flex-1 border-b border-dotted border-slate-700" />
          {badge}
        </span>
        <span className="mt-1 block truncate font-sans text-xs text-slate-400">{option.description}</span>
      </span>
    );
  }
  return (
    <span className="flex-1 min-w-0">
      <span className="mb-1 flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold leading-none text-white">{option.name}</span>
        {badge}
      </span>
      <span className="block font-sans text-xs leading-relaxed text-slate-400">
        {tokens.logLocked && !option.isAvailable ? `// ${option.slug} — queued` : option.description}
      </span>
      {tokens.installLine && selected && (
        <span className="mt-1 block font-mono text-[11px] text-amber-300">{`$ install ${option.slug}`}</span>
      )}
    </span>
  );
}

export const VariantGrid: React.FC<VariantGridProps> = ({ variantId, tokens, items, selectedId, onSelect }) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (tokens.motion !== 'gsap' || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.from('[data-vrow]', { y: 14, opacity: 0, duration: 0.45, stagger: 0.04, ease: 'power3.out' });
    }, rootRef);
    return () => ctx.revert();
  }, [variantId, tokens.motion]);

  const renderButton = (option: LanguageOption, index: number) => {
    const selected = selectedId === option.id;
    return (
      <>
        <Prefix kind={tokens.prefix} index={index} />
        <IconBox option={option} kind={tokens.iconBox} />
        <RowBody option={option} tokens={tokens} selected={selected} />
        {option.isAvailable ? (
          <span
            aria-hidden="true"
            className={cn(
              'flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] border',
              selected ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-700 text-transparent'
            )}
          >
            <Check className="h-3.5 w-3.5" weight="bold" />
          </span>
        ) : (
          <Lock aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-600" />
        )}
      </>
    );
  };

  const grid = (list: LanguageOption[], offset = 0) => (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {list.map((option, i) => {
        const index = offset + i;
        const selected = selectedId === option.id;
        const cls = cn(tokens.card, selected ? tokens.cardSelected : option.isAvailable ? '' : tokens.cardLocked);
        if (tokens.radix) {
          return (
            <RadioGroup.Item key={option.id} value={option.id} disabled={!option.isAvailable} asChild>
              <button type="button" data-vrow aria-label={option.name} className={cls}>
                {renderButton(option, index)}
              </button>
            </RadioGroup.Item>
          );
        }
        return (
          <button
            key={option.id}
            type="button"
            data-vrow
            disabled={!option.isAvailable}
            aria-pressed={selected}
            onClick={() => option.isAvailable && onSelect(option.id)}
            className={cls}
          >
            {renderButton(option, index)}
          </button>
        );
      })}
    </div>
  );

  const body = tokens.grouped ? (
    <div className="space-y-5">
      {(['language', 'framework', 'tools'] as const).map((cat) => {
        const list = items.filter((o) => o.category === cat);
        if (!list.length) return null;
        return (
          <div key={cat}>
            <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-widest text-slate-500">
              {cat}/ <span className="text-amber-400">[{String(list.length).padStart(2, '0')}]</span>
            </p>
            {grid(list)}
          </div>
        );
      })}
    </div>
  ) : (
    grid(items)
  );

  const framed = tokens.chrome ? (
    <div className="overflow-hidden rounded-[10px] border border-slate-700 bg-slate-950">
      <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900/80 px-4 py-2.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        </span>
        <p className="ml-1 font-mono text-[11px] font-bold uppercase tracking-widest text-slate-400">
          koda --select-stack
        </p>
      </div>
      <div className="p-4">
        {tokens.note && (
          <p className="mb-3 rounded-[6px] border border-slate-800 bg-black px-3 py-2 font-mono text-[11px] text-amber-300">
            {tokens.note}
          </p>
        )}
        {body}
      </div>
    </div>
  ) : (
    body
  );

  if (tokens.radix) {
    return (
      <div ref={rootRef}>
        <RadioGroup.Root value={selectedId} onValueChange={onSelect} aria-label="Vista previa de tecnologías">
          {framed}
        </RadioGroup.Root>
      </div>
    );
  }
  return <div ref={rootRef}>{framed}</div>;
};

export default VariantGrid;
