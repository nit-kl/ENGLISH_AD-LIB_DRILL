import { useCallback, useEffect, useState } from "react";
import {
  getCertQuestions,
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
import { ResultScreen } from "./screens/ResultScreen";
import { StageSelectScreen } from "./screens/StageSelectScreen";
import { TitleScreen } from "./screens/TitleScreen";

type Screen = "title" | "modeSelect" | "stageSelect" | "playing" | "result" | "certResult";
type Mode = "cert" | "stage";

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
  const [showHint, setShowHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<ApiClientError | null>(null);

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
          : new ApiClientError("?????????", "SCORING_FAILED", 502, true),
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [showScoring, isSubmitting, mode, currentStage, questionIndex, userInput, voice]);

  useEffect(() => {
    if (screen === "playing" && timeLeft > 0 && !showScoring && !isSubmitting) {
      const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
      return () => clearTimeout(t);
    }
    if (timeLeft === 0 && screen === "playing" && !showScoring && !isSubmitting) {
      void handleSubmit();
    }
  }, [timeLeft, screen, showScoring, isSubmitting, handleSubmit]);

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

  const resetPlayState = () => {
    setUserInput("");
    setTimeLeft(60);
    setScore(null);
    setFeedback(null);
    setShowScoring(false);
    setShowHint(false);
    setSubmitError(null);
    voice.stop();
  };

  const handleStartCert = () => {
    setMode("cert");
    setQuestionIndex(0);
    setCertScores([]);
    resetPlayState();
    setScreen("playing");
  };

  const handleStartStage = (key: StageKey) => {
    setMode("stage");
    setCurrentStage(key);
    setQuestionIndex(0);
    resetPlayState();
    setScreen("playing");
  };

  const handleNext = () => {
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
    } else if (questionIndex + 1 >= questions.length) {
      setShowScoring(false);
      setScreen("result");
      return;
    } else {
      setQuestionIndex(questionIndex + 1);
    }
    resetPlayState();
  };

  const handleHome = () => {
    setScreen("title");
    setMode(null);
    setCurrentStage(null);
    setQuestionIndex(0);
    setCertScores([]);
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

  if (screen === "playing") {
    const questions = getCurrentQuestions();
    const q = questions[questionIndex];
    if (!q) return null;

    const totalQs = mode === "cert" ? 10 : questions.length;
    const isLast =
      (mode === "cert" && questionIndex + 1 >= 10) ||
      (mode === "stage" && questionIndex + 1 >= questions.length);

    return (
      <PlayingScreen
        question={q}
        questionIndex={questionIndex}
        totalQs={totalQs}
        timeLeft={timeLeft}
        userInput={userInput}
        onInputChange={setUserInput}
        showHint={showHint}
        onToggleHint={() => setShowHint((v) => !v)}
        showScoring={showScoring}
        feedback={feedback}
        animatedScore={animatedScore}
        isSubmitting={isSubmitting}
        submitError={submitError}
        isLast={isLast}
        voice={voice}
        onHome={handleHome}
        onSubmit={() => void handleSubmit()}
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
