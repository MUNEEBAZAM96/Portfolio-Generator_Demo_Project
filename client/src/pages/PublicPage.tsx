import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Navbar from '../components/Navbar'
import Skeleton from '../components/Skeleton'
import { getPortfolio } from '../services/api'
import type { Portfolio } from '../types'
import { Calendar, AlertCircle, Sparkles } from 'lucide-react'

function LoadingSkeleton() {
  return (
    <div className="public-page__skeleton">
      <div className="skeleton-card">
        <Skeleton variant="avatar" width={80} height={80} />
        <Skeleton variant="title" width="50%" height={24} />
        <Skeleton variant="text"  width="40%" height={14} />
        <Skeleton variant="text"  width="80%" height={13} />
        <Skeleton variant="text"  width="70%" height={13} />
        <Skeleton variant="rect"  width={140} height={40} />
      </div>
    </div>
  )
}

export default function PublicPage() {
  const { pageName = '' } = useParams()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [calendlyOpen, setCalendlyOpen] = useState(false)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await getPortfolio(pageName)
        if (!cancelled) setPortfolio(data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load portfolio.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [pageName])

  return (
    <div className="page page--public">
      <Navbar variant="minimal" />

      <main className="public-page__main" aria-label="Portfolio page">
        {loading && <LoadingSkeleton />}

        {error && !loading && (
          <div
            className="form-error"
            role="alert"
            style={{ maxWidth: 400, borderRadius: 'var(--radius-lg)' }}
          >
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {portfolio && !loading && (
          <article className="public-page__content">
            <div className="public-page__hero">
              <div className="public-page__avatar" aria-hidden="true">
                {portfolio.name.charAt(0).toUpperCase()}
              </div>

              <h1 className="public-page__name">{portfolio.name}</h1>
              <p className="public-page__header">{portfolio.header}</p>
              <p className="public-page__subheader">{portfolio.subheader}</p>

              <div className="public-page__cta">
                <Button
                  size="lg"
                  onClick={() => setCalendlyOpen(true)}
                  leftIcon={<Calendar size={16} />}
                  id="get-in-touch-btn"
                >
                  Get In Touch
                </Button>
              </div>
            </div>
          </article>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="public-page__footer">
        <Link to="/" className="public-page__branding" aria-label="Built with PortfolioGen">
          <Sparkles size={12} aria-hidden="true" />
          Built with PortfolioGen
        </Link>
        {portfolio && (
          <span className="public-page__slug" aria-label="Page URL slug">
            /page/{portfolio.pageName}
          </span>
        )}
      </footer>

      {/* ── Calendly modal ── */}
      <Modal
        isOpen={calendlyOpen}
        onClose={() => setCalendlyOpen(false)}
        title="Schedule a call"
        wide
      >
        <iframe
          title="Calendly scheduling"
          className="calendly-embed"
          src="https://calendly.com/calendly-demo/30min?hide_gdpr_banner=1"
          loading="lazy"
        />
      </Modal>
    </div>
  )
}
