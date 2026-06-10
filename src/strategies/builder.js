// ── Custom Strategy Builder ───────────────────────────────────
// Allows users to construct strategies from simple logic blocks

export const CONDITIONS = [
  { id: 'always',         label: 'Always',                         fn: () => true },
  { id: 'opp_last_c',     label: 'Opponent cooperated last round', fn: (my, opp) => opp.length > 0 && opp[opp.length - 1] === 'C' },
  { id: 'opp_last_d',     label: 'Opponent defected last round',   fn: (my, opp) => opp.length > 0 && opp[opp.length - 1] === 'D' },
  { id: 'i_last_c',       label: 'I cooperated last round',        fn: (my) => my.length > 0 && my[my.length - 1] === 'C' },
  { id: 'i_last_d',       label: 'I defected last round',          fn: (my) => my.length > 0 && my[my.length - 1] === 'D' },
  { id: 'opp_defected_2', label: 'Opponent defected 2 rounds in a row', fn: (my, opp) => opp.length >= 2 && opp[opp.length - 1] === 'D' && opp[opp.length - 2] === 'D' },
  { id: 'opp_never_d',    label: 'Opponent has never defected',    fn: (my, opp) => !opp.includes('D') },
  { id: 'opp_mostly_c',   label: 'Opponent cooperates >70% of time', fn: (my, opp) => opp.length > 5 && opp.filter(m => m === 'C').length / opp.length > 0.7 },
  { id: 'opp_mostly_d',   label: 'Opponent defects >70% of time',  fn: (my, opp) => opp.length > 5 && opp.filter(m => m === 'D').length / opp.length > 0.7 },
  { id: 'first_round',    label: 'It is the first round',          fn: (my) => my.length === 0 },
  { id: 'round_gt_10',    label: 'More than 10 rounds played',     fn: (my) => my.length > 10 },
  { id: 'round_gt_50',    label: 'More than 50 rounds played',     fn: (my) => my.length > 50 },
  { id: 'same_last',      label: 'Both made the same move last round', fn: (my, opp) => my.length > 0 && my[my.length - 1] === opp[opp.length - 1] },
];

export const ACTIONS = [
  { id: 'C', label: 'Cooperate' },
  { id: 'D', label: 'Defect' },
];

export const DEFAULT_RULES = [
  { conditionId: 'first_round', actionId: 'C' },
  { conditionId: 'opp_last_d',  actionId: 'D' },
  { conditionId: 'always',      actionId: 'C' },
];

export function buildStrategyFn(rules) {
  return (myHistory, opponentHistory) => {
    for (const rule of rules) {
      const condition = CONDITIONS.find(c => c.id === rule.conditionId);
      if (condition && condition.fn(myHistory, opponentHistory)) {
        return rule.actionId;
      }
    }
    return 'C'; // fallback
  };
}
