import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink, Outlet, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { supabase } from './lib/supabase'
import ProtectedRoute from './components/ProtectedRoute'

import Dashboard       from './pages/Dashboard'
import SeriesList      from './pages/SeriesList'
import SeriesDetail    from './pages/SeriesDetail'
import FearlessTracker from './pages/FearlessTracker'
import NewSeries       from './pages/NewSeries'
import Login           from './pages/Login'
import Register        from './pages/Register'

function AppLayout() {
  const { session, signOut } = useAuth()
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
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-name">ScrimOS</span>
          <span className="logo-sub">{teamName || '—'}</span>
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
          <div className="api-note" style={{ marginBottom: 10 }}>Production key pending</div>
          <button
            onClick={signOut}
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: 12, padding: '7px 12px' }}
          >
            Sign Out
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename="/nbs-scrim-tracker">
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected — all share AppLayout with sidebar */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
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
