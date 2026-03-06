import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { series, players } from '../data/mockData'

function KDA({ kills, deaths, assists }) {
  const kda = deaths === 0 ? 'Perfect' : ((kills + assists) / deaths).toFixed(2)
  const color = deaths === 0 ? 'var(--win)' : parseFloat(kda) >= 4 ? 'var(--win)' : parseFloat(kda) >= 2.5 ? 'var(--gold)' : 'var(--text-secondary)'
  return (
    <span style={{ color, fontWeight: 600 }}>
      {kills}/{deaths}/{assists}
      <span style={{ color: 'var(--text-muted)', fontSize: 11, marginLeft: 4 }}>({kda})</span>
    </span>
  )
}

function PicksAndBans({ picks, bans }) {
  const roles = ['top', 'jng', 'mid', 'bot', 'sup']
  return (
    <div className="grid-2" style={{ gap: 24 }}>
      {/* Our picks */}
      <div>
        <div className="side-label blue">NBS (Our Picks)</div>
        {roles.map(r => (
          <div key={r} className="pick-row">
            <span className={`role-badge role-${r.toUpperCase()} pick-role`}>{r.toUpperCase()}</span>
            <span className="pick-champ">{picks.ours[r]}</span>
          </div>
        ))}
        <div style={{ marginTop: 10 }}>
          <div className="side-label" style={{ marginBottom: 6 }}>Bans</div>
          <div className="bans-list">
            {bans.ours.map(b => <span key={b} className="ban-tag">{b}</span>)}
          </div>
        </div>
      </div>
      {/* Their picks */}
      <div>
        <div className="side-label red">Opponent (Their Picks)</div>
        {roles.map(r => (
          <div key={r} className="pick-row">
            <span className={`role-badge role-${r.toUpperCase()} pick-role`}>{r.toUpperCase()}</span>
            <span className="pick-champ">{picks.theirs[r]}</span>
          </div>
        ))}
        <div style={{ marginTop: 10 }}>
          <div className="side-label" style={{ marginBottom: 6 }}>Bans</div>
          <div className="bans-list">
            {bans.theirs.map(b => <span key={b} className="ban-tag">{b}</span>)}
          </div>
        </div>
      </div>
    </div>
  )
}

function PlayerStatsTable({ stats }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>Player</th>
            <th>Champion</th>
            <th>KDA</th>
            <th>CS</th>
            <th>CS/min</th>
            <th>Gold</th>
            <th>Vision</th>
          </tr>
        </thead>
        <tbody>
          {stats.map(s => {
            const player = players.find(p => p.id === s.playerId)
            const [min, sec] = (s.duration || '0:0').split(':').map(Number)
            const minutes = (min || 0) + (sec || 0) / 60 || 1
            return (
              <tr key={s.playerId}>
                <td><span className={`role-badge role-${player?.role}`}>{player?.role}</span></td>
                <td style={{ fontWeight: 600 }}>{player?.name}</td>
                <td style={{ color: 'var(--gold)', fontWeight: 600 }}>{s.champion}</td>
                <td><KDA kills={s.kills} deaths={s.deaths} assists={s.assists} /></td>
                <td>{s.cs}</td>
                <td className="muted-text">{minutes > 1 ? (s.cs / minutes).toFixed(1) : '—'}</td>
                <td>{(s.gold / 1000).toFixed(1)}k</td>
                <td>{s.visionScore}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function GameAccordion({ game, seriesDuration }) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('picks')

  // Inject duration into each stat row for CS/min calc
  const statsWithDuration = game.playerStats.map(s => ({ ...s, duration: game.duration }))

  return (
    <div className="game-row">
      <div className="game-header" onClick={() => setOpen(o => !o)}>
        <span className="game-number">Game {game.gameNumber}</span>
        <span className={`badge badge-${game.result}`}>{game.result}</span>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          {game.ourSide === 'blue' ? 'Blue Side' : 'Red Side'}
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>{game.duration}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div className="game-body">
          <div className="tabs">
            <button className={`tab${tab === 'picks' ? ' active' : ''}`} onClick={() => setTab('picks')}>Picks & Bans</button>
            <button className={`tab${tab === 'stats' ? ' active' : ''}`} onClick={() => setTab('stats')}>Player Stats</button>
          </div>

          {tab === 'picks' && <PicksAndBans picks={game.picks} bans={game.bans} />}
          {tab === 'stats' && <PlayerStatsTable stats={statsWithDuration} />}
        </div>
      )}
    </div>
  )
}

export default function SeriesDetail() {
  const { id } = useParams()
  const s = series.find(x => x.id === id)

  if (!s) return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Series not found</h1>
      </div>
      <Link to="/series" className="btn btn-secondary">← Back to Series</Link>
    </div>
  )

  const winGames  = s.games.filter(g => g.result === 'win').length
  const lossGames = s.games.filter(g => g.result === 'loss').length

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 16 }}>
        <Link to="/series" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13 }}>
          ← All Series
        </Link>
      </div>

      {/* Header */}
      <div className="flex-between mb-6">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div className="flex-center gap-2 mb-3" style={{ flexWrap: 'wrap' }}>
            <h1 className="page-title">vs {s.opponent}</h1>
            {s.status === 'in_progress'
              ? <span className="badge badge-live">● In Progress</span>
              : <span className={`badge badge-${s.result}`}>{s.result}</span>
            }
          </div>
          <p className="page-subtitle">{s.format} · {s.date} · {s.games.length} games played</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: s.result === 'win' ? 'var(--win)' : s.result === 'loss' ? 'var(--loss)' : 'var(--text-primary)' }}>
            {s.score || `${winGames}–${lossGames}`}
          </div>
          <div className="muted-text" style={{ fontSize: 12 }}>{winGames}W {lossGames}L</div>
        </div>
      </div>

      {/* Notes */}
      {s.notes && (
        <div className="alert alert-info mb-6">{s.notes}</div>
      )}

      {/* Tournament code */}
      <div className="card mb-6">
        <div className="section-title">Tournament Code</div>
        <div className="code-box">
          <span className="code-text">{s.tournamentCode}</span>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigator.clipboard.writeText(s.tournamentCode)}
          >
            Copy
          </button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
          This code is used to set up the custom game lobby in the League of Legends client.
          With a production API key, this code would be generated via the Riot Tournament API
          and match data would be automatically retrieved once the game ends.
        </p>
      </div>

      {/* Games */}
      <div className="card">
        <div className="section-title">Games</div>
        {s.games.map(game => (
          <GameAccordion key={game.id} game={game} />
        ))}
        {s.status === 'in_progress' && (
          <div className="alert alert-info" style={{ marginTop: 12 }}>
            Game {s.games.length + 1} has not been played yet. Generate a new tournament code from the New Series page when ready.
          </div>
        )}
      </div>

      {/* Player performance summary */}
      <div className="card mt-4">
        <div className="section-title">Series Performance Summary</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Role</th>
                <th>Player</th>
                <th>Champions Played</th>
                <th>Avg KDA</th>
                <th>Avg CS</th>
                <th>Avg Gold</th>
              </tr>
            </thead>
            <tbody>
              {['top','jng','mid','bot','sup'].map(role => {
                const player = s.games.length > 0
                  ? (() => {
                      const allStats = s.games.flatMap(g => g.playerStats).filter(ps => ps.playerId === role)
                      if (!allStats.length) return null
                      const totalKills   = allStats.reduce((a, b) => a + b.kills,   0)
                      const totalDeaths  = allStats.reduce((a, b) => a + b.deaths,  0)
                      const totalAssists = allStats.reduce((a, b) => a + b.assists, 0)
                      const avgCS        = Math.round(allStats.reduce((a, b) => a + b.cs,   0) / allStats.length)
                      const avgGold      = Math.round(allStats.reduce((a, b) => a + b.gold, 0) / allStats.length)
                      const kda = totalDeaths === 0 ? 'Perfect' : ((totalKills + totalAssists) / totalDeaths).toFixed(2)
                      const champs = [...new Set(allStats.map(x => x.champion))]
                      return { kda, avgCS, avgGold, champs, totalKills, totalDeaths, totalAssists }
                    })()
                  : null
                const p = players.find(x => x.id === role)
                if (!player) return null
                return (
                  <tr key={role}>
                    <td><span className={`role-badge role-${p.role}`}>{p.role}</span></td>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>
                      <div className="flex-center gap-2" style={{ flexWrap: 'wrap' }}>
                        {player.champs.map(c => (
                          <span key={c} className="champ-tag" style={{ fontSize: 11, padding: '2px 7px' }}>{c}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--gold)' }}>{player.kda}</td>
                    <td>{player.avgCS}</td>
                    <td>{(player.avgGold / 1000).toFixed(1)}k</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
