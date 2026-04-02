"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AUTH_STATE_CHANGED_EVENT, getStoredToken } from "@/services/auth.service";

/**
 * Blocks all `(withNav)` routes until a session token exists. Auth lives under `/auth/*` (separate layout).
 */
export function WithNavAuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const syncToken = useCallback(() => {
    setToken(getStoredToken());
  }, []);

  useEffect(() => {
    syncToken();
    setChecked(true);
    const onChange = () => syncToken();
    window.addEventListener("storage", onChange);
    window.addEventListener(AUTH_STATE_CHANGED_EVENT, onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener(AUTH_STATE_CHANGED_EVENT, onChange);
    };
  }, [syncToken]);

  const redirectToLogin = useCallback(() => {
    const path =
      typeof window !== "undefined"
        ? `${window.location.pathname}${window.location.search}`
        : pathname || "/";
    const cb = encodeURIComponent(path || "/");
    router.replace(`/auth/login?callbackUrl=${cb}`);
  }, [pathname, router]);

  useEffect(() => {
    if (!checked) return;
    if (!token) redirectToLogin();
  }, [checked, token, redirectToLogin]);

  if (!checked) {
    return (
      <div
        className="flex min-h-[50vh] items-center justify-center px-6 text-sm text-gray-500"
        style={{ backgroundColor: "#191919" }}
      >
        Checking session…
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return <>{children}</>;
}
