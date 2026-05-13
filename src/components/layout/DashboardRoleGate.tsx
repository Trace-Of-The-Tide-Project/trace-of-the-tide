"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  AUTH_STATE_CHANGED_EVENT,
  getStoredUser,
} from "@/services/auth.service";
import { isAdminDashboardUser } from "@/lib/auth/admin-access";
import { normalizeAppPathname } from "@/lib/i18n/strip-locale-from-path";

export function DashboardRoleGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  const syncAccess = useCallback(() => {
    const path = normalizeAppPathname(pathname) ?? "/";
    const user = getStoredUser();

    if (isAdminDashboardUser(user)) {
      setAllowed(true);
      return;
    }

    if (path.startsWith("/admin") || path.startsWith("/profile")) {
      setAllowed(false);
      router.replace("/contribute");
      return;
    }

    setAllowed(true);
  }, [pathname, router]);

  useEffect(() => {
    syncAccess();
    const onChange = () => syncAccess();
    window.addEventListener("storage", onChange);
    window.addEventListener(AUTH_STATE_CHANGED_EVENT, onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener(AUTH_STATE_CHANGED_EVENT, onChange);
    };
  }, [syncAccess]);

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}
