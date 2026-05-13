"use client";

import { UploadedMediaImage } from "@/components/media/UploadedMediaImage";

type AuthedContributionImageProps = {
  path: string;
  alt?: string;
  className?: string;
};

/** @deprecated Use {@link UploadedMediaImage} with `mediaRef`. */
export function AuthedContributionImage({ path, alt, className }: AuthedContributionImageProps) {
  return <UploadedMediaImage mediaRef={path} alt={alt} className={className} />;
}
