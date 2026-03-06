import { useState } from 'react'
import { series, players, championPools, getFearlessStatus } from '../data/mockData'

const LOW_WARN     = 10
const LOW_CRITICAL = 6

function PoolBar({ remaining, total }) {
  const pct = Math.round((remaining / total) * 100)
  const color = remaining <= LOW_CRITICAL ? 'var(--loss)' : remaining <= LOW_WARN ? 'var(--warning)' : 'var(--win)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div className="progress-bar" style={{ flex: 1 }}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span style={{ fontSize: 12, color, fontWeight: 700, width: 60, textAlign: 'right' }}>
        {remaining}/{total}
      </span>
    </div>
  )
}

function PlayerPoolCard({ data }) {
  const { player, pool, used, remaining } = data
  const [showAll, setShowAll] = useState(false)

  const isCritical = remaining.length <= LOW_CRITICAL
  const isWarn     = remaining.length <= LOW_WARN && !isCritical

  let cardClass = 'fearless-card'
  if (isCritical) cardClass += ' critical'
  else if (isWarn) cardClass += ' warn'

  const countLabel = isCritical
    ? <strong className="critical">{remaining.length}</strong>
    : isWarn
    ? <strong className="warn">{remaining.length}</strong>
    : <strong>{remaining.length}</strong>

  return (
    <div className={cardClass}>
      <div className="fearless-header">
        <div className="fearless-player">
          <span className={`role-badge role-${player.role}`}>{player.role}</span>
          <span className="fearless-player-name">{player.name}</span>
          {isCritical && (
            <span className="badge" style={{ background: 'rgba(239,68,68,.2)', color: 'var(--loss)', border: '1px solid rgba(239,68,68,.4)', fontSize: 10 }}>
              LOW POOL
            </span>
          )}
          {isWarn && (
            <span className="badge" style={{ background: 'rgba(245,158,11,.15)', color: 'var(--warning)', border: '1px solid rgba(245,158,11,.3)', fontSize: 10 }}>
              WATCH
            </span>
          )}
        </div>
        <div className="fearless-count">
          {countLabel} <span className="muted-text">/ {pool.length} champions remaining</span>
        </div>
      </div>

      <PoolBar remaining={remaining.length} total={pool.length} />

      <div style={{ marginTop: 14 }}>
        {/* Used champions */}
        {used.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
              Used (Locked Out)
            </div>
            <div className="champs-grid">
              {used.map(c => <span key={c} className="champ-tag used">{c}</span>)}
            </div>
          </div>
        )}

        {/* Available champions */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
              Available
            </div>
            {remaining.length > 8 && (
              <button
                onClick={() => setShowAll(a => !a)}
                style={{ background: 'none', border: 'none', color: 'var(--blue)', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}
              >
                {showAll ? 'Show less' : `Show all ${remaining.length}`}
              </button>
            )}
          </div>
          <div className="champs-grid">
            {(showAll ? remaining : remaining.slice(0, 8)).map(c => (
              <span key={c} className="champ-tag available">{c}</span>
            ))}
            {!showAll && remaining.length > 8 && (
              <span
                className="champ-tag"
                style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
                onClick={() => setShowAll(true)}
              >
                +{remaining.length - 8} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FearlessTracker() {
  const activeSeries = series.find(s => s.status === 'in_progress')
  const completedSeries = series.filter(s => s.status === 'completed')

  const [selectedId, setSelectedId] = useState(activeSeries?.id ?? series[series.length - 1]?.id)
  const selectedSeries = series.find(s => s.id === selectedId)
  const fearlessData   = selectedId ? getFearlessStatus(selectedId) : null

  const totalLocked = fearlessData ? fearlessData.reduce((acc, d) => acc + d.used.length, 0) : 0

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Fearless Draft Tracker</h1>
        <p className="page-subtitle">
          Track champion usage per player across a series. Each champion played is locked out for the remainder of that series.
        </p>
      </div>

      {/* Series selector */}
      <div className="card mb-6">
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="form-label">Select Series</div>
            <select
              className="form-select"
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
            >
              {activeSeries && (
                <option value={activeSeries.id}>
                  [IN PROGRESS] vs {activeSeries.opponent} · {activeSeries.score} · {activeSeries.date}
                </option>
              )}
              {completedSeries.map(s => (
                <option key={s.id} value={s.id}>
                  [Completed] vs {s.opponent} · {s.score} ({s.result?.toUpperCase()}) · {s.date}
                </option>
              ))}
            </select>
          </div>

          {selectedSeries && (
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <div className="stat-label">Games Played</div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{selectedSeries.games.length}</div>
              </div>
              <div>
                <div className="stat-label">Total Locks</div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{totalLocked}</div>
              </div>
              <div>
                <div className="stat-label">Score</div>
                <div style={{ fontWeight: 700, fontSize: 18, color: selectedSeries.result === 'win' ? 'var(--win)' : selectedSeries.result === 'loss' ? 'var(--loss)' : 'var(--text-primary)' }}>
                  {selectedSeries.score || `${selectedSeries.games.filter(g=>g.result==='win').length}–${selectedSeries.games.filter(g=>g.result==='loss').length}`}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* How Fearless Draft works */}
      <div className="alert alert-info mb-6">
        <strong>Fearless Draft:</strong> Every champion played during a series is permanently banned from that player's pool for the rest of the series.
        Champions marked <span style={{ textDecoration: 'line-through', color: 'rgba(239,68,68,.8)' }}>like this</span> are locked out.
        Players with fewer than {LOW_WARN} champions remaining are flagged for review.
      </div>

      {/* Player pool cards */}
      {fearlessData ? (
        fearlessData.map(d => <PlayerPoolCard key={d.player.id} data={d} />)
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
          Select a series above to view fearless tracking data.
        </div>
      )}

      {/* Game-by-game breakdown */}
      {selectedSeries && selectedSeries.games.length > 0 && (
        <div className="card mt-4">
          <div className="section-title">Champion Usage by Game</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Player</th>
                  {selectedSeries.games.map(g => (
                    <th key={g.id} style={{ textAlign: 'center' }}>
                      G{g.gameNumber}
                      <span style={{ marginLeft: 4 }} className={g.result === 'win' ? 'win-text' : 'loss-text'}>
                        {g.result === 'win' ? '▲' : '▼'}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {players.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex-center gap-2">
                        <span className={`role-badge role-${p.role}`}>{p.role}</span>
                        <span style={{ fontWeight: 600 }}>{p.name}</span>
                      </div>
                    </td>
                    {selectedSeries.games.map(g => {
                      const stat = g.playerStats.find(ps => ps.playerId === p.id)
                      return (
                        <td key={g.id} style={{ textAlign: 'center' }}>
                          <span style={{ color: 'var(--gold)', fontWeight: 600, fontSize: 12 }}>
                            {stat?.champion ?? '—'}
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
