# ◈ Axelrod's Tournament

An interactive simulator for all 14 strategies from **Robert Axelrod's landmark 1980 Iterated Prisoner's Dilemma tournament** — the experiment that proved cooperation can emerge from pure self-interest.

🔗 **[Live Demo](https://YOUR_GITHUB_USERNAME.github.io/axelrod-tournament)** ← update after deploying

---

## Features

- **Strategies** — Browse all 14 original strategies with personality profiles, authors, and descriptions
- **Duel ⚔** — Pick any two strategies, run 200 rounds, and inspect the move-by-move history + score chart
- **Tournament ◉** — Full round-robin: every strategy vs every other, with a leaderboard, bar chart, and interactive heatmap
- **Builder ⬡** — Design your own strategy with visual if→then rules, then pit it against the originals
- **Learn ◎** — Expandable explainers on the Prisoner's Dilemma, why TFT won, and the evolutionary implications

---

## The 14 Strategies (original tournament rank)

| # | Strategy | Author | Type |
|---|----------|--------|------|
| 1 | Tit for Tat | Anatol Rapoport | Nice |
| 2 | Tideman & Chieruzzi | Tideman & Chieruzzi | Nice |
| 3 | Nydegger | Rudy Nydegger | Nice |
| 4 | Grofman | Bernard Grofman | Nice |
| 5 | Shubik | Martin Shubik | Nice |
| 6 | Stein & Rapoport | Stein & Rapoport | Nice |
| 7 | Grudger (Grim Trigger) | James Friedman | Nice |
| 8 | Davis | Morton Davis | Nice |
| 9 | Graaskamp | James Graaskamp | Not Nice |
| 10 | Downing | Leslie Downing | Not Nice |
| 11 | Feld | Scott Feld | Not Nice |
| 12 | Joss | Johann Joss | Not Nice |
| 13 | Tullock | Gordon Tullock | Not Nice |
| 14 | Anonymous | Name Withheld | Not Nice |

> **Nice** = never defects first. All top 8 finishers were nice strategies.

---

## Quick Start

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/axelrod-tournament.git
cd axelrod-tournament
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to GitHub Pages (get a live URL)

### Step 1 — Create the GitHub repo

1. Go to [github.com/new](https://github.com/new)
2. Name it `axelrod-tournament`
3. Leave it public, don't initialize with README
4. Click **Create repository**

### Step 2 — Push your code

```bash
cd axelrod-tournament
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/axelrod-tournament.git
git push -u origin main
```

### Step 3 — Update your username

In `package.json`, replace `YOUR_GITHUB_USERNAME`:

```json
"homepage": "https://YOUR_GITHUB_USERNAME.github.io/axelrod-tournament"
```

Also update the GitHub link in `src/App.jsx`:

```jsx
href="https://github.com/YOUR_GITHUB_USERNAME/axelrod-tournament"
```

And the live demo link in this README.

### Step 4 — Deploy

```bash
npm run deploy
```

This builds the app and pushes to the `gh-pages` branch. GitHub Pages serves it automatically.

Your app will be live at:
```
https://YOUR_GITHUB_USERNAME.github.io/axelrod-tournament
```

> **Note:** GitHub Pages can take 1–2 minutes to go live after first deploy. Subsequent deploys are faster.

### Re-deploying after changes

```bash
# Make your changes, then:
git add .
git commit -m "Your change description"
git push origin main
npm run deploy
```

---

## Project Structure

```
src/
├── strategies/
│   ├── index.js        # All 14 strategies + game engine (runMatch, runTournament)
│   └── builder.js      # Custom strategy builder logic + conditions
├── components/
│   ├── StrategyCard.jsx      # Strategy info card (used in Strategies + Duel tabs)
│   ├── MatchView.jsx         # 1v1 match result: overview, moves grid, score chart
│   ├── TournamentResults.jsx # Leaderboard, bar chart, heatmap
│   ├── StrategyBuilder.jsx   # Visual if→then rule editor
│   └── MoveGrid.jsx          # 200-cell move visualization grid
└── App.jsx             # Root: tab routing, state, duel/tournament orchestration
```

---

## The Payoff Matrix

|  | Opponent Cooperates | Opponent Defects |
|--|--------------------|-----------------| 
| **I Cooperate** | 3, 3 | 0, 5 |
| **I Defect** | 5, 0 | 1, 1 |

## Why Tit for Tat Won

Axelrod identified 4 properties of successful strategies:

1. **Nice** — never defects first
2. **Retaliatory** — punishes defection immediately  
3. **Forgiving** — returns to cooperation after retaliation
4. **Clear** — so predictable that opponents quickly learn how to interact with it

> Cooperation can emerge from self-interest alone, when players interact repeatedly and both care about future rounds.

---

## Further Reading

- Axelrod, R. (1980). *Effective Choice in the Prisoner's Dilemma*. Journal of Conflict Resolution, 24(1), 3–25.
- Axelrod, R. (1984). *The Evolution of Cooperation*. Basic Books.
- [Nicky Case — The Evolution of Trust](https://ncase.me/trust/) — excellent interactive explainer
- [Axelrod Python Library](https://github.com/Axelrod-Python/Axelrod) — research-grade IPD toolkit

---

## Ideas for Contribution

- **Noise mode** — random move flips to test robustness
- **Evolutionary simulation** — strategies reproduce proportionally to score
- **Second tournament** — add strategies from Axelrod's 1984 tournament (62 strategies)
- **Mobile layout** improvements

---

## License

MIT
