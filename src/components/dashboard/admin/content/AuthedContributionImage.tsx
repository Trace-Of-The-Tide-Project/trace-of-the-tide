"use client";

import { useEffect, useState } from "react";
import { getStoredToken } from "@/services/auth.service";
import { contributionFilePublicUrl } from "@/services/contributions.service";

type AuthedContributionImageProps = {
  path: string;
  alt?: string;
  className?: string;
};

/**
 * Contribution `path` values are often relative (`uploads/...`) on the API host. Those GETs may
 * require a Bearer token, which a plain {@code <img src>} cannot send. Article content usually stores
 * a full public URL after upload, so it still loads. This component fetches with the session token
 * and displays a blob URL when needed.
 */
export function AuthedContributionImage({ path, alt = "", className }: AuthedContributionImageProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    const raw = path.trim();
    if (!raw) {
      setSrc(null);
      setStatus("error");
      return;
    }

    const abs = contributionFilePublicUrl(path);
    if (!abs) {
      setSrc(null);
      setStatus("error");
      return;
    }

    if (/^https?:\/\//i.test(raw)) {
      setSrc(abs);
      setStatus("ready");
      return;
    }

    setStatus("loading");
    let objectUrl: string | null = null;
    const ac = new AbortController();

    (async () => {
      try {
        const token = getStoredToken();
        const res = await fetch(abs, {
          signal: ac.signal,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (ac.signal.aborted) return;
        if (!res.ok) {
          setSrc(null);
          setStatus("error");
          return;
        }
        const blob = await res.blob();
        if (ac.signal.aborted) return;
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
        setStatus("ready");
      } catch {
        if (!ac.signal.aborted) {
          setSrc(null);
          setStatus("error");
        }
      }
    })();

    return () => {
      ac.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [path]);

  if (status === "loading" || status === "idle") {
    return (
      <div
        className={`animate-pulse bg-[var(--tott-dash-surface-inset)] ${className ?? ""}`}
        aria-hidden
      />
    );
  }

  if (status === "error" || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-[var(--tott-dash-input-bg)] text-[10px] text-gray-600 ${className ?? ""}`}
        title="Could not load image"
      >
        —
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- blob: URL or public https URL
    <img src={src} alt={alt} className={className} loading="lazy" />
  );
}
