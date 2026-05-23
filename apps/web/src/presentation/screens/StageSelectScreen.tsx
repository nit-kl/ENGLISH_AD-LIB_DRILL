import { ChevronRight, Star } from "lucide-react";
import { STAGES } from "@english-adlib/content";
import type { StageKey } from "@english-adlib/domain";
import { getStageColorClass } from "../config/stage-theme";

const serif = { fontFamily: '"Noto Serif JP", serif' } as const;
const sans = { fontFamily: '"Noto Sans JP", sans-serif' } as const;

type Props = {
  onBack: () => void;
  onSelect: (key: StageKey) => void;
};

export function StageSelectScreen({ onBack, onSelect }: Props) {
  const entries = Object.entries(STAGES) as [StageKey, (typeof STAGES)[StageKey]][];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-purple-900 to-rose-900 p-6" style={sans}>
      <div className="max-w-5xl mx-auto pt-8">
        <button type="button" onClick={onBack} className="mb-8 flex items-center gap-2 text-purple-200 hover:text-white text-sm transition">
          <ChevronRight className="w-5 h-5 rotate-180" /> 戻る
        </button>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-2" style={serif}>
          ステージ選択
        </h2>
        <p className="text-purple-200 mb-12 text-sm">難易度を選んでください</p>
        <div className="grid sm:grid-cols-2 gap-5">
          {entries.map(([key, stage], idx) => (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              className={`group relative bg-gradient-to-br ${getStageColorClass(key)} rounded-2xl p-6 text-left hover:scale-[1.02] transition-all shadow-xl overflow-hidden`}
            >
              <div className="absolute top-3 right-3 px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-white text-xs font-bold">
                Lv.{idx + 1}
              </div>
              <div className="flex gap-1 mb-3">
                {Array.from({ length: idx + 1 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                ))}
              </div>
              <h3 className="text-3xl font-black text-white mb-1" style={serif}>
                {stage.label}
              </h3>
              <p className="text-white/70 text-xs tracking-widest mb-1">{stage.sublabel.toUpperCase()}</p>
              <p className="text-white/90 text-sm mb-3">
                {stage.desc} · 全{stage.questions.length}問
                {stage.conversationTurns > 1 && (
                  <> · 会話{stage.conversationTurns}回</>
                )}
              </p>
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                お題一覧へ <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
