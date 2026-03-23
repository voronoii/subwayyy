// components/TycoonScene.tsx
'use client';

export default function TycoonScene() {
  return (
    <div
      className="tycoon-scene"
      style={{
        position: 'relative',
        width: '100%',
        height: '520px',
        overflow: 'hidden',
        borderRadius: '24px',
        border: '8px solid #166534',
        background: 'linear-gradient(to bottom, #bae6fd, #e0f2fe, white)',
      }}
    >
      {/* 하늘 그라디언트 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '260px',
          background: 'linear-gradient(to bottom, #7dd3fc, transparent)',
        }}
      />

      {/* 태양 */}
      <div
        style={{
          position: 'absolute',
          top: '32px',
          right: '48px',
          width: '64px',
          height: '64px',
          background: '#fde047',
          borderRadius: '50%',
          boxShadow: '0 0 40px #facc15',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
        }}
      >
        ☀️
      </div>

      {/* 구름 */}
      <div style={{ position: 'absolute', top: '16px', left: '25%', fontSize: '56px', opacity: 0.9 }}>☁️</div>
      <div style={{ position: 'absolute', top: '64px', right: '33%', fontSize: '48px', opacity: 0.8 }}>☁️</div>
      <div style={{ position: 'absolute', top: '40px', right: '20%', fontSize: '40px', opacity: 0.7 }}>☁️</div>

      {/* 멀리 있는 나무 */}
      <div style={{ position: 'absolute', left: '6%', top: '175px', fontSize: '48px' }}>🌳</div>
      <div style={{ position: 'absolute', right: '8%', top: '160px', fontSize: '56px' }}>🌲</div>
      <div style={{ position: 'absolute', left: '30%', top: '185px', fontSize: '40px', opacity: 0.8 }}>🌿</div>

      {/* 잔디 바닥 (둥근 상단) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '240px',
          background: '#4ade80',
          borderRadius: '80px 80px 0 0',
        }}
      />
      {/* 잔디 바닥 (직사각형) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: '#22c55e',
        }}
      />

      {/* 미끄럼틀 (왼쪽) */}
      <div style={{ position: 'absolute', left: '10%', bottom: '60px' }}>
        {/* 사다리 기둥 */}
        <div style={{ position: 'absolute', left: 0, bottom: 0, width: '2px', height: '120px', background: '#ef4444', borderRadius: '2px' }} />
        <div style={{ position: 'absolute', left: '22px', bottom: 0, width: '2px', height: '120px', background: '#ef4444', borderRadius: '2px' }} />
        {/* 사다리 가로대 */}
        <div style={{ position: 'absolute', left: 0, bottom: '20px', width: '24px', height: '8px', background: '#eab308', borderRadius: '4px' }} />
        <div style={{ position: 'absolute', left: 0, bottom: '50px', width: '24px', height: '8px', background: '#eab308', borderRadius: '4px' }} />
        <div style={{ position: 'absolute', left: 0, bottom: '80px', width: '24px', height: '8px', background: '#eab308', borderRadius: '4px' }} />
        <div style={{ position: 'absolute', left: 0, bottom: '110px', width: '24px', height: '8px', background: '#eab308', borderRadius: '4px' }} />
        {/* 플랫폼 */}
        <div style={{ position: 'absolute', left: 0, top: '-136px', width: '64px', height: '16px', background: '#3b82f6', borderRadius: '4px' }} />
        {/* 슬라이드 */}
        <div
          style={{
            position: 'absolute',
            width: '90px',
            height: '12px',
            left: '16px',
            top: '-136px',
            transformOrigin: 'top left',
            transform: 'rotate(35deg)',
            background: '#facc15',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            border: '2px solid #ca8a04',
          }}
        />
        {/* 슬라이드 가드 */}
        <div
          style={{
            position: 'absolute',
            width: '90px',
            height: '6px',
            left: '16px',
            top: '-144px',
            transformOrigin: 'top left',
            transform: 'rotate(35deg)',
            background: '#f87171',
            borderRadius: '4px',
          }}
        />
      </div>

      {/* 모래놀이터 */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '128px',
          height: '48px',
          background: '#fef08a',
          borderRadius: '9999px',
          border: '4px solid #facc15',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          gap: '4px',
        }}
      >
        🪣⭐
      </div>

      {/* 징검다리 돌 */}
      <div style={{ position: 'absolute', bottom: '80px', left: '38%', width: '32px', height: '32px', background: '#9ca3af', borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', border: '2px solid #6b7280' }} />
      <div style={{ position: 'absolute', bottom: '90px', left: '48%', width: '24px', height: '24px', background: '#d1d5db', borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', border: '2px solid #9ca3af' }} />
      <div style={{ position: 'absolute', bottom: '75px', left: '57%', width: '28px', height: '28px', background: '#9ca3af', borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', border: '2px solid #6b7280' }} />

      {/* 꽃밭 (왼쪽 하단) */}
      <div style={{ position: 'absolute', bottom: '25px', left: '5%', fontSize: '24px', display: 'flex', gap: '4px' }}>
        🌸🌼🌷
      </div>

      {/* 꽃밭 (오른쪽 하단) */}
      <div style={{ position: 'absolute', bottom: '25px', right: '5%', fontSize: '24px', display: 'flex', gap: '4px' }}>
        🌻🌸🌼
      </div>

      {/* 꽃밭 (중앙 오른쪽) */}
      <div style={{ position: 'absolute', bottom: '110px', right: '15%', fontSize: '20px', display: 'flex', gap: '4px' }}>
        🌷🌼
      </div>

      {/* 울타리 (왼쪽) */}
      <div style={{ position: 'absolute', bottom: '52px', left: '22%', display: 'flex', gap: '4px' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ width: '12px', height: '32px', background: '#92400e', borderRadius: '9999px 9999px 0 0' }} />
        ))}
      </div>

      {/* 울타리 (오른쪽) */}
      <div style={{ position: 'absolute', bottom: '52px', right: '22%', display: 'flex', gap: '4px' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ width: '12px', height: '32px', background: '#92400e', borderRadius: '9999px 9999px 0 0' }} />
        ))}
      </div>

      {/* 풀 장식 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '32px',
          background: '#16a34a',
          opacity: 0.5,
        }}
      />
    </div>
  );
}
