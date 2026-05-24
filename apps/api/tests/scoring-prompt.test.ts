import { describe, expect, it } from "vitest";
import type { Question } from "@english-adlib/domain";
import {
  buildScoringSystemPrompt,
  buildScoringUserPrompt,
} from "../src/llm-prompts/scoring.js";

const intermediate1: Question = {
  id: "intermediate-1",
  stageKey: "intermediate",
  title: "ホテルでトラブル",
  titleEn: "Hotel Trouble",
  situation:
    'ハワイのホテルでチェックインしようとしたら、フロント係に "I\'m sorry, I don\'t see a reservation under that name." と言われました。',
  role: "困っている宿泊客",
  counterpart: "フロント係",
  icon: "🏨",
  hints: ["I have a reservation"],
  modelAnswer:
    "I have a reservation under the name Tanaka. Could you please check again?",
};

describe("scoring prompt", () => {
  it("system prompt forbids conversation-log sceneUpdateJa", () => {
    const prompt = buildScoringSystemPrompt(intermediate1);
    expect(prompt).toContain("PLAIN JAPANESE PROSE");
    expect(prompt).toContain('{"Learner said"');
    expect(prompt).toContain("never a nested JSON object");
    expect(prompt).toContain("フロント係");
  });

  it("system prompt includes hotel-specific good example", () => {
    const prompt = buildScoringSystemPrompt(intermediate1);
    expect(prompt).toContain("確認メール");
    expect(prompt).toContain("Tanaka");
  });

  it("user prompt reinforces plain Japanese sceneUpdateJa", () => {
    const answer =
      "I have a reservation under the name Tanaka. Could you please check again? I also have a confirmation email on my phone.";
    const prompt = buildScoringUserPrompt(intermediate1, answer);
    expect(prompt).toContain("plain Japanese sentences");
    expect(prompt).toContain("Do NOT write a conversation log");
    expect(prompt).toContain(answer);
  });
});
