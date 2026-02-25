"use client";

import { ContentVideoPlayer } from "./ContentVideoPlayer";
import { ContentAudioPlayer } from "./ContentAudioPlayer";
import { ContentImageDisplay } from "./ContentImageDisplay";

export type ContentMediaPlayerProps = {
  type: "video" | "audio" | "image";
  src: string;
  thumbnail?: string;
  duration?: string;
  title?: string;
};

export function ContentMediaPlayer({
  type,
  src,
  thumbnail,
  duration,
  title,
}: ContentMediaPlayerProps) {
  if (type === "image") return <ContentImageDisplay src={src} />;
  if (type === "audio") {
    return (
      <ContentAudioPlayer
        src={src}
        thumbnail={thumbnail}
        title={title}
        duration={duration}
      />
    );
  }
  return <ContentVideoPlayer src={src} thumbnail={thumbnail || src} />;
}
