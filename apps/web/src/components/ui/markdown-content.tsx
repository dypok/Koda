'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface InlineToken {
  type: 'text' | 'bold' | 'italic' | 'code' | 'link';
  value: string;
  url?: string;
  children?: InlineToken[];
}

function parseInlineTokens(text: string): InlineToken[] {
  if (!text) return [];

  // Match bold (** or __), inline code (`), italic (* or _), and markdown links ([text](url))
  const regex = /(\*\*[\s\S]*?\*\*|__[\s\S]*?__|`[^`]+`|\*[^*\n]+?\*|_[^_\n]+?_|\[[^\]]+\]\([^)]+\))/g;
  const tokens: InlineToken[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        type: 'text',
        value: text.substring(lastIndex, match.index),
      });
    }

    const raw = match[0];

    if ((raw.startsWith('**') && raw.endsWith('**')) || (raw.startsWith('__') && raw.endsWith('__'))) {
      const inner = raw.slice(2, -2);
      tokens.push({
        type: 'bold',
        value: inner,
        children: parseInlineTokens(inner),
      });
    } else if (raw.startsWith('`') && raw.endsWith('`')) {
      tokens.push({
        type: 'code',
        value: raw.slice(1, -1),
      });
    } else if ((raw.startsWith('*') && raw.endsWith('*')) || (raw.startsWith('_') && raw.endsWith('_'))) {
      tokens.push({
        type: 'italic',
        value: raw.slice(1, -1),
      });
    } else if (raw.startsWith('[') && raw.includes('](')) {
      const splitIdx = raw.indexOf('](');
      tokens.push({
        type: 'link',
        value: raw.slice(1, splitIdx),
        url: raw.slice(splitIdx + 2, -1),
      });
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push({
      type: 'text',
      value: text.substring(lastIndex),
    });
  }

  return tokens;
}

export function renderMarkdownInline(text: string): React.ReactNode {
  const tokens = parseInlineTokens(text);

  return tokens.map((token, idx) => {
    switch (token.type) {
      case 'bold':
        return (
          <strong key={idx} className="font-bold text-white tracking-wide">
            {token.children && token.children.length > 0
              ? token.children.map((child, cIdx) =>
                  child.type === 'code' ? (
                    <code
                      key={cIdx}
                      className="mx-0.5 rounded px-1.5 py-0.5 font-mono text-[12px] sm:text-xs font-semibold text-amber-300 bg-slate-800/90 border border-slate-700/60 shadow-sm"
                    >
                      {child.value}
                    </code>
                  ) : (
                    child.value
                  )
                )
              : token.value}
          </strong>
        );
      case 'code':
        return (
          <code
            key={idx}
            className="mx-0.5 rounded px-1.5 py-0.5 font-mono text-[12px] sm:text-xs font-semibold text-amber-300 bg-slate-800/90 border border-slate-700/60 shadow-sm"
          >
            {token.value}
          </code>
        );
      case 'italic':
        return (
          <em key={idx} className="italic text-slate-200">
            {token.value}
          </em>
        );
      case 'link': {
        const rawUrl = (token.url || '').trim();
        const safeUrl = /^(https?:\/\/|\/|#|mailto:)/i.test(rawUrl) ? rawUrl : '#';
        const isExternal = safeUrl.startsWith('http');
        return (
          <a
            key={idx}
            href={safeUrl}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="text-orange-400 underline hover:text-orange-300 transition-colors"
          >
            {token.value}
          </a>
        );
      }
      case 'text':
      default:
        return <React.Fragment key={idx}>{token.value}</React.Fragment>;
    }
  });
}

type BlockItem =
  | { type: 'paragraph'; text: string }
  | { type: 'blockquote'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'heading'; level: number; text: string }
  | { type: 'codeblock'; code: string; language?: string };

function parseBlockElements(rawBlock: string): BlockItem[] {
  const lines = rawBlock.split('\n');
  const items: BlockItem[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Fenced code block toggle
    if (trimmed.startsWith('```')) {
      if (!inCodeBlock) {
        if (currentList) {
          items.push(currentList);
          currentList = null;
        }
        inCodeBlock = true;
        codeLang = trimmed.slice(3).trim();
        codeBuffer = [];
      } else {
        inCodeBlock = false;
        items.push({ type: 'codeblock', code: codeBuffer.join('\n'), language: codeLang });
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      if (currentList) {
        items.push(currentList);
        currentList = null;
      }
      items.push({ type: 'blockquote', text: trimmed.replace(/^>\s?/, '') });
      continue;
    }

    // Unordered list item
    const ulMatch = line.match(/^\s*[-*]\s+(.*)$/);
    if (ulMatch) {
      if (!currentList || currentList.type !== 'ul') {
        if (currentList) items.push(currentList);
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(ulMatch[1]);
      continue;
    }

    // Ordered list item
    const olMatch = line.match(/^\s*\d+\.\s+(.*)$/);
    if (olMatch) {
      if (!currentList || currentList.type !== 'ol') {
        if (currentList) items.push(currentList);
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(olMatch[1]);
      continue;
    }

    // Heading
    const hMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (hMatch) {
      if (currentList) {
        items.push(currentList);
        currentList = null;
      }
      items.push({ type: 'heading', level: hMatch[1].length, text: hMatch[2] });
      continue;
    }

    // Plain line
    if (currentList) {
      items.push(currentList);
      currentList = null;
    }
    if (trimmed) {
      items.push({ type: 'paragraph', text: line });
    }
  }

  if (currentList) {
    items.push(currentList);
  }
  if (inCodeBlock && codeBuffer.length > 0) {
    items.push({ type: 'codeblock', code: codeBuffer.join('\n'), language: codeLang });
  }

  return items;
}

export interface MarkdownContentProps {
  content?: string | null;
  className?: string;
  inline?: boolean;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({
  content,
  className,
  inline = false,
}) => {
  if (!content) return null;

  if (inline) {
    return <span className={className}>{renderMarkdownInline(content)}</span>;
  }

  const rawBlocks = content.trim().split(/\n\s*\n+/);

  return (
    <div className={cn('space-y-3.5', className)}>
      {rawBlocks.map((rawBlock, blockIdx) => {
        const elements = parseBlockElements(rawBlock);

        return (
          <React.Fragment key={blockIdx}>
            {elements.map((el, elIdx) => {
              switch (el.type) {
                case 'paragraph':
                  return (
                    <p key={elIdx} className="text-slate-300 text-sm sm:text-base leading-relaxed">
                      {renderMarkdownInline(el.text)}
                    </p>
                  );
                case 'blockquote':
                  return (
                    <blockquote
                      key={elIdx}
                      className="border-l-2 border-orange-500/80 bg-orange-500/10 pl-3.5 pr-3 py-2.5 rounded-r-xl text-slate-300 text-xs sm:text-sm leading-relaxed my-2.5 not-italic shadow-sm"
                    >
                      {renderMarkdownInline(el.text)}
                    </blockquote>
                  );
                case 'ul':
                  return (
                    <ul
                      key={elIdx}
                      className="list-disc pl-5 space-y-1.5 my-2.5 text-slate-300 text-sm sm:text-base leading-relaxed marker:text-orange-400"
                    >
                      {el.items.map((item, itemIdx) => (
                        <li key={itemIdx}>{renderMarkdownInline(item)}</li>
                      ))}
                    </ul>
                  );
                case 'ol':
                  return (
                    <ol
                      key={elIdx}
                      className="list-decimal pl-5 space-y-1.5 my-2.5 text-slate-300 text-sm sm:text-base leading-relaxed marker:text-orange-400 marker:font-mono"
                    >
                      {el.items.map((item, itemIdx) => (
                        <li key={itemIdx}>{renderMarkdownInline(item)}</li>
                      ))}
                    </ol>
                  );
                case 'heading': {
                  const HeadingTag =
                    el.level === 1 ? 'h2' : el.level === 2 ? 'h3' : 'h4';
                  const headingClasses =
                    el.level === 1
                      ? 'text-lg sm:text-xl font-bold text-white tracking-tight mt-3 mb-1'
                      : el.level === 2
                      ? 'text-base sm:text-lg font-bold text-white tracking-tight mt-2.5 mb-1'
                      : 'text-sm sm:text-base font-semibold text-slate-100 mt-2 mb-1';

                  return (
                    <HeadingTag key={elIdx} className={headingClasses}>
                      {renderMarkdownInline(el.text)}
                    </HeadingTag>
                  );
                }
                case 'codeblock':
                  return (
                    <pre
                      key={elIdx}
                      className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-xs sm:text-sm leading-relaxed text-slate-200 my-2 shadow-inner"
                    >
                      <code>{el.code}</code>
                    </pre>
                  );
                default:
                  return null;
              }
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default MarkdownContent;
