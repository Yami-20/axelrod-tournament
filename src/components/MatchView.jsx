import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import MoveGrid from './MoveGrid';

function getMatchCommentary(result, nameA, nameB) {
  const { histA, histB, totalA, totalB } = result;
  const comments = [];
  const coopA = histA.filter(m => m === 'C').length / histA.length;
  const coopB = histB.filter(m => m === 'C').length / histB.length;

  if (coopA > 0.9 && coopB > 0.9)
    comments.push({ icon: '🤝', text: `Mutual cooperation: Both players cooperated almost every round, maximizing joint score.` });
  else if (coopA < 0.2 && coopB < 0.2)
    comments.push({ icon: '⚔', text: `Mutual defection spiral: Both locked into defecting — leaving points on the table for both.` });
  else if (Math.abs(coopA - coopB) > 0.4) {
    const exploiter = coopA < coopB ? nameA : nameB;
    const victim = coopA < coopB ? nameB : nameA;
    comments.push({ icon: '🦊', text: `Exploitation: ${exploiter} defected heavily while ${victim} kept cooperating.` });
  }

  if (histA[0] === 'D' || histB[0] === 'D') {
    const who = histA[0] === 'D' ? nameA : nameB;
    comments.push({ icon: '⚡', text: `${who} defected on round 1, setting a hostile tone immediately.` });
  }

  const gap = Math.abs(totalA - totalB);
  const winner = totalA > totalB ? nameA : totalB > totalA ? nameB : null;
  if (winner)
    comments.push({ icon: '◉', text: `${winner} won by ${gap} points (${(gap / histA.length).toFixed(1)} per round).` });
  else
    comments.push({ icon: '⚖', text: `The match ended in a perfect tie.` });

  return comments;
}

export default function MatchView({ result, stratA, stratB, onBack }) {
  const [view, setView] = useState('overview');
  if (!result) return null;

  const { histA, histB, scoreA, scoreB, totalA, totalB } = result;
  const coopA = Math.round(histA.filter(m => m === 'C').length / histA.length * 100);
  const coopB = Math.round(histB.filter(m => m === 'C').length / histB.length * 100);
  const commentary = getMatchCommentary(result, stratA.name, stratB.name);

  const chartData = histA.map((_, i) => {
    const cumA = scoreA.slice(0, i + 1).reduce((a, b) => a + b, 0);
    const cumB = scoreB.slice(0, i + 1).reduce((a, b) => a + b, 0);
    return { round: i + 1, [stratA.name]: cumA, [stratB.name]: cumB };
  }).filter((_, i) => i % 4 === 0 || i === histA.length - 1);

  return (
    <div style={{ animation: 'fadeUp 0.3s ease both' }}>
      <button onClick={onBack} style={{
        background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer',
        fontSize: '13px', padding: '0 0 16px', fontFamily: 'inherit', fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>← Back</button>

      {/* Match header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          {stratA.name} <span style={{ color: '#475569', fontWeight: 400 }}>vs</span> {stratB.name}
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
          200 rounds · Iterated Prisoner's Dilemma
        </p>
      </div>

      {/* Score banner */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        gap: 16, alignItems: 'center', margin: '0 0 24px',
        padding: '24px', borderRadius: 16,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}>
        <ScorePanel
          name={stratA.name}
          score={totalA}
          coop={coopA}
          isWinner={totalA > totalB}
          color="#6366f1"
        />
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '12px', color: '#475569', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4,
          }}>vs</div>
          <div style={{ fontSize: '11px', color: '#374151' }}>200 rounds</div>
        </div>
        <ScorePanel
          name={stratB.name}
          score={totalB}
          coop={coopB}
          isWinner={totalB > totalA}
          color="#ec4899"
          align="right"
        />
      </div>

      {/* View tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {['overview', 'moves', 'chart'].map(t => (
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

      {/* Overview */}
      {view === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Label>Match Analysis</Label>
          {commentary.map((c, i) => (
            <div key={i} style={{
              padding: '14px 16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10, fontSize: '14px', color: '#cbd5e1', lineHeight: 1.7,
              display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: '18px', flexShrink: 0 }}>{c.icon}</span>
              {c.text}
            </div>
          ))}
        </div>
      )}

      {/* Moves */}
      {view === 'moves' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Label>Move History (green = cooperate, red = defect)</Label>
          {[[histA, stratA.name, '#6366f1'], [histB, stratB.name, '#ec4899']].map(([hist, name, color]) => (
            <div key={name} style={{
              padding: '16px 18px', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12,
            }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color, marginBottom: 10, letterSpacing: '0.02em' }}>
                {name}
              </div>
              <MoveGrid history={hist} />
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      {view === 'chart' && (
        <div>
          <Label>Cumulative Score Over 200 Rounds</Label>
          <div style={{ marginTop: 16 }}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <XAxis dataKey="round" stroke="#1e293b" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <YAxis stroke="#1e293b" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, fontFamily: 'Space Grotesk' }}
                  labelStyle={{ color: '#94a3b8', fontSize: 12 }}
                  itemStyle={{ fontSize: 13 }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                <Line type="monotone" dataKey={stratA.name} stroke="#6366f1" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey={stratB.name} stroke="#ec4899" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

function ScorePanel({ name, score, coop, isWinner, color, align = 'left' }) {
  return (
    <div style={{ textAlign: align }}>
      <div style={{ fontSize: '13px', color: '#64748b', marginBottom: 6, fontWeight: 600 }}>{name}</div>
      <div style={{
        fontSize: '44px', fontWeight: 700,
        fontFamily: "'JetBrains Mono', monospace",
        color: isWinner ? color : '#374151',
        letterSpacing: '-0.03em',
        textShadow: isWinner ? `0 0 24px ${color}60` : 'none',
      }}>{score}</div>
      <div style={{ fontSize: '12px', color: '#475569', marginTop: 4 }}>{coop}% coop</div>
    </div>
  );
}

function Label({ children }) {
  return (
    <div style={{
      fontSize: '11px', color: '#6366f1', fontWeight: 700,
      letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4,
    }}>
      {children}
    </div>
  );
}
