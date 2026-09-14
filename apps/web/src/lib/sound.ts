'use client';

const STORAGE_KEY = 'koda-sound';
let ctx: AudioContext | null = null;
let enabled = false;

if (typeof window !== 'undefined') {
  try {
    enabled = window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    enabled = false;
  }
}

export function isSoundEnabled(): boolean {
  return enabled;
}

export function setSoundEnabled(value: boolean) {
  enabled = value;
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? '1' : '0');
  } catch {
    // sin almacenamiento, solo sesión
  }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', gain = 0.08) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, ctx.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
  osc.connect(g).connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + dur + 0.05);
}

function ensure(): boolean {
  if (!enabled || typeof window === 'undefined') return false;
  try {
    if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (ctx.state === 'suspended') void ctx.resume();
    return true;
  } catch {
    return false;
  }
}

export const sound = {
  pop() {
    if (!ensure()) return;
    tone(520, 0, 0.12, 'triangle');
  },
  hint() {
    if (!ensure()) return;
    tone(330, 0, 0.14, 'sine');
    tone(262, 0.1, 0.16, 'sine');
  },
  success() {
    if (!ensure()) return;
    tone(523, 0, 0.12, 'triangle');
    tone(659, 0.09, 0.12, 'triangle');
    tone(784, 0.18, 0.2, 'triangle');
  },
  party() {
    if (!ensure()) return;
    const seq = [523, 659, 784, 1047, 784, 1047];
    seq.forEach((f, i) => tone(f, i * 0.11, 0.14, 'square', 0.04));
  },
};
