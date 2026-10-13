'use client';

import React from 'react';
import { BracketsSquare, Code, GitFork, Atom, Lock, Skull, Gift, Database } from '@phosphor-icons/react';
import { GraphNode } from '@/models/roadmap/roadmap-graph.types';

export function RoadmapNodeIcon({ iconType, className }: { iconType: GraphNode['iconType']; className?: string }) {
  switch (iconType) {
    case 'brackets': return <BracketsSquare className={className} />;
    case 'code': return <Code className={className} />;
    case 'matrix':
    case 'flow': return <GitFork className={className} />;
    case 'atom': return <Atom className={className} />;
    case 'lock': return <Lock className={className} />;
    case 'skull': return <Skull className={className} />;
    case 'chest': return <Gift className={className} />;
    case 'server': return <Database className={className} />;
    case 'database': return <Database className={className} />;
    default: return <Code className={className} />;
  }
}
