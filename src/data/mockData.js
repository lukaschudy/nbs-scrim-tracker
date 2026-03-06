export const TEAM = {
  name: 'NBS',
  region: 'EUW',
  fullName: 'NBS Esports',
}

export const players = [
  { id: 'top', role: 'TOP', name: 'NBS Titan',  riotId: 'NBS Titan#EUW1',  puuid: 'PUUID_PLACEHOLDER_TOP_001' },
  { id: 'jng', role: 'JNG', name: 'NBS Ghost',  riotId: 'NBS Ghost#EUW1',  puuid: 'PUUID_PLACEHOLDER_JNG_001' },
  { id: 'mid', role: 'MID', name: 'NBS Cipher', riotId: 'NBS Cipher#EUW1', puuid: 'PUUID_PLACEHOLDER_MID_001' },
  { id: 'bot', role: 'BOT', name: 'NBS Blaze',  riotId: 'NBS Blaze#EUW1',  puuid: 'PUUID_PLACEHOLDER_BOT_001' },
  { id: 'sup', role: 'SUP', name: 'NBS Anchor', riotId: 'NBS Anchor#EUW1', puuid: 'PUUID_PLACEHOLDER_SUP_001' },
]

// Each player's full champion pool (what they are comfortable playing)
export const championPools = {
  top: ['Jax', 'Malphite', 'Darius', 'Fiora', 'Camille', 'Renekton', 'Sett', 'Gwen', 'Jayce', 'Riven', 'Irelia', 'Gangplank', "K'Sante", 'Yone', 'Garen', 'Quinn', 'Kennen', 'Olaf', 'Teemo', 'Vayne'],
  jng: ['Lee Sin', 'Vi', 'Jarvan IV', 'Hecarim', 'Lillia', 'Kindred', 'Graves', 'Nidalee', 'Elise', "Kha'Zix", 'Diana', 'Poppy', 'Wukong', 'Xin Zhao', 'Taliyah', 'Viego', 'Kayn', "Rek'Sai"],
  mid: ['Azir', 'Orianna', 'Viktor', 'Syndra', 'Akali', 'Zed', 'LeBlanc', 'Ahri', 'Sylas', 'Corki', 'Jayce', 'Cassiopeia', 'Twisted Fate', 'Lissandra', 'Qiyana', 'Katarina', 'Ryze', 'Vex', 'Yone', 'Galio', 'Irelia', 'Annie'],
  bot: ['Jhin', 'Jinx', 'Caitlyn', 'Ezreal', 'Xayah', "Kai'Sa", 'Lucian', 'Draven', 'Zeri', 'Aphelios', 'Varus', 'Kalista'],
  sup: ['Thresh', 'Nautilus', 'Lulu', 'Janna', 'Morgana', 'Leona', 'Blitzcrank', 'Alistar', 'Rakan', 'Soraka', 'Karma', 'Nami', 'Zyra', 'Brand', 'Bard', 'Senna', 'Milio', 'Renata Glasc', 'Pyke', 'Poppy'],
}

// ── Utility ──────────────────────────────────────────────────────────────────

export function getFearlessStatus(seriesId) {
  const s = series.find(x => x.id === seriesId)
  if (!s) return null

  const usedMap = {}
  players.forEach(p => { usedMap[p.id] = [] })

  s.games.forEach(game => {
    players.forEach(p => {
      const stat = game.playerStats.find(ps => ps.playerId === p.id)
      if (stat && !usedMap[p.id].includes(stat.champion)) {
        usedMap[p.id].push(stat.champion)
      }
    })
  })

  return players.map(p => {
    const pool = championPools[p.id]
    const used = usedMap[p.id]
    const remaining = pool.filter(c => !used.includes(c))
    return { player: p, pool, used, remaining }
  })
}

export function getOverallStats() {
  const completed = series.filter(s => s.status === 'completed')
  const wins = completed.filter(s => s.result === 'win').length
  const allGames = series.flatMap(s => s.games)
  const wonGames = allGames.filter(g => g.result === 'win').length
  return {
    seriesWins: wins,
    seriesLosses: completed.length - wins,
    totalSeries: series.length,
    gamesWon: wonGames,
    gamesLost: allGames.length - wonGames,
    totalGames: allGames.length,
    winRate: allGames.length > 0 ? Math.round((wonGames / allGames.length) * 100) : 0,
  }
}

// ── Series data ────────────────────────────────────────────────────────────

export const series = [
  // ── Series 1 — Completed W ──────────────────────────────────────────────
  {
    id: 'series-001',
    opponent: 'Team Vitality Academy',
    date: '2026-02-08',
    status: 'completed',
    result: 'win',
    score: '3-1',
    format: 'BO5',
    patch_version: '25.4',
    season: '2026-Spring',
    notes: 'Strong early game, dominated mid through jng synergy.',
    tournamentCode: 'EUWC1-ABCD-1234-EF56-GHIJ7890KL',
    games: [
      {
        id: 'g001-1',
        gameNumber: 1,
        duration: '34:21',
        ourSide: 'blue',
        result: 'win',
        picks: {
          ours:   { top: 'Jax',       jng: 'Lee Sin',  mid: 'Orianna', bot: 'Jhin',   sup: 'Thresh'   },
          theirs: { top: 'Darius',    jng: 'Vi',       mid: 'Syndra',  bot: 'Jinx',   sup: 'Nautilus' },
        },
        bans: {
          ours:   ['Azir', 'LeBlanc', 'Caitlyn', 'Rakan', 'Lillia'],
          theirs: ['Camille', 'Viego', "Kai'Sa", 'Alistar', 'Ahri'],
        },
        playerStats: [
          { playerId: 'top', champion: 'Jax',     kills: 7,  deaths: 2, assists: 5,  cs: 267, gold: 15400, visionScore: 22 },
          { playerId: 'jng', champion: 'Lee Sin',  kills: 4,  deaths: 3, assists: 12, cs: 156, gold: 12800, visionScore: 31 },
          { playerId: 'mid', champion: 'Orianna',  kills: 3,  deaths: 1, assists: 14, cs: 289, gold: 14100, visionScore: 19 },
          { playerId: 'bot', champion: 'Jhin',     kills: 9,  deaths: 2, assists: 7,  cs: 312, gold: 17200, visionScore: 24 },
          { playerId: 'sup', champion: 'Thresh',   kills: 1,  deaths: 2, assists: 18, cs: 28,  gold: 8900,  visionScore: 48 },
        ],
      },
      {
        id: 'g001-2',
        gameNumber: 2,
        duration: '28:44',
        ourSide: 'red',
        result: 'win',
        picks: {
          ours:   { top: 'Camille',  jng: 'Graves',   mid: 'Viktor',  bot: "Kai'Sa", sup: 'Lulu'    },
          theirs: { top: 'Renekton', jng: 'Hecarim',  mid: 'Ahri',    bot: 'Xayah',  sup: 'Rakan'   },
        },
        bans: {
          ours:   ['Jax', 'Viego', 'Caitlyn', 'Thresh', 'Lillia'],
          theirs: ['Lee Sin', 'Orianna', 'Jhin', 'Nautilus', 'Azir'],
        },
        playerStats: [
          { playerId: 'top', champion: 'Camille', kills: 5,  deaths: 1, assists: 9,  cs: 241, gold: 14800, visionScore: 18 },
          { playerId: 'jng', champion: 'Graves',  kills: 6,  deaths: 2, assists: 8,  cs: 198, gold: 14100, visionScore: 27 },
          { playerId: 'mid', champion: 'Viktor',  kills: 8,  deaths: 1, assists: 11, cs: 302, gold: 16700, visionScore: 21 },
          { playerId: 'bot', champion: "Kai'Sa",  kills: 11, deaths: 0, assists: 6,  cs: 288, gold: 17900, visionScore: 22 },
          { playerId: 'sup', champion: 'Lulu',    kills: 0,  deaths: 1, assists: 22, cs: 31,  gold: 9100,  visionScore: 44 },
        ],
      },
      {
        id: 'g001-3',
        gameNumber: 3,
        duration: '41:55',
        ourSide: 'blue',
        result: 'loss',
        picks: {
          ours:   { top: 'Renekton', jng: 'Vi',       mid: 'Ahri',    bot: 'Ezreal', sup: 'Nautilus' },
          theirs: { top: 'Sett',     jng: 'Jarvan IV', mid: 'LeBlanc', bot: 'Jinx',   sup: 'Leona'   },
        },
        bans: {
          ours:   ['Camille', 'Viktor', 'Caitlyn', 'Thresh', 'Lillia'],
          theirs: ['Jax', 'Graves', "Kai'Sa", 'Lulu', 'Azir'],
        },
        playerStats: [
          { playerId: 'top', champion: 'Renekton', kills: 2, deaths: 5, assists: 4,  cs: 198, gold: 11200, visionScore: 21 },
          { playerId: 'jng', champion: 'Vi',        kills: 3, deaths: 4, assists: 7,  cs: 134, gold: 10900, visionScore: 29 },
          { playerId: 'mid', champion: 'Ahri',      kills: 4, deaths: 3, assists: 6,  cs: 241, gold: 12800, visionScore: 18 },
          { playerId: 'bot', champion: 'Ezreal',    kills: 5, deaths: 3, assists: 5,  cs: 267, gold: 13600, visionScore: 23 },
          { playerId: 'sup', champion: 'Nautilus',  kills: 0, deaths: 4, assists: 8,  cs: 22,  gold: 7800,  visionScore: 41 },
        ],
      },
      {
        id: 'g001-4',
        gameNumber: 4,
        duration: '38:12',
        ourSide: 'red',
        result: 'win',
        picks: {
          ours:   { top: 'Gwen',     jng: 'Hecarim',  mid: 'Zed',     bot: 'Xayah',  sup: 'Leona'   },
          theirs: { top: 'Malphite', jng: 'Jarvan IV', mid: 'Syndra',  bot: 'Draven', sup: 'Thresh'  },
        },
        bans: {
          ours:   ['Camille', 'Viktor', 'Caitlyn', 'Nautilus', 'Lillia'],
          theirs: ['Jax', 'Graves', "Kai'Sa", 'Lulu', 'Azir'],
        },
        playerStats: [
          { playerId: 'top', champion: 'Gwen',    kills: 8,  deaths: 2, assists: 7,  cs: 289, gold: 16100, visionScore: 19 },
          { playerId: 'jng', champion: 'Hecarim', kills: 5,  deaths: 2, assists: 14, cs: 167, gold: 13400, visionScore: 28 },
          { playerId: 'mid', champion: 'Zed',     kills: 12, deaths: 3, assists: 5,  cs: 278, gold: 17800, visionScore: 17 },
          { playerId: 'bot', champion: 'Xayah',   kills: 7,  deaths: 1, assists: 10, cs: 301, gold: 17100, visionScore: 25 },
          { playerId: 'sup', champion: 'Leona',   kills: 2,  deaths: 3, assists: 19, cs: 18,  gold: 8700,  visionScore: 47 },
        ],
      },
    ],
  },

  // ── Series 2 — Completed L ──────────────────────────────────────────────
  {
    id: 'series-002',
    opponent: 'LDLC OL',
    date: '2026-02-15',
    status: 'completed',
    result: 'loss',
    score: '1-2',
    format: 'BO3',
    patch_version: '25.4',
    season: '2026-Spring',
    notes: 'Lost botlane matchup in games 2 and 3. Need to address early Draven / Lucian read.',
    tournamentCode: 'EUWC1-EFGH-5678-IJ90-KLMN1234OP',
    games: [
      {
        id: 'g002-1',
        gameNumber: 1,
        duration: '29:18',
        ourSide: 'blue',
        result: 'win',
        picks: {
          ours:   { top: 'Irelia',  jng: 'Kindred', mid: 'Qiyana',  bot: 'Lucian', sup: 'Nami'   },
          theirs: { top: 'Garen',   jng: 'Warwick', mid: 'Galio',   bot: 'Caitlyn',sup: 'Morgana' },
        },
        bans: {
          ours:   ['Azir', 'Viktor', 'Jinx', 'Thresh', 'Hecarim'],
          theirs: ['Jax', 'Lee Sin', "Kai'Sa", 'Lulu', 'Camille'],
        },
        playerStats: [
          { playerId: 'top', champion: 'Irelia',  kills: 9, deaths: 2, assists: 6,  cs: 271, gold: 15900, visionScore: 20 },
          { playerId: 'jng', champion: 'Kindred', kills: 5, deaths: 1, assists: 10, cs: 189, gold: 13700, visionScore: 33 },
          { playerId: 'mid', champion: 'Qiyana',  kills: 7, deaths: 2, assists: 9,  cs: 254, gold: 14800, visionScore: 16 },
          { playerId: 'bot', champion: 'Lucian',  kills: 8, deaths: 1, assists: 7,  cs: 299, gold: 17400, visionScore: 23 },
          { playerId: 'sup', champion: 'Nami',    kills: 1, deaths: 1, assists: 20, cs: 35,  gold: 9400,  visionScore: 42 },
        ],
      },
      {
        id: 'g002-2',
        gameNumber: 2,
        duration: '44:32',
        ourSide: 'red',
        result: 'loss',
        picks: {
          ours:   { top: 'Sett',   jng: 'Wukong', mid: 'Ryze',   bot: 'Draven',  sup: 'Alistar' },
          theirs: { top: 'Fiora',  jng: 'Viego',  mid: 'Sylas',  bot: 'Zeri',    sup: 'Lulu'    },
        },
        bans: {
          ours:   ['Camille', 'Viktor', 'Jinx', 'Thresh', 'Hecarim'],
          theirs: ['Jax', 'Lee Sin', 'Lucian', 'Nami', 'Kindred'],
        },
        playerStats: [
          { playerId: 'top', champion: 'Sett',    kills: 3, deaths: 6, assists: 5,  cs: 187, gold: 11100, visionScore: 22 },
          { playerId: 'jng', champion: 'Wukong',  kills: 2, deaths: 5, assists: 8,  cs: 122, gold: 9800,  visionScore: 30 },
          { playerId: 'mid', champion: 'Ryze',    kills: 4, deaths: 4, assists: 7,  cs: 261, gold: 13100, visionScore: 19 },
          { playerId: 'bot', champion: 'Draven',  kills: 7, deaths: 5, assists: 4,  cs: 278, gold: 14400, visionScore: 21 },
          { playerId: 'sup', champion: 'Alistar', kills: 0, deaths: 5, assists: 11, cs: 15,  gold: 7200,  visionScore: 38 },
        ],
      },
      {
        id: 'g002-3',
        gameNumber: 3,
        duration: '36:47',
        ourSide: 'blue',
        result: 'loss',
        picks: {
          ours:   { top: 'Yone',  jng: 'Taliyah', mid: 'LeBlanc', bot: 'Varus', sup: 'Karma'  },
          theirs: { top: 'Gwen',  jng: 'Hecarim', mid: 'Orianna', bot: 'Jinx',  sup: 'Thresh' },
        },
        bans: {
          ours:   ['Camille', 'Viktor', 'Fiora', 'Zeri', 'Lillia'],
          theirs: ['Jax', 'Lee Sin', 'Lucian', 'Nami', 'Sett'],
        },
        playerStats: [
          { playerId: 'top', champion: 'Yone',    kills: 4, deaths: 7, assists: 3,  cs: 211, gold: 11800, visionScore: 18 },
          { playerId: 'jng', champion: 'Taliyah', kills: 2, deaths: 6, assists: 7,  cs: 143, gold: 9700,  visionScore: 29 },
          { playerId: 'mid', champion: 'LeBlanc', kills: 6, deaths: 5, assists: 5,  cs: 234, gold: 12400, visionScore: 15 },
          { playerId: 'bot', champion: 'Varus',   kills: 5, deaths: 4, assists: 6,  cs: 256, gold: 13200, visionScore: 22 },
          { playerId: 'sup', champion: 'Karma',   kills: 0, deaths: 4, assists: 13, cs: 29,  gold: 7900,  visionScore: 40 },
        ],
      },
    ],
  },

  // ── Series 3 — IN PROGRESS (2-2, Game 5 pending) ────────────────────────
  {
    id: 'series-003',
    opponent: 'Karmine Corp Academy',
    date: '2026-03-05',
    status: 'in_progress',
    result: null,
    score: '2-2',
    format: 'BO5',
    patch_version: '25.5',
    season: '2026-Spring',
    notes: 'Tied at 2-2. Game 5 is do-or-die. Watch their Jarvan IV / Galio combo.',
    tournamentCode: 'EUWC1-MNOP-9012-QR34-STUV5678WX',
    games: [
      {
        id: 'g003-1',
        gameNumber: 1,
        duration: '31:08',
        ourSide: 'blue',
        result: 'win',
        picks: {
          ours:   { top: "K'Sante", jng: 'Nidalee',   mid: 'Sylas',    bot: 'Zeri',     sup: 'Rakan'    },
          theirs: { top: 'Malphite',jng: 'Jarvan IV',  mid: 'Galio',    bot: 'Jinx',     sup: 'Lulu'     },
        },
        bans: {
          ours:   ['Azir', 'Viktor', 'Caitlyn', 'Thresh', 'Viego'],
          theirs: ['Jax', 'Lee Sin', "Kai'Sa", 'Nautilus', 'Camille'],
        },
        playerStats: [
          { playerId: 'top', champion: "K'Sante",  kills: 3, deaths: 2, assists: 12, cs: 212, gold: 13200, visionScore: 24 },
          { playerId: 'jng', champion: 'Nidalee',   kills: 4, deaths: 3, assists: 9,  cs: 178, gold: 12800, visionScore: 36 },
          { playerId: 'mid', champion: 'Sylas',     kills: 7, deaths: 2, assists: 10, cs: 261, gold: 15100, visionScore: 21 },
          { playerId: 'bot', champion: 'Zeri',      kills: 8, deaths: 1, assists: 8,  cs: 291, gold: 17200, visionScore: 24 },
          { playerId: 'sup', champion: 'Rakan',     kills: 1, deaths: 2, assists: 20, cs: 24,  gold: 9000,  visionScore: 46 },
        ],
      },
      {
        id: 'g003-2',
        gameNumber: 2,
        duration: '38:29',
        ourSide: 'red',
        result: 'loss',
        picks: {
          ours:   { top: 'Jax',    jng: "Kha'Zix",  mid: 'Katarina', bot: 'Aphelios', sup: 'Thresh'   },
          theirs: { top: 'Darius', jng: 'Hecarim',   mid: 'Azir',     bot: 'Caitlyn',  sup: 'Nautilus' },
        },
        bans: {
          ours:   ["K'Sante", 'Nidalee', 'Zeri', 'Rakan', 'Sylas'],
          theirs: ['Camille', 'Lee Sin', 'Jinx', 'Lulu', 'Viktor'],
        },
        playerStats: [
          { playerId: 'top', champion: 'Jax',      kills: 4, deaths: 5, assists: 3,  cs: 234, gold: 12400, visionScore: 19 },
          { playerId: 'jng', champion: "Kha'Zix",  kills: 5, deaths: 4, assists: 5,  cs: 145, gold: 11200, visionScore: 28 },
          { playerId: 'mid', champion: 'Katarina',  kills: 6, deaths: 6, assists: 4,  cs: 221, gold: 12700, visionScore: 14 },
          { playerId: 'bot', champion: 'Aphelios',  kills: 4, deaths: 4, assists: 7,  cs: 267, gold: 13800, visionScore: 22 },
          { playerId: 'sup', champion: 'Thresh',    kills: 1, deaths: 4, assists: 10, cs: 21,  gold: 8100,  visionScore: 39 },
        ],
      },
      {
        id: 'g003-3',
        gameNumber: 3,
        duration: '27:44',
        ourSide: 'blue',
        result: 'win',
        picks: {
          ours:   { top: 'Renekton', jng: 'Graves',   mid: 'Viktor',  bot: "Kai'Sa", sup: 'Nautilus' },
          theirs: { top: 'Sett',     jng: 'Vi',        mid: 'Syndra',  bot: 'Lucian', sup: 'Alistar'  },
        },
        bans: {
          ours:   ['Jax', "Kha'Zix", 'Zeri', 'Thresh', 'Katarina'],
          theirs: ["K'Sante", 'Nidalee', 'Aphelios', 'Rakan', 'Hecarim'],
        },
        playerStats: [
          { playerId: 'top', champion: 'Renekton', kills: 6, deaths: 1, assists: 8,  cs: 258, gold: 15300, visionScore: 20 },
          { playerId: 'jng', champion: 'Graves',    kills: 7, deaths: 2, assists: 9,  cs: 202, gold: 14900, visionScore: 29 },
          { playerId: 'mid', champion: 'Viktor',    kills: 5, deaths: 0, assists: 13, cs: 297, gold: 16200, visionScore: 22 },
          { playerId: 'bot', champion: "Kai'Sa",    kills: 9, deaths: 1, assists: 7,  cs: 308, gold: 18100, visionScore: 25 },
          { playerId: 'sup', champion: 'Nautilus',  kills: 2, deaths: 2, assists: 16, cs: 19,  gold: 9300,  visionScore: 44 },
        ],
      },
      {
        id: 'g003-4',
        gameNumber: 4,
        duration: '42:11',
        ourSide: 'red',
        result: 'loss',
        picks: {
          ours:   { top: 'Camille', jng: 'Lee Sin', mid: 'Corki',    bot: 'Lucian', sup: 'Lulu'   },
          theirs: { top: 'Gwen',    jng: 'Jarvan IV',mid: 'Orianna', bot: 'Jinx',   sup: 'Thresh' },
        },
        bans: {
          ours:   ['Renekton', 'Graves', 'Viktor', "Kai'Sa", 'Nautilus'],
          theirs: ['Jax', "Kha'Zix", 'Zeri', 'Rakan', 'Katarina'],
        },
        playerStats: [
          { playerId: 'top', champion: 'Camille',  kills: 3, deaths: 6, assists: 4,  cs: 189, gold: 11500, visionScore: 21 },
          { playerId: 'jng', champion: 'Lee Sin',   kills: 4, deaths: 5, assists: 7,  cs: 148, gold: 11100, visionScore: 33 },
          { playerId: 'mid', champion: 'Corki',     kills: 5, deaths: 4, assists: 6,  cs: 248, gold: 13400, visionScore: 18 },
          { playerId: 'bot', champion: 'Lucian',    kills: 6, deaths: 5, assists: 5,  cs: 274, gold: 14200, visionScore: 23 },
          { playerId: 'sup', champion: 'Lulu',      kills: 0, deaths: 4, assists: 14, cs: 28,  gold: 8400,  visionScore: 41 },
        ],
      },
      // Game 5 — not yet played
    ],
  },
]
