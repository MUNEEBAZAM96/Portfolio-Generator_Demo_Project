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
          Configure your public page slug and content.
        </p>
      </div>

      <div className="portfolio-form__grid">
        <Input
          label="Page name (slug)"
          name="pageName"
          placeholder="john-doe"
          value={data.pageName}
          onChange={(event) => onChange('pageName', event.target.value)}
        />
        <Input
          label="Full name"
          name="name"
          placeholder="John Doe"
          value={data.name}
          onChange={(event) => onChange('name', event.target.value)}
        />
        <Input
          label="Header"
          name="header"
          placeholder="Senior Product Designer"
          value={data.header}
          onChange={(event) => onChange('header', event.target.value)}
        />
        <Input
          label="Subheader"
          name="subheader"
          placeholder="I craft delightful digital experiences..."
          value={data.subheader}
          onChange={(event) => onChange('subheader', event.target.value)}
        />
      </div>
    </div>
  )
}
