import { useEffect, useState } from "react";

/** 採点スコアのカウントアップアニメーション */
export function useScoreAnimation(showScoring: boolean, score: number | null): number {
  const [animatedScore, setAnimatedScore] = useState(0);

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
    setAnimatedScore(0);
  }, [showScoring, score]);

  return animatedScore;
}
