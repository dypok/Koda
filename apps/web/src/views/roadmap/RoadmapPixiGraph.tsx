'use client';

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { GraphDataset, GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { useRoadmapStore } from '@/stores/roadmap.store';
import {
  loadPixi,
  dprCap,
  getGlowTexture,
  GLOW_TEXTURE_SIZE,
  useElementVisible,
  type PixiApp,
  type PixiContainer,
  type PixiGraphics,
} from '@/lib/pixi/engine';

const VIEW_W = 1150;
const VIEW_H = 620;

export type EdgeStyle = 'static' | 'flow' | 'packets' | 'pulse' | 'cylindrical';
export type NodeStyle = 'medallion' | 'hex' | 'donut';
export type EdgeDesign = 'curve' | 'twin' | 'morse';
export type UnlockStyle = 'shockwave' | 'ignition';

interface RoadmapPixiGraphProps {
  dataset: GraphDataset;
  branchColor: string;
  activeNodeId: string | null;
  onSelect: (node: GraphNode) => void;
  /** Animación de las conexiones desbloqueadas. Solo preview/lab salvo 'static'. */
  edgeStyle?: EdgeStyle;
  /** Diseño de los medallones. */
  nodeStyle?: NodeStyle;
  /** Trazado de las líneas. */
  edgeDesign?: EdgeDesign;
  /** Nodo en cinemática de desbloqueo (lab). */
  unlockingNodeId?: string | null;
  /** Estética de la cinemática de desbloqueo. */
  unlockStyle?: UnlockStyle;
}

type Cubic = [number, number, number, number, number, number, number, number];

interface EdgeCurve {
  pts: [number, number][];
  pts2?: [number, number][];
  color: number;
  lit: boolean;
  dashed: boolean;
  sprites: PixiContainer[];
  phase: number;
}

/** Desplaza una polilínea d px a lo largo de sus normales (para el haz doble). */
function offsetPts(pts: [number, number][], d: number): [number, number][] {
  return pts.map((p, i) => {
    const q = pts[Math.min(pts.length - 1, i + 1)] ?? p;
    const o = pts[Math.max(0, i - 1)] ?? p;
    const dx = q[0] - o[0];
    const dy = q[1] - o[1];
    const len = Math.hypot(dx, dy) || 1;
    return [p[0] + (-dy / len) * d, p[1] + (dx / len) * d];
  });
}

function parsePath(path: string): Cubic | null {
  const m = /^M\s+([-\d.]+)\s+([-\d.]+)\s+C\s+([-\d.]+)\s+([-\d.]+),\s*([-\d.]+)\s+([-\d.]+),\s*([-\d.]+)\s+([-\d.]+)$/i.exec(
    path.trim()
  );
  if (!m) return null;
  return [1, 2, 3, 4, 5, 6, 7, 8].map((i) => Number(m[i])) as Cubic;
}

/**
 * Resuelve una curva Bézier cúbica asegurando que inicie exactamente en el centro
 * del nodo A y finalice en el nodo B, preservando tangentes relativas y corrigiendo
 * cualquier desfasaje originado en fuentes de datos externas.
 */
function resolveCurve(
  path: string | undefined,
  a: GraphNode | undefined,
  b: GraphNode | undefined
): Cubic | null {
  const raw = path ? parsePath(path) : null;
  if (!a || !b) return raw;
  if (raw) {
    const [x0, y0, x1, y1, x2, y2, x3, y3] = raw;
    // Si los puntos inicial y final ya coinciden con los centros de los nodos, se mantiene
    if (
      Math.abs(x0 - a.x) < 0.5 &&
      Math.abs(y0 - a.y) < 0.5 &&
      Math.abs(x3 - b.x) < 0.5 &&
      Math.abs(y3 - b.y) < 0.5
    ) {
      return raw;
    }
    // Si hay desfasaje, anclamos rígidamente a (a.x, a.y) y (b.x, b.y) proyectando tangentes
    return [
      a.x,
      a.y,
      a.x + (x1 - x0),
      a.y + (y1 - y0),
      b.x + (x2 - x3),
      b.y + (y2 - y3),
      b.x,
      b.y,
    ];
  }
  // Curva horizontal suave por defecto entre centros de nodos
  const dx = Math.abs(b.x - a.x) * 0.5;
  return [a.x, a.y, a.x + dx, a.y, b.x - dx, b.y, b.x, b.y];
}

function hexToNumber(hex: string, fallback: number): number {
  const parsed = Number.parseInt(hex.replace('#', ''), 16);
  return Number.isFinite(parsed) ? parsed : fallback;
}

type NodeState = 'done' | 'active' | 'open' | 'locked';

function nodeStateOf(node: GraphNode): NodeState {
  if (node.variant === 'completed') return 'done';
  if (node.variant === 'active') return 'active';
  if (node.isUnlocked) return 'open';
  return 'locked';
}

/** Icono vectorial mínimo por tipo, centrado en (0,0), ~12px. */
function drawIcon(g: PixiGraphics, icon: GraphNode['iconType'], color: number): void {
  g.lineStyle(1.8, color, 1);
  g.beginFill(color, 1);
  switch (icon) {
    case 'brackets':
      g.moveTo(-1, -5);
      g.lineTo(-5, 0);
      g.lineTo(-1, 5);
      g.moveTo(1, -5);
      g.lineTo(5, 0);
      g.lineTo(1, 5);
      break;
    case 'code':
      g.moveTo(-5, -3);
      g.lineTo(-1, 0);
      g.lineTo(-5, 3);
      g.moveTo(0, 4.5);
      g.lineTo(5, 4.5);
      break;
    case 'lock':
      g.drawRect(-4, -1, 8, 7);
      g.arc(0, -1, 3, Math.PI, 0);
      break;
    case 'skull':
      g.drawCircle(0, -0.5, 4);
      g.drawCircle(-1.5, -1, 1);
      g.drawCircle(1.5, -1, 1);
      g.moveTo(-2, 4.5);
      g.lineTo(-2, 3);
      g.moveTo(0, 4.5);
      g.lineTo(0, 3);
      g.moveTo(2, 4.5);
      g.lineTo(2, 3);
      break;
    case 'chest':
      g.drawRect(-5, -2, 10, 7);
      g.moveTo(-5, 1);
      g.lineTo(5, 1);
      g.drawCircle(0, 1, 1.2);
      break;
    case 'matrix':
      for (let ix = -1; ix <= 1; ix++) for (let iy = -1; iy <= 1; iy++) g.drawCircle(ix * 3.5, iy * 3.5, 0.9);
      break;
    case 'flow':
      g.moveTo(-5, 0);
      g.lineTo(3, 0);
      g.moveTo(0, -3);
      g.lineTo(4, 0);
      g.lineTo(0, 3);
      break;
    case 'atom':
      g.drawCircle(0, 0, 1.6);
      g.drawEllipse(0, 0, 6, 2.4);
      break;
    case 'server':
      g.drawRect(-4, -5, 8, 10);
      g.moveTo(-4, 0);
      g.lineTo(4, 0);
      g.drawCircle(-2, -2.5, 0.9);
      g.drawCircle(-2, 2.5, 0.9);
      break;
    case 'database':
      g.drawEllipse(0, -3, 4, 1.8);
      g.moveTo(-4, -3);
      g.lineTo(-4, 3);
      g.moveTo(4, -3);
      g.lineTo(4, 3);
      g.moveTo(-4, 3);
      g.quadraticCurveTo(0, 5.5, 4, 3);
      break;
    default:
      g.moveTo(0, -5);
      g.lineTo(4, 0);
      g.lineTo(0, 5);
      g.lineTo(-4, 0);
      g.lineTo(0, -5);
      break;
  }
}

interface IrisNodeRefs {
  vernier: PixiContainer;
  iris: PixiContainer;
  shock: PixiContainer;
  core: PixiContainer;
  glyph: PixiContainer;
}

interface AnimBits {
  rings: { obj: PixiContainer; speed: number }[];
  halos: { obj: PixiContainer; base: number; phase: number }[];
  sats: { obj: PixiContainer; angle: number; radius: number; speed: number }[];
  holders: Record<string, PixiContainer>;
  irisNodes: Record<string, IrisNodeRefs>;
}

interface FxBurst {
  kind: UnlockStyle;
  nodeId: string;
  x: number;
  y: number;
  color: number;
  t: number;
  dur: number;
}

/** Grafo del roadmap en Pixi: medallones detallados (anillos, halo, icono, progreso, satélite). */
export const RoadmapPixiGraph: React.FC<RoadmapPixiGraphProps> = ({
  dataset,
  branchColor,
  activeNodeId,
  onSelect,
  edgeStyle = 'static',
  nodeStyle = 'medallion',
  edgeDesign = 'curve',
  unlockingNodeId = null,
  unlockStyle = 'shockwave',
}) => {
  const reduceMotion = useReducedMotion();
  const [mountRef, visible] = useElementVisible<HTMLDivElement>();
  const appRef = useRef<PixiApp | null>(null);
  const animRef = useRef<AnimBits>({ rings: [], halos: [], sats: [], holders: {}, irisNodes: {} });
  const edgeRef = useRef<{ style: EdgeStyle; curves: EdgeCurve[] }>({ style: 'static', curves: [] });
  const fxRef = useRef<{ pending: Omit<FxBurst, 't'> | null; live: FxBurst[] }>({ pending: null, live: [] });
  const stateRef = useRef({ panX: 0, panY: 0, zoom: 100, travelX: 0, travelY: 0, tTravelX: 0, tTravelY: 0 });
  const propsRef = useRef({ dataset, branchColor, activeNodeId, onSelect, edgeStyle, nodeStyle, edgeDesign });
  propsRef.current = { dataset, branchColor, activeNodeId, onSelect, edgeStyle, nodeStyle, edgeDesign };
  const downRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let cancelled = false;
    let unsubscribe: (() => void) | null = null;
    let ro: ResizeObserver | null = null;

    const boot = async () => {
      const PIXI = await loadPixi();
      if (cancelled) return;
      const rect = mount.getBoundingClientRect();
      let W = Math.max(1, Math.round(rect.width));
      let H = Math.max(1, Math.round(rect.height));
      const app = new PIXI.Application({
        width: W,
        height: H,
        backgroundAlpha: 0,
        antialias: true,
        resolution: dprCap(),
      });
      if (cancelled) {
        try {
          app.destroy(true);
        } catch {
          /* noop */
        }
        return;
      }
      const view = app.view as unknown as HTMLCanvasElement;
      view.style.position = 'absolute';
      view.style.inset = '0';
      view.style.width = '100%';
      view.style.height = '100%';
      view.style.display = 'block';
      mount.appendChild(view);
      appRef.current = app;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const world = new PIXI.Container();
      const connLayer = new PIXI.Graphics();
      const slugLayer = new PIXI.Graphics();
      const edgeOverlay = new PIXI.Container();
      const nodeLayer = new PIXI.Container();
      const reticle = new PIXI.Container();
      const fxLayer = new PIXI.Graphics();
      world.addChild(connLayer, slugLayer, edgeOverlay, nodeLayer, reticle, fxLayer);
      app.stage.addChild(world);
      const glowTex = getGlowTexture(PIXI);

      const sampleCurve = (cubic: Cubic | null, a: GraphNode | undefined, b: GraphNode | undefined): [number, number][] => {
        const pts: [number, number][] = [];
        const curve = cubic ?? (a && b ? resolveCurve(undefined, a, b) : null);
        const N = 60;
        for (let i = 0; i <= N; i++) {
          const t = i / N;
          if (curve) {
            const u = 1 - t;
            const [x0, y0, x1, y1, x2, y2, x3, y3] = curve;
            pts.push([
              u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
              u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3,
            ]);
          } else if (a && b) {
            pts.push([a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t]);
          }
        }
        return pts;
      };

      const buildEdgeOverlay = () => {
        const { dataset: ds, edgeStyle: style } = propsRef.current;
        edgeOverlay.removeChildren().forEach((c) => c.destroy({ children: true }));
        const curves = edgeRef.current.curves;
        curves.length = 0;
        if (style === 'static' || reduced) return;
        ds.connections.forEach((c, ci) => {
          const a = byId.get(c.fromId);
          const b = byId.get(c.toId);
          const lit = Boolean((a?.isUnlocked || a?.variant === 'completed') && (b?.isUnlocked || b?.variant === 'completed'));
          const pts = sampleCurve(resolveCurve(c.path, a, b), a, b);
          if (pts.length === 0) return;
          const { edgeDesign: design } = propsRef.current;
          const entry: EdgeCurve = {
            pts,
            pts2: design === 'twin' ? offsetPts(pts, 3.5) : undefined,
            color: hexToNumber(c.color, 0x8fa8ff),
            lit,
            dashed: Boolean(c.isDashed),
            sprites: [],
            phase: (ci * 0.37) % 1,
          };
          curves.push(entry);
          if (!lit || style === 'cylindrical') return;
          const count = style === 'packets' ? 2 : 4;
          for (let k = 0; k < count; k++) {
            const sp = new PIXI.Sprite(glowTex);
            sp.anchor.set(0.5);
            sp.tint = entry.color;
            sp.scale.set(((style === 'packets' ? 7 : 10 - k * 2) / GLOW_TEXTURE_SIZE) * 2);
            sp.alpha = style === 'packets' ? 0 : [0.95, 0.55, 0.3, 0.15][k] ?? 0.2;
            edgeOverlay.addChild(sp);
            entry.sprites.push(sp);
          }
        });
      };

      const byId = new Map<string, GraphNode>();

      const inPattern = (pattern: number[], pos: number): boolean => {
        const cycle = pattern.reduce((x, y) => x + y, 0);
        let p = ((pos % cycle) + cycle) % cycle;
        for (let k = 0; k < pattern.length; k += 2) {
          const on = pattern[k] ?? 0;
          if (p < on) return true;
          p -= on + (pattern[k + 1] ?? 0);
        }
        return false;
      };

      const strokeSamples = (
        pts: [number, number][],
        color: string | number,
        alpha: number,
        width: number,
        pattern: number[] | null,
        offset: number
      ) => {
        if (pts.length === 0) return;
        connLayer.lineStyle(width, color, alpha);
        if (!pattern) {
          const p0 = pts[0];
          if (!p0) return;
          connLayer.moveTo(p0[0], p0[1]);
          for (let i = 1; i < pts.length; i++) {
            const p = pts[i];
            if (p) connLayer.lineTo(p[0], p[1]);
          }
          return;
        }
        for (let i = 0; i < pts.length - 1; i++) {
          if (!inPattern(pattern, i + offset)) continue;
          const p = pts[i];
          const q = pts[i + 1];
          if (p && q) {
            connLayer.moveTo(p[0], p[1]);
            connLayer.lineTo(q[0], q[1]);
          }
        }
      };

      const drawConnections = () => {
        const { dataset: ds, edgeDesign: design, edgeStyle: style } = propsRef.current;
        connLayer.clear();
        for (const c of ds.connections) {
          const a = byId.get(c.fromId);
          const b = byId.get(c.toId);
          const lit = (a?.isUnlocked || a?.variant === 'completed') && (b?.isUnlocked || b?.variant === 'completed');
          const cubic = resolveCurve(c.path, a, b);

          if (lit) {
            // =========================================================================
            // GLOW AMBIENTAL PERMANENTE EN RUTAS DESBLOQUEADAS (Estilo Mapa SVG)
            // =========================================================================
            const pts = sampleCurve(cubic, a, b);
            const lists = design === 'twin' ? [pts, offsetPts(pts, 3.5)] : [pts];

            for (const pList of lists) {
              // 1. Halo difuso grueso envolvente (9px)
              strokeSamples(pList, c.color, 0.24, 9, null, 0);
              // 2. Trazo central conductor nítido (2px)
              strokeSamples(pList, c.color, 0.65, 2, null, 0);
            }
          } else {
            // Filamento en reposo / bloqueado: trazo discreto titanio
            const color = '#252f3f';
            const alpha = 0.45;
            if (design === 'twin') {
              const pts = sampleCurve(cubic, a, b);
              strokeSamples(pts, color, alpha, 1.5, null, 0);
              strokeSamples(offsetPts(pts, 3.5), color, alpha * 0.7, 1.5, null, 0);
              continue;
            }
            const morse = design === 'morse' && c.isDashed;
            if (cubic && !c.isDashed && !morse) {
              const [x0, y0, x1, y1, x2, y2, x3, y3] = cubic;
              connLayer.lineStyle(2, color, alpha);
              connLayer.moveTo(x0, y0);
              connLayer.bezierCurveTo(x1, y1, x2, y2, x3, y3);
            } else if (cubic) {
              strokeSamples(sampleCurve(cubic, a, b), color, alpha, 2, morse ? [12, 5, 3, 5] : [8, 8], 0);
            } else if (a && b) {
              connLayer.lineStyle(2, color, alpha);
              connLayer.moveTo(a.x, a.y);
              connLayer.lineTo(b.x, b.y);
            }
          }
        }
      };

      const dashedCircle = (g: PixiGraphics, r: number, segs: number, skipEvery: number) => {
        for (let i = 0; i < segs; i++) {
          if (i % skipEvery === 0) continue;
          const a0 = (i / segs) * Math.PI * 2;
          const a1 = ((i + 1) / segs) * Math.PI * 2;
          g.moveTo(Math.cos(a0) * r, Math.sin(a0) * r);
          g.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
        }
      };

      const buildNodes = (animateIn: boolean) => {
        const { dataset: ds, branchColor: bc, activeNodeId: activeId, onSelect: select, nodeStyle } = propsRef.current;
        gsap.killTweensOf(nodeLayer.children);
        Object.values(animRef.current.irisNodes).forEach((iris) => {
          if (iris) {
            gsap.killTweensOf([iris.vernier, iris.iris, iris.shock, iris.glyph, iris.core]);
            if (iris.iris) gsap.killTweensOf(iris.iris.scale);
            if (iris.shock) gsap.killTweensOf(iris.shock.scale);
            if (iris.glyph) gsap.killTweensOf(iris.glyph.scale);
          }
        });
        nodeLayer.removeChildren().forEach((c) => c.destroy({ children: true }));
        animRef.current = { rings: [], halos: [], sats: [], holders: {}, irisNodes: {} };
        const accentNum = hexToNumber(bc, 0x38bdf8);

        ds.nodes.forEach((n, idx) => {
          const st = nodeStateOf(n);
          const boss = n.variant === 'boss';
          const active = n.id === activeId;
          const R = active ? 14 : 12;
          const coreColor =
            st === 'done'
              ? 0x34d399
              : st === 'active'
              ? (boss ? 0xf43f5e : accentNum)
              : st === 'open'
              ? 0xff6a00
              : 0x0f172a;
          const ringColor =
            st === 'done'
              ? 0x34d399
              : st === 'active'
              ? (boss ? 0xf43f5e : accentNum)
              : st === 'open'
              ? 0xffa338
              : boss
              ? 0xf43f5e
              : 0x475569;

          const holder = new PIXI.Container();
          holder.position.set(n.x, n.y);
          holder.eventMode = 'static';
          holder.cursor = n.isUnlocked ? 'pointer' : 'default';
          holder.hitArea = new PIXI.Circle(0, 0, 32);

          const frac =
            typeof n.maxStars === 'number' && n.maxStars > 0
              ? Math.max(0, Math.min(1, (n.stars ?? 0) / n.maxStars))
              : 0;

          if (nodeStyle === 'hex') {
            // =========================================================================
            // MÓDULO IRIS B CARTOGRAPHY & VERNIER SCALE (Prototipo Lua Core)
            // =========================================================================
            // 1. Halo cuántico de alta tensión en nodos activos / completados / desbloqueados
            const halo = new PIXI.Sprite(glowTex);
            halo.anchor.set(0.5);
            const haloBase = st === 'active' ? 0.75 : st === 'done' ? 0.45 : st === 'open' ? 0.35 : 0.08;
            halo.scale.set(((R * 6) / GLOW_TEXTURE_SIZE) * 2);
            halo.tint = boss
              ? 0xf43f5e
              : st === 'active'
              ? 0xffa338
              : st === 'done'
              ? 0xff6a00
              : st === 'open'
              ? 0xff6a00
              : 0x1b2330;
            halo.alpha = haloBase;
            holder.addChild(halo);
            animRef.current.halos.push({ obj: halo, base: haloBase, phase: idx * 0.9 });

            // 2. Anillo de contención exterior base (r = 34)
            const outerRim = new PIXI.Graphics();
            outerRim.lineStyle(1.5, ringColor, st === 'locked' ? 0.4 : 0.9);
            outerRim.drawCircle(0, 0, 34);
            holder.addChild(outerRim);

            // 3. Escala Vernier micrométrica rotativa exterior (r = 30, stroke-dasharray 1 5)
            const vernier = new PIXI.Graphics();
            vernier.lineStyle(
              2.5,
              st === 'active' ? 0xffa338 : st === 'done' ? 0xff6a00 : st === 'open' ? 0xffa338 : 0x4b586b,
              st === 'locked' ? 0.35 : 0.85
            );
            dashedCircle(vernier, 30, 48, 2);
            holder.addChild(vernier);
            animRef.current.rings.push({
              obj: vernier,
              speed: st === 'active' ? 0.008 : st === 'done' ? 0.003 : st === 'open' ? 0.0025 : 0.001,
            });

            // 4. Diafragma Iris mecánico concéntrico (r = 23, stroke-dasharray 10 4)
            const iris = new PIXI.Graphics();
            iris.lineStyle(
              2.2,
              st === 'active' ? 0xff6a00 : st === 'done' ? 0xffa338 : st === 'open' ? 0xff6a00 : 0x313d4f,
              st === 'locked' ? 0.5 : 0.95
            );
            dashedCircle(iris, 23, 24, 3);
            holder.addChild(iris);
            animRef.current.rings.push({
              obj: iris,
              speed: st === 'active' ? -0.005 : st === 'done' ? -0.002 : st === 'open' ? -0.0018 : -0.0008,
            });

            // 5. Anillo Shockwave expansivo para detonación mecánica (r = 22)
            const shock = new PIXI.Graphics();
            shock.lineStyle(2.5, boss ? 0xf43f5e : 0xffa338, 1);
            shock.drawCircle(0, 0, 22);
            shock.alpha = 0;
            holder.addChild(shock);

            // 6. Núcleo térmico blindado central (node-core, r = 16)
            const core = new PIXI.Graphics();
            if (st === 'locked') {
              core.beginFill(0x05070b, 1);
              core.lineStyle(1.8, 0x1b2330, 0.9);
            } else if (st === 'active') {
              core.beginFill(0x18130d, 1);
              core.lineStyle(2, boss ? 0xf43f5e : 0xffa338, 1);
            } else if (st === 'done') {
              core.beginFill(0x0f1520, 1);
              core.lineStyle(1.8, 0xff6a00, 0.95);
            } else if (st === 'open') {
              core.beginFill(0x130e0a, 1);
              core.lineStyle(1.8, 0xff6a00, 0.9);
            } else {
              core.beginFill(0x0a0e15, 1);
              core.lineStyle(1.8, 0x4b586b, 0.8);
            }
            core.drawCircle(0, 0, 16);
            core.endFill();
            holder.addChild(core);

            // 7. Glifo vectorial centrado con resplandor
            const hicon = new PIXI.Graphics();
            drawIcon(
              hicon,
              n.iconType,
              st === 'locked'
                ? 0x4b586b
                : st === 'active'
                ? 0xffffff
                : st === 'done'
                ? 0xffa338
                : 0xf1f5f9
            );
            holder.addChild(hicon);

            // 8. Arco de estrellas / maestría si aplica
            if (frac > 0 && st !== 'locked') {
              const arc = new PIXI.Graphics();
              arc.lineStyle(2.5, 0xffa338, 0.95);
              arc.arc(0, 0, 36, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
              holder.addChild(arc);
            }

            // Registrar referencias para cinemática interactiva Iris B
            animRef.current.irisNodes[n.id] = {
              vernier,
              iris,
              shock,
              core,
              glyph: hicon,
            };
          } else if (nodeStyle === 'donut') {
            // Dona de progreso: el anillo grueso manda, núcleo mínimo sin icono.
            const track = new PIXI.Graphics();
            track.lineStyle(6, 0x1e293b, 1);
            track.drawCircle(0, 0, R + 8);
            holder.addChild(track);
            if (st === 'done' || frac > 0) {
              const arc = new PIXI.Graphics();
              arc.lineStyle(6, 0x34d399, 0.95);
              if (st === 'done') arc.drawCircle(0, 0, R + 8);
              else arc.arc(0, 0, R + 8, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
              holder.addChild(arc);
            }
            if (st === 'active') {
              const glow = new PIXI.Graphics();
              glow.lineStyle(1.5, ringColor, 0.6);
              dashedCircle(glow, R + 14, 36, 3);
              holder.addChild(glow);
              animRef.current.rings.push({ obj: glow, speed: 0.004 });
            }
            const dot = new PIXI.Graphics();
            if (st === 'locked') {
              dot.lineStyle(2, ringColor, 0.9);
              dot.beginFill(0x0f172a, 1);
            } else {
              dot.beginFill(coreColor, 1);
            }
            dot.drawCircle(0, 0, 8);
            dot.endFill();
            holder.addChild(dot);
          } else {
            // Medallón clásico: halo + anillo + núcleo + icono + satélite.
            const halo = new PIXI.Sprite(glowTex);
            halo.anchor.set(0.5);
            const haloBase = st === 'active' ? 0.5 : st === 'done' ? 0.32 : st === 'open' ? 0.18 : 0.07;
            halo.scale.set(((R * 5) / GLOW_TEXTURE_SIZE) * 2);
            halo.tint = coreColor;
            halo.alpha = haloBase;
            holder.addChild(halo);
            animRef.current.halos.push({ obj: halo, base: haloBase, phase: idx * 0.7 });

            const ring = new PIXI.Graphics();
            if (st === 'locked') {
              ring.lineStyle(1.5, ringColor, 0.8);
              dashedCircle(ring, R + 10, 36, 3);
              animRef.current.rings.push({ obj: ring, speed: 0.0015 });
            } else if (st === 'open') {
              ring.lineStyle(1.5, ringColor, 0.7);
              ring.drawCircle(0, 0, R + 10);
            } else {
              ring.lineStyle(2, ringColor, 0.95);
              dashedCircle(ring, R + 10, 44, 2);
              animRef.current.rings.push({ obj: ring, speed: st === 'active' ? 0.006 : 0.002 });
              ring.lineStyle(1, ringColor, 0.5);
              ring.drawCircle(0, 0, R + 5);
            }
            holder.addChild(ring);

            if (frac > 0 && st !== 'locked') {
              const arc = new PIXI.Graphics();
              arc.lineStyle(3, 0x34d399, 0.95);
              arc.arc(0, 0, R + 5, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
              holder.addChild(arc);
            }

            const core = new PIXI.Graphics();
            if (st === 'locked') {
              core.lineStyle(2, ringColor, 0.9);
              core.beginFill(0x0f172a, 1);
              core.drawCircle(0, 0, R);
              core.endFill();
            } else {
              core.beginFill(coreColor, 1);
              core.drawCircle(0, 0, R);
              core.endFill();
            }
            holder.addChild(core);

            const icon = new PIXI.Graphics();
            drawIcon(icon, n.iconType, st === 'locked' ? 0x94a3b8 : 0x020617);
            holder.addChild(icon);

            if (active && !reduced) {
              const sat = new PIXI.Graphics();
              sat.beginFill(boss ? 0xf43f5e : accentNum, 1);
              sat.drawCircle(0, 0, 2.5);
              sat.endFill();
              holder.addChild(sat);
              animRef.current.sats.push({ obj: sat, angle: idx, radius: R + 10, speed: 0.03 });
            }
          }

          // Etiquetas técnicas de telemetría cartográfica
          const tagSuffix = st === 'done' ? '· OK' : st === 'active' ? '· ACTV' : st === 'locked' ? '· LOCK' : '· OPEN';
          const codeText = nodeStyle === 'hex' ? `${n.code} ${tagSuffix}` : n.code;
          const code = new PIXI.Text(codeText, {
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontSize: 10,
            fontWeight: '700',
            fill: st === 'active' ? '#ffa338' : st === 'done' ? '#ff6a00' : st === 'open' ? '#ffa338' : '#475569',
          });
          code.anchor.set(0.5, 1);
          const topOffset = nodeStyle === 'hex' ? -42 : -R - 16;
          code.position.set(0, topOffset);
          holder.addChild(code);

          const label = new PIXI.Text(n.label, {
            fontFamily: 'Rajdhani, Inter, sans-serif',
            fontSize: 12,
            fontWeight: '600',
            fill: st === 'active' ? '#ffffff' : n.isUnlocked ? '#f8fafc' : '#64748b',
          });
          label.anchor.set(0.5, 0);
          const bottomOffset = nodeStyle === 'hex' ? 40 : R + 14;
          label.position.set(0, bottomOffset);
          holder.addChild(label);

          holder.on('pointertap', (e) => {
            const ev = e as unknown as { nativeEvent?: MouseEvent | TouchEvent; client?: { x: number; y: number } };
            const native = ev.nativeEvent;
            const down = downRef.current;
            const clientX =
              (native as MouseEvent)?.clientX ??
              (native as TouchEvent)?.changedTouches?.[0]?.clientX ??
              ev.client?.x;
            const clientY =
              (native as MouseEvent)?.clientY ??
              (native as TouchEvent)?.changedTouches?.[0]?.clientY ??
              ev.client?.y;
            if (down && clientX !== undefined && clientY !== undefined) {
              if (Math.hypot(clientX - down.x, clientY - down.y) > 16) return;
            }
            select(n);
          });
          if (n.isUnlocked && !reduced) {
            holder.on('pointerover', () => gsap.to(holder.scale, { x: 1.1, y: 1.1, duration: 0.25, ease: 'power2.out', overwrite: 'auto' }));
            holder.on('pointerout', () => gsap.to(holder.scale, { x: 1, y: 1, duration: 0.3, ease: 'power2.out', overwrite: 'auto' }));
          }

          nodeLayer.addChild(holder);
          animRef.current.holders[n.id] = holder;
          if (animateIn && !reduced) {
            gsap.from(holder.scale, { x: 0, y: 0, duration: 0.5, delay: 0.15 + idx * 0.05, ease: 'back.out(1.7)', overwrite: 'auto' });
            gsap.from(holder, { alpha: 0, duration: 0.4, delay: 0.15 + idx * 0.05, overwrite: 'auto' });
          }
        });
      };

      const drawReticle = () => {
        const { dataset: ds, branchColor: bc, activeNodeId: activeId } = propsRef.current;
        reticle.removeChildren().forEach((c) => c.destroy({ children: true }));
        const n = ds.nodes.find((x) => x.id === activeId);
        if (!n) return;
        const accent = n.variant === 'boss' ? '#F43F5E' : bc;
        const brackets = new PIXI.Graphics();
        brackets.lineStyle(2, accent, 0.7);
        const o = 46;
        const l = 12;
        brackets.moveTo(-o, -o + l);
        brackets.lineTo(-o, -o);
        brackets.lineTo(-o + l, -o);
        brackets.moveTo(o - l, -o);
        brackets.lineTo(o, -o);
        brackets.lineTo(o, -o + l);
        brackets.moveTo(-o, o - l);
        brackets.lineTo(-o, o);
        brackets.lineTo(-o + l, o);
        brackets.moveTo(o - l, o);
        brackets.lineTo(o, o);
        brackets.lineTo(o, o - l);
        brackets.position.set(n.x, n.y);
        reticle.addChild(brackets);
      };

      const applyWorld = () => {
        const s = stateRef.current;
        const fit = Math.min(W / VIEW_W, H / VIEW_H);
        const scale = fit * (s.zoom / 100);
        world.scale.set(scale);
        world.position.set((W - VIEW_W * scale) / 2 + s.panX + s.travelX, (H - VIEW_H * scale) / 2 + s.panY + s.travelY);
      };

      const refresh = (animateIn: boolean) => {
        const { dataset: ds, edgeStyle: style } = propsRef.current;
        byId.clear();
        ds.nodes.forEach((x) => byId.set(x.id, x));
        edgeRef.current.style = style;
        if (style === 'flow' && !reduced) {
          connLayer.clear();
        } else {
          drawConnections();
        }
        buildEdgeOverlay();
        buildNodes(animateIn);
        drawReticle();
        const { activeNodeId: activeId } = propsRef.current;
        const n = ds.nodes.find((x) => x.id === activeId);
        if (n) {
          stateRef.current.tTravelX = Math.round((575 - n.x) * 0.7);
          stateRef.current.tTravelY = Math.round((310 - n.y) * 0.7);
          if (reduced) {
            stateRef.current.travelX = stateRef.current.tTravelX;
            stateRef.current.travelY = stateRef.current.tTravelY;
          }
        }
        applyWorld();
        app.renderer.render(app.stage);
      };
      (app as unknown as { __refresh?: (animate: boolean) => void }).__refresh = refresh;

      const at = (pts: [number, number][], t: number): [number, number] => {
        const clamped = Math.max(0, Math.min(0.999, t));
        const f = clamped * (pts.length - 1);
        const i = Math.floor(f);
        const r = f - i;
        const p = pts[i] ?? pts[0];
        const q = pts[Math.min(pts.length - 1, i + 1)] ?? p;
        return [p[0] + (q[0] - p[0]) * r, p[1] + (q[1] - p[1]) * r];
      };

      let time = 0;
      const tick = () => {
        if (cancelled || !app?.renderer) return;
        const s = stateRef.current;
        const dt = Math.min(0.05, app.ticker.deltaMS / 1000);
        time += dt;
        const pending = fxRef.current.pending;
        if (pending) {
          fxRef.current.pending = null;
          fxRef.current.live.push({ ...pending, t: 0 });
        }
        if (fxRef.current.live.length > 0) {
          fxLayer.clear();
          fxRef.current.live = fxRef.current.live.filter((fx) => {
            fx.t += dt / fx.dur;
            const done = fx.t >= 1;
            const t = Math.min(1, fx.t);
            if (fx.kind === 'shockwave') {
              for (let k = 0; k < 3; k++) {
                const lt = Math.max(0, Math.min(1, (t - k * 0.15) / 0.7));
                if (lt <= 0 || lt >= 1) continue;
                fxLayer.lineStyle(3, fx.color, (1 - lt) * 0.85);
                fxLayer.drawCircle(fx.x, fx.y, 12 + lt * 68);
              }
              fxLayer.beginFill(0xffffff, (1 - t) * (1 - t) * 0.85);
              fxLayer.drawCircle(fx.x, fx.y, 16);
              fxLayer.endFill();
            } else {
              const sweep = t * Math.PI * 2;
              fxLayer.beginFill(fx.color, 0.45 * (1 - t * 0.5));
              fxLayer.moveTo(fx.x, fx.y);
              fxLayer.arc(fx.x, fx.y, 22, -Math.PI / 2, -Math.PI / 2 + sweep);
              fxLayer.lineTo(fx.x, fx.y);
              fxLayer.endFill();
              fxLayer.lineStyle(2, fx.color, 1 - t * 0.4);
              fxLayer.drawCircle(fx.x, fx.y, 22);
            }
            if (done) {
              const holder = animRef.current.holders[fx.nodeId];
              if (holder && !holder.destroyed) {
                gsap.fromTo(
                  holder.scale,
                  { x: 1, y: 1 },
                  { x: 1.25, y: 1.25, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.out', overwrite: 'auto' }
                );
              }
            }
            return !done;
          });
        }
        s.travelX += (s.tTravelX - s.travelX) * 0.12;
        s.travelY += (s.tTravelY - s.travelY) * 0.12;
        for (const r of animRef.current.rings) {
          if (r?.obj && !r.obj.destroyed) r.obj.rotation += r.speed;
        }
        for (const h of animRef.current.halos) {
          if (h?.obj && !h.obj.destroyed) h.obj.alpha = h.base * (0.85 + 0.15 * Math.sin(time * 2.2 + h.phase));
        }
        for (const sat of animRef.current.sats) {
          if (sat?.obj && !sat.obj.destroyed) {
            sat.angle += sat.speed;
            sat.obj.position.set(Math.cos(sat.angle) * sat.radius, Math.sin(sat.angle) * sat.radius);
          }
        }
        const edge = edgeRef.current;
        if (edge.style === 'flow') {
          const { edgeDesign: design } = propsRef.current;
          const offset = Math.floor(time * 28) % 64;
          connLayer.clear();
          for (const c of edge.curves) {
            const color = c.lit ? c.color : 0x1e293b;
            const alpha = c.lit ? 0.6 : 0.8;
            const lists = design === 'twin' && c.pts2 ? [c.pts, c.pts2] : [c.pts];
            for (const pts of lists) {
              const pattern = c.dashed ? (design === 'morse' ? [12, 5, 3, 5] : [8, 8]) : null;
              strokeSamples(pts, color, alpha, design === 'twin' ? 1.5 : 2, pattern, offset);
            }
          }
        } else if (edge.style === 'packets' || edge.style === 'pulse') {
          for (const c of edge.curves) {
            if (!c.lit) {
              c.sprites.forEach((sp) => {
                sp.alpha = 0;
              });
              continue;
            }
            c.sprites.forEach((sp, k) => {
              const speed = edge.style === 'packets' ? 0.22 : 0.32;
              const lag = edge.style === 'packets' ? 0.5 : 0.035;
              const t = (time * speed + c.phase + k * lag) % 1;
              const [x, y] = at(c.pts, t);
              sp.position.set(x, y);
              sp.alpha = edge.style === 'packets' ? Math.sin(t * Math.PI) * 0.95 : [0.95, 0.55, 0.3, 0.15][k] ?? 0.2;
            });
          }
        } else if (edge.style === 'cylindrical') {
          // =========================================================================
          // CONDUCTOS CILÍNDRICOS DE CARGA CUÁNTICA TÉRMICA (Prototipo Lua Core)
          // =========================================================================
          slugLayer.clear();
          const { edgeDesign: design } = propsRef.current;
          const SLUG_LEN = 0.28; // Longitud proporcional de la cápsula (28% de la curva)
          const speed = 0.26;

          // Modulación senoidal sutil de la respiración idle en la capa base
          connLayer.alpha = 0.82 + 0.18 * Math.sin(time * 2.4);

          for (const c of edge.curves) {
            if (!c.lit || c.pts.length < 2) continue;

            const tHead = (time * speed + c.phase) % 1;
            const tTail = tHead - SLUG_LEN;

            // Manejar segmentos continuos incluyendo el wrapping circular en los bordes
            const intervals: [number, number][] =
              tTail < 0 ? [[0, tHead], [1 + tTail, 1]] : [[tTail, tHead]];

            for (const [startT, endT] of intervals) {
              if (endT - startT < 0.005) continue;
              const numSteps = Math.max(3, Math.round((endT - startT) * 36));
              const stepDelta = (endT - startT) / numSteps;

              const subPts: [number, number][] = [];
              for (let sIdx = 0; sIdx <= numSteps; sIdx++) {
                subPts.push(at(c.pts, startT + sIdx * stepDelta));
              }

              const lists =
                design === 'twin' && c.pts2
                  ? [
                      subPts,
                      subPts.map((_, idx) => at(c.pts2!, startT + idx * stepDelta)),
                    ]
                  : [subPts];

              for (const pts of lists) {
                if (pts.length < 2) continue;
                const p0 = pts[0];
                if (!p0) continue;

                // 1. Halo difuminado exterior de alta dispersión térmica
                slugLayer.lineStyle(12, c.color, 0.2, 0.5, true);
                slugLayer.moveTo(p0[0], p0[1]);
                for (let pi = 1; pi < pts.length; pi++) slugLayer.lineTo(pts[pi][0], pts[pi][1]);

                // 2. Manga Térmica Cilíndrica (Charge Sleeve - Ámbar cuántico / color de rama)
                slugLayer.lineStyle(6.5, c.color, 0.95, 0.5, true);
                slugLayer.moveTo(p0[0], p0[1]);
                for (let pi = 1; pi < pts.length; pi++) slugLayer.lineTo(pts[pi][0], pts[pi][1]);

                // 3. Núcleo Plasma Blanco de Alta Densidad (Charge Core)
                slugLayer.lineStyle(2.2, 0xffffff, 1.0, 0.5, true);
                slugLayer.moveTo(p0[0], p0[1]);
                for (let pi = 1; pi < pts.length; pi++) slugLayer.lineTo(pts[pi][0], pts[pi][1]);
              }
            }
          }
        }
        applyWorld();
      };

      view.addEventListener('pointerdown', (e: PointerEvent) => {
        downRef.current = { x: e.clientX, y: e.clientY };
      });

      const syncStore = () => {
        const s = useRoadmapStore.getState();
        stateRef.current.panX = s.panOffset.x;
        stateRef.current.panY = s.panOffset.y;
        stateRef.current.zoom = s.zoomLevel;
        applyWorld();
      };
      unsubscribe = useRoadmapStore.subscribe(syncStore);
      syncStore();

      ro = new ResizeObserver(() => {
        if (cancelled || !app.renderer) return;
        const r = mount.getBoundingClientRect();
        W = Math.max(1, Math.round(r.width));
        H = Math.max(1, Math.round(r.height));
        if (app.renderer) {
          app.renderer.resize(W, H);
          applyWorld();
          if (app.stage) {
            app.renderer.render(app.stage);
          }
        }
      });
      ro.observe(mount);

      refresh(true);
      if (!reduced) app.ticker.add(tick);
    };

    void boot();
    return () => {
      cancelled = true;
      if (ro) {
        ro.disconnect();
        ro = null;
      }
      unsubscribe?.();
      unsubscribe = null;
      const app = appRef.current;
      appRef.current = null;
      if (app) {
        try {
          Object.values(animRef.current.holders).forEach((h) => gsap.killTweensOf([h.scale, h]));
          Object.values(animRef.current.irisNodes).forEach((iris) => {
            if (iris) {
              gsap.killTweensOf([iris.vernier, iris.iris, iris.shock, iris.glyph, iris.core]);
              if (iris.iris) gsap.killTweensOf(iris.iris.scale);
              if (iris.shock) gsap.killTweensOf(iris.shock.scale);
              if (iris.glyph) gsap.killTweensOf(iris.glyph.scale);
            }
          });
        } catch {
          /* noop */
        }
        try {
          app.ticker.stop();
        } catch {
          /* noop */
        }
        const v = app.view as unknown as HTMLElement;
        if (v && v.parentNode === mount) mount.removeChild(v);
        try {
          app.destroy(true);
        } catch {
          /* noop */
        }
      }
    };
    // Montaje: estilos y rama. Los cambios de dataset entran por refresco sin entrada.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchColor, edgeStyle, nodeStyle, edgeDesign, mountRef]);

  // Refresco de escena ante cambios de datos (candados, progreso): sin entrada.
  useEffect(() => {
    const app = appRef.current as unknown as { __refresh?: (animate: boolean) => void } | null;
    app?.__refresh?.(false);
  }, [dataset]);

  // Dispara la cinemática de desbloqueo sin reconstruir la escena.
  useEffect(() => {
    if (!unlockingNodeId || reduceMotion) return;
    const { dataset } = propsRef.current;
    const n = dataset.nodes.find((x) => x.id === unlockingNodeId);
    if (!n) return;
    fxRef.current.pending = {
      kind: unlockStyle,
      nodeId: n.id,
      x: n.x,
      y: n.y,
      color: n.variant === 'boss' ? 0xf43f5e : hexToNumber(branchColor, 0x8fa8ff),
      dur: unlockStyle === 'shockwave' ? 1.1 : 0.9,
    };
    appRef.current?.ticker.start();

    // Si tiene estructura Iris B, disparar la apertura mecánica sincronizada
    const irisSet = animRef.current.irisNodes[unlockingNodeId];
    if (
      irisSet?.vernier &&
      irisSet?.iris &&
      irisSet?.shock &&
      irisSet?.glyph &&
      !irisSet.vernier.destroyed &&
      !irisSet.iris.destroyed &&
      !irisSet.shock.destroyed &&
      !irisSet.glyph.destroyed
    ) {
      const tl = gsap.timeline();
      tl.to(irisSet.vernier, { rotation: '+=6.28318', duration: 0.7, ease: 'power2.inOut' });
      tl.to(irisSet.iris, { rotation: '-=3.14159', duration: 0.45, ease: 'power3.in' }, '-=0.6');
      tl.fromTo(irisSet.iris.scale, { x: 1, y: 1 }, { x: 0.15, y: 0.15, duration: 0.35, ease: 'power2.in' }, '-=0.55');
      tl.to(irisSet.iris.scale, { x: 1.5, y: 1.5, duration: 0.3, ease: 'power2.out' });
      tl.to(irisSet.iris.scale, { x: 1, y: 1, duration: 0.2, ease: 'power1.out' });
      tl.fromTo(irisSet.shock, { alpha: 1 }, { alpha: 0, duration: 0.45, ease: 'power2.out' }, '-=0.35');
      tl.fromTo(irisSet.shock.scale, { x: 0.8, y: 0.8 }, { x: 1.7, y: 1.7, duration: 0.45, ease: 'power2.out' }, '-=0.45');
      tl.fromTo(irisSet.glyph.scale, { x: 0.3, y: 0.3 }, { x: 1, y: 1, duration: 0.35, ease: 'back.out(2)' }, '-=0.3');
    }
  }, [unlockingNodeId, unlockStyle, branchColor, reduceMotion]);

  useEffect(() => {
    const app = appRef.current;
    if (!app || reduceMotion) return;
    if (visible) app.ticker.start();
    else app.ticker.stop();
  }, [visible, reduceMotion]);

  // Pulso GSAP sutil de selección al cambiar de nodo + recentrado (la cinemática de apertura Iris B es exclusiva de unlockingNodeId)
  useEffect(() => {
    const app = appRef.current as unknown as { __refresh?: (animate: boolean) => void } | null;
    app?.__refresh?.(false);
    const { activeNodeId: activeId } = propsRef.current;
    const holder = activeId ? animRef.current.holders[activeId] : undefined;

    if (!reduceMotion && holder) {
      // Feedback sutil y rápido de selección, sin disparar la detonación/apertura de desbloqueo
      gsap.fromTo(
        holder.scale,
        { x: 1, y: 1 },
        { x: 1.08, y: 1.08, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out', overwrite: 'auto' }
      );
    }
  }, [activeNodeId, reduceMotion]);

  return <div ref={mountRef} className="absolute inset-0" />;
};

export default RoadmapPixiGraph;
