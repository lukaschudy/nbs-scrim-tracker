# NBS Scrim Tracker

A League of Legends scrim tracking application for competitive teams, with full **Fearless Draft** support.

## What It Does

NBS Scrim Tracker automates the data collection and analysis workflow around competitive scrimmages. Instead of manually tracking results in spreadsheets, the app integrates with the **Riot Tournament API** to generate custom game lobby codes, automatically retrieve match data once games end, and display everything in a clean dashboard.

### Core Features

**Series Management**
- Create scrim series against opponents with configurable formats (BO1 / BO3 / BO5)
- Track win/loss results game by game with full pick, ban, and stat breakdowns
- Add coaching notes per series for post-scrim review

**Tournament Code Generation**
- Generate a Riot Tournament API lobby code per game with one click
- Share the code with both teams to set up the custom game lobby in the League of Legends client
- Once the game ends, Riot automatically associates the match data with the code — no manual input needed

**Match Data Retrieval**
- Automatically fetches full match stats via the Riot Match v5 API: KDA, CS, gold, vision score, objectives
- Stores the complete pick/ban order per game for draft review

**Fearless Draft Tracker**
- The central feature of the app — tracks which champions each player has used across every game in a series
- Champions played are permanently locked out for that player for the rest of the series
- Visual pool display per player: used champions crossed out, available champions highlighted
- Alerts when a player's remaining champion pool drops below a threshold
- Game-by-game usage table for the full series view

**Dashboard**
- At-a-glance overview: series record, game win rate, active series status
- Live tournament code for the next game
- Fearless pool warnings surfaced directly on the home screen

---

## How the Riot Tournament API Integration Works

```
1. POST /lol/tournament/v5/providers   → Register the app as a tournament provider (one-time setup)
2. POST /lol/tournament/v5/tournaments → Create a tournament context per split / season
3. POST /lol/tournament/v5/codes       → Generate a lobby code for each individual game
4. [Game is played using the lobby code]
5. GET  /lol/tournament/v5/games/by-code/{code} → Retrieve the match ID once the game ends
6. GET  /lol/match/v5/matches/{matchId}         → Fetch full match stats and pick/ban data
```

The app handles this entire flow automatically. Coaches only need to click "Generate Code", share it with the teams, and the rest is populated once the game concludes.

---

## Current Status

This prototype runs in **Stub / Mock Mode** using realistic placeholder data to demonstrate the full application flow. A production Riot API key has been applied for — once approved, the mock API calls will be replaced with live Tournament API calls and the app will be fully operational with real match data.

All placeholder values (tournament codes, PUUIDs, match IDs) are clearly marked and structured to mirror the exact format returned by the live Riot API, making the swap to production straightforward.

---

## Tech Stack

- **Frontend:** React 18 + Vite
- **Routing:** React Router v6
- **Styling:** Custom CSS (dark theme)
- **Hosting:** GitHub Pages via GitHub Actions
- **Data:** Riot Tournament API v5 + Match API v5 (stub mode during development)

## Running Locally

```bash
npm install
npm run dev
```

## Deployment

Pushes to `main` automatically deploy to GitHub Pages via the included GitHub Actions workflow.
