import React, { useState } from 'react';
import { CONDITIONS, ACTIONS, DEFAULT_RULES, buildStrategyFn } from '../strategies/builder';

export default function StrategyBuilder({ onSave, onCancel }) {
  const [rules, setRules] = useState([...DEFAULT_RULES]);
  const [name, setName] = useState('My Strategy');

  const addRule = () => setRules([...rules, { conditionId: 'always', actionId: 'C' }]);
  const removeRule = (i) => setRules(rules.filter((_, idx) => idx !== i));
  const updateRule = (i, field, val) => setRules(rules.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  const moveRule = (i, dir) => {
    const newRules = [...rules];
    const j = i + dir;
    if (j < 0 || j >= newRules.length) return;
    [newRules[i], newRules[j]] = [newRules[j], newRules[i]];
    setRules(newRules);
  };

  const handleSave = () => {
    const fn = buildStrategyFn(rules);
    onSave({
      id: 'custom_' + Date.now(),
      name,
      author: 'You',
      rank: 0,
      isNice: rules[0]?.actionId === 'C',
      complexity: 'Custom',
      personality: 'Your Creation',
      description: `Custom strategy with ${rules.length} rules.`,
      tagline: '"Built by you."',
      fn,
      isCustom: true,
    });
  };

  return (
    <div style={{ animation: 'fadeUp 0.35s ease both', maxWidth: 680 }}>
      {/* Name input */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: '11px', color: '#6366f1', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
          Strategy Name
        </label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: 10, padding: '10px 14px', color: '#f1f5f9',
            fontSize: '16px', fontWeight: 700, width: '100%',
            fontFamily: 'inherit', outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
          onBlur={e => e.target.style.borderColor = 'rgba(99,102,241,0.25)'}
        />
      </div>

      {/* Rules */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Rules
            </div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: 2 }}>
              Evaluated top to bottom — first match wins
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', fontFamily: "'JetBrains Mono', monospace" }}>
            {rules.length} rule{rules.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rules.map((rule, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10, padding: '10px 12px',
              transition: 'border-color 0.15s',
            }}>
              {/* Index */}
              <span style={{
                fontSize: '11px', color: '#6366f1', width: 18,
                flexShrink: 0, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
              }}>
                {i + 1}
              </span>

              <span style={{ fontSize: '11px', color: '#64748b', flexShrink: 0, fontWeight: 700, letterSpacing: '0.06em' }}>IF</span>

              <select
                value={rule.conditionId}
                onChange={e => updateRule(i, 'conditionId', e.target.value)}
                style={selectStyle}
              >
                {CONDITIONS.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>

              <span style={{ fontSize: '14px', color: '#6366f1', flexShrink: 0 }}>→</span>

              <select
                value={rule.actionId}
                onChange={e => updateRule(i, 'actionId', e.target.value)}
                style={{
                  ...selectStyle,
                  color: rule.actionId === 'C' ? '#4ade80' : '#f87171',
                  fontWeight: 700, width: 116, flex: 'none',
                }}
              >
                {ACTIONS.map(a => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
              </select>

              <div style={{ display: 'flex', gap: 4, marginLeft: 'auto', flexShrink: 0 }}>
                <IconBtn onClick={() => moveRule(i, -1)} title="Move up">↑</IconBtn>
                <IconBtn onClick={() => moveRule(i, 1)} title="Move down">↓</IconBtn>
                <IconBtn onClick={() => removeRule(i)} title="Remove" danger>×</IconBtn>
              </div>
            </div>
          ))}
        </div>

        <button onClick={addRule} style={{
          width: '100%', padding: '10px', marginTop: 8,
          border: '1px dashed rgba(99,102,241,0.25)',
          borderRadius: 10, background: 'none',
          color: '#6366f1', cursor: 'pointer', fontSize: '13px',
          fontFamily: 'inherit', fontWeight: 600,
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.background = 'rgba(99,102,241,0.06)'; }}
          onMouseLeave={e => { e.target.style.borderColor = 'rgba(99,102,241,0.25)'; e.target.style.background = 'none'; }}
        >
          + Add Rule
        </button>
      </div>

      {/* Tip */}
      <div style={{
        background: 'rgba(99,102,241,0.06)',
        border: '1px solid rgba(99,102,241,0.15)',
        borderRadius: 10, padding: '13px 16px',
        marginBottom: 24, fontSize: '12px', color: '#94a3b8', lineHeight: 1.8,
      }}>
        <span style={{ color: '#6366f1', fontWeight: 700 }}>💡 Tip: </span>
        Rules are checked in order — the first matching condition wins.
        Put specific conditions before general ones.
        Always end with an "Always" rule as a fallback.
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={handleSave} style={{
          flex: 1, padding: '11px', borderRadius: 10, border: 'none',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: '#fff', cursor: 'pointer', fontSize: '14px',
          fontWeight: 700, fontFamily: 'inherit',
          boxShadow: '0 0 20px rgba(99,102,241,0.3)',
          transition: 'all 0.2s',
        }}>
          Save & Test Strategy →
        </button>
        <button onClick={onCancel} style={{
          padding: '11px 18px', borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'none', color: '#64748b',
          cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit',
          fontWeight: 600,
        }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function IconBtn({ children, onClick, title, danger }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 6,
        color: danger ? '#f87171' : '#64748b', cursor: 'pointer',
        width: 26, height: 26, fontSize: '14px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
        transition: 'all 0.15s', fontFamily: 'inherit',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = danger ? 'rgba(248,113,113,0.15)' : 'rgba(255,255,255,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
    >
      {children}
    </button>
  );
}

const selectStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8, padding: '5px 8px', color: '#e2e8f0',
  fontSize: '12px', cursor: 'pointer', flex: 1, fontFamily: 'inherit',
  outline: 'none',
};
