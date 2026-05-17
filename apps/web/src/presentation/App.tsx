import { useCallback, useEffect, useState } from "react";
import {
  getCertQuestions,
  hasQuestionMedia,
  STAGES,
  type Question,
  type ScoreFeedback,
  type StageKey,
} from "@english-adlib/domain";
import { ApiClientError, scoreAnswer } from "../infrastructure/api-client";
import { useVoiceInput } from "./hooks/useVoiceInput";
import { CertResultScreen } from "./screens/CertResultScreen";
import { ModeSelectScreen } from "./screens/ModeSelectScreen";
import { PlayingScreen } from "./screens/PlayingScreen";
import { RevealScreen } from "./screens/RevealScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { QuestionListScreen } from "./screens/QuestionListScreen";
import { StageSelectScreen } from "./screens/StageSelectScreen";
import { TitleScreen } from "./screens/TitleScreen";

type Screen =
  | "title"
  | "modeSelect"
  | "stageSelect"
  | "questionList"
  | "playing"
  | "reveal"
  | "result"
  | "certResult";
type Mode = "cert" | "stage";

function initialSetupComplete(question: Question | undefined): boolean {
  return question == null || !hasQuestionMedia(question);
}

export function App() {
  const [screen, setScreen] = useState<Screen>("title");
  const [mode, setMode] = useState<Mode | null>(null);
  const [currentStage, setCurrentStage] = useState<StageKey | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<ScoreFeedback | null>(null);
  const [certScores, setCertScores] = useState<number[]>([]);
  const [showScoring, setShowScoring] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<ApiClientError | null>(null);
  const [setupComplete, setSetupComplete] = useState(false);
  const [answerTimerActive, setAnswerTimerActive] = useState(false);
  const [stageCompletedIds, setStageCompletedIds] = useState<Set<string>>(() => new Set());

  const appendTranscript = useCallback((text: string) => {
    setUserInput((prev) => (prev ? `${prev} ${text}` : text));
  }, []);

  const voice = useVoiceInput(appendTranscript);

  const getCurrentQuestions = (): Question[] => {
    if (mode === "cert") return getCertQuestions();
    if (currentStage) return STAGES[currentStage].questions;
    return [];
  };

  const handleSubmit = useCallback(async () => {
    if (showScoring || isSubmitting) return;
    const questions = getCurrentQuestions();
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
      setAnimatedScore(0);
    } catch (e) {
      setSubmitError(
        e instanceof ApiClientError
          ? e
          : new ApiClientError("採点に失敗しました", "SCORING_FAILED", 502, true),
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [showScoring, isSubmitting, mode, currentStage, questionIndex, userInput, voice]);

  useEffect(() => {
    if (
      screen === "playing" &&
      answerTimerActive &&
      timeLeft > 0 &&
      !showScoring &&
      !isSubmitting
    ) {
      const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
      return () => clearTimeout(t);
    }
    if (
      timeLeft === 0 &&
      screen === "playing" &&
      answerTimerActive &&
      !showScoring &&
      !isSubmitting
    ) {
      void handleSubmit();
    }
  }, [timeLeft, screen, answerTimerActive, showScoring, isSubmitting, handleSubmit]);

  useEffect(() => {
    if (showScoring && score !== null) {
      let v = 0;
      const inc = setInterval(() => {
        v += 2;
        if (v >= score) {
          v = score;
          clearInterval(inc);
        }
        setAnimatedScore(v);
      }, 20);
      return () => clearInterval(inc);
    }
  }, [showScoring, score]);

  const resetPlayState = (question?: Question) => {
    setUserInput("");
    setTimeLeft(60);
    setScore(null);
    setFeedback(null);
    setShowScoring(false);
    setSubmitError(null);
    const ready = initialSetupComplete(question);
    setSetupComplete(ready);
    setAnswerTimerActive(ready);
    voice.stop();
  };

  const handleSetupComplete = useCallback(() => {
    setSetupComplete(true);
    setAnswerTimerActive(true);
    setTimeLeft(60);
  }, []);

  const handleStartCert = () => {
    setMode("cert");
    setQuestionIndex(0);
    setCertScores([]);
    const q = getCertQuestions()[0];
    resetPlayState(q);
    setScreen("playing");
  };

  const handleStartStage = (key: StageKey) => {
    setMode("stage");
    setCurrentStage(key);
    setQuestionIndex(0);
    resetPlayState();
    setScreen("questionList");
  };

  const handleSelectQuestion = (index: number) => {
    if (!currentStage) return;
    const q = STAGES[currentStage].questions[index];
    if (!q) return;
    setQuestionIndex(index);
    resetPlayState(q);
    setScreen("playing");
  };

  const handleReturnToQuestionList = (markCurrentComplete = true) => {
    const questions = getCurrentQuestions();
    const q = questions[questionIndex];
    if (markCurrentComplete && q) {
      setStageCompletedIds((prev) => new Set(prev).add(q.id));
    }
    setShowScoring(false);
    resetPlayState();
    setScreen("questionList");
  };

  const handleNext = () => {
    if (mode === "stage") {
      handleReturnToQuestionList();
      return;
    }

    const questions = getCurrentQuestions();
    if (mode === "cert" && score !== null) {
      const newScores = [...certScores, score];
      setCertScores(newScores);
      if (questionIndex + 1 >= 10) {
        setShowScoring(false);
        setScreen("certResult");
        return;
      }
      setQuestionIndex(questionIndex + 1);
    } else {
      setQuestionIndex(questionIndex + 1);
    }
    const nextQ = questions[questionIndex + 1];
    resetPlayState(nextQ);
    setScreen("playing");
  };

  const handleContinueToReveal = () => {
    setScreen("reveal");
  };

  const handleHome = () => {
    setScreen("title");
    setMode(null);
    setCurrentStage(null);
    setQuestionIndex(0);
    setCertScores([]);
    setStageCompletedIds(new Set());
    resetPlayState();
  };

  if (screen === "title") {
    return <TitleScreen onStart={() => setScreen("modeSelect")} />;
  }

  if (screen === "modeSelect") {
    return (
      <ModeSelectScreen
        onHome={handleHome}
        onCert={handleStartCert}
        onStage={() => setScreen("stageSelect")}
      />
    );
  }

  if (screen === "stageSelect") {
    return (
      <StageSelectScreen onBack={() => setScreen("modeSelect")} onSelect={handleStartStage} />
    );
  }

  if (screen === "questionList" && currentStage) {
    return (
      <QuestionListScreen
        stageKey={currentStage}
        completedIds={stageCompletedIds}
        onBack={() => setScreen("stageSelect")}
        onHome={handleHome}
        onSelect={(_q, index) => handleSelectQuestion(index)}
      />
    );
  }

  const questions = getCurrentQuestions();
  const stagePickMode = mode === "stage";
  const q = questions[questionIndex];
  const totalQs = mode === "cert" ? 10 : questions.length;
  const isLast = mode === "cert" && questionIndex + 1 >= 10;
  const finishLabel = stagePickMode ? "一覧に戻る" : isLast ? "結果を見る" : "次の問題へ";

  if (screen === "playing" && q) {
    return (
      <PlayingScreen
        question={q}
        questionIndex={questionIndex}
        totalQs={totalQs}
        pickMode={stagePickMode}
        finishLabel={finishLabel}
        timeLeft={timeLeft}
        answerTimerActive={answerTimerActive}
        setupComplete={setupComplete}
        onSetupComplete={handleSetupComplete}
        userInput={userInput}
        onInputChange={setUserInput}
        showScoring={showScoring}
        feedback={feedback}
        animatedScore={animatedScore}
        isSubmitting={isSubmitting}
        submitError={submitError}
        voice={voice}
        onHome={handleHome}
        onBackToList={stagePickMode ? () => handleReturnToQuestionList(false) : undefined}
        onSubmit={() => void handleSubmit()}
        onContinueToReveal={handleContinueToReveal}
        onNext={handleNext}
      />
    );
  }

  if (screen === "reveal" && q && feedback) {
    return (
      <RevealScreen
        question={q}
        feedback={feedback}
        finishLabel={finishLabel}
        onHome={handleHome}
        onBackToList={stagePickMode ? () => handleReturnToQuestionList(true) : undefined}
        onNext={handleNext}
      />
    );
  }

  if (screen === "result" && currentStage) {
    return (
      <ResultScreen
        stageKey={currentStage}
        score={score}
        onOtherStages={() => setScreen("stageSelect")}
        onHome={handleHome}
      />
    );
  }

  if (screen === "certResult") {
    return (
      <CertResultScreen certScores={certScores} onRetry={handleStartCert} onHome={handleHome} />
    );
  }

  return null;
}
