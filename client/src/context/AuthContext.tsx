/**
 * AuthContext — Clerk-backed implementation
 *
 * This is a thin bridge that exposes the same interface as before
 * (isAuthenticated, user, isLoading, logout) but delegates to Clerk under the
 * hood. The legacy email/password login() and signup() methods are kept as
 * no-ops so nothing breaks during the transition — auth is now handled by
 * Clerk's hosted UI (SignIn / SignUp components).
 */
import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import { useAuth as useClerkAuth, useUser, useClerk } from '@clerk/react'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  /** @deprecated – auth is now handled by Clerk's hosted UI */
  login: (email: string, password: string) => Promise<void>
  /** @deprecated – auth is now handled by Clerk's hosted UI */
  signup: (email: string, password: string, confirmPassword: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useClerkAuth()
  const { user: clerkUser } = useUser()
  const { signOut } = useClerk()

  const user: User | null = useMemo(() => {
    if (!clerkUser) return null
    return {
      id: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress ?? clerkUser.id,
    }
  }, [clerkUser])

  const logout = () => {
    signOut({ redirectUrl: '/' })
  }

  // Legacy stubs — Clerk's <SignIn /> / <SignUp /> handle auth now.
  const login = async (_email: string, _password: string) => {
    console.warn('login() is deprecated. Use Clerk sign-in instead.')
  }
  const signup = async (_email: string, _password: string, _confirm: string) => {
    console.warn('signup() is deprecated. Use Clerk sign-up instead.')
  }

  const value = useMemo(
    () => ({
      user,
      token: null, // Clerk manages tokens internally; use getToken() if needed
      isAuthenticated: Boolean(isSignedIn),
      isLoading: !isLoaded,
      login,
      signup,
      logout,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, isSignedIn, isLoaded],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
