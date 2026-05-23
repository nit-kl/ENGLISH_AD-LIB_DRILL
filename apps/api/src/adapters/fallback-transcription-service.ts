import type { TranscriptionService } from "@english-adlib/domain";
import { withAiFallback } from "./fallback-chain.js";

export class FallbackTranscriptionService implements TranscriptionService {
  constructor(
    private readonly primary: TranscriptionService,
    private readonly secondary: TranscriptionService,
    private readonly onFallback?: () => void,
  ) {}

  transcribe(
    audioBytes: Uint8Array,
    options?: Parameters<TranscriptionService["transcribe"]>[1],
  ): Promise<string> {
    return withAiFallback(
      () => this.primary.transcribe(audioBytes, options),
      () => this.secondary.transcribe(audioBytes, options),
      this.onFallback,
    );
  }
}
