import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from './Button'

interface NavbarProps {
  variant?: 'landing' | 'app' | 'minimal'
}

export default function Navbar({ variant = 'landing' }: NavbarProps) {
  const { isAuthenticated, logout } = useAuth()

  return (
    <header className={`navbar navbar--${variant}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__logo">◆</span>
          PortfolioGen
        </Link>

        <nav className="navbar__links">
          {variant === 'landing' && (
            <>
              <Link to="/login" className="navbar__link">
                Log in
              </Link>
              <Link to="/signup">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}

          {variant === 'app' && (
            <>
              <Link to="/dashboard" className="navbar__link">
                Dashboard
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Log out
              </Button>
            </>
          )}

          {variant === 'minimal' && isAuthenticated && (
            <Link to="/dashboard" className="navbar__link">
              Dashboard
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
