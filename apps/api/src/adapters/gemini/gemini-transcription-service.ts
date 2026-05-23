import type { TranscriptionService } from "@english-adlib/domain";
import { buildTranscriptionPrompt } from "../../llm-prompts/transcription.js";
import type { GeminiClient } from "./gemini-client.js";

/** Workers AI Whisper 失敗時の文字起こしフォールバック */
export class GeminiTranscriptionService implements TranscriptionService {
  constructor(private readonly client: GeminiClient) {}

  async transcribe(
    audioBytes: Uint8Array,
    options?: { language?: string; mimeType?: string },
  ): Promise<string> {
    const mimeType = options?.mimeType?.trim() || "audio/webm";
    const text = await this.client.generateFromAudio({
      audioBytes,
      mimeType,
      prompt: buildTranscriptionPrompt(options?.language),
      maxOutputTokens: 512,
      temperature: 0.1,
    });

    if (!text.trim()) {
      throw new Error("Empty transcription from Gemini");
    }

    return text.trim();
  }
}
