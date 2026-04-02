import type { AuthUser } from "@/types/auth.types";

/** Navbar user chip: admins / super-admin personas → dashboard. */
export function getNavAccountHref(user: AuthUser): string {
  const roles = user.roles ?? [];
  if (roles.some((r) => /super_?\s*admin|admin|moderator/i.test(String(r)))) {
    return "/admin";
  }
  const persona = `${user.full_name ?? ""} ${user.username ?? ""}`.toLowerCase();
  if (persona.includes("super admin") || persona.includes("admin")) {
    return "/admin";
  }
  return "/profile";
}
