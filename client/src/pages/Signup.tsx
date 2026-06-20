import { Navigate } from 'react-router-dom'
import { SignUp, useAuth } from '@clerk/react'
import Navbar from '../components/Navbar'
import { Sparkles, Zap, Shield, Star } from 'lucide-react'

const BRAND_FEATURES = [
  { icon: <Sparkles size={14} />, text: 'AI-powered copy generation' },
  { icon: <Zap size={14} />,      text: 'Deploy your portfolio in seconds' },
  { icon: <Shield size={14} />,   text: 'No credit card required' },
  { icon: <Star size={14} />,     text: 'Calendly scheduling built in' },
]

// Clerk appearance — cast to any to avoid fighting version-specific type constraints
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const clerkAppearance: any = {
  variables: {
    colorPrimary: '#6366f1',
    colorBackground: '#0d0d10',
    colorText: '#f1f1f3',
    colorDanger: '#ef4444',
    borderRadius: '10px',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '15px',
  },
  elements: {
    rootBox: 'clerk-root',
    card: 'clerk-card',
    socialButtonsBlockButton: 'clerk-social-btn',
    formButtonPrimary: 'clerk-primary-btn',
    footerActionLink: 'clerk-footer-link',
    dividerLine: 'clerk-divider',
    dividerText: 'clerk-divider-text',
    formFieldInput: 'clerk-input',
    formFieldLabel: 'clerk-label',
  },
}

export default function Signup() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) return null

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />
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

        {/* ── Clerk SignUp form ── */}
        <div className="auth-form-side">
          <div className="clerk-auth-wrap">
            <SignUp
              routing="hash"
              fallbackRedirectUrl="/dashboard"
              appearance={clerkAppearance}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
