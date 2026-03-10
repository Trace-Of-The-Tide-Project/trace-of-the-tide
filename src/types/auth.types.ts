/**
 * Auth API request/response types
 */

export interface SignupRequest {
  username: string
  email: string
  password: string
  full_name: string
  phone_number: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  username: string
  full_name?: string
  email: string
  roles?: string[]
}

export interface AuthResponse {
  access_token: string
  user: AuthUser
}
