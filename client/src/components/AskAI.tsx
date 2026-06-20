import { useState } from 'react'
import { Sparkles, Zap, RotateCcw } from 'lucide-react'
import { askAI } from '../services/api'
import Button from './Button'
import Skeleton from './Skeleton'

interface AskAIProps {
  onApply: (header: string, subheader: string) => void
}

const EXAMPLE_PROMPTS = [
  'Full-stack engineer, 5yrs React & Node, built SaaS products',
  'UX designer focused on B2B dashboards and design systems',
  'Product manager at a startup, previously in consulting',
]

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

  const handleReset = () => {
    setHasResult(false)
    setHeader('')
    setSubheader('')
    setError('')
    setPrompt('')
  }

  const handleExample = (example: string) => {
    setPrompt(example)
  }

  return (
    <div className="ask-ai">
      {/* Header */}
      <div className="ask-ai__header">
        <div className="ask-ai__header-icon" aria-hidden="true">
          <Sparkles size={16} />
        </div>
        <div>
          <h2 className="ask-ai__title">AI Copy Assistant</h2>
        </div>
        {hasResult && (
          <button
            className="ask-ai__reset"
            onClick={handleReset}
            aria-label="Start over"
            title="Start over"
          >
            <RotateCcw size={14} />
          </button>
        )}
      </div>

      <p className="ask-ai__subtitle">
        Describe your background and AI will write professional copy for your portfolio.
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

        {/* Example chips */}
        {!prompt && (
          <div className="ask-ai__examples" aria-label="Example prompts">
            {EXAMPLE_PROMPTS.map((ex) => (
              <button
                key={ex}
                className="ask-ai__example-chip"
                onClick={() => handleExample(ex)}
                type="button"
              >
                {ex}
              </button>
            ))}
          </div>
        )}

        <div className="ask-ai__btn-row">
          <span className="ask-ai__shortcut" aria-label="Keyboard shortcut">
            <kbd>⌘</kbd> <kbd>↵</kbd> to generate
          </span>
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
            <Skeleton variant="text" width="35%" height={10} />
            <Skeleton variant="text" width="100%" height={15} />
          </div>
          <div className="ask-ai__skeleton-row">
            <Skeleton variant="text" width="35%" height={10} />
            <Skeleton variant="text" width="100%" height={14} />
            <Skeleton variant="text" width="75%" height={14} />
          </div>
        </div>
      )}

      {/* Result */}
      {hasResult && !loading && (
        <div className="ask-ai__result">
          <div className="ask-ai__result-top">
            <span className="badge">
              <Sparkles size={10} style={{ marginRight: 4 }} />
              Generated
            </span>
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
          <Sparkles className="ask-ai__empty-icon" size={22} />
          <p>AI-generated copy will appear here.</p>
          <p className="ask-ai__empty-hint">
            Type your background above and hit <strong>Ask AI</strong>.
          </p>
        </div>
      )}
    </div>
  )
}
