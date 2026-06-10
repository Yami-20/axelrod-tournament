import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MEDAL = ['🥇', '🥈', '🥉'];

export default function TournamentResults({ results, strategies, onMatchClick }) {
  const [view, setView] = useState('leaderboard');
  const { ranked, matchResults } = results;
  const maxScore = Math.max(...ranked.map(s => s.totalScore));

  const matrix = {};
  matchResults.forEach(m => {
    if (!matrix[m.a]) matrix[m.a] = {};
    if (!matrix[m.b]) matrix[m.b] = {};
    matrix[m.a][m.b] = m.totalA;
    matrix[m.b][m.a] = m.totalB;
  });
  const stratIds = ranked.map(s => s.id);

  const getHeatColor = (score) => {
    if (score === undefined) return '#0f172a';
    const max = 200 * 5;
    const ratio = Math.min(score / max, 1);
    if (ratio > 0.7) return `rgba(99,102,241,${0.3 + ratio * 0.5})`;
    if (ratio > 0.4) return `rgba(99,102,241,${0.15 + ratio * 0.3})`;
    return `rgba(248,113,113,${0.1 + (1 - ratio) * 0.25})`;
  };

  return (
    <div style={{ animation: 'fadeUp 0.35s ease both' }}>
      {/* View switcher */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {['leaderboard', 'chart', 'heatmap'].map(t => (
          <button key={t} onClick={() => setView(t)} style={{
            padding: '7px 18px', borderRadius: 24, border: 'none',
            fontFamily: 'inherit', fontSize: '13px', cursor: 'pointer', fontWeight: 600,
            background: view === t ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
            color: view === t ? '#a5b4fc' : '#64748b',
            transition: 'all 0.15s',
          }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      {view === 'leaderboard' && (
        <div>
          {/* Top 3 podium */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
            {ranked.slice(0, 3).map((s, i) => (
              <div key={s.id} style={{
                padding: '18px 16px', textAlign: 'center',
                borderRadius: 14,
                background: i === 0
                  ? 'linear-gradient(135deg, rgba(250,204,21,0.12), rgba(99,102,241,0.08))'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${i === 0 ? 'rgba(250,204,21,0.25)' : 'rgba(255,255,255,0.07)'}`,
              }}>
                <div style={{ fontSize: '24px', marginBottom: 6 }}>{MEDAL[i]}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', marginBottom: 3 }}>{s.name}</div>
                <div style={{
                  fontSize: '20px', fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: i === 0 ? '#facc15' : '#94a3b8',
                }}>
                  {s.totalScore.toLocaleString()}
                </div>
                <div style={{ fontSize: '10px', color: '#475569', marginTop: 4, fontWeight: 600 }}>
                  {s.isNice ? '🟢 Nice' : '🔴 Not Nice'}
                </div>
              </div>
            ))}
          </div>

          {/* Full list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {ranked.map((s, i) => (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 16px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderLeft: `3px solid ${i === 0 ? '#facc15' : i === 1 ? '#94a3b8' : i === 2 ? '#cd7c2f' : 'rgba(99,102,241,0.15)'}`,
                borderRadius: 10,
                transition: 'background 0.15s',
              }}>
                <span style={{
                  width: 26, height: 26, borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: i < 3 ? 'rgba(250,204,21,0.12)' : 'rgba(255,255,255,0.05)',
                  fontSize: '12px', fontWeight: 700,
                  color: i < 3 ? '#facc15' : '#475569',
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {i + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {s.name}
                    {s.isCustom && (
                      <span style={{ fontSize: '9px', color: '#a78bfa', background: 'rgba(167,139,250,0.12)', padding: '2px 7px', borderRadius: 4, fontWeight: 700, letterSpacing: '0.06em' }}>CUSTOM</span>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569', marginTop: 2 }}>
                    <span style={{ color: s.isNice ? '#4ade80' : '#f87171' }}>●</span>
                    {' '}{s.isNice ? 'Nice' : 'Not Nice'} · {s.author}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{
                    fontSize: '17px', fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: '#e2e8f0',
                  }}>
                    {s.totalScore.toLocaleString()}
                  </div>
                </div>
                {/* Score bar */}
                <div style={{ width: 64, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', flexShrink: 0 }}>
                  <div style={{
                    width: `${(s.totalScore / maxScore) * 100}%`,
                    height: '100%',
                    background: s.isNice ? 'linear-gradient(90deg, #6366f1, #a5b4fc)' : 'linear-gradient(90deg, #f87171, #fca5a5)',
                    borderRadius: 3, transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bar chart */}
      {view === 'chart' && (
        <div>
          <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
            Total Score by Strategy
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={ranked} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
              <XAxis type="number" stroke="#1e293b" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
              <YAxis dataKey="name" type="category" width={128} tick={{ fill: '#cbd5e1', fontSize: 11, fontFamily: 'Space Grotesk' }} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, fontFamily: 'Space Grotesk' }}
                formatter={(v) => [v.toLocaleString(), 'Total Score']}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Bar dataKey="totalScore" radius={[0, 6, 6, 0]}>
                {ranked.map((s, i) => (
                  <Cell key={s.id} fill={s.isNice ? '#6366f1' : '#f87171'} opacity={0.6 + 0.4 * (1 - i / ranked.length)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 10, fontSize: '12px', color: '#64748b' }}>
            <span style={{ color: '#6366f1' }}>■ Nice strategies</span>
            <span style={{ color: '#f87171' }}>■ Not-nice strategies</span>
          </div>
        </div>
      )}

      {/* Heatmap */}
      {view === 'heatmap' && (
        <div>
          <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            Match Scores — Click Any Cell to Drill Down
          </div>
          <p style={{ fontSize: '12px', color: '#475569', marginBottom: 16 }}>
            Score earned by the row strategy against the column strategy.
          </p>
          <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
            <div style={{ minWidth: 580 }}>
              {/* Column headers */}
              <div style={{ display: 'flex', gap: 3, marginBottom: 3, paddingLeft: 96 }}>
                {stratIds.map(id => {
                  const s = ranked.find(x => x.id === id);
                  return (
                    <div key={id} style={{
                      width: 34, fontSize: '8px', color: '#64748b',
                      textAlign: 'center',
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      height: 52, overflow: 'hidden',
                      display: 'flex', alignItems: 'center',
                    }}>
                      {s?.name?.split(' ')[0] || id}
                    </div>
                  );
                })}
              </div>

              {stratIds.map(rowId => {
                const rowStrat = ranked.find(s => s.id === rowId);
                return (
                  <div key={rowId} style={{ display: 'flex', gap: 3, marginBottom: 3, alignItems: 'center' }}>
                    <div style={{
                      width: 94, fontSize: '10px', color: '#94a3b8',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      textAlign: 'right', paddingRight: 8, flexShrink: 0,
                    }}>
                      {rowStrat?.name}
                    </div>
                    {stratIds.map(colId => {
                      const score = matrix[rowId]?.[colId];
                      const matchResult = matchResults.find(m =>
                        (m.a === rowId && m.b === colId) || (m.a === colId && m.b === rowId)
                      );
                      const isSelf = rowId === colId;
                      return (
                        <div
                          key={colId}
                          title={isSelf ? '—' : `${rowStrat?.name} vs ${ranked.find(s => s.id === colId)?.name}: ${score ?? '?'}`}
                          onClick={() => !isSelf && matchResult && onMatchClick && onMatchClick(matchResult, rowId, colId)}
                          style={{
                            width: 34, height: 34, borderRadius: 5,
                            background: isSelf ? '#0f172a' : getHeatColor(score),
                            cursor: !isSelf && matchResult ? 'pointer' : 'default',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '9px', color: 'rgba(255,255,255,0.45)',
                            transition: 'transform 0.1s, filter 0.1s',
                            border: '1px solid rgba(255,255,255,0.04)',
                          }}
                          onMouseEnter={e => { if (!isSelf) { e.currentTarget.style.transform = 'scale(1.25)'; e.currentTarget.style.filter = 'brightness(1.3)'; e.currentTarget.style.zIndex = '10'; e.currentTarget.style.position = 'relative'; } }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'none'; e.currentTarget.style.zIndex = 'auto'; }}
                        >
                          {isSelf ? '–' : ''}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, fontSize: '11px', color: '#475569' }}>
            <div style={{
              width: 64, height: 8,
              background: 'linear-gradient(to right, rgba(248,113,113,0.4), rgba(99,102,241,0.8))',
              borderRadius: 3,
            }} />
            Low → High score per match
          </div>
        </div>
      )}
    </div>
  );
}
