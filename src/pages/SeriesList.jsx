import { Link } from 'react-router-dom'
import { series, getOverallStats } from '../data/mockData'

function ResultBadge({ result, status }) {
  if (status === 'in_progress') return <span className="badge badge-in_progress">In Progress</span>
  if (status === 'upcoming')    return <span className="badge badge-upcoming">Upcoming</span>
  if (result === 'win')         return <span className="badge badge-win">Win</span>
  return <span className="badge badge-loss">Loss</span>
}

function GameDots({ games, format }) {
  const maxGames = format === 'BO5' ? 5 : format === 'BO3' ? 3 : 1
  return (
    <div className="flex-center gap-2">
      {Array.from({ length: maxGames }).map((_, i) => {
        const game = games[i]
        let color = 'var(--text-muted)'
        let title = `Game ${i + 1}`
        if (game) {
          color = game.result === 'win' ? 'var(--win)' : 'var(--loss)'
          title = `G${i + 1}: ${game.result} (${game.duration})`
        }
        return (
          <span
            key={i}
            title={title}
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: game ? color : 'var(--border)',
              border: game ? 'none' : '1px solid var(--border)',
            }}
          />
        )
      })}
    </div>
  )
}

export default function SeriesList() {
  const stats = getOverallStats()
  const sorted = [...series].sort((a, b) => {
    // in_progress first, then by date desc
    if (a.status === 'in_progress') return -1
    if (b.status === 'in_progress') return 1
    return new Date(b.date) - new Date(a.date)
  })

  return (
    <div>
      <div className="flex-between mb-6">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 className="page-title">All Series</h1>
          <p className="page-subtitle">
            {stats.seriesWins}W – {stats.seriesLosses}L series record · {stats.winRate}% game win rate
          </p>
        </div>
        <Link to="/new-series" className="btn btn-primary">+ New Series</Link>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Opponent</th>
                <th>Format</th>
                <th>Score</th>
                <th>Games</th>
                <th>Result</th>
                <th>Tournament Code</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(s => (
                <tr key={s.id}>
                  <td className="muted-text">{s.date}</td>
                  <td style={{ fontWeight: 600 }}>{s.opponent}</td>
                  <td className="muted-text">{s.format}</td>
                  <td style={{ fontWeight: 700, color: s.result === 'win' ? 'var(--win)' : s.result === 'loss' ? 'var(--loss)' : 'var(--text-primary)' }}>
                    {s.score || '—'}
                  </td>
                  <td><GameDots games={s.games} format={s.format} /></td>
                  <td><ResultBadge result={s.result} status={s.status} /></td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--blue)' }}>
                      {s.tournamentCode ? s.tournamentCode.slice(0, 14) + '…' : '—'}
                    </span>
                  </td>
                  <td>
                    <Link to={`/series/${s.id}`} className="btn btn-secondary btn-sm">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes column — show series with notes */}
      <div style={{ marginTop: 24 }}>
        {sorted.filter(s => s.notes).map(s => (
          <div key={s.id} className="card mb-4" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ minWidth: 120 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{s.opponent}</div>
              <div className="muted-text" style={{ fontSize: 12 }}>{s.date}</div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1 }}>
              <span style={{ color: 'var(--text-muted)', marginRight: 6 }}>Notes:</span>
              {s.notes}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
