import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import Navbar from '../components/Navbar'

export default function Landing() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="page page--landing">
      <Navbar />

      <main className="landing">
        <section className="landing__hero">
          <div className="landing__badge">Portfolio Generator SaaS</div>
          <h1 className="landing__title">
            Build a stunning portfolio
            <span className="landing__gradient"> in minutes</span>
          </h1>
          <p className="landing__subtitle">
            Create, customize, and deploy your personal portfolio page with AI-powered
            copy — no code required.
          </p>

          <div className="landing__actions">
            <Link to="/signup">
              <Button size="lg">Start for free</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">
                Log in
              </Button>
            </Link>
          </div>
        </section>

        <section className="landing__features">
          <div className="feature-card">
            <span className="feature-card__icon">✦</span>
            <h3>AI-powered copy</h3>
            <p>Generate professional headers and subheaders with a single prompt.</p>
          </div>
          <div className="feature-card">
            <span className="feature-card__icon">⚡</span>
            <h3>One-click deploy</h3>
            <p>Publish your portfolio to a shareable public URL instantly.</p>
          </div>
          <div className="feature-card">
            <span className="feature-card__icon">◈</span>
            <h3>Clean design</h3>
            <p>Modern, minimal layouts that put your work front and center.</p>
          </div>
        </section>
      </main>
    </div>
  )
}
