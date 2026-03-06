# ScrimOS — Competitive Scrim Tracker

A League of Legends scrim tracking platform built for amateur and semi-pro teams. Coaches log series results, track champion picks, and manage Fearless Draft eligibility across a full split.

**Live demo:** [lukaschudy.github.io/nbs-scrim-tracker](https://lukaschudy.github.io/nbs-scrim-tracker)

---

## What it does

### Dashboard
Overview of the team's split performance — series record, game win rate, recent series results, and a quick snapshot of each player's champion pool depth.

### Series Tracker
Log best-of-3 and best-of-5 series with opponent name, date, and game-by-game results. Each game records blue/red side, picks, bans, and individual player stats (KDA, CS, vision).

### Fearless Draft
Tracks which champions have been played by each player across the current series. In Fearless Draft format, a champion cannot be replayed by the same player once used. ScrimOS shows:
- Champions played (locked out)
- Remaining champion pool per player
- Pool pressure warnings when a player's pool is running thin

### New Series
Form to log a new scrim series — opponent, format (BO3/BO5), date, and game-by-game data entry.

---

## Multi-team platform

ScrimOS is a shared platform where each team registers once and the coach shares team credentials with players and staff. Each team's data is fully isolated via Supabase Row Level Security — teams can only see their own series, players, and stats.

The app is publicly accessible as a demo preview. Anyone can browse the mock data without logging in. Registering a team unlocks your own private environment with real data.

### Auth flow
1. Coach registers at `/register` — creates an account, team profile, and optional roster (TOP/JNG/MID/BOT/SUP with Riot IDs)
2. Team members log in at `/login` using shared team credentials
3. Discord OAuth available as a one-click alternative

### Data model

```
teams
  └── team_members   (links auth users to teams, role: coach)
  └── players        (TOP/JNG/MID/BOT/SUP roster)
  └── series
        └── games
              └── player_stats
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Styling | Custom CSS (dark LoL-inspired theme, CSS variables) |
| Auth | Supabase Auth (email/password + Discord OAuth) |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |

---

## Running locally

```bash
# Clone
git clone https://github.com/lukaschudy/nbs-scrim-tracker.git
cd nbs-scrim-tracker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and fill in your Supabase project URL and anon key

# Start dev server
npm run dev
```

### Environment variables

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Deployment

Pushes to `main` automatically deploy to GitHub Pages via GitHub Actions. The workflow injects `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from repository secrets at build time.

To configure: **GitHub repo → Settings → Secrets and variables → Actions → New repository secret**

---

## Riot API

The app currently runs in stub/mock mode with realistic placeholder data. A Riot Games production API key is pending approval to enable live tournament data via the Tournament API v5.

Once approved, the full integration will work like this:

```
1. POST /lol/tournament/v5/providers   → Register app as tournament provider (one-time)
2. POST /lol/tournament/v5/tournaments → Create a tournament context per split
3. POST /lol/tournament/v5/codes       → Generate a lobby code per game
4. [Game is played using the lobby code]
5. GET  /lol/tournament/v5/games/by-code/{code} → Retrieve match ID after game ends
6. GET  /lol/match/v5/matches/{matchId}         → Fetch full stats and pick/ban data
```

The domain verification file is live at:
`https://lukaschudy.github.io/nbs-scrim-tracker/riot.txt`

---

## Roadmap

- Replace mock data with live Supabase queries
- Live Tournament API integration once production key is approved
- Scheduling calendar (scrims, officials, team events)
- Opponent scouting — track tendencies of teams you've scrimmed against
- Discord bot for result logging and reminders
- Per-player login with role-based permissions
- Public landing page separate from the demo app
