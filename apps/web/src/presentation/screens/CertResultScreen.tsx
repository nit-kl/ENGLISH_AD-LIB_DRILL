import { Crown, RotateCcw } from "lucide-react";
import { Grade } from "@english-adlib/domain";
import { SparkleField } from "../components/SparkleField";

const serif = { fontFamily: '"Noto Serif JP", serif' } as const;
const sans = { fontFamily: '"Noto Sans JP", sans-serif' } as const;

type Props = {
  certScores: number[];
  onRetry: () => void;
  onHome: () => void;
};

export function CertResultScreen({ certScores, onRetry, onHome }: Props) {
  const avg = certScores.length
    ? Math.round(certScores.reduce((a, b) => a + b, 0) / certScores.length)
    : 0;
  const grade = Grade.fromAverageScore(avg);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-rose-900 p-6 flex items-center justify-center relative overflow-hidden" style={sans}>
      <SparkleField count={30} />
      <div className="max-w-2xl w-full text-center relative z-10">
        <Crown className="w-20 h-20 text-yellow-300 mx-auto mb-4 drop-shadow-[0_0_30px_rgba(253,224,71,0.8)]" />
        <h2 className="text-4xl md:text-5xl font-black text-white mb-2" style={serif}>
          あなたの英会話判定
        </h2>
        <p className="text-purple-200 mb-8 text-sm">全10問の検定が終了しました</p>
        <div className={`bg-gradient-to-br ${grade.colorClass} rounded-3xl p-8 md:p-10 mb-6 shadow-2xl relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
          <div className="relative z-10">
            <div className="text-xs font-bold tracking-widest text-white/80 mb-2">あなたの級</div>
            <div className="text-8xl md:text-9xl font-black text-white mb-2" style={serif}>
              {grade.rank}
            </div>
            <div className="text-2xl font-black text-white mb-1">{grade.label}</div>
            <p className="text-white/90 text-sm mb-2">{grade.description}</p>
            <p className="text-white/70 text-xs mb-4">{grade.toeicEquivalent}</p>
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-black/30 rounded-full">
              <span className="text-white/80 text-sm">平均スコア</span>
              <span className="text-white font-black text-xl">{avg}</span>
              <span className="text-white/80 text-sm">/ 100</span>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-5 mb-6">
          <div className="text-xs font-bold tracking-widest text-yellow-300 mb-3">各問題のスコア</div>
          <div className="grid grid-cols-10 gap-1">
            {certScores.map((s, i) => (
              <div
                key={i}
                className="aspect-square bg-black/30 rounded-lg flex items-center justify-center text-white text-xs font-bold border border-white/10"
              >
                {s}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={onRetry}
            className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-white/20 flex items-center justify-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4" /> もう一度受検
          </button>
          <button
            type="button"
            onClick={onHome}
            className="px-8 py-4 bg-gradient-to-r from-yellow-300 to-amber-400 text-purple-950 font-black rounded-full hover:scale-105 transition shadow-lg"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
