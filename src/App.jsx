import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink, Outlet, Navigate, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { supabase } from './lib/supabase'

import Dashboard       from './pages/Dashboard'
import SeriesList      from './pages/SeriesList'
import SeriesDetail    from './pages/SeriesDetail'
import FearlessTracker from './pages/FearlessTracker'
import NewSeries       from './pages/NewSeries'
import Login           from './pages/Login'
import Register        from './pages/Register'

function TopBar() {
  const { session, signOut } = useAuth()

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <span className="top-bar-badge">Preview</span>
        <span className="top-bar-text">You are viewing a demo — register your team to track real scrims</span>
      </div>
      <div className="top-bar-right">
        {session ? (
          <button onClick={signOut} className="btn btn-secondary btn-sm">Sign Out</button>
        ) : (
          <>
            <Link to="/register" className="btn btn-secondary btn-sm">Register Team</Link>
            <Link to="/login"    className="btn btn-primary    btn-sm">Login</Link>
          </>
        )}
      </div>
    </div>
  )
}

function AppLayout() {
  const { session } = useAuth()
  const [teamName, setTeamName] = useState('')

  useEffect(() => {
    if (!session) return
    supabase
      .from('team_members')
      .select('teams(name)')
      .eq('user_id', session.user.id)
      .single()
      .then(({ data }) => {
        if (data?.teams?.name) setTeamName(data.teams.name)
      })
  }, [session])

  const links = [
    { to: '/',           label: 'Dashboard',      icon: '▣' },
    { to: '/series',     label: 'All Series',     icon: '≡' },
    { to: '/fearless',   label: 'Fearless Draft', icon: '◈' },
    { to: '/new-series', label: 'New Series',     icon: '+' },
  ]

  return (
    <>
      <TopBar />
      <div className="app app-with-topbar">
        <aside className="sidebar sidebar-with-topbar">
          <div className="logo">
            <span className="logo-name">ScrimOS</span>
            <span className="logo-sub">{session ? (teamName || '…') : 'Demo'}</span>
          </div>
          <nav>
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                <span className="nav-icon">{l.icon}</span>
                <span>{l.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="api-status">
              <span className="api-dot"></span>
              <span>Riot API: Stub Mode</span>
            </div>
            <div className="api-note">Production key pending</div>
          </div>
        </aside>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter basename="/nbs-scrim-tracker">
      <AuthProvider>
        <Routes>
          {/* Auth pages — redirect to home if already logged in */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* App — public (demo mode) but also works when logged in */}
          <Route element={<AppLayout />}>
            <Route path="/"           element={<Dashboard />} />
            <Route path="/series"     element={<SeriesList />} />
            <Route path="/series/:id" element={<SeriesDetail />} />
            <Route path="/fearless"   element={<FearlessTracker />} />
            <Route path="/new-series" element={<NewSeries />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
