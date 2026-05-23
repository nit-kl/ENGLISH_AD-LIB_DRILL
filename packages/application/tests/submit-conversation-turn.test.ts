import { describe, expect, it } from "vitest";
import type { CounterpartReply, CounterpartReplyService, Question } from "@english-adlib/domain";
import { SubmitConversationTurnUseCase } from "../src/use-cases/submit-conversation-turn.js";

const question: Question = {
  id: "intermediate-1",
  stageKey: "intermediate",
  title: "ホテルでトラブル",
  titleEn: "Hotel Trouble",
  situation: "No reservation found.",
  role: "宿泊客",
  counterpart: "フロント係",
  icon: "🏨",
  hints: ["I have a reservation"],
  modelAnswer: "I have a reservation under Tanaka.",
};

class FakeCounterpartReplyService implements CounterpartReplyService {
  async generateReply(): Promise<CounterpartReply> {
    return {
      counterpartLineEn: "Let me check again. What name is the reservation under?",
      sceneUpdateJa: "フロント係がもう一度確認し、予約名を尋ねる場面に進みました。",
    };
  }
}

/** 責務: 中間ターンの相手返答オーケストレーション */
describe("SubmitConversationTurnUseCase", () => {
  it("空の発話は拒否する", async () => {
    const useCase = new SubmitConversationTurnUseCase(new FakeCounterpartReplyService());
    await expect(
      useCase.execute({
        question,
        userText: "  ",
        priorExchanges: [],
        turnIndex: 0,
        totalTurns: 2,
      }),
    ).rejects.toThrow(/empty/i);
  });

  it("相手返答付きの exchange を返す", async () => {
    const useCase = new SubmitConversationTurnUseCase(new FakeCounterpartReplyService());
    const exchange = await useCase.execute({
      question,
      userText: "I have a reservation under Tanaka.",
      priorExchanges: [],
      turnIndex: 0,
      totalTurns: 2,
    });
    expect(exchange.userText).toContain("Tanaka");
    expect(exchange.counterpartLineEn).toContain("check again");
    expect(exchange.sceneUpdateJa).toContain("フロント");
  });
});
