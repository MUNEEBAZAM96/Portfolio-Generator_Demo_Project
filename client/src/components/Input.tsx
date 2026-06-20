import { useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export default function Input({
  label,
  error,
  hint,
  id,
  type,
  className = '',
  ...props
}: InputProps) {
  const inputId = id ?? props.name
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      <label htmlFor={inputId} className="field__label">
        {label}
      </label>

      <div className="field__input-wrap">
        <input
          id={inputId}
          type={resolvedType}
          className={`field__input ${className}`.trim()}
          style={isPassword ? { paddingRight: '2.5rem' } : undefined}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            className="field__eye-toggle"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {hint && !error && (
        <span id={`${inputId}-hint`} className="field__hint">
          {hint}
        </span>
      )}

      {error && (
        <span id={`${inputId}-error`} className="field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
