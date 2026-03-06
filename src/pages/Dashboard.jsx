import { Link } from 'react-router-dom'
import { series, players, TEAM, getOverallStats, getFearlessStatus, championPools } from '../data/mockData'

const LOW_POOL_THRESHOLD = 10

export default function Dashboard() {
  const stats = getOverallStats()
  const activeSeries = series.find(s => s.status === 'in_progress')
  const recentCompleted = [...series].filter(s => s.status === 'completed').reverse().slice(0, 3)

  const fearlessData = activeSeries ? getFearlessStatus(activeSeries.id) : []
  const lowPoolAlerts = fearlessData.filter(d => d.remaining.length <= LOW_POOL_THRESHOLD)

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{TEAM.fullName}</h1>
        <p className="page-subtitle">{TEAM.region} · {today}</p>
      </div>

      {/* Stats row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Series Record</div>
          <div className="stat-value">
            <span className="win-text">{stats.seriesWins}</span>
            <span className="muted-text" style={{ fontSize: 20, margin: '0 4px' }}>–</span>
            <span className="loss-text">{stats.seriesLosses}</span>
          </div>
          <div className="stat-detail">{stats.totalSeries} series played</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Game Win Rate</div>
          <div className="stat-value gold-text">{stats.winRate}%</div>
          <div className="stat-detail">{stats.gamesWon}W – {stats.gamesLost}L across all games</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Games Played</div>
          <div className="stat-value">{stats.totalGames}</div>
          <div className="stat-detail">Across {stats.totalSeries} series</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Series</div>
          <div className="stat-value">{activeSeries ? '1' : '—'}</div>
          <div className="stat-detail">
            {activeSeries ? `vs ${activeSeries.opponent} · ${activeSeries.score}` : 'No series in progress'}
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Left column */}
        <div>
          {/* Active series card */}
          {activeSeries && (
            <div className="card mb-4">
              <div className="flex-between mb-3">
                <div className="section-title" style={{ border: 'none', margin: 0, padding: 0 }}>Active Series</div>
                <span className="badge badge-live">● Live</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{activeSeries.opponent}</div>
              <div className="muted-text" style={{ fontSize: 13, marginBottom: 14 }}>
                {activeSeries.format} · {activeSeries.date} · Score: <strong style={{ color: 'var(--text-primary)' }}>{activeSeries.score}</strong>
              </div>
              <div style={{ marginBottom: 8, fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                Game 5 Tournament Code
              </div>
              <div className="code-box mb-4">
                <span className="code-text">{activeSeries.tournamentCode}</span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigator.clipboard.writeText(activeSeries.tournamentCode)}
                >
                  Copy
                </button>
              </div>
              <Link to={`/series/${activeSeries.id}`} className="btn btn-primary btn-full">
                View Series Details →
              </Link>
            </div>
          )}

          {/* Recent results */}
          <div className="card">
            <div className="section-title">Recent Series</div>
            {recentCompleted.map((s, i) => (
              <Link
                key={s.id}
                to={`/series/${s.id}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div
                  className="flex-between"
                  style={{
                    padding: '11px 0',
                    borderBottom: i < recentCompleted.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{s.opponent}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.format} · {s.date}</div>
                  </div>
                  <div className="flex-center gap-2">
                    <span style={{ fontSize: 15, fontWeight: 700, color: s.result === 'win' ? 'var(--win)' : 'var(--loss)' }}>
                      {s.score}
                    </span>
                    <span className={`badge badge-${s.result}`}>{s.result}</span>
                  </div>
                </div>
              </Link>
            ))}
            <Link to="/series" className="btn btn-secondary btn-full mt-4">
              View All Series
            </Link>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Fearless alerts */}
          {lowPoolAlerts.length > 0 && (
            <div className="card mb-4">
              <div className="section-title">Fearless Pool Alerts</div>
              {lowPoolAlerts.map(d => {
                const pct = Math.round((d.remaining.length / d.pool.length) * 100)
                const isCritical = d.remaining.length <= 6
                return (
                  <div key={d.player.id} className={`alert ${isCritical ? 'alert-warning' : 'alert-info'} mb-3`}>
                    <div className="flex-between mb-3">
                      <span>
                        <strong>{d.player.name}</strong>
                        <span className={`role-badge role-${d.player.role}`} style={{ marginLeft: 8 }}>{d.player.role}</span>
                      </span>
                      <span style={{ fontWeight: 700 }}>{d.remaining.length} / {d.pool.length} left</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${pct}%`,
                          background: isCritical ? 'var(--warning)' : 'var(--blue)',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
              <Link to="/fearless" className="btn btn-secondary btn-full">
                View Full Fearless Tracker →
              </Link>
            </div>
          )}

          {/* Player roster */}
          <div className="card mb-4">
            <div className="section-title">Roster</div>
            {players.map(p => (
              <div key={p.id} className="flex-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="flex-center gap-2">
                  <span className={`role-badge role-${p.role}`}>{p.role}</span>
                  <span style={{ fontWeight: 600 }}>{p.name}</span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{p.riotId}</span>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="card">
            <div className="section-title">Quick Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/new-series" className="btn btn-primary btn-full">+ Start New Scrim Series</Link>
              <Link to="/fearless" className="btn btn-secondary btn-full">Fearless Draft Tracker</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
