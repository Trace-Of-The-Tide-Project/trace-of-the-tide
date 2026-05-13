import type { AuthUser } from "@/types/auth.types";
import { isAdminDashboardUser } from "@/lib/auth/admin-access";

/** Navbar account chip: admins → dashboard; everyone else → Trace a Story. */
export function getNavAccountHref(user: AuthUser): string {
  return isAdminDashboardUser(user) ? "/admin" : "/contribute";
}
