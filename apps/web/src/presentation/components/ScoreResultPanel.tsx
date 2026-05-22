import { BookOpen, ChevronRight, Play, Sparkles, Trophy, User } from "lucide-react";
import type { ScoreFeedback } from "@english-adlib/domain";
import { SparkleField } from "./SparkleField";

type Props = {
  feedback: ScoreFeedback;
  modelAnswer: string;
  animatedScore: number;
  userAnswer: string;
  nextLabel: string;
  onNext: () => void;
  /** 動画お題: 模範・解説は次画面へ */
  deferModelAndTips?: boolean;
};

export function ScoreResultPanel({
  feedback,
  modelAnswer,
  animatedScore,
  userAnswer,
  nextLabel,
  onNext,
  deferModelAndTips = false,
}: Props) {
  return (
    <div className="bg-gradient-to-br from-yellow-300/20 to-pink-500/20 backdrop-blur-xl rounded-3xl border-2 border-yellow-300/50 p-5 md:p-7 shadow-2xl relative overflow-hidden">
      <SparkleField count={8} />
      <div className="relative z-10 flex flex-col min-h-[min(70vh,32rem)]">
        <div className="text-center mb-4 shrink-0">
          <div className="text-xs font-bold tracking-widest text-yellow-300 mb-1">AI採点結果</div>
          <div
            className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 to-amber-400 leading-none"
            style={{ fontFamily: '"Noto Serif JP", serif' }}
          >
            {animatedScore}
          </div>
          <div className="text-purple-200 text-sm">/ 100点</div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 min-h-0">
          <div className="flex justify-end gap-2">
            <div className="max-w-[92%] rounded-2xl rounded-tr-sm bg-white/15 border border-white/20 px-4 py-3 shadow-lg">
              <div className="flex items-center gap-1.5 text-purple-300 text-xs font-bold mb-2">
                <User className="w-3.5 h-3.5" />
                あなたの回答
              </div>
              <p className="text-white text-sm leading-relaxed italic">&ldquo;{userAnswer}&rdquo;</p>
            </div>
          </div>

          <div className="rounded-2xl bg-black/35 border border-emerald-400/30 px-4 py-4 shadow-lg">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold mb-2">
              <Sparkles className="w-4 h-4" />
              場面の変化
            </div>
            <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
              {feedback.sceneUpdateJa}
            </p>
          </div>

          {!deferModelAndTips && (
            <>
              <div className="rounded-2xl bg-black/40 border border-yellow-300/25 px-4 py-4">
                <div className="flex items-center gap-2 text-yellow-300 text-xs font-bold mb-2">
                  <BookOpen className="w-4 h-4" />
                  模範解答
                </div>
                <p className="text-white text-sm italic leading-relaxed">
                  &ldquo;{modelAnswer}&rdquo;
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 text-sm">
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <div className="text-emerald-300 text-xs font-bold mb-1">良かった点</div>
                  <ul className="text-purple-100 space-y-1 list-disc list-inside">
                    {feedback.goodPoints.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <div className="text-amber-300 text-xs font-bold mb-1">改善ポイント</div>
                  <ul className="text-purple-100 space-y-1 list-disc list-inside">
                    {feedback.improvements.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>

        {deferModelAndTips && (
          <p className="text-center text-purple-200/80 text-sm mb-4 shrink-0">
            次の画面で模範解答と解説動画を確認できます
          </p>
        )}

        <button
          type="button"
          onClick={onNext}
          className="w-full py-4 bg-gradient-to-r from-yellow-300 to-amber-400 text-purple-950 font-black rounded-full hover:scale-[1.02] transition shadow-lg flex items-center justify-center gap-2 shrink-0"
        >
          {nextLabel}
          {deferModelAndTips ? (
            <Play className="w-5 h-5" />
          ) : nextLabel.includes("結果") ? (
            <Trophy className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
