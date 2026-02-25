"use client";

import { useRef, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { PlayIcon, PauseIcon } from "@/components/ui/icons";
import { formatTime } from "./mediaUtils";

type ContentAudioPlayerProps = {
  src: string;
  thumbnail?: string;
  title?: string;
  duration?: string;
};

export function ContentAudioPlayer({
  src,
  thumbnail,
  title,
  duration: durationLabel,
}: ContentAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    } else {
      a.pause();
      setPlaying(false);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const a = audioRef.current;
    if (a) setCurrentTime(a.currentTime);
  }, []);

  const updateDuration = useCallback(() => {
    const a = audioRef.current;
    if (a && isFinite(a.duration) && a.duration > 0) {
      setDuration(a.duration);
    }
  }, []);

  const handleLoadedMetadata = updateDuration;
  const handleDurationChange = updateDuration;

  const handleEnded = useCallback(() => {
    setPlaying(false);
    setCurrentTime(0);
  }, []);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    const bar = e.currentTarget;
    if (!a || !bar) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    a.currentTime = pct * a.duration;
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const displayTotalTime =
    duration > 0 && isFinite(duration)
      ? formatTime(duration)
      : durationLabel ?? "0:00";

  const waveformHeights = useMemo(
    () =>
      Array.from(
        { length: 200 },
        (_, i) => 0.35 + (Math.sin(i * 0.7) * 0.3 + Math.cos(i * 0.4) * 0.35)
      ),
    []
  );

  return (
    <div
      className="overflow-hidden rounded-xl p-8 sm:p-10"
    >
      <div className="flex gap-8">
        {thumbnail && (
          <div className="relative h-44 w-44 shrink-0 self-start overflow-hidden rounded-lg sm:h-48 sm:w-48">
            <Image src={thumbnail} alt="" fill className="object-cover" sizes="192px" />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-5">
          {/* Upper section: play, name + time */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-white transition-colors hover:bg-[#252525]"
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <div className="min-w-0 flex-1">
              {title && (
                <p className="text-base font-semibold text-white sm:text-lg">{title}</p>
              )}
              <p className="mt-0.5 text-sm text-gray-400">
                Audio time: <span className="tabular-nums">{displayTotalTime}</span>
              </p>
            </div>
          </div>

          {/* Waveform with mirrored bottom (curved, reflection effect) */}
          <div
            className="relative flex cursor-pointer flex-col overflow-hidden rounded-2xl"
            role="slider"
            tabIndex={0}
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={currentTime}
            onClick={handleSeek}
          >
            <span
              className="absolute right-2 top-2 z-10 whitespace-nowrap rounded-full bg-[#1a1a1a] px-3 py-1 tabular-nums text-sm text-white"
            >
              {formatTime(currentTime)}
            </span>
            {/* Main waveform */}
            <div className="relative flex h-12 w-full items-end gap-0.5 pr-16 sm:h-14">
              <div className="relative flex h-full w-full items-end gap-0.5">
                <div className="flex h-full w-full items-end gap-0.5">
                  {waveformHeights.map((h, i) => (
                    <div
                      key={i}
                      className="w-0.5 shrink-0 rounded-sm"
                      style={{ height: `${h * 100}%`, backgroundColor: "#CCCCCC" }}
                    />
                  ))}
                </div>
                <div
                  className="absolute left-0 top-0 flex h-full items-end gap-0.5 overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  {waveformHeights.map((h, i) => (
                    <div
                      key={i}
                      className="w-0.5 shrink-0 rounded-sm"
                      style={{ height: `${h * 100}%`, backgroundColor: "#CCCCCC" }}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Mirrored waveform (reflection) */}
            <div
              className="relative flex h-12 w-full items-end gap-0.5 pr-16 sm:h-14"
              style={{ transform: "scaleY(-1)" }}
              aria-hidden
            >
              <div className="relative flex h-full w-full items-end gap-0.5">
                <div className="flex h-full w-full items-end gap-0.5">
                  {waveformHeights.map((h, i) => (
                    <div
                      key={i}
                      className="w-0.5 shrink-0 rounded-sm"
                      style={{ height: `${h * 100}%`, backgroundColor: "#CCCCCC" }}
                    />
                  ))}
                </div>
                <div
                  className="absolute left-0 top-0 flex h-full items-end gap-0.5 overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  {waveformHeights.map((h, i) => (
                    <div
                      key={i}
                      className="w-0.5 shrink-0 rounded-sm"
                      style={{ height: `${h * 100}%`, backgroundColor: "#CCCCCC" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onDurationChange={handleDurationChange}
        onCanPlay={updateDuration}
        onEnded={handleEnded}
      />
    </div>
  );
}
