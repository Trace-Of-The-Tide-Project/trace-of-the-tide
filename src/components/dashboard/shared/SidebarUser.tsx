"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";
import { theme } from "@/lib/theme";
import { LogOutIcon } from "@/components/ui/icons";
import { clearStoredAuth } from "@/services/auth.service";
import { useStoredAuthUser } from "@/hooks/useStoredAuthUser";

function getInitial(name?: string | null, email?: string | null): string {
  if (name?.trim()) return name.trim()[0].toUpperCase();
  if (email?.trim()) return email.trim()[0].toUpperCase();
  return "A";
}

export function SidebarUser() {
  const router = useRouter();
  const { isDark } = useTheme();
  const user = useStoredAuthUser();
  const name = user?.full_name || user?.username;
  const email = user?.email;
  const displayName = name || email || "Super Admin";

  return (
    <div className="flex items-center gap-3 px-3 py-4">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
        style={{ backgroundColor: theme.accentGoldFocus, color: theme.bgDark }}
      >
        {getInitial(name, email)}
      </span>
      <span
        className={`flex-1 truncate text-sm font-medium ${isDark ? "text-foreground" : "text-gray-900"}`}
      >
        {displayName}
      </span>
      <button
        type="button"
        onClick={() => {
          clearStoredAuth();
          router.push("/auth/login");
          router.refresh();
        }}
        className={
          isDark
            ? "shrink-0 text-gray-500 transition-colors hover:text-foreground"
            : "shrink-0 text-gray-500 transition-colors hover:text-gray-900"
        }
        aria-label="Sign out"
      >
        <LogOutIcon />
      </button>
    </div>
  );
}
