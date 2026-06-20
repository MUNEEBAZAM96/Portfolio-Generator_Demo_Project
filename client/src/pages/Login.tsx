import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Input from '../components/Input'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { Sparkles, Zap, Shield, ArrowRight } from 'lucide-react'

const BRAND_FEATURES = [
  { icon: <Sparkles size={14} />, text: 'AI-powered copy generation' },
  { icon: <Zap size={14} />,       text: 'One-click portfolio deploy' },
  { icon: <Shield size={14} />,    text: 'Secure & always online' },
]

export default function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.')
    }
  }

  return (
    <div className="page page--auth">
      <Navbar variant="minimal" />

      <div className="auth-layout">
        {/* ── Brand side ── */}
        <aside className="auth-brand" aria-hidden="true">
          <div />
          <div className="auth-brand__features">
            {BRAND_FEATURES.map((f) => (
              <div key={f.text} className="auth-brand__feature">
                <span className="auth-brand__feature-icon">{f.icon}</span>
                {f.text}
              </div>
            ))}
          </div>
          <div className="auth-brand__quote">
            <blockquote className="auth-brand__q">
              "Your portfolio is your first impression. Make it count."
            </blockquote>
            <p className="auth-brand__author">— The PortfolioGen team</p>
          </div>
        </aside>

        {/* ── Form side ── */}
        <div className="auth-form-side">
          <main className="auth-card">
            <div className="auth-card__header">
              <p className="auth-card__eyebrow">Welcome back</p>
              <h1>Log in to your account</h1>
              <p>Continue building your portfolio where you left off.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <Input
                label="Email address"
                type="email"
                name="email"
                id="login-email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <Input
                label="Password"
                type="password"
                name="password"
                id="login-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />

              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={isLoading}
                rightIcon={<ArrowRight size={16} />}
              >
                Log in
              </Button>
            </form>

            <p className="auth-card__footer">
              Don&apos;t have an account?{' '}
              <Link to="/signup">Create one for free</Link>
            </p>
          </main>
        </div>
      </div>
    </div>
  )
}
