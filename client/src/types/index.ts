export interface User {
  id: string
  email: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Portfolio {
  pageName: string
  name: string
  header: string
  subheader: string
  deployed?: boolean
}

export interface AIResponse {
  header: string
  subheader: string
}

export interface PortfolioFormData {
  pageName: string
  name: string
  header: string
  subheader: string
}
