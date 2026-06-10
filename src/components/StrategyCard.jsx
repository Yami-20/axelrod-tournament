import React from 'react';

const complexityColor = {
  Simple:   { color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
  Moderate: { color: '#facc15', bg: 'rgba(250,204,21,0.1)' },
  Complex:  { color: '#fb923c', bg: 'rgba(251,146,60,0.1)' },
  Custom:   { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
};

export default function StrategyCard({ strategy, selected, onClick, showRank = false }) {
  const cx = complexityColor[strategy.complexity] || complexityColor.Custom;

  return (
    <div
      className="strategy-card-wrap"
      onClick={() => onClick && onClick(strategy)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div
        className="card-inner"
        style={{
          borderRadius: 14,
          padding: '16px 18px',
          background: selected ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${selected ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.07)'}`,
          transition: 'all 0.2s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Rank badge */}
        {showRank && (
          <div style={{
            position: 'absolute', top: 12, right: 14,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px', fontWeight: 700,
            color: strategy.rank <= 3 ? '#facc15' : '#475569',
          }}>
            #{strategy.rank}
          </div>
        )}

        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
            background: strategy.isNice ? '#4ade80' : '#f87171',
            boxShadow: strategy.isNice ? '0 0 6px rgba(74,222,128,0.6)' : '0 0 6px rgba(248,113,113,0.6)',
          }} />
          <span style={{ fontWeight: 700, fontSize: '15px', color: '#f1f5f9', letterSpacing: '-0.01em' }}>
            {strategy.name}
          </span>
        </div>

        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: 6, paddingLeft: 16 }}>
          {strategy.author}
        </div>

        <div style={{
          fontSize: '12px', color: '#818cf8',
          fontStyle: 'italic', fontWeight: 600, marginBottom: 8,
        }}>
          {strategy.personality}
        </div>

        <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6, marginBottom: 10 }}>
          {strategy.description}
        </div>

        <div style={{
          fontSize: '11px', color: '#6366f1',
          fontStyle: 'italic', fontFamily: "'JetBrains Mono', monospace",
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: 10, marginBottom: 10,
        }}>
          {strategy.tagline}
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <Pill color={cx.color} bg={cx.bg}>{strategy.complexity}</Pill>
          <Pill
            color={strategy.isNice ? '#4ade80' : '#f87171'}
            bg={strategy.isNice ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)'}
          >
            {strategy.isNice ? 'Nice' : 'Not Nice'}
          </Pill>
          {strategy.isCustom && (
            <Pill color="#a78bfa" bg="rgba(167,139,250,0.12)">Custom</Pill>
          )}
        </div>
      </div>
    </div>
  );
}

function Pill({ children, color, bg }) {
  return (
    <span style={{
      fontSize: '10px', padding: '3px 9px', borderRadius: 20,
      background: bg, color, fontWeight: 700, letterSpacing: '0.04em',
    }}>
      {children}
    </span>
  );
}
