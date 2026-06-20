import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '@clerk/react'
import AskAI from '../components/AskAI'
import Button from '../components/Button'
import Navbar from '../components/Navbar'
import PortfolioForm from '../components/PortfolioForm'
import PortfolioPreview from '../components/PortfolioPreview'
import Toast, { useToast } from '../components/Toast'
import { deployPortfolio, saveDraft } from '../services/api'
import type { PortfolioFormData } from '../types'
import { Save, Globe, Link2, CheckCircle } from 'lucide-react'

const initialForm: PortfolioFormData = {
  pageName: '',
  name: '',
  header: '',
  subheader: '',
}

export default function Dashboard() {
  const { user: clerkUser } = useUser()
  const userEmail = clerkUser?.primaryEmailAddress?.emailAddress ?? clerkUser?.id ?? ''
  const { toasts, addToast, dismissToast } = useToast()
  const [formData, setFormData] = useState<PortfolioFormData>(initialForm)
  const [loading, setLoading] = useState<'draft' | 'deploy' | null>(null)
  const [deployedSlug, setDeployedSlug] = useState('')

  const handleChange = (field: keyof PortfolioFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleApplyAI = (header: string, subheader: string) => {
    setFormData((prev) => ({ ...prev, header, subheader }))
    addToast('AI copy applied to your form.', 'success')
  }

  const handleSaveDraft = async () => {
    setLoading('draft')
    try {
      const portfolio = await saveDraft(formData)
      addToast(`Draft saved for /page/${portfolio.pageName}`, 'success')
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to save draft.', 'error')
    } finally {
      setLoading(null)
    }
  }

  const handleDeploy = async () => {
    setLoading('deploy')
    try {
      const portfolio = await deployPortfolio(formData)
      setDeployedSlug(portfolio.pageName)
      addToast(`🚀 Deployed! Live at /page/${portfolio.pageName}`, 'success')
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to deploy.', 'error')
    } finally {
      setLoading(null)
    }
  }

  const slug = formData.pageName.trim().toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="page page--dashboard">
      <Navbar variant="app" />

      <div className="dashboard-shell">
        {/* ── Top header ── */}
        <header className="dashboard__top">
          <div className="dashboard__title-block">
            <h1>Portfolio Builder</h1>
            <p className="dashboard__welcome">
              <CheckCircle size={13} style={{ color: 'var(--success)' }} />
              Signed in as <strong>{userEmail}</strong>
            </p>
          </div>

          <div className="dashboard__actions">
            <Button
              variant="secondary"
              size="md"
              onClick={handleSaveDraft}
              disabled={loading !== null}
              loading={loading === 'draft'}
              leftIcon={<Save size={15} />}
              id="save-draft-btn"
            >
              Save Draft
            </Button>
            <Button
              size="md"
              onClick={handleDeploy}
              disabled={loading !== null}
              loading={loading === 'deploy'}
              leftIcon={<Globe size={15} />}
              id="deploy-btn"
            >
              Deploy
            </Button>
          </div>
        </header>

        {/* ── Slug chip ── */}
        {(slug || deployedSlug) && (
          <div className="slug-chip" aria-label="Public portfolio URL">
            <Link2 size={12} aria-hidden="true" />
            <span>portfoliogen.app/page/</span>
            <Link
              to={`/page/${deployedSlug || slug}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View live page at /page/${deployedSlug || slug}`}
            >
              {deployedSlug || slug}
            </Link>
            {deployedSlug && (
              <span className="badge badge--success" style={{ marginLeft: 4 }}>
                Live
              </span>
            )}
          </div>
        )}

        {/* ── Main grid ── */}
        <div className="dashboard__grid">
          {/* Left – form */}
          <section className="dashboard__panel" aria-label="Portfolio form">
            <PortfolioForm data={formData} onChange={handleChange} />
          </section>

          {/* Right – AI + preview (sticky) */}
          <div className="dashboard__side-stack">
            <section className="dashboard__panel" aria-label="AI assistant">
              <AskAI onApply={handleApplyAI} />
            </section>

            <section className="dashboard__panel" aria-label="Live preview">
              <PortfolioPreview data={formData} />
            </section>
          </div>
        </div>
      </div>

      {/* ── Toast notifications ── */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
