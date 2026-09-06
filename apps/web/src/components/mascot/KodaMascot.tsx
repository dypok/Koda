'use client';

import React, { useEffect, useRef } from 'react';

export type KodaMood = 'idle' | 'happy' | 'thinking' | 'proud' | 'celebrating';

interface KodaMascotProps {
  size?: number;
  mood?: KodaMood;
  interactive?: boolean;
  className?: string;
}

export const KodaMascot: React.FC<KodaMascotProps> = ({
  size = 280,
  mood = 'idle',
  interactive = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<any>(null);
  const mascotContainerRef = useRef<any>(null);
  const leftPupilRef = useRef<any>(null);
  const rightPupilRef = useRef<any>(null);
  const confettiParticlesRef = useRef<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    let cleanupFn = () => {};

    // Dynamic import of pixi.js to avoid SSR issues
    import('pixi.js').then((PIXI) => {
      if (!isMounted || !containerRef.current) return;

      const app = new PIXI.Application({
        width: size,
        height: size,
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      appRef.current = app;
      containerRef.current.appendChild(app.view as HTMLCanvasElement);

      const stage = app.stage;
      const center = size / 2;
      const scale = size / 280;

      // Container for the mascot to animate floating
      const mascot = new PIXI.Container();
      mascot.x = center;
      mascot.y = center;
      mascot.scale.set(scale);
      mascotContainerRef.current = mascot;
      stage.addChild(mascot);

      // 1. Soft glowing aura behind Koda
      const glow = new PIXI.Graphics();
      glow.beginFill(0xf97316, 0.12);
      glow.drawCircle(0, 0, 110);
      glow.endFill();
      glow.beginFill(0xf59e0b, 0.08);
      glow.drawCircle(0, 0, 130);
      glow.endFill();
      mascot.addChild(glow);

      // 2. Ears
      // Left ear
      const leftEar = new PIXI.Graphics();
      leftEar.beginFill(0xe05600); // darker orange base
      leftEar.moveTo(-50, -30);
      leftEar.lineTo(-85, -100);
      leftEar.lineTo(-15, -60);
      leftEar.closePath();
      leftEar.endFill();
      // Left ear tip (dark)
      leftEar.beginFill(0x1e1b4b);
      leftEar.moveTo(-75, -80);
      leftEar.lineTo(-85, -100);
      leftEar.lineTo(-55, -85);
      leftEar.closePath();
      leftEar.endFill();
      // Left ear inner fluff
      leftEar.beginFill(0xfed7aa);
      leftEar.moveTo(-45, -35);
      leftEar.lineTo(-70, -80);
      leftEar.lineTo(-25, -55);
      leftEar.closePath();
      leftEar.endFill();
      mascot.addChild(leftEar);

      // Right ear
      const rightEar = new PIXI.Graphics();
      rightEar.beginFill(0xe05600);
      rightEar.moveTo(50, -30);
      rightEar.lineTo(85, -100);
      rightEar.lineTo(15, -60);
      rightEar.closePath();
      rightEar.endFill();
      // Right ear tip (dark)
      rightEar.beginFill(0x1e1b4b);
      rightEar.moveTo(75, -80);
      rightEar.lineTo(85, -100);
      rightEar.lineTo(55, -85);
      rightEar.closePath();
      rightEar.endFill();
      // Right ear inner fluff
      rightEar.beginFill(0xfed7aa);
      rightEar.moveTo(45, -35);
      rightEar.lineTo(70, -80);
      rightEar.lineTo(25, -55);
      rightEar.closePath();
      rightEar.endFill();
      mascot.addChild(rightEar);

      // 3. Fox Body / Shoulders
      const body = new PIXI.Graphics();
      body.beginFill(0xf97316);
      body.drawRoundedRect(-45, 30, 90, 65, 28);
      body.endFill();
      // Chest white bib
      body.beginFill(0xfffbeb);
      body.drawRoundedRect(-24, 40, 48, 48, 16);
      body.endFill();
      mascot.addChild(body);

      // 4. Fox Head (Rounded & friendly)
      const head = new PIXI.Graphics();
      head.beginFill(0xf97316);
      head.drawCircle(0, -10, 62);
      head.endFill();

      // White cheek puffs
      const cheeks = new PIXI.Graphics();
      cheeks.beginFill(0xffffff);
      // Left cheek puff
      cheeks.moveTo(-60, 5);
      cheeks.bezierCurveTo(-68, 25, -45, 45, -15, 38);
      cheeks.lineTo(-10, 0);
      cheeks.closePath();
      // Right cheek puff
      cheeks.moveTo(60, 5);
      cheeks.bezierCurveTo(68, 25, 45, 45, 15, 38);
      cheeks.lineTo(10, 0);
      cheeks.closePath();
      cheeks.endFill();
      head.addChild(cheeks);

      // Snout patch
      const snoutPatch = new PIXI.Graphics();
      snoutPatch.beginFill(0xfffbeb);
      snoutPatch.drawEllipse(0, 15, 26, 20);
      snoutPatch.endFill();
      head.addChild(snoutPatch);

      // Nose
      const nose = new PIXI.Graphics();
      nose.beginFill(0x1e1b4b);
      nose.drawRoundedRect(-8, 3, 16, 11, 5);
      nose.endFill();
      // Nose reflection
      nose.beginFill(0xffffff, 0.7);
      nose.drawCircle(-3, 6, 2);
      nose.endFill();
      head.addChild(nose);

      // Smiling mouth
      const mouth = new PIXI.Graphics();
      mouth.lineStyle(2.5, 0x1e1b4b, 0.9);
      mouth.moveTo(-9, 17);
      mouth.quadraticCurveTo(0, 24, 9, 17);
      head.addChild(mouth);

      // Pink blush on cheeks
      const blush = new PIXI.Graphics();
      blush.beginFill(0xf43f5e, 0.25);
      blush.drawCircle(-40, 12, 10);
      blush.drawCircle(40, 12, 10);
      blush.endFill();
      head.addChild(blush);

      // Eyes and Pupils
      const leftEyeSocket = new PIXI.Graphics();
      leftEyeSocket.beginFill(0x1e1b4b);
      leftEyeSocket.drawCircle(-26, -15, 12);
      leftEyeSocket.endFill();
      head.addChild(leftEyeSocket);

      const rightEyeSocket = new PIXI.Graphics();
      rightEyeSocket.beginFill(0x1e1b4b);
      rightEyeSocket.drawCircle(26, -15, 12);
      rightEyeSocket.endFill();
      head.addChild(rightEyeSocket);

      // Shiny reflections in eyes
      const leftPupil = new PIXI.Graphics();
      leftPupil.beginFill(0xffffff);
      leftPupil.drawCircle(-24, -18, 4.5);
      leftPupil.drawCircle(-28, -12, 2);
      leftPupil.endFill();
      head.addChild(leftPupil);
      leftPupilRef.current = leftPupil;

      const rightPupil = new PIXI.Graphics();
      rightPupil.beginFill(0xffffff);
      rightPupil.drawCircle(28, -18, 4.5);
      rightPupil.drawCircle(24, -12, 2);
      rightPupil.endFill();
      head.addChild(rightPupil);
      rightPupilRef.current = rightPupil;

      mascot.addChild(head);

      // Confetti Layer
      const confettiContainer = new PIXI.Container();
      stage.addChild(confettiContainer);

      const colors = [0xf97316, 0xf59e0b, 0x10b981, 0x6366f1, 0xec4899, 0x38bdf8];
      const particles: any[] = [];

      function spawnConfettiBatch() {
        for (let i = 0; i < 45; i++) {
          const p = new PIXI.Graphics();
          const color = colors[Math.floor(Math.random() * colors.length)];
          p.beginFill(color);
          if (Math.random() > 0.5) {
            p.drawRect(-4, -4, 8, 8);
          } else {
            p.drawCircle(0, 0, 4);
          }
          p.endFill();
          p.x = center + (Math.random() - 0.5) * 40;
          p.y = center - 20;
          const angle = Math.random() * Math.PI * 2;
          const speed = 3 + Math.random() * 6;
          (p as any).vx = Math.cos(angle) * speed;
          (p as any).vy = Math.sin(angle) * speed - 3;
          (p as any).rotSpeed = (Math.random() - 0.5) * 0.2;
          (p as any).alpha = 1;
          (p as any).life = 1;
          (p as any).decay = 0.012 + Math.random() * 0.015;
          confettiContainer.addChild(p);
          particles.push(p);
        }
      }

      if (mood === 'celebrating') {
        spawnConfettiBatch();
      }

      // Pointer tracking
      let targetPupilX = 0;
      let targetPupilY = 0;

      const handlePointerMove = (e: MouseEvent) => {
        if (!containerRef.current || !interactive) return;
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - (rect.left + rect.width / 2);
        const mouseY = e.clientY - (rect.top + rect.height / 2);
        targetPupilX = Math.max(-4, Math.min(4, mouseX * 0.03));
        targetPupilY = Math.max(-3, Math.min(3, mouseY * 0.03));
      };

      if (interactive) {
        window.addEventListener('pointermove', handlePointerMove);
      }

      // Main Ticker Loop (60 FPS)
      let blinkTimer = 0;
      let isBlinking = false;

      app.ticker.add((delta) => {
        const time = performance.now() * 0.0025;

        // 1. Sinusoidal breathing / floating
        mascot.y = center + Math.sin(time) * (mood === 'happy' || mood === 'celebrating' ? 8 : 4);
        mascot.rotation = Math.sin(time * 0.8) * 0.03;

        // 2. Smooth pupil tracking
        if (leftPupilRef.current && rightPupilRef.current) {
          leftPupilRef.current.x += (targetPupilX - leftPupilRef.current.x) * 0.1;
          leftPupilRef.current.y += (targetPupilY - leftPupilRef.current.y) * 0.1;
          rightPupilRef.current.x += (targetPupilX - rightPupilRef.current.x) * 0.1;
          rightPupilRef.current.y += (targetPupilY - rightPupilRef.current.y) * 0.1;
        }

        // 3. Eye blinking
        blinkTimer += delta;
        if (!isBlinking && blinkTimer > 180 + Math.random() * 120) {
          isBlinking = true;
          blinkTimer = 0;
          leftEyeSocket.scale.y = 0.15;
          rightEyeSocket.scale.y = 0.15;
        } else if (isBlinking && blinkTimer > 8) {
          isBlinking = false;
          blinkTimer = 0;
          leftEyeSocket.scale.y = 1;
          rightEyeSocket.scale.y = 1;
        }

        // 4. Confetti updates
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.15; // Gravity
          p.rotation += p.rotSpeed;
          p.life -= p.decay;
          p.alpha = Math.max(0, p.life);

          if (p.life <= 0 || p.y > size + 20) {
            confettiContainer.removeChild(p);
            p.destroy();
            particles.splice(i, 1);
          }
        }
      });

      cleanupFn = () => {
        if (interactive) {
          window.removeEventListener('pointermove', handlePointerMove);
        }
        app.destroy(true, { children: true, texture: true, baseTexture: true });
      };
    });

    return () => {
      isMounted = false;
      cleanupFn();
    };
  }, [size, mood, interactive]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      aria-label="Mascota interactiva Koda el Zorro"
    />
  );
};
