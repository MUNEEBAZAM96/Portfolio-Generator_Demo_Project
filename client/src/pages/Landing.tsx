import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import Navbar from '../components/Navbar'
import {
  Sparkles,
  Zap,
  Globe,
  ArrowRight,
  Palette,
  Shield,
  Star,
} from 'lucide-react'

const FEATURES = [
  {
    icon: <Sparkles size={18} />,
    title: 'AI-powered copy',
    desc: 'Generate professional headlines and bios with a single prompt. No writer\'s block.',
  },
  {
    icon: <Zap size={18} />,
    title: 'One-click deploy',
    desc: 'Publish to a shareable public URL in seconds. No configuration required.',
  },
  {
    icon: <Palette size={18} />,
    title: 'Clean design',
    desc: 'Modern, minimal layouts that put your work front and center — always.',
  },
  {
    icon: <Globe size={18} />,
    title: 'Custom slug',
    desc: 'Choose your own URL slug. Share a link that looks professional from day one.',
  },
  {
    icon: <Shield size={18} />,
    title: 'Secure & reliable',
    desc: 'Your data is safe and your page loads fast, every time.',
  },
  {
    icon: <Star size={18} />,
    title: 'Calendly integration',
    desc: 'Let visitors book meetings with you directly from your portfolio page.',
  },
]

const HOW_STEPS = [
  {
    n: '01',
    title: 'Create your account',
    desc: 'Sign up in seconds. No credit card required. Start building immediately.',
  },
  {
    n: '02',
    title: 'Fill in your details',
    desc: 'Add your name, headline, and bio — or let our AI draft the perfect copy for you.',
  },
  {
    n: '03',
    title: 'Deploy & share',
    desc: 'Hit deploy and share your live portfolio URL with the world instantly.',
  },
]

export default function Landing() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="page page--landing">
      <Navbar variant="landing" />

      <main className="landing">
        {/* ── Hero ── */}
        <section className="landing__hero">
          <div className="landing__hero-text">
            <div className="landing__badge">
              <span className="landing__badge-dot" />
              AI-powered portfolio builder
            </div>

            <h1 className="landing__title">
              Build a stunning
              <br />
              portfolio{' '}
              <span className="landing__gradient">in minutes</span>
            </h1>

            <p className="landing__subtitle">
              Create, customize, and deploy your personal portfolio with AI-powered copy.
              No code. No design skills needed.
            </p>

            <div className="landing__actions">
              <Link to="/signup">
                <Button size="xl" rightIcon={<ArrowRight size={18} />}>
                  Start for free
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="xl">
                  Log in
                </Button>
              </Link>
            </div>
          </div>

          {/* Mock product card */}
          <div className="landing__hero-visual" aria-hidden="true">
            <div className="hero-card">
              <div className="hero-card__bar">
                <div className="hero-card__dots">
                  <span className="hero-card__dot" />
                  <span className="hero-card__dot" />
                  <span className="hero-card__dot" />
                </div>
                <div className="hero-card__url">
                  <Globe size={10} />
                  portfoliogen.app/page/jane-smith
                </div>
              </div>
              <div className="hero-card__body">
                <div className="hero-card__avatar">J</div>
                <p className="hero-card__name">Jane Smith</p>
                <p className="hero-card__role">Senior Product Designer</p>
                <div className="hero-card__tags">
                  <span className="hero-card__tag">UX Research</span>
                  <span className="hero-card__tag">Figma</span>
                  <span className="hero-card__tag">Design Systems</span>
                </div>
                <p className="hero-card__bio">
                  I help SaaS companies ship products that users love. 8 years of
                  experience across B2B and consumer apps.
                </p>
                <span className="hero-card__cta">
                  <Globe size={13} />
                  Get In Touch
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Social proof strip ── */}
        <div className="landing__social" aria-label="Social proof">
          <div className="social__avatars" aria-hidden="true">
            <span className="social__avatar">A</span>
            <span className="social__avatar">M</span>
            <span className="social__avatar">R</span>
            <span className="social__avatar">K</span>
            <span className="social__avatar">S</span>
          </div>
          <p className="social__label">
            <strong className="social__count">2,400+</strong> creators trust PortfolioGen
          </p>
          <span className="social__divider" aria-hidden="true" />
          <div className="social__stat">
            <span className="social__stat-num">30 sec</span>
            <span className="social__stat-label">to first draft</span>
          </div>
          <span className="social__divider" aria-hidden="true" />
          <div className="social__stat">
            <span className="social__stat-num">100%</span>
            <span className="social__stat-label">no-code</span>
          </div>
        </div>

        {/* ── Features ── */}
        <section className="landing__features-section" aria-labelledby="features-heading">
          <p className="landing__section-label">Features</p>
          <h2 id="features-heading" className="landing__section-title">
            Everything you need,
            <br />
            nothing you don't
          </h2>
          <p className="landing__section-sub">
            We've stripped out the complexity. PortfolioGen gives you a beautiful
            public page with zero setup.
          </p>

          <div className="landing__features-grid" role="list">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card" role="listitem">
                <div className="feature-card__icon-wrap" aria-hidden="true">
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="landing__how" aria-labelledby="how-heading">
          <p className="landing__section-label">How it works</p>
          <h2 id="how-heading" className="landing__section-title">
            Three steps to live
          </h2>
          <p className="landing__section-sub">
            From signup to published portfolio in under 5 minutes.
          </p>

          <div className="how__steps" role="list">
            {HOW_STEPS.map((s) => (
              <div key={s.n} className="how__step" role="listitem">
                <div className="how__num" aria-hidden="true">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="landing__cta" aria-labelledby="cta-heading">
          <div className="landing__cta-inner">
            <h2 id="cta-heading" className="landing__cta-title">
              Ready to stand out?
            </h2>
            <p className="landing__cta-sub">
              Join thousands of creators who launched their portfolio in minutes. It's free.
            </p>
            <div className="landing__cta-actions">
              <Link to="/signup">
                <Button size="xl" rightIcon={<ArrowRight size={18} />}>
                  Create your portfolio
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost" size="xl">
                  Already have an account
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="landing__footer">
          <div className="landing__footer-inner">
            <div className="footer__brand">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <rect width="28" height="28" rx="7" fill="url(#footer-grad)" />
                <path
                  d="M9 14l3.5 3.5L19 10"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="footer-grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366f1" />
                    <stop offset="1" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
              </svg>
              PortfolioGen
            </div>
            <nav className="footer__links" aria-label="Footer navigation">
              <Link to="/" className="footer__link">Product</Link>
              <Link to="/login" className="footer__link">Log in</Link>
              <Link to="/signup" className="footer__link">Sign up</Link>
            </nav>
            <span className="footer__copy">
              © {new Date().getFullYear()} PortfolioGen
            </span>
          </div>
        </footer>
      </main>
    </div>
  )
}
