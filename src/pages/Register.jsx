import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const REGIONS = ['EUW', 'EUNE', 'NA', 'KR', 'LAN', 'LAS', 'OCE', 'TR', 'RU', 'JP']

const ROLES = ['TOP', 'JNG', 'MID', 'BOT', 'SUP']

const emptyPlayer = (role) => ({ role, name: '', riotId: '' })

const STEPS = ['Account', 'Team', 'Roster']

export default function Register() {
  const { signIn } = useAuth()
  const navigate   = useNavigate()

  const [step, setStep]     = useState(0)
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const [account, setAccount] = useState({ email: '', password: '', confirm: '' })
  const [team, setTeam]       = useState({ name: '', tag: '', region: 'EUW' })
  const [players, setPlayers] = useState(ROLES.map(emptyPlayer))

  function updateAccount(field, value) { setAccount(a => ({ ...a, [field]: value })) }
  function updateTeam(field, value)    { setTeam(t => ({ ...t, [field]: value })) }
  function updatePlayer(i, field, value) {
    setPlayers(ps => ps.map((p, idx) => idx === i ? { ...p, [field]: value } : p))
  }

  function nextStep(e) {
    e.preventDefault()
    setError('')

    if (step === 0) {
      if (account.password !== account.confirm) { setError('Passwords do not match'); return }
      if (account.password.length < 6)          { setError('Password must be at least 6 characters'); return }
    }
    if (step === 1) {
      if (!team.name.trim()) { setError('Team name is required'); return }
    }

    setStep(s => s + 1)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // 1. Create auth user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: account.email,
      password: account.password,
    })
    if (signUpError) { setError(signUpError.message); setLoading(false); return }

    // 2. Sign in to establish session
    const { error: signInError } = await signIn(account.email, account.password)
    if (signInError) {
      setError('Account created — check your email to confirm, then log in.')
      setLoading(false)
      return
    }

    const userId = authData.user.id

    // 3. Create team
    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .insert({ name: team.name.trim(), tag: team.tag.trim().toUpperCase(), region: team.region })
      .select()
      .single()
    if (teamError) { setError(teamError.message); setLoading(false); return }

    // 4. Link user to team as coach
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({ user_id: userId, team_id: teamData.id, role: 'coach' })
    if (memberError) { setError(memberError.message); setLoading(false); return }

    // 5. Insert players (skip blank ones)
    const filledPlayers = players.filter(p => p.name.trim())
    if (filledPlayers.length > 0) {
      const { error: playersError } = await supabase
        .from('players')
        .insert(filledPlayers.map(p => ({
          team_id: teamData.id,
          name: p.name.trim(),
          riot_id: p.riotId.trim(),
          role: p.role,
        })))
      if (playersError) { setError(playersError.message); setLoading(false); return }
    }

    navigate('/')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--gold)', letterSpacing: 4 }}>ScrimOS</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 }}>
            Register Your Team
          </div>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 28 }}>
          {STEPS.map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: i <= step ? 'var(--gold)' : 'var(--bg-hover)',
                  border: `2px solid ${i <= step ? 'var(--gold)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                  color: i <= step ? '#000' : 'var(--text-muted)',
                  transition: 'all 0.2s',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 11, color: i === step ? 'var(--gold)' : 'var(--text-muted)', fontWeight: i === step ? 700 : 400 }}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width: 60, height: 2, background: i < step ? 'var(--gold)' : 'var(--border)', margin: '0 4px', marginBottom: 20, transition: 'all 0.2s' }} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: 32 }}>

          {error && <div className="alert alert-warning mb-4">{error}</div>}

          {/* Step 0 — Account */}
          {step === 0 && (
            <form onSubmit={nextStep}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Create your account</h3>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={account.email}
                  onChange={e => updateAccount('email', e.target.value)} placeholder="coach@team.gg" required autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" value={account.password}
                  onChange={e => updateAccount('password', e.target.value)} placeholder="Min. 6 characters" required />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input className="form-input" type="password" value={account.confirm}
                  onChange={e => updateAccount('confirm', e.target.value)} placeholder="••••••••" required />
              </div>
              <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 8 }}>
                Next →
              </button>
            </form>
          )}

          {/* Step 1 — Team */}
          {step === 1 && (
            <form onSubmit={nextStep}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Team profile</h3>
              <div className="form-group">
                <label className="form-label">Team Name *</label>
                <input className="form-input" type="text" value={team.name}
                  onChange={e => updateTeam('name', e.target.value)} placeholder="e.g. NBS Esports" required autoFocus />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Tag</label>
                  <input className="form-input" type="text" value={team.tag} maxLength={5}
                    onChange={e => updateTeam('tag', e.target.value)} placeholder="NBS" />
                </div>
                <div className="form-group">
                  <label className="form-label">Region</label>
                  <select className="form-select" value={team.region} onChange={e => updateTeam('region', e.target.value)}>
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(0)}>← Back</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Next →</button>
              </div>
            </form>
          )}

          {/* Step 2 — Roster */}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Add your roster</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
                Optional — you can add or edit players later in Settings.
              </p>
              {players.map((p, i) => (
                <div key={p.role} style={{ display: 'grid', gridTemplateColumns: '52px 1fr 1fr', gap: 8, marginBottom: 10, alignItems: 'center' }}>
                  <span className={`role-badge role-${p.role}`} style={{ textAlign: 'center', padding: '6px 4px' }}>{p.role}</span>
                  <input className="form-input" type="text" value={p.name} placeholder="Player name"
                    onChange={e => updatePlayer(i, 'name', e.target.value)} />
                  <input className="form-input" type="text" value={p.riotId} placeholder="Riot ID#TAG"
                    onChange={e => updatePlayer(i, 'riotId', e.target.value)} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>← Back</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
                  {loading ? 'Creating team...' : 'Create Team'}
                </button>
              </div>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
