'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TransitionLinkProps extends Omit<React.ComponentProps<typeof Link>, 'href'> {
  href: string;
}

/** Link con View Transitions API (fallback a navegación normal). */
export const TransitionLink: React.FC<TransitionLinkProps> = ({ href, onClick, children, ...rest }) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
      return;
    }
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (!doc.startViewTransition) return;
    e.preventDefault();
    doc.startViewTransition(() => {
      router.push(href);
    });
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
};

export default TransitionLink;
