/**
 * Backend (Nest) API base URL for auth and other API calls.
 * Set NEXT_PUBLIC_API_URL in .env (e.g. http://localhost:3001).
 */
export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
}

export const authEndpoints = {
  /** POST body: { firstName, lastName, email, password } */
  register: () => `${getApiUrl()}/auth/register`,
  /** POST body: { email, password } - used by NextAuth authorize */
  login: () => `${getApiUrl()}/auth/login`,
  /** POST body: { email } */
  forgotPassword: () => `${getApiUrl()}/auth/forgot-password`,
  /** POST body: { token, password } */
  resetPassword: () => `${getApiUrl()}/auth/reset-password`,
} as const
