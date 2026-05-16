import { Trophy } from "lucide-react";
import { STAGES, type StageKey } from "@english-adlib/domain";

const serif = { fontFamily: '"Noto Serif JP", serif' } as const;
const sans = { fontFamily: '"Noto Sans JP", sans-serif' } as const;

type Props = {
  stageKey: StageKey;
  score: number | null;
  onOtherStages: () => void;
  onHome: () => void;
};

export function ResultScreen({ stageKey, score, onOtherStages, onHome }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-rose-900 p-6 flex items-center justify-center" style={sans}>
      <div className="max-w-2xl w-full text-center">
        <Trophy className="w-24 h-24 text-yellow-300 mx-auto mb-6 drop-shadow-[0_0_30px_rgba(253,224,71,0.6)]" />
        <h2 className="text-5xl md:text-6xl font-black text-white mb-3" style={serif}>
          ステージクリア！
        </h2>
        <p className="text-purple-200 mb-10">
          <span className="text-yellow-300 font-bold">{STAGES[stageKey].label}</span>を制覇しました
        </p>
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 mb-8">
          <div className="text-xs font-bold tracking-widest text-yellow-300 mb-3">最終問題スコア</div>
          {score !== null && (
            <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 to-amber-400 mb-4" style={serif}>
              {score}
              <span className="text-3xl md:text-4xl text-purple-200 font-normal">/100</span>
            </div>
          )}
          <p className="text-purple-200 text-sm">よくがんばりました。次は1つ上の難易度に挑戦してみましょう。</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={onOtherStages}
            className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-white/20 transition"
          >
            他のステージへ
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
