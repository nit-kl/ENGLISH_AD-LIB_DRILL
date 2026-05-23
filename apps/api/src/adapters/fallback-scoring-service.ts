import type { ScoreFeedback, ScoringService } from "@english-adlib/domain";
import { withAiFallback } from "./fallback-chain.js";

export class FallbackScoringService implements ScoringService {
  constructor(
    private readonly primary: ScoringService,
    private readonly secondary: ScoringService,
    private readonly onFallback?: () => void,
  ) {}

  scoreAnswer(
    input: Parameters<ScoringService["scoreAnswer"]>[0],
  ): Promise<ScoreFeedback> {
    return withAiFallback(
      () => this.primary.scoreAnswer(input),
      () => this.secondary.scoreAnswer(input),
      this.onFallback,
    );
  }
}
