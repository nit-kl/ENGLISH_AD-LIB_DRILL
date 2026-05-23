import type { CounterpartReply, CounterpartReplyService } from "@english-adlib/domain";
import { withAiFallback } from "./fallback-chain.js";

export class FallbackCounterpartReplyService implements CounterpartReplyService {
  constructor(
    private readonly primary: CounterpartReplyService,
    private readonly secondary: CounterpartReplyService,
    private readonly onFallback?: () => void,
  ) {}

  generateReply(
    input: Parameters<CounterpartReplyService["generateReply"]>[0],
  ): Promise<CounterpartReply> {
    return withAiFallback(
      () => this.primary.generateReply(input),
      () => this.secondary.generateReply(input),
      this.onFallback,
    );
  }
}
