import { useEffect, useState, useCallback, type ReactNode } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  type: ToastType
  message: string
}

interface ToastProps {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

function ToastIcon({ type }: { type: ToastType }) {
  if (type === 'success') return <CheckCircle size={16} />
  if (type === 'error')   return <XCircle size={16} />
  return <Info size={16} />
}

function SingleToast({
  toast,
  onDismiss,
}: {
  toast: ToastItem
  onDismiss: (id: string) => void
}) {
  const [exiting, setExiting] = useState(false)

  const dismiss = useCallback(() => {
    setExiting(true)
    setTimeout(() => onDismiss(toast.id), 250)
  }, [toast.id, onDismiss])

  useEffect(() => {
    const timer = setTimeout(dismiss, 4000)
    return () => clearTimeout(timer)
  }, [dismiss])

  return (
    <div
      className={`toast toast--${toast.type} ${exiting ? 'toast--exiting' : ''}`}
      role="alert"
      aria-live="polite"
    >
      <span className={`toast__icon toast__icon--${toast.type}`}>
        <ToastIcon type={toast.type} />
      </span>
      <span className="toast__message">{toast.message}</span>
      <button
        className="toast__close"
        onClick={dismiss}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null

  return (
    <div className="toast-container" aria-live="polite" aria-label="Notifications">
      {toasts.map((t) => (
        <SingleToast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

// ── hook ──────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
    setToasts((prev) => [...prev, { id, type, message }])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, addToast, dismissToast }
}

// ── provider (optional wrapper) ───────────────────
export function ToastContainer({ children, toasts, onDismiss }: {
  children: ReactNode
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}) {
  return (
    <>
      {children}
      <Toast toasts={toasts} onDismiss={onDismiss} />
    </>
  )
}
