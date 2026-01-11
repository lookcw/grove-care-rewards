import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Signup from './Signup'
import Login from './Login'
import ForgotPassword from './ForgotPassword'
import ResetPassword from './ResetPassword'
import ReferralForm from './ReferralForm'
import MyNetwork from './MyNetwork'
import BrowseProviders from './BrowseProviders'

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface HealthStatus {
  status: string
  message?: string
  database?: string
}

function Home() {
  const [backendStatus, setBackendStatus] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBackendStatus = async () => {
      try {
        const response = await fetch(`${API_URL}`)
        if (!response.ok) {
          throw new Error('Failed to connect to backend')
        }
        const data = await response.json()
        setBackendStatus(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchBackendStatus()
  }, [])

  return (
    <div className="container">
      <h1>Hello World!</h1>
      <p className="subtitle">FastAPI + React + PostgreSQL</p>

      <div className="status-card">
        <h2>Backend Status</h2>
        {loading && <p>Connecting to backend...</p>}
        {error && <p className="error">Error: {error}</p>}
        {backendStatus && (
          <div className="status-info">
            <p className="success">
              ✓ Status: {backendStatus.status}
            </p>
            {backendStatus.message && (
              <p className="message">{backendStatus.message}</p>
            )}
          </div>
        )}
      </div>

      <div className="info">
        <p>Frontend: React + Vite + TypeScript</p>
        <p>Backend: FastAPI + SQLAlchemy</p>
        <p>Database: PostgreSQL</p>
      </div>
    </div>
  )
}

function Navigation() {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">Referral App</Link>
        <div className="nav-links">
          {isAuthenticated && <Link to="/network">My Network</Link>}
          {isAuthenticated && <Link to="/referrals/new">New Referral</Link>}
          {!isAuthenticated && <Link to="/login">Log In</Link>}
          {!isAuthenticated && <Link to="/signup">Sign Up</Link>}
          {isAuthenticated && (
            <>
              <span style={{ color: '#666', marginLeft: '10px' }}>
                {user?.first_name || user?.email}
              </span>
              <button
                onClick={logout}
                style={{
                  padding: '5px 15px',
                  marginLeft: '10px',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navigation />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/network"
              element={
                <ProtectedRoute>
                  <MyNetwork />
                </ProtectedRoute>
              }
            />
            <Route
              path="/network/browse"
              element={
                <ProtectedRoute>
                  <BrowseProviders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/referrals/new"
              element={
                <ProtectedRoute>
                  <ReferralForm />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
