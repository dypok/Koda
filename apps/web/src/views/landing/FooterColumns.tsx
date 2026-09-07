import React from 'react';
import { InfoModalTab } from '@/components/landing/InfoModal';
import {
  FOOTER_SUPPORT_LINKS,
  FOOTER_LEGAL_LINKS,
  FOOTER_SOCIAL_LINKS,
  FooterLinkItem,
} from '@/models/landing/footer.model';

interface FooterColumnsProps {
  onOpenModal: (tab: InfoModalTab) => void;
}

const FooterLinkList: React.FC<{
  title: string;
  links: FooterLinkItem[];
  onOpenModal: (tab: InfoModalTab) => void;
}> = ({ title, links, onOpenModal }) => (
  <div className="md:col-span-3 space-y-3.5">
    <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">
      {title}
    </h4>
    <ul className="space-y-2.5 text-xs font-sans">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <li key={link.id}>
            <button
              onClick={() => onOpenModal(link.tab)}
              className="inline-flex items-center gap-2 hover:text-amber-400 transition-colors cursor-pointer text-left"
            >
              {Icon && <Icon className="w-3.5 h-3.5 text-slate-500" />}
              <span>{link.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  </div>
);

export const FooterColumns: React.FC<FooterColumnsProps> = ({ onOpenModal }) => (
  <>
    <FooterLinkList
      title="Ayuda y Soporte"
      links={FOOTER_SUPPORT_LINKS}
      onOpenModal={onOpenModal}
    />
    <FooterLinkList
      title="Privacidad y Términos"
      links={FOOTER_LEGAL_LINKS}
      onOpenModal={onOpenModal}
    />
    <FooterLinkList
      title="Social"
      links={FOOTER_SOCIAL_LINKS}
      onOpenModal={onOpenModal}
    />
  </>
);
