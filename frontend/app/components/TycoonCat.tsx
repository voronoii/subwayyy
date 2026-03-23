'use client';

import type { CatState } from '../hooks/useCatSimulation';

const CAT_IMAGES = ['/cats/blue.png', '/cats/mint.png', '/cats/orange.png'];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    hash = ((hash << 5) - hash + c) | 0;
  }
  return Math.abs(hash);
}

interface TycoonCatProps {
  entryId: string;
  brandId: string;
  size?: number;
  onClick?: () => void;
  active?: boolean;
  isNew?: boolean;
  pose?: CatState;
  facing?: 'left' | 'right';
  bobPhase?: number;
}

export default function TycoonCat({
  entryId,
  size = 56,
  onClick,
  active = false,
  isNew = false,
  pose,
  facing = 'right',
  bobPhase = 0,
}: TycoonCatProps) {
  const catImage = CAT_IMAGES[hashCode(entryId) % CAT_IMAGES.length];

  // Walk bobbing offset
  const bobY = pose === 'walk' ? Math.sin(bobPhase) * 3 : 0;

  // Roll animation for sleeping cats that got clicked
  const rollStyle = pose === 'roll' ? {
    animation: 'catRollAnim 0.5s ease-in-out infinite alternate',
  } : {};

  return (
    <div
      style={{
        width: size,
        height: size,
        cursor: 'pointer',
        userSelect: 'none' as const,
        position: 'relative',
        transform: `scaleX(${facing === 'left' ? -1 : 1}) translateY(${bobY}px)`,
        transition: pose === 'walk' ? 'none' : 'transform 0.3s ease',
        filter: `drop-shadow(0 ${active ? 4 : 2}px ${active ? 8 : 3}px rgba(0,0,0,${active ? 0.25 : 0.15}))`,
        ...rollStyle,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <img
        src={catImage}
        alt="고양이"
        width={size}
        height={size}
        draggable={false}
        style={{ display: 'block' }}
      />

      {/* Active glow */}
      {active && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#fde047',
          borderRadius: '50%',
          opacity: 0.3,
          filter: 'blur(16px)',
          pointerEvents: 'none',
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
      )}

      {/* New cat sparkle */}
      {isNew && (
        <div style={{
          position: 'absolute',
          inset: '-24px',
          background: 'linear-gradient(135deg, #f472b6, #a78bfa, #22d3ee)',
          borderRadius: '50%',
          opacity: 0.2,
          animation: 'pulse 1s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
      )}
    </div>
  );
}
