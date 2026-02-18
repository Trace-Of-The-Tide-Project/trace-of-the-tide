"use client";

import Link from "next/link";
import HexBackground from "@/components/ui/HexBackground";
import { theme } from "@/lib/theme";

function XIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg
      width="16"
      height="18"
      viewBox="0 0 15 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M0.75 9.91667V7.41667C0.75 5.64856 1.45238 3.95286 2.70262 2.70262C3.95286 1.45238 5.64856 0.75 7.41667 0.75C9.18478 0.75 10.8805 1.45238 12.1307 2.70262C13.381 3.95286 14.0833 5.64856 14.0833 7.41667V9.91667M0.75 9.91667C0.75 9.47464 0.925595 9.05072 1.23816 8.73816C1.55072 8.42559 1.97464 8.25 2.41667 8.25H3.25C3.69203 8.25 4.11595 8.42559 4.42851 8.73816C4.74107 9.05072 4.91667 9.47464 4.91667 9.91667V12.4167C4.91667 12.8587 4.74107 13.2826 4.42851 13.5952C4.11595 13.9077 3.69203 14.0833 3.25 14.0833H2.41667C1.97464 14.0833 1.55072 13.9077 1.23816 13.5952C0.925595 13.2826 0.75 12.8587 0.75 12.4167V9.91667ZM14.0833 9.91667C14.0833 9.47464 13.9077 9.05072 13.5952 8.73816C13.2826 8.42559 12.8587 8.25 12.4167 8.25H11.5833C11.1413 8.25 10.7174 8.42559 10.4048 8.73816C10.0923 9.05072 9.91667 9.47464 9.91667 9.91667V12.4167C9.91667 12.8587 10.0923 13.2826 10.4048 13.5952C10.7174 13.9077 11.1413 14.0833 11.5833 14.0833H12.4167M14.0833 9.91667V12.4167C14.0833 12.8587 13.9077 13.2826 13.5952 13.5952C13.2826 13.9077 12.8587 14.0833 12.4167 14.0833M12.4167 14.0833C12.4167 15.4642 10.1783 16.5833 7.41667 16.5833" />
    </svg>
  );
}

export default function ContributionErrorPage() {
  return (
    <div
      className="relative min-h-screen w-full"
      style={{ backgroundColor: theme.bgDark }}
    >
      {/* Red-tinted hexagon pattern at top */}
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0" style={{ background: theme.bgDark }} />
        <div className="absolute inset-0 h-[320px] w-full">
          <HexBackground />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(127, 29, 29, 0.25) 0%, transparent 70%)",
            }}
            aria-hidden
          />
        </div>
      </section>

      {/* Centered error content */}
      <div className="relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-6 py-12">
        <div className="flex w-full max-w-md flex-col items-center text-center">
          <div
            className="mb-6 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-red-600"
            aria-hidden
          >
            <XIcon />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-white">
            Hmm... Something went wrong.
          </h1>
          <p className="mb-8 max-w-sm text-center text-sm text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit nulla vel
            consequat arcu nulla vel arcu amet vestibulum nibh.
          </p>
          <Link
            href="/contribute"
            className="inline-block rounded-lg border border-gray-500 px-5 py-2 text-center text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: theme.cardBorder }}
          >
            Try again
          </Link>
          <p className="mt-8 flex flex-wrap items-center justify-center gap-1.5 text-sm text-gray-400">
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
              className="inline-flex hover:underline"
              style={{ color: theme.accentGold }}
            >
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
