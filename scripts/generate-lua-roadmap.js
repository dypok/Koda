#!/usr/bin/env node
/**
 * Koda — Generador declarativo del Roadmap de Lua
 *
 * Lee `content/languages/lua/manifest.json` y `content/languages/lua/modules/* /module.json`,
 * aplica la regla de resolución de coordenadas de 3 niveles (`30_ROADMAP_STRUCTURE_AND_COORDINATES.md` §4):
 *   1. Capa C (curada absoluta): `graph.x` y `graph.y` definidos.
 *   2. Capa B (derivada topológica): `graph.tier` y `graph.lane` definidos → `x = tier * 220 + 140`, `y = lane * 130 + 290`.
 *   3. Capa A (fallback por posición): `tier = position - 1`, `lane = 0`.
 *
 * Materializa:
 *   - `apps/web/src/models/roadmap/tracks/lua-track.mock.ts`
 *   - `apps/web/src/models/roadmap/tracks/lua-lessons-graph.mock.ts`
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const LUA_DIR = path.join(ROOT_DIR, 'content', 'languages', 'lua');
const MANIFEST_PATH = path.join(LUA_DIR, 'manifest.json');
const TRACK_MOCK_PATH = path.join(
  ROOT_DIR,
  'apps',
  'web',
  'src',
  'models',
  'roadmap',
  'tracks',
  'lua-track.mock.ts',
);
const LESSONS_MOCK_PATH = path.join(
  ROOT_DIR,
  'apps',
  'web',
  'src',
  'models',
  'roadmap',
  'tracks',
  'lua-lessons-graph.mock.ts',
);

const ACCENT = '#8FA8FF';

/**
 * Regla de resolución de 3 niveles (`30_ROADMAP_STRUCTURE_AND_COORDINATES.md` §4)
 * @param {object|undefined} graph
 * @param {number} position
 * @returns {{ x: number, y: number, tier: number, lane: number, route: string }}
 */
function resolveCoordinates(graph, position) {
  const posIndex = Math.max(0, (Number(position) || 1) - 1);
  const tier =
    graph && typeof graph.tier === 'number' ? graph.tier : posIndex;
  const lane =
    graph && typeof graph.lane === 'number' ? graph.lane : 0;

  let x;
  let y;
  if (graph && typeof graph.x === 'number' && typeof graph.y === 'number') {
    // Nivel 1: Capa C — coordenadas absolutas curadas
    x = graph.x;
    y = graph.y;
  } else if (
    graph &&
    typeof graph.tier === 'number' &&
    typeof graph.lane === 'number'
  ) {
    // Nivel 2: Capa B — fórmula derivada de tier/lane
    x = graph.tier * 220 + 140;
    y = graph.lane * 130 + 290;
  } else {
    // Nivel 3: Capa A — derivado desde position (tier = position - 1, lane = 0)
    x = posIndex * 220 + 140;
    y = 290;
  }

  const route = (graph && graph.route) || 'trunk';
  return { x, y, tier, lane, route };
}

function truncateSubtitle(description) {
  const upper = String(description || '').toUpperCase();
  return upper.length > 42 ? `${upper.slice(0, 41)}…` : upper;
}

function loadModuleJson(relPath) {
  if (!relPath) return null;
  const fullPath = path.join(LUA_DIR, relPath, 'module.json');
  if (!fs.existsSync(fullPath)) return null;
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

function generateTrackMock(manifest, loadedModulesByCode) {
  const sortedModules = [...(manifest.modules || [])].sort(
    (a, b) => (a.position || 0) - (b.position || 0),
  );

  const nodes = [];
  const connections = [];

  for (const m of sortedModules) {
    const modJson = loadedModulesByCode.get(m.code);
    // Merge manifest.modules[].graph with module.json graph (module.json overrides coordinates/route)
    const mergedGraph = {
      ...(m.graph || {}),
      ...(modJson && modJson.graph ? modJson.graph : {}),
    };

    const { x, y, route } = resolveCoordinates(mergedGraph, m.position);
    const posCode = String(m.position).padStart(2, '0');
    const variant =
      mergedGraph.variant || (m.position === 1 ? 'active' : 'locked');
    const isBoss = variant === 'boss';
    const nodeId = mergedGraph.nodeId || `lua-m${posCode}`;
    const nodeCode = mergedGraph.nodeCode || (isBoss ? 'Ω' : posCode);
    const iconType =
      mergedGraph.iconType ||
      (isBoss ? 'skull' : m.position === 1 ? 'brackets' : 'lock');
    const totalSections = Number(m.total_sections) || 8;
    const xp = totalSections * 60;
    const maxStars = totalSections * 3;
    const statusText =
      mergedGraph.statusText ||
      (m.position === 1
        ? 'ACTIVO • EN PROGRESO'
        : `RQ LUA_MOD_${String(m.position - 1).padStart(2, '0')}`);
    const isUnlocked =
      typeof mergedGraph.isUnlocked === 'boolean'
        ? mergedGraph.isUnlocked
        : m.position === 1;

    const node = {
      id: nodeId,
      code: nodeCode,
      label: String(m.title || '').toUpperCase(),
      subtitle: truncateSubtitle(m.description),
      x,
      y,
      variant,
      iconType,
      stars: 0,
      ...(isBoss ? {} : { maxStars }),
      xp,
      statusText,
      targetCourseId: `lua-${m.slug}`,
      isUnlocked,
      route,
      ...(mergedGraph.routeLabel ? { routeLabel: mergedGraph.routeLabel } : {}),
    };

    nodes.push(node);

    if (Array.isArray(mergedGraph.edges)) {
      for (const edge of mergedGraph.edges) {
        connections.push({
          id: edge.id,
          fromId: nodeId,
          toId: edge.toNodeId,
          path: edge.path,
          dashed: edge.dashed !== false,
        });
      }
    }
  }

  const totalStars = nodes.reduce((sum, n) => sum + (n.maxStars || 0), 0);
  const totalCourses = nodes.length;

  const connectionLines = connections.map((c) => {
    if (c.dashed === false) {
      return `  link(${JSON.stringify(c.id)}, ${JSON.stringify(c.fromId)}, ${JSON.stringify(c.toId)}, ${JSON.stringify(c.path)}, false),`;
    }
    return `  link(${JSON.stringify(c.id)}, ${JSON.stringify(c.fromId)}, ${JSON.stringify(c.toId)}, ${JSON.stringify(c.path)}),`;
  });

  return `import { GraphDataset, GraphNode, GraphConnection } from '../roadmap-graph.types';

// Generado desde content/languages/lua/manifest.json y modules/*/module.json — no editar a mano.
// Topología multiruta (tronco → ramas Flujo/Datos → convergencia) en el viewBox 1150×620.
const ACCENT = '${ACCENT}';

const NODES: GraphNode[] = ${JSON.stringify(nodes, null, 2)};

function link(id: string, fromId: string, toId: string, path: string, dashed = true): GraphConnection {
  return { id, fromId, toId, color: ACCENT, path, ...(dashed ? { isDashed: true } : {}) };
}

const CONNECTIONS: GraphConnection[] = [
${connectionLines.join('\n')}
];

export const LUA_COURSES_DATASET: GraphDataset = {
  sectorTitle: 'LUA · 3 RUTAS · ${totalCourses} MÓDULOS',
  progressPercent: 8,
  nodes: NODES,
  connections: CONNECTIONS,
};

export const LUA_TRACK_TOTALS = { totalStars: ${totalStars}, totalCourses: ${totalCourses} };
`;
}

function generateLessonsGraphMock(manifest, loadedModulesByCode) {
  const sortedModules = [...(manifest.modules || [])].sort(
    (a, b) => (a.position || 0) - (b.position || 0),
  );

  const lessonsDataset = {};

  for (const m of sortedModules) {
    const modJson = loadedModulesByCode.get(m.code);
    if (!modJson || !Array.isArray(modJson.sections) || modJson.sections.length === 0) {
      continue;
    }

    const courseKey = `lua-${m.slug}`;
    const sections = [...modJson.sections].sort(
      (a, b) => (a.position || 0) - (b.position || 0),
    );
    const total = sections.length;

    const nodes = sections.map((sec, i) => {
      let x;
      let y;
      if (
        sec.graph &&
        ((typeof sec.graph.x === 'number' && typeof sec.graph.y === 'number') ||
          (typeof sec.graph.tier === 'number' && typeof sec.graph.lane === 'number'))
      ) {
        const resolved = resolveCoordinates(sec.graph, sec.position || i + 1);
        x = resolved.x;
        y = resolved.y;
      } else {
        x = total > 1 ? 100 + Math.round((i * 950) / (total - 1)) : 100;
        y = Math.round(310 + Math.sin(i * 1.1) * 150);
      }

      const pos = sec.position || i + 1;
      const lessonsCount = Array.isArray(sec.lessons) ? sec.lessons.length : 0;
      const estimatedMinutes = sec.estimated_minutes || 15;
      const isFirst = i === 0;

      return {
        id: `${courseKey}-s${pos}`,
        code: `S${pos}`,
        label: String(sec.title || '').toUpperCase().slice(0, 34),
        subtitle: `${lessonsCount} LECCIONES · ~${estimatedMinutes} MIN`,
        x,
        y,
        variant: isFirst ? 'active' : 'locked',
        iconType: isFirst ? 'brackets' : 'lock',
        stars: 0,
        maxStars: 3,
        xp: 60,
        statusText: isFirst ? 'ACTIVO • EN PROGRESO' : `RQ S${pos - 1}`,
        isUnlocked: isFirst,
      };
    });

    const connections = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      const from = nodes[i];
      const to = nodes[i + 1];
      const mx = (from.x + to.x) / 2;
      const conn = {
        id: `c-${courseKey}-s${i + 1}-s${i + 2}`,
        fromId: from.id,
        toId: to.id,
        color: ACCENT,
        path: `M ${from.x} ${from.y} C ${mx} ${from.y}, ${mx} ${to.y}, ${to.x} ${to.y}`,
        ...(i > 0 ? { isDashed: true } : {}),
      };
      connections.push(conn);
    }

    lessonsDataset[courseKey] = {
      sectorTitle: `LUA · ${String(m.title || modJson.title || '').toUpperCase()}`,
      progressPercent: 0,
      nodes,
      connections,
    };
  }

  return `import { GraphDataset } from '../roadmap-graph.types';

// Generado desde content/languages/lua/modules/*/module.json — no editar a mano.
export const LUA_LESSONS: Record<string, GraphDataset> = ${JSON.stringify(lessonsDataset, null, 2)};
`;
}

function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const loadedModulesByCode = new Map();

  for (const m of manifest.modules || []) {
    const modJson = loadModuleJson(m.path);
    if (modJson) {
      loadedModulesByCode.set(m.code, modJson);
    }
  }

  const trackMockContent = generateTrackMock(manifest, loadedModulesByCode);
  const lessonsMockContent = generateLessonsGraphMock(
    manifest,
    loadedModulesByCode,
  );

  fs.writeFileSync(TRACK_MOCK_PATH, trackMockContent, 'utf8');
  fs.writeFileSync(LESSONS_MOCK_PATH, lessonsMockContent, 'utf8');

  console.log(
    `✅ [Koda Roadmap Generator] Generados:\n  - ${path.relative(ROOT_DIR, TRACK_MOCK_PATH)} (${manifest.modules.length} módulos)\n  - ${path.relative(ROOT_DIR, LESSONS_MOCK_PATH)} (${loadedModulesByCode.size} cursos con secciones)`,
  );
}

if (require.main === module) {
  main();
}

module.exports = {
  resolveCoordinates,
  generateTrackMock,
  generateLessonsGraphMock,
};
