'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { generateCosmos } from '@/models/landing/cosmic-field';

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
    };
    window.addEventListener('resize', onResize);

    const loop = () => {
      if (!running) return;
      uniforms.uTime.value = performance.now() / 1000;
      points.rotation.y += 0.0006;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
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
