import { useCallback, useState } from "react";
import { ChevronRight, ExternalLink, Home, Trophy } from "lucide-react";
import { hasQuestionMedia, type Question, type ScoreFeedback } from "@english-adlib/domain";
import { YouTubePlayer } from "../components/YouTubePlayer";

const sans = { fontFamily: '"Noto Sans JP", sans-serif' } as const;

type Props = {
  question: Question;
  feedback: ScoreFeedback;
  finishLabel: string;
  onHome: () => void;
  onBackToList?: () => void;
  onNext: () => void;
};

function youtubeWatchUrl(videoId: string, startSeconds?: number): string {
  const base = `https://www.youtube.com/watch?v=${videoId}`;
  if (startSeconds != null && startSeconds > 0) {
    return `${base}&t=${Math.floor(startSeconds)}s`;
  }
  return base;
}

export function RevealScreen({ question, feedback, finishLabel, onHome, onBackToList, onNext }: Props) {
  const [revealComplete, setRevealComplete] = useState(false);

  const onRevealComplete = useCallback(() => {
    setRevealComplete(true);
  }, []);

  if (!hasQuestionMedia(question)) {
    return null;
  }

  const { reveal } = question.media;
  return (
    <div
      className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 p-4 md:p-6 relative overflow-hidden"
      style={sans}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          {onBackToList ? (
            <button
              type="button"
              onClick={onBackToList}
              className="flex items-center gap-2 text-purple-200 hover:text-white text-sm transition"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
              お題一覧
            </button>
          ) : (
            <button
              type="button"
              onClick={onHome}
              className="flex items-center gap-2 text-purple-200 hover:text-white transition"
            >
              <Home className="w-5 h-5" />
            </button>
          )}
          <span className="text-xs font-bold tracking-widest text-yellow-300">続き・模範・解説</span>
        </div>

        <YouTubePlayer
          segment={reveal}
          mode="reveal"
          onRevealComplete={onRevealComplete}
          className="mb-4"
        />

        <p className="text-center text-purple-200/80 text-sm mb-4">
          {revealComplete ? "視聴完了！次に進めます" : "最後まで視聴すると次に進めます"}
        </p>

        {revealComplete && (
          <div className="bg-black/40 rounded-2xl p-4 mb-4 border border-white/10">
            <div className="text-xs font-bold tracking-widest text-yellow-300 mb-2">模範解答の例</div>
            <p className="text-white text-sm italic leading-relaxed">
              &ldquo;{feedback.modelAnswer}&rdquo;
            </p>
          </div>
        )}

        <a
          href={youtubeWatchUrl(reveal.youtubeVideoId, reveal.startSeconds)}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 flex items-center justify-center gap-2 text-purple-300 hover:text-white text-sm transition"
        >
          <ExternalLink className="w-4 h-4" />
          YouTubeで開く
        </a>

        <button
          type="button"
          onClick={onNext}
          disabled={!revealComplete}
          className="w-full py-4 bg-gradient-to-r from-yellow-300 to-amber-400 text-purple-950 font-black rounded-full hover:scale-[1.02] transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:hover:scale-100"
        >
          {finishLabel}
          {finishLabel === "結果を見る" ? (
            <Trophy className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
