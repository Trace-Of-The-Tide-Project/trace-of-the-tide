import { api } from "./api"
import type {
  SignupRequest,
  LoginRequest,
  AuthResponse,
  AuthUser,
} from "@/types/auth.types"

const AUTH_TOKEN_KEY = "access_token"
const AUTH_USER_KEY = "auth_user"
export const AUTH_STATE_CHANGED_EVENT = "auth-state-changed"
type AuthStorageMode = "local" | "session"

function emitAuthStateChanged(): void {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(AUTH_STATE_CHANGED_EVENT))
}

function getStorage(mode: AuthStorageMode): Storage | null {
  if (typeof window === "undefined") return null
  return mode === "local" ? window.localStorage : window.sessionStorage
}

function readStoredValue(key: string): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key)
}

function writeStoredValue(key: string, value: string, mode: AuthStorageMode): void {
  const target = getStorage(mode)
  const other = getStorage(mode === "local" ? "session" : "local")
  target?.setItem(key, value)
  other?.removeItem(key)
}

export function getStoredToken(): string | null {
  return readStoredValue(AUTH_TOKEN_KEY)
}

export function setStoredToken(token: string, mode: AuthStorageMode = "local"): void {
  if (typeof window === "undefined") return
  writeStoredValue(AUTH_TOKEN_KEY, token, mode)
  emitAuthStateChanged()
}

export function clearStoredToken(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_TOKEN_KEY)
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
  emitAuthStateChanged()
}

export function getStoredUser(): AuthUser | null {
  const raw = readStoredValue(AUTH_USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function setStoredUser(user: AuthUser, mode: AuthStorageMode = "local"): void {
  if (typeof window === "undefined") return
  writeStoredValue(AUTH_USER_KEY, JSON.stringify(user), mode)
  emitAuthStateChanged()
}

export function clearStoredAuth(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
  sessionStorage.removeItem(AUTH_USER_KEY)
  emitAuthStateChanged()
}

/** Raw API response may wrap in data and use camelCase or snake_case */
interface SignupApiResponse {
  data?: {
    accessToken?: string
    access_token?: string
    user?: AuthUser
    message?: string
  }
  accessToken?: string
  access_token?: string
  user?: AuthUser
  message?: string
  error?: string
}

async function createHttpError(res: Response): Promise<Error & {
  response?: { status: number; data: unknown }
}> {
  const errorData = await res.json().catch(() => ({}))
  const backendMessage =
    (errorData as { data?: { message?: string }; message?: string; error?: string }).data
      ?.message ??
    (errorData as { message?: string }).message ??
    (errorData as { error?: string }).error

  const err = new Error(backendMessage ?? res.statusText) as Error & {
    response?: { status: number; data: unknown }
  }
  err.response = { status: res.status, data: errorData }
  return err
}

function normalizeAuthResponse(
  raw: SignupApiResponse,
  storageMode: AuthStorageMode = "local"
): AuthResponse {
  const inner = raw?.data ?? raw
  const token =
    inner?.access_token ?? inner?.accessToken ?? raw?.access_token ?? raw?.accessToken
  const user = inner?.user ?? raw?.user

  if (token) {
    setStoredToken(token, storageMode)
  }

  if (!user) {
    throw new Error("Invalid auth response: missing user")
  }

  setStoredUser(user, storageMode)

  return {
    access_token: token ?? "",
    user: {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      email: user.email,
      roles: user.roles,
    },
  }
}

/**
 * POST /auth/signup - Register a new user
 * Stores access_token in localStorage and returns normalized AuthResponse
 */
export async function signup(data: SignupRequest): Promise<AuthResponse> {
  const payload = {
    username: data.username,
    email: data.email,
    password: data.password,
    full_name: data.full_name,
  }

  let raw: SignupApiResponse
  if (typeof window !== "undefined") {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      throw await createHttpError(res)
    }
    raw = await res.json()
  } else {
    const response = await api.post<SignupApiResponse>("/auth/signup", payload)
    raw = response.data
  }
  return normalizeAuthResponse(raw, "local")
}

/**
 * POST /auth/login - Authenticate user
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  let raw: SignupApiResponse

  if (typeof window !== "undefined") {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      throw await createHttpError(res)
    }
    raw = await res.json()
  } else {
    const response = await api.post<SignupApiResponse>("/auth/login", data)
    raw = response.data
  }

  return normalizeAuthResponse(raw, "local")
}

/**
 * POST /auth/logout - Invalidate session (placeholder for future implementation)
 */
// export async function logout(): Promise<void> { clearStoredToken(); ... }

/**
 * POST /auth/refresh - Refresh access token (placeholder for future implementation)
 */
// export async function refreshToken(): Promise<AuthResponse> { ... }
