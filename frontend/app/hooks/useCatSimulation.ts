import { useState, useEffect, useRef, useCallback } from 'react';
import type { GrassEntry } from '../lib/grassStore';
import { getCatPosition } from '../lib/catGenerator';

export type CatState = 'idle' | 'walk' | 'sit' | 'sleep' | 'wave' | 'roll';

export interface CatSim {
  id: string;
  x: number;        // % position
  y: number;        // % position
  targetX: number;
  targetY: number;
  state: CatState;
  prevState: CatState;
  facing: 'left' | 'right';
  stateTimer: number;  // ms remaining in current state
  bobPhase: number;    // 0-1 for walk bobbing
}

// Obstacle zones (percentage coordinates) - cats won't walk into these
const OBSTACLES = [
  { x: 5, y: 38, w: 18, h: 30 },    // slide area (left)
  { x: 18, y: 80, w: 20, h: 10 },   // left fence
  { x: 60, y: 80, w: 20, h: 10 },   // right fence
  { x: 38, y: 82, w: 24, h: 15 },   // sandbox (center bottom)
];

// Grass walkable area bounds
const BOUNDS = { minX: 5, maxX: 95, minY: 38, maxY: 88 };

function isInObstacle(x: number, y: number): boolean {
  return OBSTACLES.some(o => x >= o.x && x <= o.x + o.w && y >= o.y && y <= o.y + o.h);
}

function randomTarget(): { x: number; y: number } {
  for (let i = 0; i < 50; i++) {
    const x = BOUNDS.minX + Math.random() * (BOUNDS.maxX - BOUNDS.minX);
    const y = BOUNDS.minY + Math.random() * (BOUNDS.maxY - BOUNDS.minY);
    if (!isInObstacle(x, y)) return { x, y };
  }
  return { x: 50, y: 60 }; // fallback center
}

function pickNextState(): { state: CatState; duration: number } {
  const r = Math.random();
  if (r < 0.60) return { state: 'walk', duration: 0 }; // duration handled by movement
  if (r < 0.85) return { state: 'sit', duration: 3000 + Math.random() * 3000 };
  return { state: 'sleep', duration: 5000 + Math.random() * 5000 };
}

export function useCatSimulation(entries: GrassEntry[]) {
  const [cats, setCats] = useState<CatSim[]>([]);
  const catsRef = useRef<CatSim[]>([]);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Initialize cats
  useEffect(() => {
    const initial: CatSim[] = entries.map((entry, i) => {
      const pos = getCatPosition(i, entries.length, entry.id);
      const initState = (['idle', 'sit', 'walk', 'sleep'] as CatState[])[i % 4];
      return {
        id: entry.id,
        x: pos.x,
        y: pos.y,
        targetX: pos.x,
        targetY: pos.y,
        state: initState,
        prevState: 'idle',
        facing: Math.random() > 0.5 ? 'left' : 'right',
        stateTimer: 1000 + Math.random() * 3000, // stagger initial timers
        bobPhase: 0,
      };
    });
    catsRef.current = initial;
    setCats([...initial]);
  }, [entries]);

  // Animation loop
  useEffect(() => {
    if (entries.length === 0) return;

    const SPEED = 3; // % per second (walking speed)

    const tick = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = Math.min(time - lastTimeRef.current, 100); // cap delta
      lastTimeRef.current = time;

      let changed = false;
      const currentCats = catsRef.current;

      for (let i = 0; i < currentCats.length; i++) {
        const cat = currentCats[i];

        if (cat.state === 'walk') {
          // Move toward target
          const dx = cat.targetX - cat.x;
          const dy = cat.targetY - cat.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 1) {
            // Arrived at target
            cat.state = 'idle';
            cat.stateTimer = 2000 + Math.random() * 2000;
            changed = true;
          } else {
            const move = (SPEED * dt) / 1000;
            const ratio = Math.min(move / dist, 1);
            cat.x += dx * ratio;
            cat.y += dy * ratio;
            cat.facing = dx > 0 ? 'right' : 'left';
            cat.bobPhase = (cat.bobPhase + dt * 0.008) % (Math.PI * 2);
            changed = true;
          }
        } else if (cat.state === 'wave' || cat.state === 'roll') {
          cat.stateTimer -= dt;
          if (cat.stateTimer <= 0) {
            cat.state = cat.state === 'roll' ? 'idle' : cat.prevState;
            cat.stateTimer = 2000 + Math.random() * 2000;
            changed = true;
          }
        } else {
          // idle, sit, sleep
          cat.stateTimer -= dt;
          if (cat.stateTimer <= 0) {
            const next = pickNextState();
            cat.prevState = cat.state;
            cat.state = next.state;
            cat.stateTimer = next.duration;

            if (next.state === 'walk') {
              const target = randomTarget();
              cat.targetX = target.x;
              cat.targetY = target.y;
            }
            changed = true;
          }
        }
      }

      if (changed) {
        setCats([...currentCats]);
      }

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [entries]);

  // Click interaction
  const handleInteract = useCallback((id: string) => {
    const cat = catsRef.current.find(c => c.id === id);
    if (!cat) return;

    if (cat.state === 'sleep') {
      cat.prevState = cat.state;
      cat.state = 'roll';
      cat.stateTimer = 2000;
    } else if (cat.state !== 'wave' && cat.state !== 'roll') {
      cat.prevState = cat.state;
      cat.state = 'wave';
      cat.stateTimer = 1500;
    }
    setCats([...catsRef.current]);
  }, []);

  return { cats, handleInteract };
}
