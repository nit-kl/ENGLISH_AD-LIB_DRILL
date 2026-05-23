import { useCallback, useState } from "react";
import { STAGES } from "@english-adlib/content";
import type { Question, ScoreFeedback, StageKey } from "@english-adlib/domain";
import {
  ApiClientError,
  scoreAnswer,
} from "../infrastructure/scoring-api-client.js";
import { useVoiceInput } from "../presentation/hooks/useVoiceInput.js";
import {
  createPlayStateReset,
  getQuestionsForStage,
  markQuestionComplete,
  type Screen,
} from "./game-flow.js";
import { useAnswerTimer } from "./use-answer-timer.js";
import { useScoreAnimation } from "./use-score-animation.js";

/** 画面遷移・採点・タイマーを束ねるアプリケーション層 hook */
export function useGameFlow() {
  const [screen, setScreen] = useState<Screen>("title");
  const [currentStage, setCurrentStage] = useState<StageKey | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<ScoreFeedback | null>(null);
  const [showScoring, setShowScoring] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<ApiClientError | null>(null);
  const [setupComplete, setSetupComplete] = useState(false);
  const [answerTimerActive, setAnswerTimerActive] = useState(false);
  const [stageCompletedIds, setStageCompletedIds] = useState<Set<string>>(
    () => new Set(),
  );

  const appendTranscript = useCallback((text: string) => {
    setUserInput((prev) => (prev ? `${prev} ${text}` : text));
  }, []);

  const voice = useVoiceInput(appendTranscript, { language: "en" });

  const resetPlayState = useCallback(
    (question?: Question) => {
      const reset = createPlayStateReset(question);
      setUserInput(reset.userInput);
      setTimeLeft(reset.timeLeft);
      setScore(reset.score);
      setFeedback(reset.feedback);
      setShowScoring(reset.showScoring);
      setSubmitError(reset.submitError);
      setSetupComplete(reset.setupComplete);
      setAnswerTimerActive(reset.answerTimerActive);
      voice.stop();
    },
    [voice],
  );

  const handleSubmit = useCallback(async () => {
    if (showScoring || isSubmitting) return;
    const questions = getQuestionsForStage(currentStage);
    const q = questions[questionIndex];
    if (!q) return;

    setIsSubmitting(true);
    setSubmitError(null);
    voice.stop();

    try {
      const result = await scoreAnswer(q.id, userInput || "...");
      setScore(result.total);
      setFeedback(result);
      setShowScoring(true);
    } catch (e) {
      setSubmitError(
        e instanceof ApiClientError
          ? e
          : new ApiClientError("採点に失敗しました", "SCORING_FAILED", 502, true),
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [showScoring, isSubmitting, currentStage, questionIndex, userInput, voice]);

  const handleTimerTick = useCallback(() => {
    setTimeLeft((v) => v - 1);
  }, []);

  const handleTimerTimeout = useCallback(() => {
    void handleSubmit();
  }, [handleSubmit]);

  useAnswerTimer({
    screen,
    answerTimerActive,
    timeLeft,
    showScoring,
    isSubmitting,
    onTick: handleTimerTick,
    onTimeout: handleTimerTimeout,
  });

  const animatedScore = useScoreAnimation(showScoring, score);

  const handleSetupComplete = useCallback(() => {
    setSetupComplete(true);
    setAnswerTimerActive(true);
    setTimeLeft(60);
  }, []);

  const handleStartStage = useCallback(
    (key: StageKey) => {
      setCurrentStage(key);
      setQuestionIndex(0);
      resetPlayState();
      setScreen("questionList");
    },
    [resetPlayState],
  );

  const handleSelectQuestion = useCallback(
    (index: number) => {
      if (!currentStage) return;
      const q = STAGES[currentStage].questions[index];
      if (!q) return;
      setQuestionIndex(index);
      resetPlayState(q);
      setScreen("playing");
    },
    [currentStage, resetPlayState],
  );

  const handleReturnToQuestionList = useCallback(
    (markCurrentComplete = true) => {
      const questions = getQuestionsForStage(currentStage);
      const q = questions[questionIndex];
      if (markCurrentComplete && q) {
        setStageCompletedIds((prev) => markQuestionComplete(prev, q.id));
      }
      setShowScoring(false);
      resetPlayState();
      setScreen("questionList");
    },
    [currentStage, questionIndex, resetPlayState],
  );

  const handleHome = useCallback(() => {
    setScreen("title");
    setCurrentStage(null);
    setQuestionIndex(0);
    setStageCompletedIds(new Set());
    resetPlayState();
  }, [resetPlayState]);

  const questions = getQuestionsForStage(currentStage);
  const currentQuestion = questions[questionIndex];

  return {
    screen,
    setScreen,
    currentStage,
    questionIndex,
    userInput,
    setUserInput,
    timeLeft,
    score,
    feedback,
    showScoring,
    animatedScore,
    isSubmitting,
    submitError,
    setupComplete,
    answerTimerActive,
    stageCompletedIds,
    voice,
    questions,
    currentQuestion,
    finishLabel: "一覧に戻る",
    handleStartStage,
    handleSelectQuestion,
    handleReturnToQuestionList,
    handleNext: () => handleReturnToQuestionList(),
    handleContinueToReveal: () => setScreen("reveal"),
    handleHome,
    handleSetupComplete,
    handleSubmit,
  };
}
