import { useState } from 'react'
import { Link } from 'react-router-dom'

function generateMockCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const seg = (n) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `EUWC1-${seg(4)}-${seg(4)}-${seg(4)}-${seg(10)}`
}

const RIOT_API_FLOW = [
  { step: '1', label: 'Register Provider', endpoint: 'POST /lol/tournament/v5/providers', note: 'One-time setup — ties your app to a callback URL' },
  { step: '2', label: 'Create Tournament', endpoint: 'POST /lol/tournament/v5/tournaments', note: 'Creates a named tournament context (e.g. "NBS Scrims Spring 2026")' },
  { step: '3', label: 'Generate Code',     endpoint: 'POST /lol/tournament/v5/codes',     note: 'Generates a lobby code for a specific game. Done per-game.' },
  { step: '4', label: 'Retrieve Results',  endpoint: 'GET  /lol/tournament/v5/games/by-code/{code}', note: 'Riot sends match data automatically once the game ends.' },
  { step: '5', label: 'Parse Match Data',  endpoint: 'GET  /lol/match/v5/matches/{matchId}',         note: 'Full stats — picks, bans, KDA, CS, objectives per player.' },
]

export default function NewSeries() {
  const [form, setForm] = useState({ opponent: '', format: 'BO5', date: new Date().toISOString().slice(0, 10), patch_version: '25.5', season: '2026-Spring', notes: '' })
  const [submitted, setSubmitted] = useState(false)
  const [generatedCode, setGeneratedCode] = useState('')
  const [copied, setCopied] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.opponent.trim()) return
    const code = generateMockCode()
    setGeneratedCode(code)
    setSubmitted(true)
  }

  function handleCopy() {
    navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleReset() {
    setForm({ opponent: '', format: 'BO5', date: new Date().toISOString().slice(0, 10), patch_version: '25.5', season: '2026-Spring', notes: '' })
    setSubmitted(false)
    setGeneratedCode('')
    setCopied(false)
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">New Scrim Series</h1>
        <p className="page-subtitle">Set up a new series and generate tournament lobby codes for each game.</p>
      </div>

      <div className="grid-2">
        {/* Left — form */}
        <div>
          {!submitted ? (
            <div className="card">
              <div className="section-title">Series Details</div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Opponent Team *</label>
                  <input
                    className="form-input"
                    name="opponent"
                    value={form.opponent}
                    onChange={handleChange}
                    placeholder="e.g. Team Vitality Academy"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Format</label>
                  <select className="form-select" name="format" value={form.format} onChange={handleChange}>
                    <option value="BO1">Best of 1</option>
                    <option value="BO3">Best of 3</option>
                    <option value="BO5">Best of 5</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    className="form-input"
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Patch</label>
                    <input
                      className="form-input"
                      name="patch_version"
                      value={form.patch_version}
                      onChange={handleChange}
                      placeholder="e.g. 25.5"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Season</label>
                    <select className="form-select" name="season" value={form.season} onChange={handleChange}>
                      <option value="2026-Spring">2026 Spring</option>
                      <option value="2026-Summer">2026 Summer</option>
                      <option value="2025-Spring">2025 Spring</option>
                      <option value="2025-Summer">2025 Summer</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes (optional)</label>
                  <input
                    className="form-input"
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="e.g. Watch their Jarvan / Galio combo"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 8 }}>
                  Generate Tournament Code →
                </button>
              </form>
            </div>
          ) : (
            <div className="card">
              <div className="alert alert-success mb-6">
                Series created vs <strong>{form.opponent}</strong> · {form.format} · {form.date} · Patch {form.patch_version}
              </div>

              <div className="section-title">Game 1 Tournament Code</div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
                Share this code with both teams. Use it to set up the custom game lobby in the League of Legends client.
              </p>
              <div className="code-box mb-4">
                <span className="code-text">{generatedCode}</span>
                <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="alert alert-info mb-6">
                <strong>Note (Stub Mode):</strong> This code is simulated. With a production Riot API key, this would call{' '}
                <code style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,.3)', padding: '1px 5px', borderRadius: 3 }}>
                  POST /lol/tournament/v5/codes
                </code>{' '}
                and generate a real lobby code that automatically captures match data when the game ends.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button className="btn btn-primary" onClick={handleReset}>
                  Create Another Series
                </button>
                <Link to="/series" className="btn btn-secondary">View All Series</Link>
              </div>
            </div>
          )}
        </div>

        {/* Right — API flow explainer */}
        <div>
          <div className="card mb-4">
            <div className="section-title">How it works with the Riot API</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
              This prototype simulates the full tournament flow. Once a production API key is approved,
              each step below will be a live API call.
            </p>
            {RIOT_API_FLOW.map(item => (
              <div key={item.step} style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                <div style={{
                  minWidth: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(200,155,60,.15)', border: '1px solid rgba(200,155,60,.4)',
                  color: 'var(--gold)', fontWeight: 700, fontSize: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {item.step}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{item.label}</div>
                  <code style={{ fontSize: 11, color: 'var(--blue)', display: 'block', marginBottom: 2 }}>
                    {item.endpoint}
                  </code>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.note}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="section-title">API Key Status</div>
            <div className="flex-center gap-2 mb-3">
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warning)', display: 'inline-block' }} />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Running in Stub / Mock Mode</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
              A production key is required to generate real tournament lobby codes and retrieve live match data.
              Tournament codes generated here are placeholders.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--win)', marginRight: 6 }}>✓</span>Dev key — available now, stub endpoints only
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--warning)', marginRight: 6 }}>○</span>Production key — applied for, review pending (~20 business days)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
