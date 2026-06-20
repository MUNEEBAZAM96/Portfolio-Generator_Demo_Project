import type { PortfolioFormData } from '../types'

interface PortfolioPreviewProps {
  data: PortfolioFormData
}

export default function PortfolioPreview({ data }: PortfolioPreviewProps) {
  const slug = data.pageName.trim().toLowerCase().replace(/\s+/g, '-') || 'your-page'

  return (
    <div className="portfolio-preview">
      <div className="section-header">
        <h2 className="section-header__title">Live preview</h2>
        <p className="section-header__subtitle">portfolio-gen.app/page/{slug}</p>
      </div>

      <div className="portfolio-preview__card">
        <div className="portfolio-preview__hero">
          <span className="portfolio-preview__avatar">
            {(data.name || 'Y').charAt(0).toUpperCase()}
          </span>
          <h3 className="portfolio-preview__name">{data.name || 'Your Name'}</h3>
          <p className="portfolio-preview__header">
            {data.header || 'Your headline goes here'}
          </p>
          <p className="portfolio-preview__subheader">
            {data.subheader || 'Your subheader will appear here.'}
          </p>
        </div>
      </div>
    </div>
  )
}
