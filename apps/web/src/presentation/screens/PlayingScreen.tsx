import { Home, Lightbulb, Mic, MicOff, Send } from "lucide-react";
import { countWords, type Question, type ScoreFeedback } from "@english-adlib/domain";
import type { ApiClientError } from "../../infrastructure/api-client";
import { ScoreResultPanel } from "../components/ScoreResultPanel";
import { SubmitErrorBanner } from "../components/SubmitErrorBanner";
import type { useVoiceInput } from "../hooks/useVoiceInput";

const serif = { fontFamily: '"Noto Serif JP", serif' } as const;
const sans = { fontFamily: '"Noto Sans JP", sans-serif' } as const;

type Voice = ReturnType<typeof useVoiceInput>;

type Props = {
  question: Question;
  questionIndex: number;
  totalQs: number;
  timeLeft: number;
  userInput: string;
  onInputChange: (v: string) => void;
  showHint: boolean;
  onToggleHint: () => void;
  showScoring: boolean;
  feedback: ScoreFeedback | null;
  animatedScore: number;
  isSubmitting: boolean;
  submitError: ApiClientError | null;
  isLast: boolean;
  voice: Voice;
  onHome: () => void;
  onSubmit: () => void;
  onNext: () => void;
};

export function PlayingScreen({
  question: q,
  questionIndex,
  totalQs,
  timeLeft,
  userInput,
  onInputChange,
  showHint,
  onToggleHint,
  showScoring,
  feedback,
  animatedScore,
  isSubmitting,
  submitError,
  isLast,
  voice,
  onHome,
  onSubmit,
  onNext,
}: Props) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 p-4 md:p-6 relative overflow-hidden" style={sans}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button type="button" onClick={onHome} className="flex items-center gap-2 text-purple-200 hover:text-white transition">
            <Home className="w-5 h-5" />
          </button>
          <div className="flex gap-2 md:gap-3">
            <div className="px-3 md:px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-sm">
              <span className="text-yellow-300 font-bold">第{questionIndex + 1}問</span>
              <span className="text-purple-200"> / 全{totalQs}問</span>
            </div>
            <div
              className={`px-3 md:px-4 py-2 backdrop-blur-md rounded-full border-2 font-black text-lg md:text-xl ${
                timeLeft <= 10
                  ? "bg-red-500/30 border-red-400 text-red-200 animate-pulse"
                  : "bg-white/10 border-white/20 text-white"
              }`}
            >
              {timeLeft}秒
            </div>
          </div>
        </div>

        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-yellow-300 to-amber-400 transition-all duration-1000"
            style={{ width: `${(timeLeft / 60) * 100}%` }}
          />
        </div>

        <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-6 md:p-8 mb-5 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-300/20 rounded-full blur-3xl" />
          <div className="flex items-start gap-4 mb-4 relative">
            <div className="text-5xl md:text-6xl">{q.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold tracking-widest text-yellow-300 mb-1">お題</div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-1" style={serif}>
                {q.title}
              </h3>
              <p className="text-purple-300/70 text-xs mb-3 tracking-wider">{q.titleEn}</p>
              <span className="inline-block px-3 py-1 bg-fuchsia-500/30 border border-fuchsia-400/50 rounded-full text-fuchsia-100 text-xs font-bold">
                あなたの役：{q.role}
              </span>
            </div>
          </div>
          <div className="bg-black/30 rounded-2xl p-4 md:p-5 border-l-4 border-yellow-300 mt-5 relative">
            <div className="text-xs font-bold text-yellow-300/80 mb-2 tracking-wider">SITUATION</div>
            <p className="text-white text-base md:text-lg leading-relaxed">{q.situation}</p>
          </div>
          <button
            type="button"
            onClick={onToggleHint}
            className="mt-4 flex items-center gap-2 text-yellow-300 hover:text-yellow-200 text-sm font-bold transition relative"
          >
            <Lightbulb className="w-4 h-4" />
            {showHint ? "ヒントを隠す" : "困ったらヒント"}
          </button>
          {showHint && (
            <div className="mt-3 bg-amber-300/10 border border-amber-300/30 rounded-2xl p-4 relative">
              <div className="text-xs font-bold text-amber-300 mb-2 tracking-wider">使えそうな表現</div>
              <div className="flex flex-wrap gap-2">
                {q.hints.map((h) => (
                  <span key={h} className="px-3 py-1 bg-white/10 rounded-full text-white text-sm border border-white/10">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {!showScoring ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-5 md:p-6 shadow-xl">
            <div className="flex justify-between mb-3">
              <span className="text-purple-200 text-sm font-bold">あなたの回答（英語で）</span>
              <span className="text-purple-300 text-xs">{countWords(userInput)} 単語</span>
            </div>
            <textarea
              value={userInput}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="英語で入力するか、マイクで話してください。"
              className="w-full bg-black/40 text-white placeholder-purple-300/50 rounded-2xl p-4 min-h-32 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-300/50 border border-white/10 leading-relaxed"
              style={sans}
            />
            {voice.error && <p className="text-rose-300 text-sm mt-2">{voice.error}</p>}
            {voice.useWhisper && (
              <p className="text-purple-300 text-xs mt-2">
                Safari 等では録音後に Whisper で認識します（Cloudflare AI 使用）
              </p>
            )}
            <SubmitErrorBanner error={submitError} onRetry={onSubmit} />
            <div className="flex justify-between mt-4 gap-3">
              <button
                type="button"
                onClick={voice.toggle}
                disabled={!voice.isSupported || voice.isBusy}
                className={`flex items-center gap-2 px-4 md:px-5 py-3 rounded-full font-bold text-sm transition-all ${
                  voice.isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {voice.isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                {voice.micLabel}
              </button>
              <button
                type="button"
                onClick={onSubmit}
                disabled={!userInput.trim() || isSubmitting || voice.isBusy}
                className="flex items-center gap-2 px-6 md:px-8 py-3 bg-gradient-to-r from-yellow-300 to-amber-400 text-purple-950 font-black rounded-full hover:scale-105 transition disabled:opacity-40 shadow-lg text-sm"
              >
                {isSubmitting ? "採点中…" : "回答する"}
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          feedback && (
            <ScoreResultPanel
              feedback={feedback}
              animatedScore={animatedScore}
              nextLabel={isLast ? "結果を見る" : "次の問題へ"}
              onNext={onNext}
            />
          )
        )}
      </div>
    </div>
  );
}
