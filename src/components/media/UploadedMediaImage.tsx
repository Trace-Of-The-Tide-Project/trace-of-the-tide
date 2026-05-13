"use client";

import { useEffect, useState } from "react";
import {
  isSignedUploadedMediaRef,
  resolveUploadedMediaSrc,
} from "@/lib/media/uploaded-media";
import { getContributionFileSignedUrl } from "@/services/contributions.service";

type UploadedMediaImageProps = {
  mediaRef: string;
  /** When the stored ref is not already a signed upload URL, load one from GET /files/:id/url. */
  fileId?: string;
  alt?: string;
  className?: string;
};

function resolveDisplaySrc(ref: string): string {
  const raw = ref.trim();
  if (!raw) return "";
  if (isSignedUploadedMediaRef(raw)) return raw;
  return resolveUploadedMediaSrc(raw);
}

/** Resolve a stored media ref the same way as article inline images, then render `<img>`. */
export function UploadedMediaImage({
  mediaRef,
  fileId,
  alt = "",
  className,
}: UploadedMediaImageProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* eslint-disable react-hooks/set-state-in-effect -- resolve refs and optional signed file URLs */
  useEffect(() => {
    const raw = mediaRef.trim();
    if (!raw && !fileId) {
      setSrc(null);
      setLoading(false);
      return;
    }

    const resolved = raw ? resolveDisplaySrc(raw) : "";
    if (resolved && isSignedUploadedMediaRef(resolved)) {
      setSrc(resolved);
      setLoading(false);
      return;
    }

    if (!fileId) {
      setSrc(resolved || null);
      setLoading(false);
      return;
    }

    setLoading(true);
    let cancelled = false;
    void getContributionFileSignedUrl(fileId)
      .then((url) => {
        if (cancelled) return;
        const signed = url?.trim();
        setSrc(signed && isSignedUploadedMediaRef(signed) ? signed : resolved || signed || null);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setSrc(resolved || null);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [mediaRef, fileId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (loading) {
    return (
      <div
        className={`animate-pulse bg-[var(--tott-dash-surface-inset)] ${className ?? ""}`}
        aria-hidden
      />
    );
  }

  if (!src) {
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
    // eslint-disable-next-line @next/next/no-img-element -- remote media URLs from API / storage
    <img src={src} alt={alt} className={className} loading="lazy" decoding="async" />
  );
}
