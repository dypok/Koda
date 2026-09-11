'use client';

import React from 'react';
import {
  IconBrackets, IconCode, IconGitFork, IconAtom, IconLock,
  IconSkull, IconGift, IconServer, IconDatabase
} from '@tabler/icons-react';
import { GraphNode } from '@/models/roadmap/roadmap-graph.types';

export function RoadmapNodeIcon({ iconType, className }: { iconType: GraphNode['iconType']; className?: string }) {
  switch (iconType) {
    case 'brackets': return <IconBrackets className={className} />;
    case 'code': return <IconCode className={className} />;
    case 'matrix':
    case 'flow': return <IconGitFork className={className} />;
    case 'atom': return <IconAtom className={className} />;
    case 'lock': return <IconLock className={className} />;
    case 'skull': return <IconSkull className={className} />;
    case 'chest': return <IconGift className={className} />;
    case 'server': return <IconServer className={className} />;
    case 'database': return <IconDatabase className={className} />;
    default: return <IconCode className={className} />;
  }
}
