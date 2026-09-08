import React from 'react';
import { SkillTreeDefs } from '@/views/landing/skill-tree/SkillTreeDefs';
import { SkillTreeConnections } from '@/views/landing/skill-tree/SkillTreeConnections';
import { SkillTreeMainNodes } from '@/views/landing/skill-tree/SkillTreeMainNodes';
import { SkillTreeBranches } from '@/views/landing/skill-tree/SkillTreeBranches';

export const MiniSkillTree: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto select-none pointer-events-none">
      {/* Resplandor ambiental cósmico sutil (GPU Layer) */}
      <div className="absolute -inset-6 bg-gradient-to-r from-cyan-500/10 via-amber-500/15 to-rose-500/10 rounded-full blur-xl opacity-60 pointer-events-none transform-gpu contain-paint" />

      {/* Canvas SVG de la Constelación integrado directamente */}
      <div className="relative aspect-[580/260] w-full">
        <svg
          viewBox="0 0 580 260"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <SkillTreeDefs />
          <SkillTreeConnections />
          <SkillTreeMainNodes />
          <SkillTreeBranches />
        </svg>
      </div>
    </div>
  );
};

export default MiniSkillTree;
