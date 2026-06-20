import { Navigate } from 'react-router-dom'
import { SignIn, useAuth } from '@clerk/react'
import Navbar from '../components/Navbar'
import { Sparkles, Zap, Shield } from 'lucide-react'

const BRAND_FEATURES = [
  { icon: <Sparkles size={14} />, text: 'AI-powered copy generation' },
  { icon: <Zap size={14} />,      text: 'One-click portfolio deploy' },
  { icon: <Shield size={14} />,   text: 'Secure & always online' },
]

export default function Login() {
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
              "Your portfolio is your first impression. Make it count."
            </blockquote>
            <p className="auth-brand__author">— The PortfolioGen team</p>
          </div>
        </aside>

        {/* ── Clerk SignIn form ── */}
        <div className="auth-form-side">
          <div className="clerk-auth-wrap">
            <SignIn
              routing="hash"
              fallbackRedirectUrl="/dashboard"
              appearance={{
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
                  headerTitle: 'clerk-header-title',
                  headerSubtitle: 'clerk-header-subtitle',
                  socialButtonsBlockButton: 'clerk-social-btn',
                  formButtonPrimary: 'clerk-primary-btn',
                  footerActionLink: 'clerk-footer-link',
                  dividerLine: 'clerk-divider',
                  dividerText: 'clerk-divider-text',
                  formFieldInput: 'clerk-input',
                  formFieldLabel: 'clerk-label',
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
