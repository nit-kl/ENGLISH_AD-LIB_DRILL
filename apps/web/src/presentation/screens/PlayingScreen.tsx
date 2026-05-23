import { useCallback } from "react";
import { ChevronRight, Home, MessageCircle, Mic, MicOff, Send } from "lucide-react";
import {
  countWords,
  hasQuestionMedia,
  type ConversationExchange,
  type Question,
  type ScoreFeedback,
} from "@english-adlib/domain";
import type { ApiClientError } from "../../infrastructure/scoring-api-client";
import { ScoreResultPanel } from "../components/ScoreResultPanel";
import { SubmitErrorBanner } from "../components/SubmitErrorBanner";
import { YouTubePlayer } from "../components/YouTubePlayer";
import type { useVoiceInput } from "../hooks/useVoiceInput";

const sans = { fontFamily: '"Noto Sans JP", sans-serif' } as const;

type Voice = ReturnType<typeof useVoiceInput>;

type Props = {
  question: Question;
  questionIndex: number;
  totalQs: number;
  pickMode?: boolean;
  finishLabel: string;
  timeLeft: number;
  answerTimerActive: boolean;
  setupComplete: boolean;
  onSetupComplete: () => void;
  userInput: string;
  onInputChange: (v: string) => void;
  conversationExchanges: ConversationExchange[];
  totalConversationTurns: number;
  currentTurnIndex: number;
  onFinalTurn: boolean;
  showScoring: boolean;
  feedback: ScoreFeedback | null;
  animatedScore: number;
  displayedUserAnswer: string;
  isSubmitting: boolean;
  submitError: ApiClientError | null;
  voice: Voice;
  onHome: () => void;
  onBackToList?: () => void;
  onSubmit: () => void;
  onContinueToReveal: () => void;
  onNext: () => void;
};

export function PlayingScreen({
  question: q,
  questionIndex,
  totalQs,
  pickMode = false,
  finishLabel,
  timeLeft,
  answerTimerActive,
  setupComplete,
  onSetupComplete,
  userInput,
  onInputChange,
  conversationExchanges,
  totalConversationTurns,
  currentTurnIndex,
  onFinalTurn,
  showScoring,
  feedback,
  animatedScore,
  displayedUserAnswer,
  isSubmitting,
  submitError,
  voice,
  onHome,
  onBackToList,
  onSubmit,
  onContinueToReveal,
  onNext,
}: Props) {
  const videoMode = hasQuestionMedia(q);
  const canAnswer = !videoMode || setupComplete;
  const timerVisible = answerTimerActive && canAnswer && !showScoring;
  const multiTurn = totalConversationTurns > 1;
  const submitLabel = isSubmitting
    ? onFinalTurn
      ? "採点中…"
      : "送信中…"
    : onFinalTurn
      ? "採点する"
      : "返答する";

  const handleSetupComplete = useCallback(() => {
    onSetupComplete();
  }, [onSetupComplete]);

  const scoringNextLabel = videoMode ? "模範解答と解説を見る" : finishLabel;
  const scoringNext = videoMode ? onContinueToReveal : onNext;

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
            <button type="button" onClick={onHome} className="flex items-center gap-2 text-purple-200 hover:text-white transition">
              <Home className="w-5 h-5" />
            </button>
          )}
          <div className="flex gap-2 md:gap-3">
            <div className="px-3 md:px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-sm max-w-[min(100%,14rem)]">
              {pickMode ? (
                <span className="text-yellow-300 font-bold truncate block">
                  {q.icon} {q.title}
                </span>
              ) : (
                <>
                  <span className="text-yellow-300 font-bold">第{questionIndex + 1}問</span>
                  <span className="text-purple-200"> / 全{totalQs}問</span>
                </>
              )}
            </div>
            {multiTurn && !showScoring && (
              <div className="px-3 py-2 bg-emerald-500/20 backdrop-blur-md rounded-full border border-emerald-400/30 text-emerald-100 text-xs font-bold flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" />
                会話 {currentTurnIndex + 1}/{totalConversationTurns}
              </div>
            )}
            {timerVisible && (
              <div
                className={`px-3 md:px-4 py-2 backdrop-blur-md rounded-full border-2 font-black text-lg md:text-xl ${
                  timeLeft <= 10
                    ? "bg-red-500/30 border-red-400 text-red-200 animate-pulse"
                    : "bg-white/10 border-white/20 text-white"
                }`}
              >
                {timeLeft}秒
              </div>
            )}
          </div>
        </div>

        {timerVisible && (
          <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-yellow-300 to-amber-400 transition-all duration-1000"
              style={{ width: `${(timeLeft / 60) * 100}%` }}
            />
          </div>
        )}

        {videoMode && !showScoring && (
          <div className="mb-5">
            <YouTubePlayer
              segment={q.media.setup}
              mode="setup"
              onSetupComplete={handleSetupComplete}
            />
          </div>
        )}

        {!videoMode && !showScoring && conversationExchanges.length === 0 && (
          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-6 md:p-8 mb-5 shadow-2xl">
            <div className="text-xs font-bold tracking-widest text-yellow-300 mb-2">お題</div>
            <p className="text-white text-base md:text-lg leading-relaxed">{q.situation}</p>
            {multiTurn && (
              <p className="text-purple-200 text-sm mt-4">
                このステージは <span className="text-yellow-300 font-bold">{totalConversationTurns}回</span> 英語で返答してから採点されます。
              </p>
            )}
          </div>
        )}

        {conversationExchanges.length > 0 && !showScoring && (
          <div className="space-y-3 mb-5">
            {conversationExchanges.map((exchange, index) => (
              <div
                key={`${index}-${exchange.userText.slice(0, 24)}`}
                className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 space-y-3"
              >
                <div>
                  <div className="text-xs font-bold text-yellow-300 mb-1">あなた（{index + 1}回目）</div>
                  <p className="text-white text-sm leading-relaxed">{exchange.userText}</p>
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-300 mb-1">{q.counterpart}</div>
                  <p className="text-purple-100 text-sm italic leading-relaxed">
                    &ldquo;{exchange.counterpartLineEn}&rdquo;
                  </p>
                  <p className="text-purple-200/90 text-xs mt-2 leading-relaxed">
                    {exchange.sceneUpdateJa}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!showScoring ? (
          <div
            className={`bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-5 md:p-6 shadow-xl transition-opacity ${
              canAnswer ? "opacity-100" : "opacity-40 pointer-events-none"
            }`}
          >
            {videoMode && setupComplete && conversationExchanges.length === 0 && (
              <p className="text-center text-yellow-200 font-bold text-sm mb-4">さあ、英語で答えて</p>
            )}
            {multiTurn && conversationExchanges.length > 0 && (
              <p className="text-center text-emerald-200 font-bold text-sm mb-4">
                {q.counterpart}の返答を受けて、続きを英語で
              </p>
            )}
            <div className="flex justify-between mb-3">
              <span className="text-purple-200 text-sm font-bold">
                {multiTurn
                  ? `あなたの返答（${currentTurnIndex + 1}/${totalConversationTurns}）`
                  : "あなたの回答（英語で）"}
              </span>
              <span className="text-purple-300 text-xs">{countWords(userInput)} 単語</span>
            </div>
            <textarea
              value={userInput}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="英語で入力するか、マイクで話してください。"
              disabled={!canAnswer}
              className="w-full bg-black/40 text-white placeholder-purple-300/50 rounded-2xl p-4 min-h-32 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-300/50 border border-white/10 leading-relaxed disabled:cursor-not-allowed"
              style={sans}
            />
            {voice.error && <p className="text-rose-300 text-sm mt-2">{voice.error}</p>}
            {voice.isListening && (
              <p className="text-purple-300 text-xs mt-2">
                録音中です。話し終わったらもう一度ボタンを押して認識します。
              </p>
            )}
            {voice.isBusy && voice.useWhisper && (
              <p className="text-purple-300 text-xs mt-2">
                英語を認識しています…（Cloudflare AI 使用）
              </p>
            )}
            <SubmitErrorBanner error={submitError} onRetry={onSubmit} />
            <div className="flex justify-between mt-4 gap-3">
              <button
                type="button"
                onClick={voice.toggle}
                disabled={!canAnswer || !voice.isSupported || voice.isBusy}
                className={`flex items-center gap-2 px-4 md:px-5 py-3 rounded-full font-bold text-sm transition-all ${
                  voice.isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-white/10 text-white hover:bg-white/20"
                } disabled:opacity-40`}
              >
                {voice.isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                {voice.micLabel}
              </button>
              <button
                type="button"
                onClick={onSubmit}
                disabled={!canAnswer || !userInput.trim() || isSubmitting || voice.isBusy}
                className="flex items-center gap-2 px-6 md:px-8 py-3 bg-gradient-to-r from-yellow-300 to-amber-400 text-purple-950 font-black rounded-full hover:scale-105 transition disabled:opacity-40 shadow-lg text-sm"
              >
                {submitLabel}
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          feedback && (
            <ScoreResultPanel
              feedback={feedback}
              modelAnswer={q.modelAnswer}
              animatedScore={animatedScore}
              userAnswer={displayedUserAnswer.trim() || "..."}
              nextLabel={scoringNextLabel}
              onNext={scoringNext}
              deferModelAndTips={videoMode}
            />
          )
        )}
      </div>
    </div>
  );
}
