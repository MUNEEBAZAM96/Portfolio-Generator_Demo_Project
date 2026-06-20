import type { AIResponse, AuthResponse, Portfolio, PortfolioFormData } from '../types'

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'
const PORTFOLIOS_KEY = 'portfolios'

const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms))

function getPortfoliosStore(): Record<string, Portfolio> {
  const raw = localStorage.getItem(PORTFOLIOS_KEY)
  return raw ? (JSON.parse(raw) as Record<string, Portfolio>) : {}
}

function savePortfoliosStore(store: Record<string, Portfolio>) {
  localStorage.setItem(PORTFOLIOS_KEY, JSON.stringify(store))
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

export function clearAuthStorage() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

function persistAuth({ token, user }: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  await delay()

  if (!email || !password) {
    throw new Error('Email and password are required.')
  }

  if (password.length < 6) {
    throw new Error('Invalid credentials.')
  }

  const response: AuthResponse = {
    token: `mock-token-${crypto.randomUUID()}`,
    user: { id: crypto.randomUUID(), email },
  }

  persistAuth(response)
  return response
}

export async function signup(
  email: string,
  password: string,
  confirmPassword: string,
): Promise<AuthResponse> {
  await delay()

  if (!email || !password || !confirmPassword) {
    throw new Error('All fields are required.')
  }

  if (password !== confirmPassword) {
    throw new Error('Passwords do not match.')
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.')
  }

  const response: AuthResponse = {
    token: `mock-token-${crypto.randomUUID()}`,
    user: { id: crypto.randomUUID(), email },
  }

  persistAuth(response)
  return response
}

export async function saveDraft(data: PortfolioFormData): Promise<Portfolio> {
  await delay()

  if (!data.pageName.trim()) {
    throw new Error('Page name is required.')
  }

  const slug = data.pageName.trim().toLowerCase().replace(/\s+/g, '-')
  const portfolio: Portfolio = {
    pageName: slug,
    name: data.name,
    header: data.header,
    subheader: data.subheader,
    deployed: false,
  }

  const store = getPortfoliosStore()
  store[slug] = portfolio
  savePortfoliosStore(store)

  return portfolio
}

export async function deployPortfolio(data: PortfolioFormData): Promise<Portfolio> {
  await delay(800)

  if (!data.pageName.trim()) {
    throw new Error('Page name is required.')
  }

  const slug = data.pageName.trim().toLowerCase().replace(/\s+/g, '-')
  const portfolio: Portfolio = {
    pageName: slug,
    name: data.name,
    header: data.header,
    subheader: data.subheader,
    deployed: true,
  }

  const store = getPortfoliosStore()
  store[slug] = portfolio
  savePortfoliosStore(store)

  return portfolio
}

export async function askAI(prompt: string): Promise<AIResponse> {
  await delay(900)

  if (!prompt.trim()) {
    throw new Error('Please enter a prompt for the AI.')
  }

  const topic = prompt.trim()

  return {
    header: `Crafting excellence in ${topic}`,
    subheader: `I help teams and clients succeed with ${topic.toLowerCase()} — focused, reliable, and built for impact.`,
  }
}

export async function getPortfolio(pageName: string): Promise<Portfolio> {
  await delay(500)

  const slug = pageName.toLowerCase()
  const store = getPortfoliosStore()
  const portfolio = store[slug]

  if (!portfolio) {
    return {
      pageName: slug,
      name: slug.charAt(0).toUpperCase() + slug.slice(1),
      header: 'Welcome to my portfolio',
      subheader: 'Building meaningful products with care and precision.',
      deployed: true,
    }
  }

  return portfolio
}
