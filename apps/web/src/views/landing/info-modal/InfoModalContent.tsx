import React from 'react';
import { motion } from 'framer-motion';
import { InfoModalTab } from '@/models/landing/info-modal.model';
import { FaqsTab } from './FaqsTab';
import { SchoolsTab } from './SchoolsTab';
import { TestsTab } from './TestsTab';
import { GuidelinesTab } from './GuidelinesTab';
import { TermsTab } from './TermsTab';
import { PrivacyTab } from './PrivacyTab';
import { DataRightsTab } from './DataRightsTab';
import { SocialTab } from './SocialTab';

interface InfoModalContentProps {
  activeTab: InfoModalTab;
}

export const InfoModalContent: React.FC<InfoModalContentProps> = ({ activeTab }) => {
  let tab: React.ReactNode = null;
  switch (activeTab) {
    case 'faqs':
      tab = <FaqsTab />;
      break;
    case 'schools':
      tab = <SchoolsTab />;
      break;
    case 'tests':
      tab = <TestsTab />;
      break;
    case 'guidelines':
      tab = <GuidelinesTab />;
      break;
    case 'terms':
      tab = <TermsTab />;
      break;
    case 'privacy':
      tab = <PrivacyTab />;
      break;
    case 'data-rights':
      tab = <DataRightsTab />;
      break;
    case 'social':
      tab = <SocialTab />;
      break;
    default:
      tab = null;
  }

  return (
    <motion.section
      key={activeTab}
      role="tabpanel"
      id={`info-panel-${activeTab}`}
      aria-labelledby={`info-tab-${activeTab}`}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {tab}
    </motion.section>
  );
};
