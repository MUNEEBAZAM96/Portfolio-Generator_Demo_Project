import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Navbar from '../components/Navbar'
import { getPortfolio } from '../services/api'
import type { Portfolio } from '../types'

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

    return () => {
      cancelled = true
    }
  }, [pageName])

  return (
    <div className="page page--public">
      <Navbar variant="minimal" />

      <main className="public-page">
        {loading && <p className="public-page__status">Loading portfolio…</p>}
        {error && <p className="form-error">{error}</p>}

        {portfolio && !loading && (
          <article className="public-page__content">
            <div className="public-page__hero">
              <span className="public-page__avatar">
                {portfolio.name.charAt(0).toUpperCase()}
              </span>
              <h1 className="public-page__name">{portfolio.name}</h1>
              <p className="public-page__header">{portfolio.header}</p>
              <p className="public-page__subheader">{portfolio.subheader}</p>

              <Button size="lg" onClick={() => setCalendlyOpen(true)}>
                Get In Touch
              </Button>
            </div>

            <footer className="public-page__footer">
              <span>Built with PortfolioGen</span>
              <span>/page/{portfolio.pageName}</span>
            </footer>
          </article>
        )}
      </main>

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
        />
      </Modal>
    </div>
  )
}
