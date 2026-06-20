import { Navigate } from 'react-router-dom'
import { SignUp, useAuth } from '@clerk/react'
import Navbar from '../components/Navbar'


// Clerk appearance — cast to any to avoid fighting version-specific type constraints
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const clerkAppearance: any = {
  variables: {
    colorPrimary: '#6366f1',
    colorBackground: '#ffffff',
    colorText: '#1f2937',
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

      <div className="auth-layout--centered">
        <div className="clerk-auth-wrap">
          <SignUp
            routing="hash"
            fallbackRedirectUrl="/dashboard"
            appearance={clerkAppearance}
          />
        </div>
      </div>
    </div>
  )
}
