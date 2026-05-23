import type {
  CounterpartReply,
  CounterpartReplyInput,
  CounterpartReplyService,
} from "@english-adlib/domain";
import {
  buildCounterpartSystemPrompt,
  buildCounterpartUserPrompt,
} from "../llm-prompts/counterpart.js";
import { parseCounterpartLlmResponse } from "../lib/llm/parse-counterpart-response.js";
import type { AiBinding } from "./workers-ai-scoring-service.js";

const PROVIDER_LABEL = "Workers AI";

/** LLM で相手役の中間返答を生成（採点なし） */
export class WorkersAiCounterpartReplyService implements CounterpartReplyService {
  constructor(
    private readonly ai: AiBinding,
    private readonly model: string,
  ) {}

  async generateReply(input: CounterpartReplyInput): Promise<CounterpartReply> {
    const messages = [
      { role: "system", content: buildCounterpartSystemPrompt(input.question) },
      { role: "user", content: buildCounterpartUserPrompt(input) },
    ];

    const result = await this.ai.run(this.model, {
      messages,
      max_tokens: 400,
      temperature: 0.4,
    });

    return parseCounterpartLlmResponse(result, PROVIDER_LABEL);
  }
}
