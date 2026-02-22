"use client";

import Link from "next/link";
import { HeadsetIcon } from "@/components/ui/icons";
import { theme } from "@/lib/theme";

export function ContactUsLink() {
  return (
    <p className="mt-8 flex flex-wrap select-none items-center justify-center gap-1.5 text-sm text-gray-400">
      If you have any questions
      <span
        className="inline-flex shrink-0 align-middle"
        style={{ color: theme.accentGold }}
        aria-hidden
      >
        <HeadsetIcon />
      </span>
      <Link
        href="/contact"
        className="inline-flex select-none hover:underline"
        style={{ color: theme.accentGold }}
      >
        Contact us
      </Link>
    </p>
  );
}
