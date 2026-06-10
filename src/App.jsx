import React, { useState, useCallback } from 'react';
import { STRATEGIES, runMatch, runTournament, getFreshStrategy } from './strategies';
import StrategyCard from './components/StrategyCard';
import MatchView from './components/MatchView';
import TournamentResults from './components/TournamentResults';
import StrategyBuilder from './components/StrategyBuilder';

const TABS = ['strategies', 'duel', 'tournament', 'builder', 'learn'];

const TAB_META = {
  strategies: { icon: '◈', label: 'Strategies' },
  duel:        { icon: '⚔', label: 'Duel' },
  tournament:  { icon: '◉', label: 'Tournament' },
  builder:     { icon: '⬡', label: 'Builder' },
  learn:       { icon: '◎', label: 'Learn' },
};

export default function App() {
  const [tab, setTab] = useState('strategies');
  const [selectedForDuel, setSelectedForDuel] = useState([]);
  const [duelResult, setDuelResult] = useState(null);
  const [tournamentResult, setTournamentResult] = useState(null);
  const [tournamentRunning, setTournamentRunning] = useState(false);
  const [customStrategies, setCustomStrategies] = useState([]);
  const [matchFromTournament, setMatchFromTournament] = useState(null);
  const [expandedStrategy, setExpandedStrategy] = useState(null);

  const allStrategies = [...STRATEGIES, ...customStrategies];

  const handleStrategySelect = (strategy) => {
    if (tab !== 'duel') return;
    setDuelResult(null);
    if (selectedForDuel.find(s => s.id === strategy.id)) {
      setSelectedForDuel(selectedForDuel.filter(s => s.id !== strategy.id));
    } else if (selectedForDuel.length < 2) {
      setSelectedForDuel([...selectedForDuel, strategy]);
    } else {
      setSelectedForDuel([selectedForDuel[1], strategy]);
    }
  };

  const runDuel = useCallback(() => {
    if (selectedForDuel.length !== 2) return;
    const fnA = getFreshStrategy(selectedForDuel[0].id) || selectedForDuel[0].fn;
    const fnB = getFreshStrategy(selectedForDuel[1].id) || selectedForDuel[1].fn;
    const result = runMatch(fnA, fnB, 200);
    setDuelResult(result);
  }, [selectedForDuel]);

  const runFullTournament = useCallback(() => {
    setTournamentRunning(true);
    setTimeout(() => {
      try {
        const result = runTournament(allStrategies, 200);
        setTournamentResult(result);
      } catch (e) { console.error(e); }
      setTournamentRunning(false);
    }, 50);
  }, [allStrategies]);

  const handleSaveCustom = (strategy) => {
    setCustomStrategies(prev => [...prev.filter(s => !s.id.startsWith('custom_') || s.id === strategy.id), strategy]);
    setTab('duel');
  };

  const handleTournamentMatchClick = (matchResult, rowId, colId) => {
    const sA = allStrategies.find(s => s.id === matchResult.a) || allStrategies.find(s => s.id === rowId);
    const sB = allStrategies.find(s => s.id === matchResult.b) || allStrategies.find(s => s.id === colId);
    setMatchFromTournament({ result: matchResult, stratA: sA, stratB: sB });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080b14',
      fontFamily: "'Space Grotesk', 'Inter', sans-serif",
      color: '#e2e8f0',
      overflowX: 'hidden',
    }}>
      {/* Ambient background glow */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 80% 40% at 20% -10%, rgba(99,102,241,0.12) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 80% 110%, rgba(236,72,153,0.08) 0%, transparent 60%)
        `,
      }} />

      {/* Header */}
      <header style={{
        position: 'relative', zIndex: 10,
        borderBottom: '1px solid rgba(99,102,241,0.2)',
        background: 'rgba(8,11,20,0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 0 0' }}>
            {/* Logo mark */}
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', flexShrink: 0, boxShadow: '0 0 20px rgba(99,102,241,0.4)',
            }}>◈</div>
            <div>
              <h1 style={{
                fontSize: '18px', fontWeight: 700, margin: 0,
                color: '#f8fafc', letterSpacing: '-0.02em',
              }}>
                Axelrod's Tournament
              </h1>
              <p style={{ fontSize: '11px', color: '#6366f1', margin: 0, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Iterated Prisoner's Dilemma · 1980
              </p>
            </div>

            {/* GitHub link */}
            <a
              href="https://github.com/YOUR_USERNAME/axelrod-tournament"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginLeft: 'auto',
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)',
                color: '#94a3b8', textDecoration: 'none',
                fontSize: '12px', fontWeight: 600,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; e.currentTarget.style.color = '#a5b4fc'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#94a3b8'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>

          {/* Nav tabs */}
          <nav style={{ display: 'flex', gap: 2, marginTop: 12 }}>
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setDuelResult(null); setMatchFromTournament(null); }}
                style={{
                  background: 'none', border: 'none',
                  padding: '10px 16px',
                  fontSize: '13px', cursor: 'pointer',
                  fontFamily: 'inherit', fontWeight: 600,
                  color: tab === t ? '#a5b4fc' : '#64748b',
                  borderBottom: `2px solid ${tab === t ? '#6366f1' : 'transparent'}`,
                  transition: 'all 0.15s ease',
                  letterSpacing: '0.02em',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <span style={{ fontSize: '14px' }}>{TAB_META[t].icon}</span>
                {TAB_META[t].label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main */}
      <main style={{ position: 'relative', zIndex: 1, maxWidth: 960, margin: '0 auto', padding: '28px 24px' }}>

        {/* STRATEGIES TAB */}
        {tab === 'strategies' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                  The 14 Original Strategies
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                  From Axelrod's landmark 1980 Prisoner's Dilemma tournament
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Tag color="#4ade80" bg="rgba(74,222,128,0.1)">● Nice</Tag>
                <Tag color="#f87171" bg="rgba(248,113,113,0.1)">● Not Nice</Tag>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {STRATEGIES.map(s => (
                <StrategyCard
                  key={s.id}
                  strategy={s}
                  showRank
                  onClick={() => setExpandedStrategy(expandedStrategy?.id === s.id ? null : s)}
                  selected={expandedStrategy?.id === s.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* DUEL TAB */}
        {tab === 'duel' && !duelResult && (
          <div>
            <SectionHeader
              title="Strategy Duel"
              subtitle="Pick two strategies — watch 200 rounds of cooperation or betrayal unfold."
            />

            {selectedForDuel.length > 0 && (
              <div style={{
                display: 'flex', gap: 12, alignItems: 'center',
                padding: '14px 18px',
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 14, marginBottom: 20, flexWrap: 'wrap',
              }}>
                <div style={{ display: 'flex', gap: 8, flex: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                  {selectedForDuel.map((s, i) => (
                    <React.Fragment key={s.id}>
                      <span style={{
                        padding: '5px 14px',
                        background: 'rgba(99,102,241,0.2)',
                        border: '1px solid rgba(99,102,241,0.3)',
                        borderRadius: 24, fontSize: '13px', color: '#a5b4fc', fontWeight: 700,
                      }}>{s.name}</span>
                      {i === 0 && selectedForDuel.length === 2 && (
                        <span style={{ color: '#475569', fontSize: '13px', fontWeight: 700 }}>vs</span>
                      )}
                    </React.Fragment>
                  ))}
                  {selectedForDuel.length === 1 && (
                    <span style={{ fontSize: '13px', color: '#475569' }}>← pick one more to duel</span>
                  )}
                </div>
                {selectedForDuel.length === 2 && (
                  <button onClick={runDuel} style={{
                    padding: '9px 22px', borderRadius: 10, border: 'none',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#fff', fontWeight: 700, cursor: 'pointer',
                    fontSize: '13px', fontFamily: 'inherit',
                    boxShadow: '0 0 20px rgba(99,102,241,0.35)',
                    transition: 'all 0.2s',
                  }}>
                    ⚔ Run Match
                  </button>
                )}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
              {allStrategies.map(s => (
                <StrategyCard
                  key={s.id}
                  strategy={s}
                  selected={selectedForDuel.find(x => x.id === s.id)}
                  onClick={handleStrategySelect}
                />
              ))}
            </div>
          </div>
        )}

        {tab === 'duel' && duelResult && (
          <MatchView
            result={duelResult}
            stratA={selectedForDuel[0]}
            stratB={selectedForDuel[1]}
            onBack={() => setDuelResult(null)}
          />
        )}

        {/* TOURNAMENT TAB */}
        {tab === 'tournament' && !matchFromTournament && (
          <div>
            {!tournamentResult ? (
              <div style={{ textAlign: 'center', padding: '64px 20px' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 72, height: 72, borderRadius: 20, marginBottom: 20,
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(236,72,153,0.2))',
                  border: '1px solid rgba(99,102,241,0.3)',
                  fontSize: '36px',
                }}>◉</div>
                <h2 style={{ color: '#f8fafc', marginBottom: 8, fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em' }}>
                  Full Round-Robin Tournament
                </h2>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: 28, maxWidth: 420, margin: '0 auto 28px', lineHeight: 1.7 }}>
                  Every strategy plays every other for 200 rounds.
                  {customStrategies.length > 0 && ` Your ${customStrategies.length} custom strateg${customStrategies.length > 1 ? 'ies' : 'y'} will compete too.`}
                </p>
                <button
                  onClick={runFullTournament}
                  disabled={tournamentRunning}
                  style={{
                    padding: '13px 36px', borderRadius: 12, border: 'none',
                    background: tournamentRunning
                      ? 'rgba(255,255,255,0.08)'
                      : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: tournamentRunning ? '#64748b' : '#fff',
                    fontWeight: 700, cursor: tournamentRunning ? 'not-allowed' : 'pointer',
                    fontSize: '15px', fontFamily: 'inherit',
                    boxShadow: tournamentRunning ? 'none' : '0 0 30px rgba(99,102,241,0.4)',
                    transition: 'all 0.2s',
                  }}
                >
                  {tournamentRunning ? '⏳ Running...' : '▶ Start Tournament'}
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <SectionHeader
                    title="Tournament Results"
                    subtitle={`${allStrategies.length} strategies · 200 rounds per match · Round-robin`}
                  />
                  <button onClick={() => setTournamentResult(null)} style={{
                    background: 'none', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8, padding: '7px 14px', color: '#64748b',
                    cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit',
                    fontWeight: 600,
                  }}>↺ Re-run</button>
                </div>
                <TournamentResults
                  results={tournamentResult}
                  strategies={allStrategies}
                  onMatchClick={handleTournamentMatchClick}
                />
              </div>
            )}
          </div>
        )}

        {tab === 'tournament' && matchFromTournament && (
          <MatchView
            result={matchFromTournament.result}
            stratA={matchFromTournament.stratA}
            stratB={matchFromTournament.stratB}
            onBack={() => setMatchFromTournament(null)}
          />
        )}

        {/* BUILDER TAB */}
        {tab === 'builder' && (
          <div>
            <SectionHeader
              title="Strategy Builder"
              subtitle="Design your own strategy with if→then rules. Then test it in Duel or Tournament."
            />
            <StrategyBuilder
              onSave={handleSaveCustom}
              onCancel={() => setTab('strategies')}
            />
          </div>
        )}

        {/* LEARN TAB */}
        {tab === 'learn' && (
          <div style={{ maxWidth: 700 }}>
            <LearnContent />
          </div>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #080b14; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.3); }
          50%       { box-shadow: 0 0 35px rgba(99,102,241,0.5); }
        }
        .fade-up { animation: fadeUp 0.35s ease both; }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.5); }

        select, option { background: #111827; color: #e2e8f0; }

        .strategy-card-wrap:hover .card-inner {
          background: rgba(99,102,241,0.07) !important;
          border-color: rgba(99,102,241,0.3) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

function Tag({ children, color, bg }) {
  return (
    <span style={{
      fontSize: '11px', padding: '4px 10px', borderRadius: 20,
      color, background: bg, fontWeight: 600, letterSpacing: '0.04em',
    }}>
      {children}
    </span>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>{subtitle}</p>
      )}
    </div>
  );
}

function LearnContent() {
  const sections = [
    {
      title: "◈  What is the Prisoner's Dilemma?",
      content: `Two players simultaneously choose to Cooperate (C) or Defect (D).

The payoffs are:
  • Both cooperate → 3 points each
  • Both defect → 1 point each
  • One defects, one cooperates → Defector gets 5, Cooperator gets 0

The dilemma: Defecting is always "safer" individually, but mutual defection leaves both players worse off than mutual cooperation.`,
    },
    {
      title: '⟳  Iterated = repeated rounds',
      content: `In a single game, rational logic says always defect. But play 200 times and something changes: you can build trust, punish betrayals, and reward cooperation.

This is what Axelrod explored. Can cooperation emerge naturally — without central authority — purely through self-interest?

The answer was yes. And the winning strategy was disarmingly simple.`,
    },
    {
      title: '◉  Why Tit for Tat won',
      content: `Tit for Tat won with just two rules:
  1. Cooperate on round 1
  2. Copy your opponent's last move

Axelrod identified four winning properties:
  Nice       — Never defects first
  Retaliatory — Punishes defection immediately
  Forgiving  — Returns to cooperation right away
  Clear      — So predictable opponents quickly learn it

The lesson: you don't need to be clever to win. Be trustworthy and firm.`,
    },
    {
      title: '⚠  Why Joss failed',
      content: `Joss was almost TFT — except it randomly defected 10% of the time after cooperation.

The idea: sneak in free points while mostly cooperating.

What actually happened: those random betrayals triggered retaliation spirals from TFT-like strategies. Joss finished 12th.

The lesson: "almost nice" collapses. Even small amounts of unprovoked cheating destroy cooperative relationships.`,
    },
    {
      title: '🔺  Why Grudger finished 7th despite being "nice"',
      content: `Grudger cooperates until the first defection — then defects forever. It never exploits anyone first.

So why didn't it win? Because it can't recover from mistakes. A single defection permanently destroys the relationship.

Forgiveness — the ability to resume cooperation after retaliation — is what separates Tit for Tat from Grudger.`,
    },
    {
      title: '◈  The evolutionary implication',
      content: `Axelrod ran a simulation where strategies "reproduced" proportionally to their scores, mimicking natural selection.

Nice strategies gradually took over the population. Even Always-Defect, which thrived early by exploiting nice strategies, declined as victims disappeared.

Cooperation isn't just a nice idea — it's an evolutionarily stable strategy when the shadow of the future is long enough.`,
    },
  ];

  const [open, setOpen] = useState(null);

  return (
    <div className="fade-up">
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ color: '#f8fafc', marginBottom: 6, fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em' }}>
          Understanding Axelrod's Tournament
        </h2>
        <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.7 }}>
          The most important experiment in the history of game theory.
        </p>
      </div>

      {/* Payoff matrix callout */}
      <div style={{
        background: 'rgba(99,102,241,0.06)',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 14, padding: '20px 24px', marginBottom: 28,
      }}>
        <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
          Payoff Matrix
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { label: 'Both Cooperate', val: '3 + 3', color: '#4ade80' },
            { label: 'Both Defect', val: '1 + 1', color: '#f87171' },
            { label: 'You Cooperate, They Defect', val: '0 + 5', color: '#f97316' },
            { label: 'You Defect, They Cooperate', val: '5 + 0', color: '#facc15' },
          ].map(row => (
            <div key={row.label} style={{
              background: 'rgba(255,255,255,0.03)', borderRadius: 8,
              padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
            }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>{row.label}</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: row.color, fontFamily: "'JetBrains Mono', monospace" }}>{row.val}</span>
            </div>
          ))}
        </div>
      </div>

      {sections.map((s, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', textAlign: 'left', padding: '15px 18px',
              background: open === i ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${open === i ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: open === i ? '12px 12px 0 0' : 12,
              cursor: 'pointer', color: '#e2e8f0',
              fontSize: '14px', fontWeight: 600, fontFamily: 'inherit',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'all 0.15s ease',
            }}
          >
            {s.title}
            <span style={{
              color: open === i ? '#6366f1' : '#475569', fontSize: '20px', fontWeight: 300,
              transform: open === i ? 'rotate(45deg)' : 'rotate(0)',
              transition: 'transform 0.2s ease',
              display: 'inline-block',
            }}>+</span>
          </button>
          {open === i && (
            <div style={{
              padding: '18px 18px', background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(99,102,241,0.15)', borderTop: 'none',
              borderRadius: '0 0 12px 12px',
              fontSize: '13px', color: '#94a3b8', lineHeight: 2,
              whiteSpace: 'pre-line', fontFamily: "'JetBrains Mono', monospace",
            }}>
              {s.content}
            </div>
          )}
        </div>
      ))}

      {/* Further reading */}
      <div style={{ marginTop: 32, padding: '20px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 }}>
        <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
          Further Reading
        </div>
        {[
          { label: "Nicky Case — The Evolution of Trust", url: "https://ncase.me/trust/" },
          { label: "Axelrod Python Library (research-grade IPD)", url: "https://github.com/Axelrod-Python/Axelrod" },
          { label: "Wikipedia — Axelrod's Tournament", url: "https://en.wikipedia.org/wiki/The_Evolution_of_Cooperation" },
        ].map(link => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block', padding: '8px 0',
              color: '#6366f1', fontSize: '13px', textDecoration: 'none', fontWeight: 500,
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.target.style.color = '#a5b4fc'}
            onMouseLeave={e => e.target.style.color = '#6366f1'}
          >
            → {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
