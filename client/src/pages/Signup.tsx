import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Input from '../components/Input'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { Sparkles, Zap, Shield, ArrowRight, Star } from 'lucide-react'

const BRAND_FEATURES = [
  { icon: <Sparkles size={14} />, text: 'AI-powered copy generation' },
  { icon: <Zap size={14} />,      text: 'Deploy your portfolio in seconds' },
  { icon: <Shield size={14} />,   text: 'No credit card required' },
  { icon: <Star size={14} />,     text: 'Calendly scheduling built in' },
]

export default function Signup() {
  const navigate = useNavigate()
  const { signup, isAuthenticated, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

    try {
      await signup(email, password, confirmPassword)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed.')
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
              "Built my portfolio in 4 minutes. Got hired the next week."
            </blockquote>
            <p className="auth-brand__author">— Alex M., Software Engineer</p>
          </div>
        </aside>

        {/* ── Form side ── */}
        <div className="auth-form-side">
          <main className="auth-card">
            <div className="auth-card__header">
              <p className="auth-card__eyebrow">Get started free</p>
              <h1>Create your account</h1>
              <p>Start building your portfolio today. It only takes a minute.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <Input
                label="Email address"
                type="email"
                name="email"
                id="signup-email"
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
                id="signup-password"
                placeholder="Choose a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <Input
                label="Confirm password"
                type="password"
                name="confirmPassword"
                id="signup-confirm"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
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
                Create account
              </Button>
            </form>

            <p className="auth-card__footer">
              Already have an account?{' '}
              <Link to="/login">Log in</Link>
            </p>
          </main>
        </div>
      </div>
    </div>
  )
}
