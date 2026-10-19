'use client';

import { useMemo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Block =
  | { kind: 'p'; text: string }
  | { kind: 'heading'; level: number; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'ol'; items: string[] }
  | { kind: 'quote'; text: string }
  | { kind: 'code'; code: string; lang: string }
  | { kind: 'table'; head: string[]; rows: string[][] };

const BLOCK_START = /^\s*(#{1,6}\s+|[-*]\s+|\d+\.\s+|>\s?|```)/;

function isTableLine(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 2;
}

function parseBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    const fence = line.trim().match(/^```([\w-]*)\s*$/);
    if (fence) {
      const lang = fence[1] ?? '';
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        code.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      blocks.push({ kind: 'code', code: code.join('\n'), lang });
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      blocks.push({ kind: 'heading', level: heading[1].length, text: heading[2].trim() });
      i += 1;
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, '').trim());
        i += 1;
      }
      blocks.push({ kind: 'ul', items });
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, '').trim());
        i += 1;
      }
      blocks.push({ kind: 'ol', items });
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^\s*>\s?/, '').trim());
        i += 1;
      }
      blocks.push({ kind: 'quote', text: quote.join(' ') });
      continue;
    }

    if (isTableLine(line)) {
      const raw: string[][] = [];
      while (i < lines.length && isTableLine(lines[i])) {
        raw.push(
          lines[i]
            .trim()
            .slice(1, -1)
            .split('|')
            .map((cell) => cell.trim())
        );
        i += 1;
      }
      const rows = raw.filter((row) => !row.every((cell) => /^:?-{2,}:?$/.test(cell)));
      if (rows.length > 0) {
        const [head, ...body] = rows;
        blocks.push({ kind: 'table', head, rows: body });
      }
      continue;
    }

    const paragraph: string[] = [];
    while (i < lines.length) {
      const current = lines[i];
      if (!current.trim() || BLOCK_START.test(current.trim()) || isTableLine(current)) break;
      paragraph.push(current.trim());
      i += 1;
    }
    if (paragraph.length > 0) blocks.push({ kind: 'p', text: paragraph.join(' ') });
  }

  return blocks;
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${match.index}`;
    if (token.startsWith('**')) {
      nodes.push(
        <strong key={key} className="font-semibold text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`')) {
      nodes.push(
        <code key={key} className="rounded bg-slate-800/80 px-1.5 py-0.5 font-mono text-[0.9em] text-amber-300">
          {token.slice(1, -1)}
        </code>
      );
    } else {
      nodes.push(
        <em key={key} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

const HEADING_CLASS: Record<number, string> = {
  1: 'text-lg font-bold text-white',
  2: 'text-base font-bold text-white',
  3: 'text-sm font-bold text-white',
  4: 'text-sm font-semibold text-slate-200',
  5: 'text-sm font-semibold text-slate-200',
  6: 'text-sm font-semibold text-slate-200',
};

interface RichTextProps {
  text: string;
  className?: string;
  compact?: boolean;
}

/** Markdown inline sin contenedor de bloque: ideal para opciones, pistas y etiquetas. */
export function RichInline({ text }: { text: string }) {
  return <>{renderInline(text, 'inline')}</>;
}

/**
 * Renderiza el texto pedagógico con Markdown básico (negritas, código inline,
 * cursivas, listas, citas, tablas y bloques de código). Evita dependencias
 * externas y no usa dangerouslySetInnerHTML.
 */
export function RichText({ text, className, compact = false }: RichTextProps) {
  const blocks = useMemo(() => parseBlocks(text), [text]);

  return (
    <div
      className={cn(
        compact ? 'space-y-1.5 leading-relaxed' : 'space-y-3 text-sm leading-relaxed sm:text-base',
        className
      )}
    >
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`;
        switch (block.kind) {
          case 'p':
            return <p key={key}>{renderInline(block.text, key)}</p>;
          case 'heading':
            return (
              <p key={key} className={HEADING_CLASS[block.level] ?? HEADING_CLASS[3]}>
                {renderInline(block.text, key)}
              </p>
            );
          case 'ul':
            return (
              <ul key={key} className="list-disc space-y-1 pl-5 marker:text-orange-400">
                {block.items.map((item, itemIndex) => (
                  <li key={`${key}-${itemIndex}`}>{renderInline(item, `${key}-${itemIndex}`)}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={key} className="list-decimal space-y-1 pl-5 marker:text-orange-400">
                {block.items.map((item, itemIndex) => (
                  <li key={`${key}-${itemIndex}`}>{renderInline(item, `${key}-${itemIndex}`)}</li>
                ))}
              </ol>
            );
          case 'quote':
            return (
              <blockquote key={key} className="border-l-2 border-orange-500/50 pl-3 italic text-slate-400">
                {renderInline(block.text, key)}
              </blockquote>
            );
          case 'code':
            return (
              <pre
                key={key}
                className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80 p-4 font-mono text-xs leading-relaxed text-emerald-300"
              >
                <code>{block.code}</code>
              </pre>
            );
          case 'table':
            return (
              <div key={key} className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr>
                      {block.head.map((cell, cellIndex) => (
                        <th
                          key={`${key}-h-${cellIndex}`}
                          className="border-b border-slate-700 px-2 py-1.5 font-semibold text-white"
                        >
                          {renderInline(cell, `${key}-h-${cellIndex}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={`${key}-r-${rowIndex}`}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={`${key}-r-${rowIndex}-${cellIndex}`}
                            className="border-b border-slate-800/70 px-2 py-1.5 text-slate-300"
                          >
                            {renderInline(cell, `${key}-r-${rowIndex}-${cellIndex}`)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
