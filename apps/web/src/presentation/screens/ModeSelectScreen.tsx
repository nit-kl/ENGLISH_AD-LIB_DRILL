import { Award, ChevronRight, Home, Target } from "lucide-react";

const serif = { fontFamily: '"Noto Serif JP", serif' } as const;
const sans = { fontFamily: '"Noto Sans JP", sans-serif' } as const;

type Props = {
  onHome: () => void;
  onCert: () => void;
  onStage: () => void;
};

export function ModeSelectScreen({ onHome, onCert, onStage }: Props) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-purple-900 to-rose-900 p-6" style={sans}>
      <div className="max-w-4xl mx-auto pt-8">
        <button type="button" onClick={onHome} className="mb-8 flex items-center gap-2 text-purple-200 hover:text-white text-sm transition">
          <Home className="w-5 h-5" /> ホームに戻る
        </button>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-2" style={serif}>
          モードを選ぶ
        </h2>
        <p className="text-purple-200 mb-12 text-sm">どちらで挑戦しますか？</p>
        <div className="grid md:grid-cols-2 gap-6">
          <button
            type="button"
            onClick={onCert}
            className="group relative bg-gradient-to-br from-rose-600 to-pink-700 rounded-3xl p-8 text-left hover:scale-[1.02] transition-all shadow-2xl overflow-hidden"
          >
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-yellow-300/20 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
            <Award className="w-12 h-12 text-yellow-300 mb-4 relative" />
            <h3 className="text-3xl font-black text-white mb-1 relative" style={serif}>
              検定モード
            </h3>
            <p className="text-rose-100 text-xs mb-3 tracking-widest relative">CERTIFICATION</p>
            <p className="text-rose-100/90 text-sm leading-relaxed relative">
              全10問でマジ判定。あなたの英会話力を5級〜1級＋「神」で評価。TOEIC換算スコアも表示。
            </p>
            <div className="mt-6 flex items-center gap-2 text-yellow-300 font-bold text-sm relative">
              受検する <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </button>
          <button
            type="button"
            onClick={onStage}
            className="group relative bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl p-8 text-left hover:scale-[1.02] transition-all shadow-2xl overflow-hidden"
          >
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-yellow-300/20 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
            <Target className="w-12 h-12 text-yellow-300 mb-4 relative" />
            <h3 className="text-3xl font-black text-white mb-1 relative" style={serif}>
              ステージモード
            </h3>
            <p className="text-cyan-100 text-xs mb-3 tracking-widest relative">STAGE CLEAR</p>
            <p className="text-cyan-100/90 text-sm leading-relaxed relative">
              初級から超人級まで4ステージ。お気に入りのシチュエーションだけ繰り返し練習することも。
            </p>
            <div className="mt-6 flex items-center gap-2 text-yellow-300 font-bold text-sm relative">
              ステージを選ぶ <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
