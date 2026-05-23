import { CheckCircle2, ChevronRight, Film, Star } from "lucide-react";
import { STAGES } from "@english-adlib/content";
import { hasQuestionMedia, type Question, type StageKey } from "@english-adlib/domain";
import { getStageColorClass } from "../config/stage-theme";

const serif = { fontFamily: '"Noto Serif JP", serif' } as const;
const sans = { fontFamily: '"Noto Sans JP", sans-serif' } as const;

const STAGE_KEYS = Object.keys(STAGES) as StageKey[];

type Props = {
  stageKey: StageKey;
  completedIds: ReadonlySet<string>;
  onBack: () => void;
  onHome: () => void;
  onSelect: (question: Question, index: number) => void;
};

export function QuestionListScreen({
  stageKey,
  completedIds,
  onBack,
  onHome,
  onSelect,
}: Props) {
  const stage = STAGES[stageKey];
  const stageLevel = STAGE_KEYS.indexOf(stageKey) + 1;
  const completedCount = stage.questions.filter((q) => completedIds.has(q.id)).length;
  const totalCount = stage.questions.length;

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-purple-900 to-rose-900 p-6"
      style={sans}
    >
      <div className="max-w-5xl mx-auto pt-8">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-purple-200 hover:text-white text-sm transition"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
          戻る
        </button>

        <h2 className="text-4xl md:text-5xl font-black text-white mb-2" style={serif}>
          お題を選ぶ
        </h2>
        <p className="text-purple-200 mb-8 text-sm">好きなシチュエーションから挑戦できます（順不同）</p>

        <div
          className={`relative bg-gradient-to-br ${getStageColorClass(stageKey)} rounded-2xl p-6 mb-8 shadow-xl overflow-hidden`}
        >
          <div className="absolute top-3 right-3 px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-white text-xs font-bold">
            Lv.{stageLevel}
          </div>
          <div className="flex gap-1 mb-3">
            {Array.from({ length: stageLevel }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-300 text-yellow-300" />
            ))}
          </div>
          <h3 className="text-3xl font-black text-white mb-1" style={serif}>
            {stage.label}
          </h3>
          <p className="text-white/70 text-xs tracking-widest mb-1">{stage.sublabel.toUpperCase()}</p>
          <p className="text-white/90 text-sm">
            {stage.desc} · 全{totalCount}問
            {stage.conversationTurns > 1 && (
              <> · 会話{stage.conversationTurns}回</>
            )}
          </p>
          <p className="text-white/80 text-xs mt-3 font-bold">
            挑戦済み {completedCount} / {totalCount}
          </p>
        </div>

        <ul className="space-y-5">
          {stage.questions.map((q, index) => {
            const done = completedIds.has(q.id);
            const withVideo = hasQuestionMedia(q);

            return (
              <li key={q.id}>
                <button
                  type="button"
                  onClick={() => onSelect(q, index)}
                  className="group w-full text-left bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-6 md:p-7 hover:scale-[1.02] transition-all shadow-2xl overflow-hidden relative"
                >
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-yellow-300/10 rounded-full blur-2xl group-hover:scale-125 transition-transform pointer-events-none" />

                  <div className="relative flex items-start gap-4">
                    <span
                      className="text-4xl md:text-5xl shrink-0 drop-shadow-md"
                      aria-hidden
                    >
                      {q.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs font-bold tracking-widest text-yellow-300">
                          お題
                        </span>
                        {done && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            挑戦済み
                          </span>
                        )}
                        {withVideo && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-400/15 border border-yellow-300/40 text-yellow-200 text-xs font-bold">
                            <Film className="w-3.5 h-3.5" />
                            動画お題
                          </span>
                        )}
                      </div>
                      <h4 className="text-2xl md:text-3xl font-black text-white mb-0.5" style={serif}>
                        {q.title}
                      </h4>
                      <p className="text-purple-200/80 text-xs tracking-widest mb-3">
                        {q.titleEn.toUpperCase()}
                      </p>
                      <p className="text-white/90 text-sm leading-relaxed line-clamp-3">
                        {q.situation}
                      </p>
                      <p className="text-purple-200 text-xs mt-3 font-bold">役割: {q.role}</p>
                      <div className="mt-5 flex items-center gap-2 text-yellow-300 font-bold text-sm">
                        挑戦する
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={onHome}
          className="mt-10 flex items-center gap-2 text-purple-200 hover:text-white text-sm transition"
        >
          ホームに戻る
        </button>
      </div>
    </div>
  );
}
