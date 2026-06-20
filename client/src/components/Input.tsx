import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export default function Input({ label, error, id, className = '', ...props }: InputProps) {
  const inputId = id ?? props.name

  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      <label htmlFor={inputId} className="field__label">
        {label}
      </label>
      <input id={inputId} className={`field__input ${className}`.trim()} {...props} />
      {error && <span className="field__error">{error}</span>}
    </div>
  )
}
