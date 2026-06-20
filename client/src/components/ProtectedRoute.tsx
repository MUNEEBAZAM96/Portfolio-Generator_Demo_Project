import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/react'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useAuth()

  // Still loading Clerk session — render nothing to avoid flash
  if (!isLoaded) return null

  if (!isSignedIn) {
    return <Navigate to="/login" replace />
  }

  return children
}
