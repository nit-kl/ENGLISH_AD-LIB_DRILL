import { ChevronRight, MessageCircle, Play, Trophy, User } from "lucide-react";
import type { ScoreFeedback } from "@english-adlib/domain";
import { SparkleField } from "./SparkleField";

type Props = {
  feedback: ScoreFeedback;
  animatedScore: number;
  situation: string;
  userAnswer: string;
  counterpartLabel: string;
  nextLabel: string;
  onNext: () => void;
  hideModelAnswer?: boolean;
};

export function ScoreResultPanel({
  feedback,
  animatedScore,
  situation,
  userAnswer,
  counterpartLabel,
  nextLabel,
  onNext,
  hideModelAnswer = false,
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
            <div className="max-w-[88%] rounded-2xl rounded-tr-sm bg-white/15 border border-white/20 px-4 py-3 shadow-lg">
              <div className="flex items-center gap-1.5 text-purple-300 text-xs font-bold mb-2">
                <User className="w-3.5 h-3.5" />
                あなた
              </div>
              <div className="text-purple-200/90 text-xs font-bold mb-1">お題</div>
              <p className="text-white text-sm leading-relaxed mb-3">{situation}</p>
              <div className="text-purple-200/90 text-xs font-bold mb-1">回答</div>
              <p className="text-white text-sm leading-relaxed italic">&ldquo;{userAnswer}&rdquo;</p>
            </div>
          </div>

          <div className="flex justify-start gap-2">
            <div className="w-8 h-8 rounded-full bg-yellow-300/20 border border-yellow-300/40 flex items-center justify-center shrink-0 mt-1">
              <MessageCircle className="w-4 h-4 text-yellow-300" />
            </div>
            <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-black/35 border border-yellow-300/25 px-4 py-3 shadow-lg">
              <div className="text-yellow-300 text-xs font-bold mb-2">{counterpartLabel}</div>
              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{feedback.reply}</p>
            </div>
          </div>
        </div>

        {hideModelAnswer && (
          <p className="text-center text-purple-200/80 text-sm mb-4 shrink-0">
            続きの動画で模範解答と解説を確認できます
          </p>
        )}

        <button
          type="button"
          onClick={onNext}
          className="w-full py-4 bg-gradient-to-r from-yellow-300 to-amber-400 text-purple-950 font-black rounded-full hover:scale-[1.02] transition shadow-lg flex items-center justify-center gap-2 shrink-0"
        >
          {nextLabel}
          {hideModelAnswer ? (
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
