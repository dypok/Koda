import React from 'react';
import { InfoModalTab } from '@/models/landing/info-modal.model';
import {
  FOOTER_SUPPORT_LINKS,
  FOOTER_LEGAL_LINKS,
  FOOTER_SOCIAL_LINKS,
  FooterLinkItem,
} from '@/models/landing/footer.model';

interface FooterColumnsProps {
  onOpenModal: (tab: InfoModalTab) => void;
}

const linkClasses =
  'inline-flex min-h-[32px] items-center gap-2 hover:text-amber-400 transition-colors cursor-pointer text-left py-0.5 focus-visible:text-amber-300 focus-visible:underline focus-visible:underline-offset-4 focus-visible:outline-none';

const FooterLinkList: React.FC<{
  id: string;
  title: string;
  links: FooterLinkItem[];
  onOpenModal: (tab: InfoModalTab) => void;
}> = ({ id, title, links, onOpenModal }) => (
  <nav aria-labelledby={id} className="md:col-span-3 space-y-3.5">
    <h4 id={id} className="font-display text-xs font-bold text-white uppercase tracking-wider">
      {title}
    </h4>
    <ul className="space-y-2.5 text-xs font-sans">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <li key={link.id}>
            {link.external && link.href ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${link.label} (abre en pestaña nueva)`}
                className={linkClasses}
              >
                {Icon && <Icon aria-hidden="true" className="w-3.5 h-3.5 text-slate-500" />}
                <span>{link.label}</span>
              </a>
            ) : (
              <button onClick={() => onOpenModal(link.tab)} className={linkClasses}>
                {Icon && <Icon aria-hidden="true" className="w-3.5 h-3.5 text-slate-500" />}
                <span>{link.label}</span>
              </button>
            )}
          </li>
        );
      })}
    </ul>
  </nav>
);

export const FooterColumns: React.FC<FooterColumnsProps> = ({ onOpenModal }) => (
  <>
    <FooterLinkList
      id="footer-ayuda"
      title="Ayuda y Soporte"
      links={FOOTER_SUPPORT_LINKS}
      onOpenModal={onOpenModal}
    />
    <FooterLinkList
      id="footer-legal"
      title="Privacidad y Términos"
      links={FOOTER_LEGAL_LINKS}
      onOpenModal={onOpenModal}
    />
    <FooterLinkList
      id="footer-social"
      title="Social"
      links={FOOTER_SOCIAL_LINKS}
      onOpenModal={onOpenModal}
    />
  </>
);
