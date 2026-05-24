import { describe, expect, it } from "vitest";
import {
  formatConversationTranscript,
  formatFullConversationForScoring,
} from "../src/lib/conversation-transcript.js";

describe("formatConversationTranscript", () => {
  it("1ターンはそのまま", () => {
    expect(formatConversationTranscript(["Hello there"])).toBe("Hello there");
  });

  it("複数ターンは Turn 形式", () => {
    const text = formatConversationTranscript(["Hi", "Nice to meet you"]);
    expect(text).toContain("Turn 1 (Learner): Hi");
    expect(text).toContain("Turn 2 (Learner): Nice to meet you");
  });
});

describe("formatFullConversationForScoring", () => {
  it("中間ターンなしは最終発話のみ", () => {
    expect(
      formatFullConversationForScoring([], "I'd like a latte", "Barista"),
    ).toBe("I'd like a latte");
  });

  it("相手の返答を含む全会話を整形する", () => {
    const text = formatFullConversationForScoring(
      [
        {
          userText: "In my previous role, I led a launch.",
          counterpartLineEn: "That sounds challenging. What was the outcome?",
          sceneUpdateJa: "面接官が深掘りを始めた。",
        },
      ],
      "We delivered on time and exceeded sales targets.",
      "Interviewer",
    );
    expect(text).toContain("Learner: In my previous role");
    expect(text).toContain("Interviewer: That sounds challenging");
    expect(text).toContain("Learner: We delivered on time");
  });
});
