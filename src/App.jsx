import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import SeriesList from './pages/SeriesList'
import SeriesDetail from './pages/SeriesDetail'
import FearlessTracker from './pages/FearlessTracker'
import NewSeries from './pages/NewSeries'

function Sidebar() {
  const links = [
    { to: '/', label: 'Dashboard', icon: '▣' },
    { to: '/series', label: 'All Series', icon: '≡' },
    { to: '/fearless', label: 'Fearless Draft', icon: '◈' },
    { to: '/new-series', label: 'New Series', icon: '+' },
  ]

  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="logo-name">NBS</span>
        <span className="logo-sub">Scrim Tracker</span>
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
  )
}

export default function App() {
  return (
    <BrowserRouter basename="/nbs-scrim-tracker">
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/series" element={<SeriesList />} />
            <Route path="/series/:id" element={<SeriesDetail />} />
            <Route path="/fearless" element={<FearlessTracker />} />
            <Route path="/new-series" element={<NewSeries />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
