"use client";

import Link from "next/link";
import { theme } from "@/lib/theme";

type ContributeResultButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
};

export function ContributeResultButton({
  href,
  children,
  variant = "primary",
}: ContributeResultButtonProps) {
  const isOutline = variant === "outline";

  return (
    <Link
      href={href}
      className={`select-none inline-block rounded-lg px-5 py-2 text-center text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#C9A96E] focus:ring-offset-2 focus:ring-offset-black ${
        isOutline ? "border border-gray-500" : ""
      }`}
      style={{
        backgroundColor: theme.cardBorder,
      }}
    >
      {children}
    </Link>
  );
}
