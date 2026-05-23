import { useEffect } from "react";
import type { Screen } from "./game-flow.js";

type Params = {
  screen: Screen;
  answerTimerActive: boolean;
  timeLeft: number;
  showScoring: boolean;
  isSubmitting: boolean;
  onTick: () => void;
  onTimeout: () => void;
};

/** 60秒回答タイマー（0で自動採点） */
export function useAnswerTimer({
  screen,
  answerTimerActive,
  timeLeft,
  showScoring,
  isSubmitting,
  onTick,
  onTimeout,
}: Params): void {
  useEffect(() => {
    if (
      screen === "playing" &&
      answerTimerActive &&
      timeLeft > 0 &&
      !showScoring &&
      !isSubmitting
    ) {
      const t = setTimeout(onTick, 1000);
      return () => clearTimeout(t);
    }
    if (
      timeLeft === 0 &&
      screen === "playing" &&
      answerTimerActive &&
      !showScoring &&
      !isSubmitting
    ) {
      onTimeout();
    }
  }, [
    timeLeft,
    screen,
    answerTimerActive,
    showScoring,
    isSubmitting,
    onTick,
    onTimeout,
  ]);
}
