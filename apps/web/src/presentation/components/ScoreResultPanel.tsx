import { BookOpen, ChevronRight, Flame, Play, Sparkles, Trophy } from "lucide-react";
import type { ScoreFeedback } from "@english-adlib/domain";
import { SparkleField } from "./SparkleField";

type Props = {
  feedback: ScoreFeedback;
  animatedScore: number;
  nextLabel: string;
  onNext: () => void;
  hideModelAnswer?: boolean;
};

export function ScoreResultPanel({
  feedback,
  animatedScore,
  nextLabel,
  onNext,
  hideModelAnswer = false,
}: Props) {
  const axes = [
    { label: "流暢さ", val: feedback.fluency, icon: "💬" },
    { label: "文法", val: feedback.grammar, icon: "✏️" },
    { label: "語彙", val: feedback.vocabulary, icon: "📚" },
    { label: "適切さ", val: feedback.relevance, icon: "🎯" },
  ] as const;

  return (
    <div className="bg-gradient-to-br from-yellow-300/20 to-pink-500/20 backdrop-blur-xl rounded-3xl border-2 border-yellow-300/50 p-6 md:p-8 shadow-2xl relative overflow-hidden">
      <SparkleField count={8} />
      <div className="relative z-10">
        <div className="text-center mb-6">
          <div className="text-xs font-bold tracking-widest text-yellow-300 mb-2">AI採点結果</div>
          <div
            className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 to-amber-400"
            style={{ fontFamily: '"Noto Serif JP", serif' }}
          >
            {animatedScore}
          </div>
          <div className="text-purple-200 text-sm">/ 100点</div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {axes.map((item) => (
            <div key={item.label} className="bg-black/30 rounded-xl p-3 border border-white/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-purple-200 text-xs font-bold">
                  {item.icon} {item.label}
                </span>
                <span className="text-white font-black">{item.val}</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-300 to-amber-400 transition-all duration-1000"
                  style={{ width: `${item.val}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-emerald-500/15 border border-emerald-400/30 rounded-2xl p-4 mb-3">
          <div className="text-xs font-bold tracking-widest text-emerald-300 mb-2 flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> 良かった点
          </div>
          <ul className="space-y-1.5">
            {feedback.goodPoints.map((c) => (
              <li key={c} className="text-white text-sm flex gap-2 leading-relaxed">
                <span className="text-emerald-300 shrink-0">◎</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-rose-500/15 border border-rose-400/30 rounded-2xl p-4 mb-3">
          <div className="text-xs font-bold tracking-widest text-rose-300 mb-2 flex items-center gap-2">
            <Flame className="w-3 h-3" /> ここを直すともっと伸びる
          </div>
          <ul className="space-y-1.5">
            {feedback.improvements.map((c) => (
              <li key={c} className="text-white text-sm flex gap-2 leading-relaxed">
                <span className="text-rose-300 shrink-0">▲</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {!hideModelAnswer && (
          <div className="bg-black/40 rounded-2xl p-4 mb-6 border border-white/10">
            <div className="text-xs font-bold tracking-widest text-yellow-300 mb-2 flex items-center gap-2">
              <BookOpen className="w-3 h-3" /> 模範解答の例
            </div>
            <p className="text-white text-sm italic leading-relaxed">
              &ldquo;{feedback.modelAnswer}&rdquo;
            </p>
          </div>
        )}

        {hideModelAnswer && (
          <p className="text-center text-purple-200/80 text-sm mb-6">
            続きの動画で模範解答と解説を確認できます
          </p>
        )}

        <button
          type="button"
          onClick={onNext}
          className="w-full py-4 bg-gradient-to-r from-yellow-300 to-amber-400 text-purple-950 font-black rounded-full hover:scale-[1.02] transition shadow-lg flex items-center justify-center gap-2"
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
