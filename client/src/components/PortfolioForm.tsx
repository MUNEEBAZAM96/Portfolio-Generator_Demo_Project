import type { PortfolioFormData } from '../types'
import Input from './Input'
import { User, AlignLeft } from 'lucide-react'

interface PortfolioFormProps {
  data: PortfolioFormData
  onChange: (field: keyof PortfolioFormData, value: string) => void
}

// Calculate form completion % to show users their progress
function calcCompletion(data: PortfolioFormData): number {
  const fields: (keyof PortfolioFormData)[] = ['pageName', 'name', 'header', 'subheader']
  const filled = fields.filter((f) => data[f].trim().length > 0).length
  return Math.round((filled / fields.length) * 100)
}

export default function PortfolioForm({ data, onChange }: PortfolioFormProps) {
  const completion = calcCompletion(data)
  const isComplete = completion === 100

  return (
    <div className="portfolio-form">
      {/* Header with progress */}
      <div className="portfolio-form__header">
        <div>
          <h2 className="section-header__title">Portfolio details</h2>
          <p className="section-header__subtitle">
            Fill in your info. Changes reflect in the live preview instantly.
          </p>
        </div>

        {/* Completion pill */}
        <div
          className={`portfolio-form__progress-pill ${isComplete ? 'portfolio-form__progress-pill--done' : ''}`}
          aria-label={`Form ${completion}% complete`}
        >
          <span
            className="portfolio-form__progress-bar"
            style={{ width: `${completion}%` }}
          />
          <span className="portfolio-form__progress-label">
            {isComplete ? '✓ Ready to deploy' : `${completion}% complete`}
          </span>
        </div>
      </div>

      <div className="portfolio-form__grid">
        {/* ── Identity group ── */}
        <div className="portfolio-form__group">
          <p className="portfolio-form__group-label">
            <User size={11} aria-hidden="true" />
            Identity
          </p>
          <div className="portfolio-form__fields">
            <Input
              label="Full name"
              name="name"
              placeholder="Jane Smith"
              value={data.name}
              onChange={(e) => onChange('name', e.target.value)}
              hint="Your display name on your public page."
              maxLength={100}
              showCount
            />
            <Input
              label="Page slug"
              name="pageName"
              placeholder="jane-smith"
              value={data.pageName}
              onChange={(e) => onChange('pageName', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              hint="Your public URL: /page/jane-smith"
              maxLength={50}
              showCount
            />
          </div>
        </div>

        <div className="portfolio-form__divider" />

        {/* ── Content group ── */}
        <div className="portfolio-form__group">
          <p className="portfolio-form__group-label">
            <AlignLeft size={11} aria-hidden="true" />
            Content
          </p>
          <div className="portfolio-form__fields">
            <Input
              label="Headline"
              name="header"
              placeholder="Senior Product Designer"
              value={data.header}
              onChange={(e) => onChange('header', e.target.value)}
              hint="Short professional title shown under your name."
              maxLength={120}
              showCount
            />
            <Input
              as="textarea"
              label="About / Subheader"
              name="subheader"
              placeholder="I craft delightful digital experiences that users actually want to use…"
              value={data.subheader}
              onChange={(e) => onChange('subheader', e.target.value)}
              hint="A few sentences about yourself and your work."
              rows={4}
              maxLength={400}
              showCount
            />
          </div>
        </div>
      </div>
    </div>
  )
}
