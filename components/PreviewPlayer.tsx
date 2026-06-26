"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";

const PREVIEW_DURATION_SEC = 30;

export interface PreviewPlayerProps {
  previewUrl: string | null;
  trackId: string;
  trackTitle: string;
  /** True when DiscoveryFlow has selected this track as the active preview. */
  isActive: boolean;
  onActivate: (trackId: string) => void;
  onDeactivate: (trackId: string) => void;
}

type PreviewStatus = "unavailable" | "idle" | "loading" | "playing" | "paused" | "finished";

function formatTime(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(total / 60);
  const remainder = total % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

/**
 * Inline 30-second Spotify preview player. Audio is created on play only and
 * torn down when playback ends, the track is deactivated, or the component unmounts.
 */
export function PreviewPlayer({
  previewUrl,
  trackId,
  trackTitle,
  isActive,
  onActivate,
  onDeactivate,
}: PreviewPlayerProps) {
  const [status, setStatus] = useState<PreviewStatus>(
    previewUrl ? "idle" : "unavailable",
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [displayDuration, setDisplayDuration] = useState(PREVIEW_DURATION_SEC);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadingRef = useRef(false);
  const wasActiveRef = useRef(false);
  const isActiveRef = useRef(isActive);
  isActiveRef.current = isActive;

  const cleanupAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    audio.pause();
    audio.onended = null;
    audio.ontimeupdate = null;
    audio.onerror = null;
    audio.removeAttribute("src");
    audio.load();
    audioRef.current = null;
    loadingRef.current = false;
  }, []);

  const handlePlaybackEnd = useCallback(() => {
    cleanupAudio();
    setStatus("finished");
    setCurrentTime(displayDuration);
    onDeactivate(trackId);
  }, [cleanupAudio, displayDuration, onDeactivate, trackId]);

  const handlePlaybackError = useCallback(() => {
    cleanupAudio();
    setStatus("unavailable");
    onDeactivate(trackId);
  }, [cleanupAudio, onDeactivate, trackId]);

  const startPlayback = useCallback(async () => {
    if (!previewUrl || loadingRef.current) {
      return;
    }

    cleanupAudio();
    loadingRef.current = true;
    setStatus("loading");
    setCurrentTime(0);

    const audio = new Audio(previewUrl);
    audioRef.current = audio;

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDisplayDuration(Math.min(audio.duration, PREVIEW_DURATION_SEC));
      }
    };
    audio.onended = () => handlePlaybackEnd();
    audio.onerror = () => handlePlaybackError();

    try {
      await audio.play();
      if (!isActiveRef.current || audioRef.current !== audio) {
        audio.pause();
        loadingRef.current = false;
        return;
      }
      loadingRef.current = false;
      setStatus("playing");
    } catch {
      loadingRef.current = false;
      handlePlaybackError();
    }
  }, [cleanupAudio, handlePlaybackEnd, handlePlaybackError, previewUrl]);

  useEffect(() => {
    const becameActive = isActive && !wasActiveRef.current;
    wasActiveRef.current = isActive;

    if (!isActive) {
      cleanupAudio();
      setCurrentTime(0);
      setDisplayDuration(PREVIEW_DURATION_SEC);
      setStatus((prev) => {
        if (prev === "finished") {
          return "finished";
        }
        return previewUrl ? "idle" : "unavailable";
      });
      return;
    }

    if (becameActive) {
      void startPlayback();
    }
  }, [isActive, cleanupAudio, previewUrl, startPlayback]);

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  function handleTogglePlay() {
    if (loadingRef.current || status === "loading") {
      return;
    }

    if (isActive && status === "playing") {
      audioRef.current?.pause();
      setStatus("paused");
      return;
    }

    if (isActive && status === "paused") {
      void audioRef.current?.play().then(() => setStatus("playing")).catch(() => {
        handlePlaybackError();
      });
      return;
    }

    if (status === "finished") {
      setStatus("idle");
      setCurrentTime(0);
      setDisplayDuration(PREVIEW_DURATION_SEC);
    }

    onActivate(trackId);
  }

  if (status === "unavailable" || !previewUrl) {
    return (
      <p
        role="status"
        className="rounded-lg bg-surface-hover px-4 py-3 text-support text-white/60"
      >
        Preview unavailable — Continue in Spotify
      </p>
    );
  }

  if (status === "finished") {
    return (
      <p
        role="status"
        className="rounded-lg border border-white/10 bg-surface-hover px-4 py-3 text-body text-white/70"
      >
        Preview ended. Listen to the full song on Spotify.
      </p>
    );
  }

  const progressPercent =
    displayDuration > 0
      ? Math.min(100, (currentTime / displayDuration) * 100)
      : 0;

  const playLabel =
    status === "playing"
      ? `Pause preview of ${trackTitle}`
      : `Play 30 second preview of ${trackTitle}`;

  return (
    <div className="flex flex-col gap-3 rounded-lg bg-surface-hover px-4 py-3">
      <div className="flex items-center gap-3">
        <IconButton
          label={playLabel}
          onClick={handleTogglePlay}
          disabled={status === "loading"}
          className={status === "loading" ? "opacity-50" : undefined}
        >
          {status === "playing" ? (
            <Pause className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Play className="h-5 w-5" aria-hidden="true" />
          )}
        </IconButton>
        <span className="text-support text-white/80" aria-live="polite">
          {status === "loading" ? "Loading preview…" : "Preview (30 sec)"}
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={Math.round(currentTime)}
        aria-valuemin={0}
        aria-valuemax={displayDuration}
        aria-label={`Preview progress for ${trackTitle}`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-150 motion-reduce:transition-none"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className="text-support tabular-nums text-white/50" aria-live="off">
        {formatTime(currentTime)} / {formatTime(displayDuration)}
      </p>
    </div>
  );
}
