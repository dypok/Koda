'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { generateCosmos } from '@/models/landing/cosmic-field';
import { getGsap } from '@/lib/gsap';
import { getLenisInstance } from '@/lib/scroll';

const ACT_INTENSITY: Record<string, number> = { '1': 1, '2': 0.7, '3': 0.55, '4': 0.85 };

function deviceCount(): number {
  if (typeof window === 'undefined') return 1200;
  const small = window.matchMedia('(max-width: 640px)').matches;
  const saveData =
    window.matchMedia('(prefers-reduced-data: reduce)').matches ||
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
  if (saveData) return 700;
  return small ? 1200 : 3500;
}

function dprCap(): number {
  if (typeof window === 'undefined') return 1.5;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  return Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
}

/**
 * Fondo 3D full-page fijo detrás del sky 2D. Rotación lenta;
 * reactividad (D3), bloom (D4) y guardián (D5) llegan en sus puntos.
 */
export const CosmicBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(dprCap());
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 8;

    const { positions, colors, phases, sizes } = generateCosmos(deviceCount());
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    const uniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: dprCap() },
      uWarp: { value: 0 },
      uIntensity: { value: 1 },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        attribute vec3 color;
        attribute float aPhase;
        attribute float aSize;
        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uWarp;
        varying vec3 vColor;
        varying float vTwinkle;
        void main() {
          vColor = color;
          float tw = 0.55 + 0.45 * sin(uTime * 1.6 + aPhase);
          vTwinkle = tw;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          // Warp: estira radialmente con la velocidad del scroll.
          vec2 dir = normalize(position.xy + vec2(0.0001));
          mv.xy += dir * uWarp * 0.35;
          gl_PointSize = aSize * tw * uPixelRatio * (14.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        varying float vTwinkle;
        uniform float uIntensity;
        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float d = length(uv);
          float glow = smoothstep(0.5, 0.05, d);
          gl_FragColor = vec4(vColor * vTwinkle * uIntensity, glow * vTwinkle * uIntensity);
        }
      `,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Bloom real solo en dispositivos capaces; si no, el sprite del shader ya da glow fake.
    type Composer = {
      render: () => void;
      setSize: (w: number, h: number) => void;
      setPixelRatio: (r: number) => void;
    };
    let composer: Composer | null = null;
    const capable =
      (navigator.hardwareConcurrency ?? 4) >= 6 &&
      !window.matchMedia('(prefers-reduced-data: reduce)').matches;
    if (capable) {
      void Promise.all([
        import('three/examples/jsm/postprocessing/EffectComposer.js'),
        import('three/examples/jsm/postprocessing/RenderPass.js'),
        import('three/examples/jsm/postprocessing/UnrealBloomPass.js'),
      ])
        .then(([composerMod, renderPassMod, bloomMod]) => {
          if (disposed) return;
          const nextComposer = new composerMod.EffectComposer(renderer);
          nextComposer.addPass(new renderPassMod.RenderPass(scene, camera));
          const bloom = new bloomMod.UnrealBloomPass(
            new THREE.Vector2(mount.clientWidth, mount.clientHeight),
            0.55,
            0.6,
            0.72
          );
          nextComposer.addPass(bloom);
          composer = nextComposer;
        })
        .catch(() => {
          composer = null;
        });
    }
    let disposed = false;

    let raf = 0;
    let running = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry?.isIntersecting ?? true;
        if (running) loop();
      },
      { threshold: 0 }
    );
    io.observe(mount);

    const onVisibility = () => {
      running = !document.hidden;
      if (running) loop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(dprCap());
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      composer?.setPixelRatio(dprCap());
      composer?.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    const loop = () => {
      if (!running) return;
      uniforms.uTime.value = performance.now() / 1000;
      points.rotation.y += 0.0006;
      // Warp por velocidad de Lenis (suavizado) + intensidad por acto visible.
      const velocity = Math.abs(getLenisInstance()?.velocity ?? 0);
      const targetWarp = Math.min(1, velocity * 0.06);
      uniforms.uWarp.value += (targetWarp - uniforms.uWarp.value) * 0.08;
      const act = document.body.dataset.act ?? '1';
      const targetIntensity = ACT_INTENSITY[act] ?? 1;
      uniforms.uIntensity.value += (targetIntensity - uniforms.uIntensity.value) * 0.05;
      if (composer) composer.render();
      else renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    // Dolly de cámara + giro extra con el scroll global.
    const { gsap } = getGsap();
    const scrollCtx = gsap.context(() => {
      gsap.to(camera.position, {
        z: 4.5,
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1 },
      });
      gsap.to(points.rotation, {
        y: '+=0.9',
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1 },
      });
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      scrollCtx.revert();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-30 overflow-hidden bg-transparent"
    />
  );
};

export default CosmicBackground;
