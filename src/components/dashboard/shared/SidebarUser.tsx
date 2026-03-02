"use client";

import { useSession, signOut } from "next-auth/react";
import { theme } from "@/lib/theme";
import { LogOutIcon } from "@/components/ui/icons";

function getInitial(name?: string | null, email?: string | null): string {
  if (name?.trim()) return name.trim()[0].toUpperCase();
  if (email?.trim()) return email.trim()[0].toUpperCase();
  return "A";
}

export function SidebarUser() {
  const { data: session } = useSession();

  const name = session?.user?.name;
  const email = session?.user?.email;
  const displayName = name || email || "Super Admin";

  return (
    <div className="flex items-center gap-3 px-3 py-4">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
        style={{ backgroundColor: theme.accentGoldFocus, color: theme.bgDark }}
      >
        {getInitial(name, email)}
      </span>
      <span className="flex-1 truncate text-sm font-medium text-white">{displayName}</span>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/auth/login" })}
        className="shrink-0 text-gray-500 transition-colors hover:text-white"
        aria-label="Sign out"
      >
        <LogOutIcon />
      </button>
    </div>
  );
}
