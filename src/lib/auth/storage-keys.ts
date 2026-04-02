export const AUTH_TOKEN_KEY = "access_token";
export const AUTH_USER_KEY = "auth_user";
export const AUTH_STATE_CHANGED_EVENT = "auth-state-changed";

/** Clears persisted session and notifies `useStoredAuthUser` (same as `clearStoredAuth`). */
export function clearAuthStorageSync(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_USER_KEY);
  window.dispatchEvent(new Event(AUTH_STATE_CHANGED_EVENT));
}
