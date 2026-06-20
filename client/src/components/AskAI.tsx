import { useState } from 'react'
import { askAI } from '../services/api'
import Button from './Button'

interface AskAIProps {
  onApply: (header: string, subheader: string) => void
}

export default function AskAI({ onApply }: AskAIProps) {
  const [prompt, setPrompt] = useState('')
  const [header, setHeader] = useState('')
  const [subheader, setSubheader] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAsk = async () => {
    setError('')
    setLoading(true)

    try {
      const result = await askAI(prompt)
      setHeader(result.header)
      setSubheader(result.subheader)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ask-ai">
      <div className="section-header">
        <h2 className="section-header__title">AI assistant</h2>
        <p className="section-header__subtitle">
          Generate header and subheader copy from a short prompt.
        </p>
      </div>

      <div className="ask-ai__input-row">
        <input
          className="ask-ai__prompt"
          type="text"
          placeholder="e.g. Full-stack developer specializing in React and Node"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleAsk()
          }}
        />
        <Button onClick={handleAsk} disabled={loading}>
          {loading ? 'Thinking…' : 'Ask AI'}
        </Button>
      </div>

      {error && <p className="form-error">{error}</p>}

      {(header || subheader) && (
        <div className="ask-ai__result">
          <div className="ask-ai__result-header">
            <span className="badge">Generated</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onApply(header, subheader)}
            >
              Apply to form
            </Button>
          </div>
          <div className="ask-ai__output">
            <div>
              <span className="ask-ai__label">Header</span>
              <p className="ask-ai__text">{header}</p>
            </div>
            <div>
              <span className="ask-ai__label">Subheader</span>
              <p className="ask-ai__text">{subheader}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
