import type { PortfolioFormData } from '../types'
import { Calendar } from 'lucide-react'

interface PortfolioPreviewProps {
  data: PortfolioFormData
}

export default function PortfolioPreview({ data }: PortfolioPreviewProps) {
  const slug =
    data.pageName.trim().toLowerCase().replace(/\s+/g, '-') || 'your-page'
  const initial = (data.name || 'Y').charAt(0).toUpperCase()

  return (
    <div className="portfolio-preview">
      <div className="section-header">
        <h2 className="section-header__title">Live preview</h2>
        <p className="section-header__subtitle">Updates as you type</p>
      </div>

      <div className="portfolio-preview__card">
        {/* Browser chrome */}
        <div className="portfolio-preview__chrome">
          <div className="preview-dots">
            <span className="preview-dot" />
            <span className="preview-dot" />
            <span className="preview-dot" />
          </div>
          <div className="preview-url">
            portfoliogen.app/page/{slug}
          </div>
        </div>

        {/* Page body */}
        <div className="portfolio-preview__body">
          <div className="portfolio-preview__avatar">{initial}</div>
          <h3 className="portfolio-preview__name">
            {data.name || 'Your Name'}
          </h3>
          <p className="portfolio-preview__role">
            {data.header || 'Your headline goes here'}
          </p>
          <p className="portfolio-preview__bio">
            {data.subheader || 'Your about text will appear here.'}
          </p>
          <span className="portfolio-preview__btn">
            <Calendar size={12} />
            Get In Touch
          </span>
        </div>
      </div>
    </div>
  )
}
