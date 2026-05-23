import type {
  CounterpartReply,
  CounterpartReplyInput,
  CounterpartReplyService,
} from "@english-adlib/domain";
import {
  buildCounterpartSystemPrompt,
  buildCounterpartUserPrompt,
} from "../../llm-prompts/counterpart.js";
import { parseCounterpartLlmResponse } from "../../lib/llm/parse-counterpart-response.js";
import type { GeminiClient } from "./gemini-client.js";

const PROVIDER_LABEL = "Gemini";

export class GeminiCounterpartReplyService implements CounterpartReplyService {
  constructor(private readonly client: GeminiClient) {}

  async generateReply(input: CounterpartReplyInput): Promise<CounterpartReply> {
    const text = await this.client.generateText({
      systemInstruction: buildCounterpartSystemPrompt(input.question),
      userText: buildCounterpartUserPrompt(input),
      maxOutputTokens: 400,
      temperature: 0.4,
      jsonMode: true,
    });

    return parseCounterpartLlmResponse(text, PROVIDER_LABEL);
  }
}
