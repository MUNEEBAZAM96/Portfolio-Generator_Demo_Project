import type { PortfolioFormData } from '../types'
import Input from './Input'

interface PortfolioFormProps {
  data: PortfolioFormData
  onChange: (field: keyof PortfolioFormData, value: string) => void
}

export default function PortfolioForm({ data, onChange }: PortfolioFormProps) {
  return (
    <div className="portfolio-form">
      <div className="section-header">
        <h2 className="section-header__title">Portfolio details</h2>
        <p className="section-header__subtitle">
          Fill in your info. Changes reflect in the live preview instantly.
        </p>
      </div>

      <div className="portfolio-form__grid">
        {/* Identity group */}
        <div>
          <p className="portfolio-form__group-label">Identity</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input
              label="Full name"
              name="name"
              placeholder="Jane Smith"
              value={data.name}
              onChange={(event) => onChange('name', event.target.value)}
              hint="Your display name on your public page."
            />
            <Input
              label="Page slug"
              name="pageName"
              placeholder="jane-smith"
              value={data.pageName}
              onChange={(event) => onChange('pageName', event.target.value)}
              hint="Used in your public URL: /page/jane-smith"
            />
          </div>
        </div>

        <div className="portfolio-form__divider" />

        {/* Copy group */}
        <div>
          <p className="portfolio-form__group-label">Content</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input
              label="Headline"
              name="header"
              placeholder="Senior Product Designer"
              value={data.header}
              onChange={(event) => onChange('header', event.target.value)}
              hint="Short title shown under your name."
            />
            <Input
              label="About / Subheader"
              name="subheader"
              placeholder="I craft delightful digital experiences..."
              value={data.subheader}
              onChange={(event) => onChange('subheader', event.target.value)}
              hint="A sentence or two about yourself."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
