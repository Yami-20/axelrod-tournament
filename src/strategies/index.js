// ============================================================
// Axelrod's 14 Strategies - faithfully implemented
// Each strategy receives: myHistory, opponentHistory (arrays of 'C' or 'D')
// Returns: 'C' or 'D'
// ============================================================

export const COOPERATE = 'C';
export const DEFECT = 'D';

// ── 1. Tit for Tat (Rapoport) ────────────────────────────────
// Cooperate first, then mirror opponent's last move
export function titForTat(myHistory, opponentHistory) {
  if (opponentHistory.length === 0) return COOPERATE;
  return opponentHistory[opponentHistory.length - 1];
}

// ── 2. Tideman & Chieruzzi ───────────────────────────────────
// TFT with escalating punishment and "fresh start" forgiveness
export function tidemanChieruzzi(myHistory, opponentHistory, state = {}) {
  const n = myHistory.length;
  if (n === 0) return COOPERATE;

  // Count defection runs and escalate punishment
  if (!state.initialized) {
    state.retaliationLength = 0;
    state.retaliationRemaining = 0;
    state.isRetaliating = false;
    state.initialized = true;
  }

  const lastOpp = opponentHistory[n - 1];
  const prevOpp = n >= 2 ? opponentHistory[n - 2] : COOPERATE;

  // Detect end of a defection run
  if (prevOpp === DEFECT && lastOpp === COOPERATE) {
    state.retaliationLength += 1;
    state.retaliationRemaining = state.retaliationLength;
    state.isRetaliating = true;
  }

  if (state.isRetaliating && state.retaliationRemaining > 0) {
    state.retaliationRemaining -= 1;
    if (state.retaliationRemaining === 0) state.isRetaliating = false;
    return DEFECT;
  }

  return lastOpp === DEFECT ? DEFECT : COOPERATE;
}

// ── 3. Nydegger ──────────────────────────────────────────────
// Uses weighted history of last 3 rounds to decide
export function nydegger(myHistory, opponentHistory) {
  const n = myHistory.length;
  if (n === 0) return COOPERATE;
  if (n <= 2) return opponentHistory[n - 1]; // TFT for first 2

  // Weights for rounds: (t-2)=1, (t-1)=2, (t)=4; D=1, C=0
  const score = (round) => {
    const myD = myHistory[round] === DEFECT ? 1 : 0;
    const oppD = opponentHistory[round] === DEFECT ? 1 : 0;
    return myD + 2 * oppD;
  };

  const A = score(n - 3) * 1 + score(n - 2) * 2 + score(n - 1) * 4;
  // Defect on values: 1,6,7,17,22,23,26,29,30 (from Axelrod's paper)
  const defectSet = new Set([1, 6, 7, 17, 22, 23, 26, 29, 30]);
  return defectSet.has(A) ? DEFECT : COOPERATE;
}

// ── 4. Grofman ───────────────────────────────────────────────
// Cooperate first 2, TFT for next 5, then: cooperate if same last move, else 2/7 chance
export function grofman(myHistory, opponentHistory) {
  const n = myHistory.length;
  if (n < 2) return COOPERATE;
  if (n < 7) return opponentHistory[n - 1];

  const myLast = myHistory[n - 1];
  const oppLast = opponentHistory[n - 1];

  if (myLast === oppLast) return COOPERATE;
  return Math.random() < 2 / 7 ? COOPERATE : DEFECT;
}

// ── 5. Shubik ────────────────────────────────────────────────
// Punish escalating: each new defection earns +1 punishment rounds
export function shubik(myHistory, opponentHistory, state = {}) {
  const n = myHistory.length;
  if (n === 0) return COOPERATE;

  if (!state.initialized) {
    state.punishCount = 1;
    state.punishing = 0;
    state.initialized = true;
  }

  if (opponentHistory[n - 1] === DEFECT && state.punishing === 0) {
    state.punishing = state.punishCount;
    state.punishCount += 1;
  }

  if (state.punishing > 0) {
    state.punishing -= 1;
    return DEFECT;
  }
  return COOPERATE;
}

// ── 6. Stein & Rapoport ──────────────────────────────────────
// TFT but: cooperate first 4, defect last 2, check for randomness every 15
export function steinRapoport(myHistory, opponentHistory, totalRounds = 200) {
  const n = myHistory.length;
  if (n < 4) return COOPERATE;
  if (n >= totalRounds - 2) return DEFECT;

  // Every 15 moves check if opponent is random using defection rate
  if (n % 15 === 0 && n > 0) {
    const defRate = opponentHistory.filter(m => m === DEFECT).length / n;
    if (defRate > 0.3 && defRate < 0.7) return DEFECT; // seems random
  }

  return opponentHistory[n - 1];
}

// ── 7. Grudger / Grim Trigger (Friedman) ─────────────────────
// Cooperate until first defection, then defect FOREVER
export function grudger(myHistory, opponentHistory) {
  const everDefected = opponentHistory.includes(DEFECT);
  return everDefected ? DEFECT : COOPERATE;
}

// ── 8. Davis ─────────────────────────────────────────────────
// Cooperate for 10 rounds, then Grudger
export function davis(myHistory, opponentHistory) {
  if (myHistory.length < 10) return COOPERATE;
  return grudger(myHistory, opponentHistory);
}

// ── 9. Graaskamp ─────────────────────────────────────────────
// TFT for 50, probe defect on 51, then occasional random defections
export function graaskamp(myHistory, opponentHistory) {
  const n = myHistory.length;
  if (n < 50) return n === 0 ? COOPERATE : opponentHistory[n - 1];
  if (n === 50) return DEFECT; // probe
  if (n < 56) return opponentHistory[n - 1];

  // Check if opponent is random
  const defRate = opponentHistory.slice(0, n).filter(m => m === DEFECT).length / n;
  if (defRate > 0.35 && defRate < 0.65) return DEFECT;

  // Randomly defect every 5-15 moves
  const sinceLastDefect = myHistory.slice().reverse().findIndex(m => m === DEFECT);
  const gap = sinceLastDefect === -1 ? n : sinceLastDefect;
  const threshold = 5 + Math.floor(Math.random() * 10);
  if (gap >= threshold) return DEFECT;

  return opponentHistory[n - 1];
}

// ── 10. Downing ──────────────────────────────────────────────
// Estimates opponent's responsiveness; opens with 2 defections due to pessimistic priors
export function downing(myHistory, opponentHistory) {
  const n = myHistory.length;
  if (n < 2) return DEFECT; // pessimistic opening

  // Estimate P(opponent cooperates | I cooperated) and P(... | I defected)
  let ccCount = 0, cTotal = 0, dcCount = 0, dTotal = 0;
  for (let i = 1; i < n; i++) {
    if (myHistory[i - 1] === COOPERATE) {
      cTotal++;
      if (opponentHistory[i] === COOPERATE) ccCount++;
    } else {
      dTotal++;
      if (opponentHistory[i] === COOPERATE) dcCount++;
    }
  }

  const alpha = cTotal > 0 ? ccCount / cTotal : 0.5;
  const beta = dTotal > 0 ? dcCount / dTotal : 0.5;

  // R=3, S=0, T=5, P=1
  const eC = alpha * 3 + (1 - alpha) * 0;
  const eD = beta * 5 + (1 - beta) * 1;

  if (eC > eD) return COOPERATE;
  if (eD > eC) return DEFECT;
  return myHistory[n - 1] === COOPERATE ? DEFECT : COOPERATE; // alternate
}

// ── 11. Feld ─────────────────────────────────────────────────
// TFT but cooperation probability after opponent cooperates declines from 1.0 to 0.5
export function feld(myHistory, opponentHistory, totalRounds = 200) {
  const n = myHistory.length;
  if (n === 0) return COOPERATE;

  const oppLast = opponentHistory[n - 1];
  if (oppLast === DEFECT) return DEFECT;

  // Linearly decrease from 1.0 to 0.5
  const prob = 1.0 - (0.5 * n) / totalRounds;
  return Math.random() < prob ? COOPERATE : DEFECT;
}

// ── 12. Joss ─────────────────────────────────────────────────
// Almost TFT: after opponent cooperates, defect 10% of the time
export function joss(myHistory, opponentHistory) {
  const n = myHistory.length;
  if (n === 0) return COOPERATE;

  const oppLast = opponentHistory[n - 1];
  if (oppLast === DEFECT) return DEFECT;
  return Math.random() < 0.9 ? COOPERATE : DEFECT;
}

// ── 13. Tullock ──────────────────────────────────────────────
// Cooperate 11 rounds, then cooperate ~10% less than opponent did in last 10
export function tullock(myHistory, opponentHistory) {
  const n = myHistory.length;
  if (n < 11) return COOPERATE;

  const last10 = opponentHistory.slice(n - 10);
  const oppCoopRate = last10.filter(m => m === COOPERATE).length / 10;
  const myCoopProb = Math.max(0, oppCoopRate - 0.1);
  return Math.random() < myCoopProb ? COOPERATE : DEFECT;
}

// ── 14. Anonymous (grad student) ─────────────────────────────
// Starts at 30% cooperation, adjusts every 10 moves based on opponent
export function anonymous(myHistory, opponentHistory, state = {}) {
  const n = myHistory.length;

  if (!state.initialized) {
    state.p = 0.3;
    state.initialized = true;
  }

  if (n > 0 && n % 10 === 0) {
    const recent = opponentHistory.slice(n - 10);
    const defRate = recent.filter(m => m === DEFECT).length / 10;
    if (defRate > 0.7) state.p = Math.max(0.1, state.p - 0.1); // very uncooperative
    else if (defRate < 0.3) state.p = Math.min(0.9, state.p + 0.2); // very cooperative
    else state.p = 0.3; // seems random, stay low
  }

  return Math.random() < state.p ? COOPERATE : DEFECT;
}

// ── Strategy Registry ────────────────────────────────────────
export const STRATEGIES = [
  {
    id: 'tit_for_tat',
    name: 'Tit for Tat',
    author: 'Anatol Rapoport',
    rank: 1,
    isNice: true,
    complexity: 'Simple',
    personality: 'The Fair Mirror',
    description: 'Cooperate on move 1, then copy whatever your opponent did last round. Simple, transparent, and the tournament winner.',
    tagline: '"Do unto others as they do unto you."',
    fn: (my, opp) => titForTat(my, opp),
  },
  {
    id: 'tideman_chieruzzi',
    name: 'Tideman & Chieruzzi',
    author: 'Tideman & Chieruzzi',
    rank: 2,
    isNice: true,
    complexity: 'Complex',
    personality: 'The Escalating Punisher',
    description: 'TFT with escalating retaliation — each new defection run earns longer punishment. Offers "fresh starts" to truly reformed opponents.',
    tagline: '"I forgive, but I remember — and next time hurts more."',
    fn: (() => { const s = {}; return (my, opp) => tidemanChieruzzi(my, opp, s); })(),
  },
  {
    id: 'nydegger',
    name: 'Nydegger',
    author: 'Rudy Nydegger',
    rank: 3,
    isNice: true,
    complexity: 'Complex',
    personality: 'The Pattern Detective',
    description: 'Assigns weighted scores to the last 3 rounds of both players and uses a lookup table to decide. Tries to detect and respond to behavioral patterns.',
    tagline: '"I see patterns where others see noise."',
    fn: (my, opp) => nydegger(my, opp),
  },
  {
    id: 'grofman',
    name: 'Grofman',
    author: 'Bernard Grofman',
    rank: 4,
    isNice: true,
    complexity: 'Moderate',
    personality: 'The Sync Seeker',
    description: 'TFT for the first few rounds, then cooperates when both players agree, otherwise cooperates with probability 2/7.',
    tagline: '"When we\'re in sync, we stay in sync."',
    fn: (my, opp) => grofman(my, opp),
  },
  {
    id: 'shubik',
    name: 'Shubik',
    author: 'Martin Shubik',
    rank: 5,
    isNice: true,
    complexity: 'Moderate',
    personality: 'The Escalating Grudge',
    description: 'Cooperates until defected on, then punishes. Each successive betrayal earns one more round of punishment than the last.',
    tagline: '"Every betrayal costs you more than the last."',
    fn: (() => { const s = {}; return (my, opp) => shubik(my, opp, s); })(),
  },
  {
    id: 'stein_rapoport',
    name: 'Stein & Rapoport',
    author: 'Stein & Rapoport',
    rank: 6,
    isNice: true,
    complexity: 'Complex',
    personality: 'The Statistician',
    description: 'TFT but runs a statistical test every 15 rounds to detect random opponents. Cooperates first 4 rounds, defects last 2.',
    tagline: '"I run the numbers before I trust you."',
    fn: (my, opp) => steinRapoport(my, opp),
  },
  {
    id: 'grudger',
    name: 'Grudger',
    author: 'James Friedman',
    rank: 7,
    isNice: true,
    complexity: 'Simple',
    personality: 'The Grim Trigger',
    description: 'Cooperates until the first defection — then defects forever, no forgiveness whatsoever. One strike and you\'re out, for life.',
    tagline: '"Cross me once, and we are done. Forever."',
    fn: (my, opp) => grudger(my, opp),
  },
  {
    id: 'davis',
    name: 'Davis',
    author: 'Morton Davis',
    rank: 8,
    isNice: true,
    complexity: 'Simple',
    personality: 'The Patient Grudger',
    description: 'Cooperates for the first 10 rounds unconditionally, then switches to Grudger — defecting forever if the opponent ever defected.',
    tagline: '"I give you 10 rounds to prove yourself."',
    fn: (my, opp) => davis(my, opp),
  },
  {
    id: 'graaskamp',
    name: 'Graaskamp',
    author: 'James Graaskamp',
    rank: 9,
    isNice: false,
    complexity: 'Complex',
    personality: 'The Opportunist',
    description: 'TFT for 50 rounds, then probes with a defection on round 51. Occasionally sneaks in defections hoping accumulated goodwill absorbs them.',
    tagline: '"Trust is just an opportunity I haven\'t exploited yet."',
    fn: (my, opp) => graaskamp(my, opp),
  },
  {
    id: 'downing',
    name: 'Downing',
    author: 'Leslie Downing',
    rank: 10,
    isNice: false,
    complexity: 'Complex',
    personality: 'The Pessimistic Modeler',
    description: 'Continuously estimates the opponent\'s responsiveness and plays optimally against that model. Opens with 2 defections due to pessimistic priors — which hurt it badly.',
    tagline: '"I assume the worst until proven otherwise."',
    fn: (my, opp) => downing(my, opp),
  },
  {
    id: 'feld',
    name: 'Feld',
    author: 'Scott Feld',
    rank: 11,
    isNice: false,
    complexity: 'Moderate',
    personality: 'The Fading Friend',
    description: 'Starts as TFT but gradually becomes more likely to defect after opponent cooperations — decaying from 100% to 50% cooperation probability by round 200.',
    tagline: '"I get a little greedier as time goes on."',
    fn: (my, opp) => feld(my, opp),
  },
  {
    id: 'joss',
    name: 'Joss',
    author: 'Johann Joss',
    rank: 12,
    isNice: false,
    complexity: 'Simple',
    personality: 'The Almost-Honest Cheat',
    description: 'Nearly TFT: after opponent cooperates, defects 10% of the time. Those random betrayals trigger retaliation spirals that sink its score.',
    tagline: '"Just a little cheat here and there... right?"',
    fn: (my, opp) => joss(my, opp),
  },
  {
    id: 'tullock',
    name: 'Tullock',
    author: 'Gordon Tullock',
    rank: 13,
    isNice: false,
    complexity: 'Moderate',
    personality: 'The Slow Defector',
    description: 'Cooperates first 11 rounds, then cooperates ~10% less than the opponent has — slowly free-riding on established goodwill.',
    tagline: '"I\'ll let you do most of the cooperating."',
    fn: (my, opp) => tullock(my, opp),
  },
  {
    id: 'anonymous',
    name: 'Anonymous',
    author: 'Name Withheld',
    rank: 14,
    isNice: false,
    complexity: 'Moderate',
    personality: 'The Adaptive Pessimist',
    description: 'Starts at only 30% cooperation and adjusts every 10 rounds based on opponent behavior. The low start poisoned relationships before it could adapt.',
    tagline: '"I don\'t trust anyone — but I\'m open to being wrong."',
    fn: (() => { const s = {}; return (my, opp) => anonymous(my, opp, s); })(),
  },
];

// ── Payoff Matrix ────────────────────────────────────────────
export function getPayoff(myMove, opponentMove) {
  if (myMove === COOPERATE && opponentMove === COOPERATE) return [3, 3];
  if (myMove === COOPERATE && opponentMove === DEFECT)    return [0, 5];
  if (myMove === DEFECT    && opponentMove === COOPERATE) return [5, 0];
  return [1, 1]; // both defect
}

// ── Run a match between two strategy functions ───────────────
export function runMatch(stratA, stratB, rounds = 200) {
  const histA = [], histB = [];
  const scoreA = [], scoreB = [];
  let totalA = 0, totalB = 0;

  for (let i = 0; i < rounds; i++) {
    const moveA = stratA(histA, histB);
    const moveB = stratB(histB, histA);
    const [pA, pB] = getPayoff(moveA, moveB);

    histA.push(moveA);
    histB.push(moveB);
    scoreA.push(pA);
    scoreB.push(pB);
    totalA += pA;
    totalB += pB;
  }

  return { histA, histB, scoreA, scoreB, totalA, totalB };
}

// ── Run full round-robin tournament ─────────────────────────
export function runTournament(strategies, rounds = 200) {
  const scores = {};
  strategies.forEach(s => { scores[s.id] = 0; });

  const matchResults = [];

  for (let i = 0; i < strategies.length; i++) {
    for (let j = i; j < strategies.length; j++) {
      const sA = strategies[i];
      const sB = strategies[j];

      // Fresh function instances for stateful strategies
      const fnA = STRATEGIES.find(s => s.id === sA.id).fn;
      const fnB = STRATEGIES.find(s => s.id === sB.id).fn;

      // Re-instantiate to reset state
      const freshA = getFreshStrategy(sA.id);
      const freshB = getFreshStrategy(sB.id);

      const result = runMatch(freshA, freshB, rounds);
      scores[sA.id] += result.totalA;
      if (i !== j) {
        scores[sB.id] += result.totalB;
      } else {
        scores[sA.id] += result.totalB; // self-play
      }

      matchResults.push({ a: sA.id, b: sB.id, ...result });
    }
  }

  const ranked = strategies
    .map(s => ({ ...s, totalScore: scores[s.id] }))
    .sort((a, b) => b.totalScore - a.totalScore);

  return { ranked, matchResults, scores };
}

export function getFreshStrategy(id) {
  switch (id) {
    case 'tit_for_tat':       return (my, opp) => titForTat(my, opp);
    case 'tideman_chieruzzi': { const s = {}; return (my, opp) => tidemanChieruzzi(my, opp, s); }
    case 'nydegger':          return (my, opp) => nydegger(my, opp);
    case 'grofman':           return (my, opp) => grofman(my, opp);
    case 'shubik':            { const s = {}; return (my, opp) => shubik(my, opp, s); }
    case 'stein_rapoport':    return (my, opp) => steinRapoport(my, opp);
    case 'grudger':           return (my, opp) => grudger(my, opp);
    case 'davis':             return (my, opp) => davis(my, opp);
    case 'graaskamp':         return (my, opp) => graaskamp(my, opp);
    case 'downing':           return (my, opp) => downing(my, opp);
    case 'feld':              return (my, opp) => feld(my, opp);
    case 'joss':              return (my, opp) => joss(my, opp);
    case 'tullock':           return (my, opp) => tullock(my, opp);
    case 'anonymous':         { const s = {}; return (my, opp) => anonymous(my, opp, s); }
    default:                  return (my, opp) => titForTat(my, opp);
  }
}
