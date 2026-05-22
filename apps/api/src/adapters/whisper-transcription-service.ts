import type { AiBinding } from "./workers-ai-scoring-service.js";

const WHISPER_MODEL = "@cf/openai/whisper";

export class WhisperTranscriptionService {
  constructor(private readonly ai: AiBinding) {}

  async transcribe(
    audioBytes: Uint8Array,
    options?: { language?: string },
  ): Promise<string> {
    const input: Record<string, unknown> = {
      audio: Array.from(audioBytes),
    };
    if (options?.language?.trim()) {
      input.language = options.language.trim();
    }

    const result = await this.ai.run(WHISPER_MODEL, input);

    if (typeof result === "string") {
      return result.trim();
    }

    const text = result.text ?? result.transcription ?? "";
    if (!text.trim()) {
      throw new Error("Empty transcription from Whisper");
    }
    return text.trim();
  }
}
