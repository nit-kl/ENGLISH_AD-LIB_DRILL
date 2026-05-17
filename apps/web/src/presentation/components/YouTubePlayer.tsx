import { useEffect, useRef } from "react";
import type { QuestionVideoSegment } from "@english-adlib/domain";
import { loadYouTubeIframeApi } from "../lib/load-youtube-api";
import { shouldBypassYouTube } from "../lib/youtube-bypass";

type Props = {
  segment: QuestionVideoSegment;
  /** setup: endSeconds で自動停止してコールバック */
  mode: "setup" | "reveal";
  onSetupComplete?: () => void;
  onRevealComplete?: () => void;
  className?: string;
};

function buildPlayerVars(segment: QuestionVideoSegment): Record<string, string | number> {
  const vars: Record<string, string | number> = {
    rel: 0,
    modestbranding: 1,
    cc_load_policy: 1,
    playsinline: 1,
  };
  if (segment.startSeconds != null && segment.startSeconds > 0) {
    vars.start = segment.startSeconds;
  }
  return vars;
}

export function YouTubePlayer({
  segment,
  mode,
  onSetupComplete,
  onRevealComplete,
  className,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const stopWatchRef = useRef<(() => void) | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    completedRef.current = false;
    const bypass = shouldBypassYouTube();

    if (bypass) {
      if (mode === "setup") {
        onSetupComplete?.();
      } else {
        onRevealComplete?.();
      }
      return;
    }

    let cancelled = false;

    const cleanup = () => {
      cancelled = true;
      stopWatchRef.current?.();
      stopWatchRef.current = null;
      playerRef.current?.destroy();
      playerRef.current = null;
    };

    void loadYouTubeIframeApi().then(() => {
      if (cancelled || !hostRef.current || !window.YT?.Player) return;

      const player = new window.YT.Player(hostRef.current, {
        videoId: segment.youtubeVideoId,
        width: "100%",
        height: "100%",
        playerVars: buildPlayerVars(segment),
        events: {
          onReady: (event) => {
            if (segment.startSeconds != null && segment.startSeconds > 0) {
              event.target.seekTo(segment.startSeconds, true);
            }

            if (mode === "setup" && segment.endSeconds != null) {
              const watch = window.setInterval(() => {
                if (completedRef.current) return;
                const t = event.target.getCurrentTime();
                if (t >= segment.endSeconds!) {
                  completedRef.current = true;
                  event.target.pauseVideo();
                  stopWatchRef.current?.();
                  stopWatchRef.current = null;
                  onSetupComplete?.();
                }
              }, 200);
              stopWatchRef.current = () => clearInterval(watch);
            }
          },
          onStateChange: (event) => {
            if (mode !== "reveal" || completedRef.current) return;
            if (event.data === YT.PlayerState.ENDED) {
              completedRef.current = true;
              onRevealComplete?.();
            }
          },
        },
      });
      playerRef.current = player;
    });

    return cleanup;
  }, [
    segment.youtubeVideoId,
    segment.startSeconds,
    segment.endSeconds,
    mode,
    onSetupComplete,
    onRevealComplete,
  ]);

  if (shouldBypassYouTube()) {
    return (
      <div
        className={`aspect-video w-full rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center text-purple-200 text-sm ${className ?? ""}`}
        data-testid="youtube-bypass-placeholder"
      >
        動画（E2E）
      </div>
    );
  }

  return (
    <div
      className={`aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-xl border border-white/10 ${className ?? ""}`}
    >
      <div ref={hostRef} className="h-full w-full" />
    </div>
  );
}
