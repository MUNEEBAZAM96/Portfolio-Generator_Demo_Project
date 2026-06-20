import { Link, useLocation } from 'react-router-dom'
import { Show, SignInButton, UserButton } from '@clerk/react'
import Button from './Button'
import { LayoutDashboard } from 'lucide-react'

interface NavbarProps {
  variant?: 'landing' | 'app' | 'minimal'
}

function LogoIcon() {
  return (
    <svg
      className="navbar__logo-icon"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <rect width="28" height="28" rx="7" fill="url(#logo-grad)" />
      <path
        d="M9 14l3.5 3.5L19 10"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="logo-grad"
          x1="0" y1="0" x2="28" y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const clerkAppearance = {
  variables: { colorPrimary: '#6366f1' },
  elements: { avatarBox: 'clerk-user-btn-avatar' },
}

export default function Navbar({ variant = 'landing' }: NavbarProps) {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  return (
    <header className={`navbar navbar--${variant}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="PortfolioGen home">
          <LogoIcon />
          PortfolioGen
        </Link>

        <nav className="navbar__links" aria-label="Main navigation">

          {/* ── Landing nav ── */}
          {variant === 'landing' && (
            <>
              <Show when="signed-out">
                <Link
                  to="/login"
                  className={`navbar__link ${isActive('/login') ? 'navbar__link--active' : ''}`}
                >
                  Log in
                </Link>
                <Link to="/signup">
                  <Button size="sm">Get started</Button>
                </Link>
              </Show>
              <Show when="signed-in">
                <Link to="/dashboard" className="navbar__link">
                  Dashboard
                </Link>
                <UserButton appearance={clerkAppearance} />
              </Show>
            </>
          )}

          {/* ── App nav (dashboard) ── */}
          {variant === 'app' && (
            <>
              <Link
                to="/dashboard"
                className={`navbar__link ${isActive('/dashboard') ? 'navbar__link--active' : ''}`}
              >
                <LayoutDashboard
                  size={14}
                  style={{ marginRight: 4, verticalAlign: 'middle' }}
                />
                Dashboard
              </Link>
              <UserButton appearance={clerkAppearance} />
            </>
          )}

          {/* ── Minimal nav (public page / auth pages) ── */}
          {variant === 'minimal' && (
            <>
              <Show when="signed-in">
                <Link
                  to="/dashboard"
                  className={`navbar__link ${isActive('/dashboard') ? 'navbar__link--active' : ''}`}
                >
                  Dashboard
                </Link>
                <UserButton appearance={clerkAppearance} />
              </Show>
              <Show when="signed-out">
                <SignInButton mode="redirect" fallbackRedirectUrl="/dashboard">
                  <Button variant="ghost" size="sm">Log in</Button>
                </SignInButton>
              </Show>
            </>
          )}

        </nav>
      </div>
    </header>
  )
}
