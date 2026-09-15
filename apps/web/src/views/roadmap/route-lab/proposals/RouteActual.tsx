'use client';

import React from 'react';
import { LUA_COURSES_DATASET } from '@/models/roadmap/tracks/lua-track.mock';
import { LuaRouteView } from '../../LuaRouteView';

interface ProposalProps {
  onAction: (msg: string) => void;
}

/** R0 — La vista mínima actual como referencia, enmarcada. */
export const RouteActual: React.FC<ProposalProps> = ({ onAction }) => (
  <div className="relative h-[75vh] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
    <LuaRouteView
      dataset={LUA_COURSES_DATASET}
      onDeploy={(node) => onAction(`→ abriría lecciones de ${node.label}`)}
    />
  </div>
);

export default RouteActual;
