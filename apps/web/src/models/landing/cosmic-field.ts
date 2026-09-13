import * as THREE from 'three';
import { mulberry32 } from './hero-sky.model';

export const COSMIC_COLORS = ['#f59e0b', '#22d3ee', '#ffffff', '#fbbf24', '#67e8f9'];

/** Genera posiciones en esfera aplanada con brazos espirales sutiles. */
export function generateCosmos(count: number, seed = 7): { positions: Float32Array; colors: Float32Array } {
  const rand = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const arm = (i % 3) * ((Math.PI * 2) / 3);
    const angle = arm + rand() * 0.9;
    const radius = 3 + rand() * 9;
    positions[i * 3] = Math.cos(angle) * radius + (rand() - 0.5) * 1.6;
    positions[i * 3 + 1] = (rand() - 0.5) * 5.5;
    positions[i * 3 + 2] = Math.sin(angle) * radius + (rand() - 0.5) * 1.6;

    color.set(COSMIC_COLORS[Math.floor(rand() * COSMIC_COLORS.length)]);
    const dim = 0.45 + rand() * 0.55;
    colors[i * 3] = color.r * dim;
    colors[i * 3 + 1] = color.g * dim;
    colors[i * 3 + 2] = color.b * dim;
  }

  return { positions, colors };
}

/** Sprite radial suave para puntos redondos (no cuadrados). */
export function makeGlowSprite(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.35, 'rgba(255,255,255,0.55)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}
