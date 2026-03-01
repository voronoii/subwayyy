// components/TycoonScene.tsx
'use client';

export default function TycoonScene() {
  return (
    <div className="tycoon-scene relative w-full h-[520px] overflow-hidden rounded-3xl border-8 border-amber-950 bg-[#7ed16e]">
      {/* 하늘 */}
      <div className="absolute inset-x-0 top-0 h-[260px] bg-gradient-to-b from-sky-200 to-transparent" />

      {/* 태양 */}
      <div className="absolute top-10 left-14 w-20 h-20 bg-yellow-300 rounded-full shadow-[0_0_50px_#facc15] flex items-center justify-center text-5xl">
        ☀️
      </div>

      {/* 구름 */}
      <div className="absolute top-6 left-1/4 text-7xl opacity-90">☁️</div>
      <div className="absolute top-20 right-1/3 text-6xl opacity-80">☁️</div>
      <div className="absolute top-14 right-1/4 text-5xl opacity-70">☁️</div>

      {/* 멀리 있는 나무 */}
      <div className="absolute left-[8%] top-[180px] text-6xl">🌳</div>
      <div className="absolute right-[12%] top-[165px] text-7xl">🌲</div>

      {/* 잔디 바닥 강조 */}
      <div className="absolute bottom-0 inset-x-0 h-[220px] bg-[#4ade80] rounded-t-[100px]" />

      {/* SNACK BAR (노란 천막) */}
      <div className="absolute left-[18%] top-[110px] w-44">
        <div className="bg-[#fcd34d] border-4 border-amber-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* 지붕 */}
          <div className="h-6 bg-amber-900 flex items-center justify-center">
            <div className="w-4 h-4 bg-white mx-1 rounded" />
            <div className="w-4 h-4 bg-white mx-1 rounded" />
          </div>
          {/* 간판 */}
          <div className="bg-white py-1 text-center text-[13px] font-black tracking-widest text-amber-900 border-b-4 border-amber-800">
            SNACK BAR
          </div>
          {/* 메뉴판 */}
          <div className="h-20 bg-amber-100 flex items-center justify-center text-4xl">
            🍔🥪☕
          </div>
        </div>
      </div>

      {/* 테이블 1 (왼쪽) */}
      <div className="absolute left-[42%] top-[260px] w-20">
        <div className="bg-amber-800 w-full h-6 rounded" />
        <div className="bg-[#fcd34d] w-16 h-20 mx-auto -mt-1 rounded-xl shadow-inner flex items-center justify-center text-3xl">
          🥪
        </div>
      </div>

      {/* 테이블 2 (중앙) */}
      <div className="absolute left-1/2 top-[235px] -translate-x-1/2 w-24">
        <div className="bg-amber-800 w-full h-6 rounded" />
        <div className="bg-white w-20 h-24 mx-auto -mt-1 rounded-2xl shadow-xl flex items-center justify-center text-4xl border-4 border-amber-800">
          🧃
        </div>
      </div>

      {/* 우산 */}
      <div className="absolute right-[38%] top-[175px] text-7xl -rotate-12">☂️</div>

      {/* 테이블 3 (오른쪽) */}
      <div className="absolute right-[22%] top-[255px] w-20">
        <div className="bg-amber-800 w-full h-6 rounded" />
        <div className="bg-[#fcd34d] w-16 h-20 mx-auto -mt-1 rounded-xl shadow-inner flex items-center justify-center text-3xl">
          🥪
        </div>
      </div>

      {/* 작은 집 (보라색) */}
      <div className="absolute right-[12%] top-[125px] w-28">
        <div className="bg-purple-400 border-4 border-purple-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* 지붕 */}
          <div className="h-10 bg-purple-900 flex items-center justify-center text-white text-xl">🏠</div>
          {/* 창문 */}
          <div className="h-16 bg-white flex items-center justify-center gap-3 text-2xl">
            🪟 🪟
          </div>
        </div>
      </div>

      {/* FISH 그릇 */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-white border-4 border-amber-900 rounded-3xl w-20 h-20 shadow-2xl flex items-center justify-center text-5xl">
        🐟
      </div>

      {/* 풀 잔디 장식 */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#22c55e] opacity-60" />
    </div>
  );
}