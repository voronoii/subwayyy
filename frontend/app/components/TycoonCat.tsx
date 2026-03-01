// components/TycoonCat.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface TycoonCatProps {
  entryId: string;
  brandId: string;
  size?: number;
  onClick?: () => void;
  active?: boolean;
  isNew?: boolean;        // 새로 심은 고양이 강조
}

const getCatImage = (brandId: string): string => {
  const map: Record<string, string> = {
    subway: '/cats/orange.png',   // 서브웨이 = 빵 좋아하는 주황 고양이
    salady: '/cats/mint.png',     // 샐러디 = 상추 좋아하는 민트 고양이
    poke: '/cats/blue.png',       // 포케 = 생선 좋아하는 블루 고양이
  };
  return map[brandId] || '/cats/orange.png';
};

const getAccessory = (brandId: string): string => {
  const map: Record<string, string> = {
    subway: '🥖',
    salady: '🥬',
    poke: '🐟',
  };
  return map[brandId] || '';
};

export default function TycoonCat({
  entryId,
  brandId,
  size = 56,
  onClick,
  active = false,
  isNew = false,
}: TycoonCatProps) {
  const [isJumping, setIsJumping] = useState(false);
  const catSrc = getCatImage(brandId);
  const accessory = getAccessory(brandId);

  const handleClick = () => {
    if (onClick) onClick();
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 500);
  };

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.15, rotate: 6 }}
      whileTap={{ scale: 1.3 }}
      initial={isNew ? { scale: 0, y: 60, rotate: -30 } : { scale: 1 }}
      animate={isNew ? { scale: 1, y: 0, rotate: 0 } : {}}
      transition={{ type: 'spring', bounce: 0.65, duration: 0.8 }}
      onClick={handleClick}
    >
      {/* 고양이 본체 */}
      <motion.div
        animate={{
          y: isJumping ? -42 : 0,
          rotate: isJumping ? -15 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Image
          src={catSrc}
          alt="귀여운 간식바 고양이"
          width={size}
          height={size}
          className="drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)]"
          priority={false}
        />
      </motion.div>

      {/* 브랜드 액세서리 (머리 위에 떠있음) */}
      {accessory && (
        <motion.div
          className="absolute -top-6 -right-4 text-4xl drop-shadow-md"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          {accessory}
        </motion.div>
      )}

      {/* 꼬리 흔들기 */}
      <motion.div
        className="absolute -bottom-3 left-1/2 w-7 h-10 bg-gradient-to-br from-orange-400 to-amber-600 rounded-full origin-bottom"
        style={{ transformOrigin: '30% 90%' }}
        animate={{
          rotate: isJumping ? 0 : [-25, 25, -25],
        }}
        transition={{
          duration: 0.75,
          repeat: isJumping ? 0 : Infinity,
          repeatType: 'reverse',
        }}
      />

      {/* 클릭 시 빛 효과 */}
      {active && (
        <div className="absolute inset-0 bg-yellow-300 rounded-full opacity-30 blur-2xl pointer-events-none animate-ping" />
      )}

      {/* 새로 온 고양이 반짝 효과 */}
      {isNew && (
        <div className="absolute -inset-6 bg-gradient-to-br from-pink-400 via-purple-400 to-cyan-400 rounded-full opacity-20 animate-ping" />
      )}
    </motion.div>
  );
}