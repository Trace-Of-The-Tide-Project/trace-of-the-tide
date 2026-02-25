"use client";

import Image from "next/image";

type ContentImageDisplayProps = {
  src: string;
};

export function ContentImageDisplay({ src }: ContentImageDisplayProps) {
  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="relative w-full" style={{ aspectRatio: "21 / 9" }}>
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      </div>
    </div>
  );
}
