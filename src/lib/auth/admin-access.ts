import type { AuthUser } from "@/types/auth.types";
import { stripLocalePrefixesFromPath } from "@/lib/i18n/strip-locale-from-path";

export function isAdminDashboardUser(user: AuthUser | null | undefined): boolean {
  if (!user) return false;

  const roles = user.roles ?? [];
  if (roles.some((role) => /super_?\s*admin|admin|moderator/i.test(String(role)))) {
    return true;
  }

  const persona = `${user.full_name ?? ""} ${user.username ?? ""}`.toLowerCase();
  return persona.includes("super admin") || persona.includes("admin");
}

export function isDashboardPath(pathname: string | null | undefined): boolean {
  const path = stripLocalePrefixesFromPath(pathname?.trim() ?? "");
  return path.startsWith("/admin") || path.startsWith("/profile");
}

export function resolvePostLoginHref(
  user: AuthUser | null | undefined,
  callbackUrl?: string | null,
): string {
  const requested = stripLocalePrefixesFromPath(callbackUrl?.trim() ?? "");
  const fallback = isAdminDashboardUser(user) ? "/admin" : "/contribute";

  if (!requested || requested === "/") {
    return fallback;
  }

  if (isAdminDashboardUser(user)) {
    return requested;
  }

  if (requested.startsWith("/admin") || requested.startsWith("/profile")) {
    return "/contribute";
  }

  return requested;
}
