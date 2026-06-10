import React from 'react';

export default function MoveGrid({ history, label, color }) {
  return (
    <div>
      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: 6, fontWeight: 600 }}>
        {label}
      </div>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 2,
        maxWidth: '100%',
      }}>
        {history.map((move, i) => (
          <div
            key={i}
            title={`Round ${i + 1}: ${move === 'C' ? 'Cooperate' : 'Defect'}`}
            style={{
              width: 10, height: 10, borderRadius: 2,
              background: move === 'C' ? '#4ade80' : '#f87171',
              opacity: 0.9,
            }}
          />
        ))}
      </div>
    </div>
  );
}
