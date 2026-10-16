'use client';

/** Motores de fondo ASCII: todos lentos por contrato (px/s de un dígito, Hz < 0.5). */

export type BgKey =
  | 'fog-drift' | 'slow-rain' | 'kepler' | 'breath' | 'tide'
  | 'meteors' | 'binary-pulse' | 'spiral' | 'code-snow' | 'horizon'
  | 'aurora' | 'twinkle-field' | 'rings' | 'side-wind' | 'depth'
  | 'kepler-spiral';

export interface BgMeta {
  key: BgKey;
  num: number;
  label: string;
  blurb: string;
}

export const BG_PROPOSALS: BgMeta[] = [
  { key: 'fog-drift', num: 16, label: 'Niebla a la deriva', blurb: 'Glifos grandes flotando en deriva sinusoidal, apenas visibles.' },
  { key: 'slow-rain', num: 17, label: 'Lluvia lenta', blurb: 'Matrix a un tercio de velocidad, columnas espaciadas con estela.' },
  { key: 'kepler', num: 18, label: 'Órbita kepleriana', blurb: 'Anillo elíptico de caracteres orbitando despacio con parpadeo.' },
  { key: 'breath', num: 19, label: 'Respiración', blurb: 'Rejilla estática que respira en ondas de brillo, sin traslación.' },
  { key: 'tide', num: 20, label: 'Marea', blurb: 'Tres bandas sinusoidales de glifos viajando en horizontal.' },
  { key: 'meteors', num: 21, label: 'Fugaces', blurb: 'Campo tenue con una estela lenta cada pocos segundos.' },
  { key: 'binary-pulse', num: 22, label: 'Pulso binario', blurb: 'Mar de 0 y 1 con una onda de brillo en diagonal.' },
  { key: 'spiral', num: 23, label: 'Espiral', blurb: 'Tres brazos de caracteres rotando a 0.03 rad/s.' },
  { key: 'code-snow', num: 24, label: 'Nieve de código', blurb: 'Símbolos cayendo a 8–16 px/s con vaivén lateral.' },
  { key: 'horizon', num: 25, label: 'Horizonte', blurb: 'Rejilla en perspectiva avanzando despacio hacia el observador.' },
  { key: 'aurora', num: 26, label: 'Aurora', blurb: 'Columnas ascendentes ámbar→cian que se desvanecen arriba.' },
  { key: 'twinkle-field', num: 27, label: 'Parpadeo estelar', blurb: 'Noventa glifos fijos titilando a frecuencias bajas.' },
  { key: 'rings', num: 28, label: 'Anillos', blurb: 'Ondas concéntricas de glifos naciendo del centro cada 3 s.' },
  { key: 'side-wind', num: 29, label: 'Viento lateral', blurb: 'Deriva horizontal lenta con oscilación vertical suave.' },
  { key: 'depth', num: 30, label: 'Profundidad', blurb: 'Tres capas de parallax a 4, 8 y 14 px/s.' },
  { key: 'kepler-spiral', num: 31, label: 'Kepler + espiral', blurb: 'Órbita elíptica y brazos en espiral compartiendo un solo lienzo.' },
];

export interface Engine {
  frame: (t: number, dt: number) => void;
}

interface Ctx {
  ctx: CanvasRenderingContext2D;
  W: number;
  H: number;
  density: number;
}

const TAU = Math.PI * 2;
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)] as T;
const CODE = ['{', '}', '<', '>', '=', ';', '(', ')', '#', '/', '+', '-', ':', '*'];
const AMBER = '245,158,11';
const SLATE = '100,116,139';
const CYAN = '34,211,238';

function text(ctx: CanvasRenderingContext2D, ch: string, x: number, y: number, size: number, color: string, alpha: number) {
  ctx.font = `${size}px "JetBrains Mono", ui-monospace, monospace`;
  ctx.fillStyle = `rgba(${color},${Math.max(0, Math.min(1, alpha)).toFixed(3)})`;
  ctx.fillText(ch, x, y);
}

function clear({ ctx, W, H }: Ctx) {
  ctx.clearRect(0, 0, W, H);
}

const builders: Record<BgKey, (c: Ctx) => Engine> = {
  'fog-drift': (c) => {
    const ps = Array.from({ length: Math.round(34 * c.density) }, () => ({
      ch: pick(CODE), x: Math.random(), y: Math.random(), s: rnd(28, 46),
      a: rnd(0.04, 0.1), f1: rnd(0.02, 0.05), f2: rnd(0.02, 0.05), p1: rnd(0, TAU), p2: rnd(0, TAU),
    }));
    return { frame: (t) => { clear(c); for (const p of ps) text(c.ctx, p.ch, (p.x + 0.03 * Math.sin(t * p.f1 + p.p1)) * c.W, (p.y + 0.03 * Math.cos(t * p.f2 + p.p2)) * c.H, p.s, Math.random() < 0.12 ? AMBER : SLATE, p.a); } };
  },
  'slow-rain': (c) => {
    const cols = Math.floor(c.W / 34) + 1;
    const ys = Array.from({ length: cols }, () => rnd(0, c.H));
    return {
      frame: (_, dt) => {
        c.ctx.fillStyle = 'rgba(6,7,10,0.08)';
        c.ctx.fillRect(0, 0, c.W, c.H);
        c.ctx.font = '12px "JetBrains Mono", monospace';
        for (let i = 0; i < cols; i++) {
          const y = ys[i] ?? 0;
          c.ctx.fillStyle = i % 7 === 0 ? 'rgba(245,158,11,0.4)' : 'rgba(100,116,139,0.28)';
          c.ctx.fillText(pick(CODE), i * 34, y);
          ys[i] = y > c.H + 20 ? -20 : y + dt * 14;
        }
      },
    };
  },
  kepler: (c) => {
    const ps = Array.from({ length: Math.round(110 * c.density) }, () => ({
      ch: pick(CODE), r: rnd(0.2, 0.75), a: rnd(0, TAU), w: rnd(0.02, 0.06) * (Math.random() < 0.5 ? 1 : 1),
      s: rnd(10, 15), al: rnd(0.15, 0.5), gold: Math.random() > 0.8, tw: rnd(0.3, 0.9), ph: rnd(0, TAU),
    }));
    return {
      frame: (t, dt) => {
        clear(c);
        const cx = c.W / 2, cy = c.H * 0.46, R = Math.max(c.W, c.H);
        for (const p of ps) {
          p.a += p.w * dt;
          const x = cx + Math.cos(p.a) * p.r * R * 0.62;
          const y = cy + Math.sin(p.a) * p.r * R * 0.34;
          text(c.ctx, p.ch, x, y, p.s, p.gold ? AMBER : SLATE, p.al * (0.6 + 0.4 * Math.sin(t * p.tw + p.ph)));
        }
      },
    };
  },
  breath: (c) => {
    const cell = 30;
    const cols = Math.ceil(c.W / cell), rows = Math.ceil(c.H / cell);
    const chs = Array.from({ length: cols * rows }, () => pick(CODE));
    return {
      frame: (t) => {
        clear(c);
        for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
          const a = 0.05 + 0.09 * (0.5 + 0.5 * Math.sin(t * 0.45 + (x + y) * 0.16));
          text(c.ctx, chs[y * cols + x] ?? '.', x * cell + 8, y * cell + 20, 13, (x + y) % 9 === 0 ? AMBER : SLATE, a);
        }
      },
    };
  },
  tide: (c) => {
    const bands = [0.3, 0.5, 0.7].map((fy, b) => ({
      fy, xs: Array.from({ length: Math.ceil(c.W / 26) + 1 }, (_, i) => i * 26),
      chs: Array.from({ length: Math.ceil(c.W / 26) + 1 }, () => pick(CODE)),
      sp: 0.25 + b * 0.07,
    }));
    return {
      frame: (t) => {
        clear(c);
        bands.forEach((bd, b) => {
          bd.xs.forEach((x, i) => {
            const xx = ((x + t * 12 * bd.sp) % (c.W + 40)) - 20;
            const y = bd.fy * c.H + Math.sin(x * 0.012 + t * bd.sp + b * 2) * 22;
            text(c.ctx, bd.chs[i] ?? '~', xx, y, 13, i % 10 === 0 ? AMBER : SLATE, 0.22 + b * 0.05);
          });
        });
      },
    };
  },
  meteors: (c) => {
    const stars = Array.from({ length: Math.round(60 * c.density) }, () => ({
      ch: pick(CODE), x: Math.random(), y: Math.random(), a: rnd(0.08, 0.2),
    }));
    let next = 1.5;
    let met: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
    return {
      frame: (t, dt) => {
        clear(c);
        for (const s of stars) text(c.ctx, s.ch, s.x * c.W, s.y * c.H, 12, SLATE, s.a);
        if (!met && t > next) {
          met = { x: rnd(0.3, 1) * c.W, y: rnd(0, 0.3) * c.H, vx: -70, vy: 38, life: 1 };
          next = t + rnd(3, 6);
        }
        if (met) {
          met.x += met.vx * dt;
          met.y += met.vy * dt;
          met.life -= dt * 0.5;
          if (met.life <= 0 || met.x < -60 || met.y > c.H + 60) met = null;
          else {
            for (let k = 0; k < 7; k++) {
              const f = k / 7;
              text(c.ctx, k === 0 ? '*' : '.', met.x - met.vx * 0.012 * k, met.y - met.vy * 0.012 * k, 12 - k, AMBER, met.life * (1 - f) * 0.8);
            }
          }
        }
      },
    };
  },
  'binary-pulse': (c) => {
    const cell = 34;
    const cols = Math.ceil(c.W / cell), rows = Math.ceil(c.H / cell);
    const bits = Array.from({ length: cols * rows }, () => (Math.random() < 0.5 ? '0' : '1'));
    return {
      frame: (t) => {
        clear(c);
        for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
          const wave = 0.5 + 0.5 * Math.sin((x + y) * 0.35 - t * 0.55);
          text(c.ctx, bits[y * cols + x] ?? '0', x * cell + 10, y * cell + 24, 14, (x * 7 + y * 13) % 23 === 0 ? AMBER : SLATE, 0.06 + wave * 0.22);
        }
      },
    };
  },
  spiral: (c) => {
    const arms = 3;
    const ps = Array.from({ length: Math.round(150 * c.density) }, (_, i) => ({
      ch: pick(CODE), arm: i % arms, r: rnd(40, Math.max(c.W, c.H) * 0.55),
      s: rnd(10, 14), al: rnd(0.15, 0.45), gold: Math.random() > 0.82,
    }));
    let rot = 0;
    return {
      frame: (_, dt) => {
        clear(c);
        rot += dt * 0.035;
        const cx = c.W / 2, cy = c.H / 2;
        for (const p of ps) {
          const a = rot + (p.arm / arms) * TAU + p.r * 0.012;
          const edge = Math.max(0, 1 - p.r / (Math.max(c.W, c.H) * 0.55));
          text(c.ctx, p.ch, cx + Math.cos(a) * p.r, cy + Math.sin(a) * p.r * 0.62, p.s, p.gold ? AMBER : SLATE, p.al * (0.3 + 0.7 * edge));
        }
      },
    };
  },
  'code-snow': (c) => {
    const ps = Array.from({ length: Math.round(70 * c.density) }, () => ({
      ch: pick(CODE), x: Math.random(), y: Math.random(), v: rnd(8, 16),
      s: rnd(11, 15), ph: rnd(0, TAU), gold: Math.random() > 0.85,
    }));
    return {
      frame: (t, dt) => {
        clear(c);
        for (const p of ps) {
          p.y += (p.v * dt) / c.H;
          if (p.y > 1.03) { p.y = -0.03; p.x = Math.random(); }
          const x = (p.x + 0.012 * Math.sin(t * 0.5 + p.ph)) * c.W;
          text(c.ctx, p.ch, x, p.y * c.H, p.s, p.gold ? AMBER : SLATE, 0.28);
        }
      },
    };
  },
  horizon: (c) => {
    let off = 0;
    const glyphs = Array.from({ length: 14 }, (_, i) => ({ x: (i * 97) % 100, ch: pick(['{', '}', '/', '*']) }));
    return {
      frame: (_, dt) => {
        clear(c);
        const { ctx, W, H } = c;
        const hz = H * 0.42;
        off = (off + dt * 9) % 44;
        ctx.strokeStyle = 'rgba(100,116,139,0.22)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 9; i++) {
          const y = hz + Math.pow(i / 8, 1.8) * (H - hz) + (off / 44) * ((H - hz) / 8);
          if (y > H) continue;
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }
        for (let i = -8; i <= 8; i++) {
          ctx.beginPath(); ctx.moveTo(W / 2 + i * 14, hz); ctx.lineTo(W / 2 + i * 90, H); ctx.stroke();
        }
        glyphs.forEach((g, i) => {
          const gx = ((g.x / 100 + off / 4000) % 1) * W;
          text(ctx, g.ch, gx, hz + 24 + (i % 4) * 30, 12, AMBER, 0.3);
        });
      },
    };
  },
  aurora: (c) => {
    const cols = 50;
    const ps = Array.from({ length: Math.round(cols * 1.4 * c.density) }, () => ({
      col: Math.floor(Math.random() * cols), y: Math.random(), v: rnd(5, 11),
      s: rnd(10, 15), ch: pick(CODE),
    }));
    return {
      frame: (_, dt) => {
        clear(c);
        const cw = c.W / cols;
        for (const p of ps) {
          p.y -= (p.v * dt) / c.H;
          if (p.y < -0.05) { p.y = 1.05; p.col = Math.floor(Math.random() * cols); }
          const fade = Math.min(1, (1 - p.y) * 3);
          const warm = p.col / cols < 0.5;
          text(c.ctx, p.ch, p.col * cw + cw / 2, p.y * c.H, p.s, warm ? AMBER : CYAN, 0.3 * fade);
        }
      },
    };
  },
  'twinkle-field': (c) => {
    const ps = Array.from({ length: Math.round(90 * c.density) }, () => ({
      ch: pick(CODE), x: Math.random(), y: Math.random(), s: rnd(11, 15),
      f: rnd(0.15, 0.45), ph: rnd(0, TAU), gold: Math.random() > 0.88, base: rnd(0.1, 0.3),
    }));
    return { frame: (t) => { clear(c); for (const p of ps) text(c.ctx, p.ch, p.x * c.W, p.y * c.H, p.s, p.gold ? AMBER : SLATE, p.base * (0.5 + 0.5 * Math.sin(t * p.f * TAU + p.ph)) + 0.04); } };
  },
  rings: (c) => {
    interface Ring { r: number; seed: number }
    const live: Ring[] = [{ r: 20, seed: 1 }];
    let acc = 0;
    return {
      frame: (_, dt) => {
        clear(c);
        acc += dt;
        if (acc > 3) { acc = 0; live.push({ r: 16, seed: Math.random() * 100 }); }
        const cx = c.W / 2, cy = c.H / 2;
        for (let i = live.length - 1; i >= 0; i--) {
          const ring = live[i];
          if (!ring) continue;
          ring.r += dt * 34;
          const max = Math.max(c.W, c.H);
          if (ring.r > max) { live.splice(i, 1); continue; }
          const n = 26;
          for (let k = 0; k < n; k++) {
            const a = (k / n) * TAU;
            text(c.ctx, CODE[Math.floor((k + ring.seed) % CODE.length)] ?? '.', cx + Math.cos(a) * ring.r, cy + Math.sin(a) * ring.r * 0.7, 12, k % 8 === 0 ? AMBER : SLATE, 0.4 * (1 - ring.r / max));
          }
        }
      },
    };
  },
  'side-wind': (c) => {
    const ps = Array.from({ length: Math.round(80 * c.density) }, () => ({
      ch: pick(CODE), x: Math.random(), y: Math.random(), v: rnd(10, 22),
      s: rnd(11, 15), ph: rnd(0, TAU), gold: Math.random() > 0.85,
    }));
    return {
      frame: (t, dt) => {
        clear(c);
        for (const p of ps) {
          p.x += (p.v * dt) / c.W;
          if (p.x > 1.03) { p.x = -0.03; p.y = Math.random(); }
          const y = (p.y + 0.02 * Math.sin(t * 0.4 + p.ph)) * c.H;
          text(c.ctx, p.ch, p.x * c.W, y, p.s, p.gold ? AMBER : SLATE, 0.26);
        }
      },
    };
  },
  depth: (c) => {
    const layers = [
      { n: 25, s: [9, 12], v: 4, a: 0.16 },
      { n: 25, s: [12, 16], v: 8, a: 0.26 },
      { n: 20, s: [17, 22], v: 14, a: 0.38 },
    ];
    const ps = layers.flatMap((L, li) =>
      Array.from({ length: Math.round(L.n * c.density) }, () => ({
        ch: pick(CODE), x: Math.random(), y: Math.random(), li,
        s: rnd(L.s[0], L.s[1]), v: L.v * rnd(0.8, 1.2), gold: Math.random() > 0.85,
      }))
    );
    return {
      frame: (_, dt) => {
        clear(c);
        for (const p of ps) {
          const L = layers[p.li];
          if (!L) continue;
          p.y += (p.v * dt) / c.H;
          p.x += ((p.v * 0.3 * dt) / c.W);
          if (p.y > 1.03) { p.y = -0.03; p.x = Math.random(); }
          if (p.x > 1.03) p.x = -0.03;
          text(c.ctx, p.ch, p.x * c.W, p.y * c.H, p.s, p.gold ? AMBER : SLATE, L.a);
        }
      },
    };
  },
  'kepler-spiral': (c) => {
    const kp = Array.from({ length: Math.round(80 * c.density) }, () => ({
      ch: pick(CODE), r: rnd(0.2, 0.72), a: rnd(0, TAU), w: rnd(0.02, 0.06),
      s: rnd(10, 15), al: rnd(0.15, 0.45), gold: Math.random() > 0.8, tw: rnd(0.3, 0.9), ph: rnd(0, TAU),
    }));
    const arms = 3;
    const sp = Array.from({ length: Math.round(110 * c.density) }, (_, i) => ({
      ch: pick(CODE), arm: i % arms, r: rnd(40, 200),
      s: rnd(10, 13), al: rnd(0.12, 0.35), gold: Math.random() > 0.84,
    }));
    let rot = 0;
    return {
      frame: (t, dt) => {
        clear(c);
        const cx = c.W / 2, cy = c.H * 0.48, R = Math.max(c.W, c.H);
        for (const p of kp) {
          p.a += p.w * dt;
          text(c.ctx, p.ch, cx + Math.cos(p.a) * p.r * R * 0.62, cy + Math.sin(p.a) * p.r * R * 0.34,
            p.s, p.gold ? AMBER : SLATE, p.al * (0.6 + 0.4 * Math.sin(t * p.tw + p.ph)) * 0.8);
        }
        rot += dt * 0.035;
        const maxR = Math.max(c.W, c.H) * 0.55;
        for (const p of sp) {
          const rr = Math.min(p.r, maxR);
          const a = rot + (p.arm / arms) * TAU + rr * 0.012;
          const edge = Math.max(0, 1 - rr / maxR);
          text(c.ctx, p.ch, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.62,
            p.s, p.gold ? AMBER : SLATE, p.al * (0.3 + 0.7 * edge) * 0.75);
        }
      },
    };
  },
};

export function createEngine(key: BgKey, ctx: CanvasRenderingContext2D, W: number, H: number): Engine {
  const small = Math.min(1, (W * H) / 900000 + 0.4);
  return builders[key]({ ctx, W, H, density: small });
}
