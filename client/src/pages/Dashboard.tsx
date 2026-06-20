import { useState } from 'react'
import { Link } from 'react-router-dom'
import AskAI from '../components/AskAI'
import Button from '../components/Button'
import Navbar from '../components/Navbar'
import PortfolioForm from '../components/PortfolioForm'
import PortfolioPreview from '../components/PortfolioPreview'
import { useAuth } from '../context/AuthContext'
import { deployPortfolio, saveDraft } from '../services/api'
import type { PortfolioFormData } from '../types'

const initialForm: PortfolioFormData = {
  pageName: '',
  name: '',
  header: '',
  subheader: '',
}

export default function Dashboard() {
  const { logout, user } = useAuth()
  const [formData, setFormData] = useState<PortfolioFormData>(initialForm)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState<'draft' | 'deploy' | null>(null)

  const handleChange = (field: keyof PortfolioFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleApplyAI = (header: string, subheader: string) => {
    setFormData((prev) => ({ ...prev, header, subheader }))
    setStatus('AI copy applied to your form.')
  }

  const handleSaveDraft = async () => {
    setError('')
    setStatus('')
    setLoading('draft')

    try {
      const portfolio = await saveDraft(formData)
      setStatus(`Draft saved for /page/${portfolio.pageName}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save draft.')
    } finally {
      setLoading(null)
    }
  }

  const handleDeploy = async () => {
    setError('')
    setStatus('')
    setLoading('deploy')

    try {
      const portfolio = await deployPortfolio(formData)
      setStatus(`Deployed! View at /page/${portfolio.pageName}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deploy.')
    } finally {
      setLoading(null)
    }
  }

  const slug = formData.pageName.trim().toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="page page--dashboard">
      <Navbar variant="app" />

      <main className="dashboard">
        <header className="dashboard__header">
          <div>
            <h1>Dashboard</h1>
            <p className="dashboard__welcome">Signed in as {user?.email}</p>
          </div>
          <div className="dashboard__actions">
            <Button
              variant="secondary"
              onClick={handleSaveDraft}
              disabled={loading !== null}
            >
              {loading === 'draft' ? 'Saving…' : 'Save Draft'}
            </Button>
            <Button onClick={handleDeploy} disabled={loading !== null}>
              {loading === 'deploy' ? 'Deploying…' : 'Deploy'}
            </Button>
            <Button variant="ghost" onClick={logout}>
              Log out
            </Button>
          </div>
        </header>

        {status && <p className="form-success">{status}</p>}
        {error && <p className="form-error">{error}</p>}

        {slug && (
          <p className="dashboard__link">
            Public URL:{' '}
            <Link to={`/page/${slug}`} target="_blank">
              /page/{slug}
            </Link>
          </p>
        )}

        <div className="dashboard__grid">
          <section className="dashboard__panel">
            <PortfolioForm data={formData} onChange={handleChange} />
          </section>

          <section className="dashboard__panel dashboard__panel--side">
            <AskAI onApply={handleApplyAI} />
            <PortfolioPreview data={formData} />
          </section>
        </div>
      </main>
    </div>
  )
}
