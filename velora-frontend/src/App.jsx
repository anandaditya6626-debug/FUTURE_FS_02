import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/layout/Layout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import LeadProfile from './pages/LeadProfile'
import Pipeline from './pages/Pipeline'
import AIAssistant from './pages/AIAssistant'
import Automation from './pages/Automation'
import Communications from './pages/Communications'
import CalendarPage from './pages/CalendarPage'
import Team from './pages/Team'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Clients from './pages/Clients'

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return !isAuthenticated ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Protected App Routes */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index                  element={<Dashboard />} />
          <Route path="leads"           element={<Leads />} />
          <Route path="leads/:id"       element={<LeadProfile />} />
          <Route path="pipeline"        element={<Pipeline />} />
          <Route path="ai-assistant"    element={<AIAssistant />} />
          <Route path="automation"      element={<Automation />} />
          <Route path="communications"  element={<Communications />} />
          <Route path="calendar"        element={<CalendarPage />} />
          <Route path="team"            element={<Team />} />
          <Route path="analytics"       element={<Analytics />} />
          <Route path="clients"         element={<Clients />} />
          <Route path="settings"        element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
