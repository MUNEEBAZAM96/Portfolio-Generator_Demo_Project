import { useState } from 'react'
import { Sparkles, Zap } from 'lucide-react'
import { askAI } from '../services/api'
import Button from './Button'
import Skeleton from './Skeleton'

interface AskAIProps {
  onApply: (header: string, subheader: string) => void
}

export default function AskAI({ onApply }: AskAIProps) {
  const [prompt, setPrompt] = useState('')
  const [header, setHeader] = useState('')
  const [subheader, setSubheader] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasResult, setHasResult] = useState(false)

  const handleAsk = async () => {
    if (!prompt.trim()) return
    setError('')
    setLoading(true)
    setHasResult(false)

    try {
      const result = await askAI(prompt)
      setHeader(result.header)
      setSubheader(result.subheader)
      setHasResult(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = () => {
    onApply(header, subheader)
  }

  return (
    <div className="ask-ai">
      {/* Header */}
      <div className="ask-ai__header">
        <div className="ask-ai__header-icon" aria-hidden="true">
          <Sparkles size={16} />
        </div>
        <div>
          <h2 className="ask-ai__title">AI Assistant</h2>
        </div>
      </div>
      <p className="ask-ai__subtitle">
        Describe yourself and let AI generate professional copy for your portfolio.
      </p>

      {/* Prompt */}
      <div className="ask-ai__prompt-wrap">
        <textarea
          className="ask-ai__prompt"
          placeholder="e.g. Full-stack developer with 5 years building SaaS products in React and Node.js…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAsk()
          }}
          aria-label="AI prompt"
          rows={3}
        />
        <div className="ask-ai__btn-row">
          <Button
            onClick={handleAsk}
            disabled={loading || !prompt.trim()}
            loading={loading}
            size="sm"
            leftIcon={<Zap size={14} />}
          >
            {loading ? 'Generating…' : 'Ask AI'}
          </Button>
        </div>
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      {/* Loading shimmer */}
      {loading && (
        <div className="ask-ai__skeleton">
          <div className="ask-ai__skeleton-row">
            <Skeleton variant="text" width="40%" height={10} />
            <Skeleton variant="text" width="100%" height={14} />
          </div>
          <div className="ask-ai__skeleton-row">
            <Skeleton variant="text" width="40%" height={10} />
            <Skeleton variant="text" width="100%" height={14} />
            <Skeleton variant="text" width="80%" height={14} />
          </div>
        </div>
      )}

      {/* Result */}
      {hasResult && !loading && (
        <div className="ask-ai__result">
          <div className="ask-ai__result-top">
            <span className="badge">Generated</span>
            <Button
              variant="primary"
              size="sm"
              onClick={handleApply}
              leftIcon={<Zap size={12} />}
            >
              Apply to form
            </Button>
          </div>

          <div className="ask-ai__output">
            <div className="ask-ai__field">
              <p className="ask-ai__label">Headline</p>
              <p className="ask-ai__text">{header}</p>
            </div>
            <div className="ask-ai__field">
              <p className="ask-ai__label">About</p>
              <p className="ask-ai__text">{subheader}</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !hasResult && !error && (
        <div className="ask-ai__empty">
          <Sparkles className="ask-ai__empty-icon" size={24} />
          <p>Your AI-generated copy will appear here.</p>
          <p style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}>
            Press ⌘ Enter or click "Ask AI" to generate.
          </p>
        </div>
      )}
    </div>
  )
}
