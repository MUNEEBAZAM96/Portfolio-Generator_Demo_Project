import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface CommonProps {
  label: string
  error?: string
  hint?: string
  showCount?: boolean
  id?: string
  name?: string
  maxLength?: number
  value?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

interface InputMode extends CommonProps, Omit<InputHTMLAttributes<HTMLInputElement>, keyof CommonProps | 'onChange'> {
  as?: 'input'
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

interface TextareaMode extends CommonProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof CommonProps | 'onChange'> {
  as: 'textarea'
  rows?: number
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
}

type FieldProps = InputMode | TextareaMode

export default function Input(fieldProps: FieldProps) {
  const { label, error, hint, id, name, maxLength, showCount, value = '', as = 'input' } = fieldProps
  const inputId = id ?? name
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = as === 'input' && (fieldProps as InputMode).type === 'password'
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : (fieldProps as InputMode).type

  const charCount = String(value).length

  const descId = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      <label htmlFor={inputId} className="field__label">
        {label}
        {showCount && maxLength && (
          <span className="field__count" aria-live="polite">
            {charCount}/{maxLength}
          </span>
        )}
      </label>

      <div className="field__input-wrap">
        {as === 'textarea' ? (
          <textarea
            id={inputId}
            name={name}
            value={value}
            maxLength={maxLength}
            rows={(fieldProps as TextareaMode).rows ?? 3}
            placeholder={(fieldProps as TextareaMode).placeholder}
            onChange={(fieldProps as TextareaMode).onChange}
            className="field__input"
            aria-describedby={descId}
            aria-invalid={error ? 'true' : undefined}
          />
        ) : (
          <input
            {...(fieldProps as Omit<InputMode, 'as' | 'label' | 'error' | 'hint' | 'showCount'>)}
            id={inputId}
            name={name}
            value={value}
            maxLength={maxLength}
            type={resolvedType}
            className="field__input"
            style={isPassword ? { paddingRight: '2.5rem' } : undefined}
            aria-describedby={descId}
            aria-invalid={error ? 'true' : undefined}
          />
        )}

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
