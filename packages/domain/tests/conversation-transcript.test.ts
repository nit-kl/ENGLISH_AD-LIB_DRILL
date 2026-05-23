import { describe, expect, it } from "vitest";
import {
  formatConversationTranscript,
  isFinalConversationTurn,
} from "../src/lib/conversation-transcript.js";

/** 責務: 会話 transcript 整形とターン判定 */
describe("formatConversationTranscript", () => {
  it("1ターンはそのまま返す", () => {
    expect(formatConversationTranscript(["Hello there"])).toBe("Hello there");
  });

  it("複数ターンは Turn N 形式", () => {
    const text = formatConversationTranscript(["Hi", "Nice to meet you"]);
    expect(text).toContain("Turn 1 (Learner): Hi");
    expect(text).toContain("Turn 2 (Learner): Nice to meet you");
  });
});

describe("isFinalConversationTurn", () => {
  it("初級1ターンは index 0 が最終", () => {
    expect(isFinalConversationTurn(0, 1)).toBe(true);
  });

  it("中級2ターンは index 0 は中間", () => {
    expect(isFinalConversationTurn(0, 2)).toBe(false);
    expect(isFinalConversationTurn(1, 2)).toBe(true);
  });
});
