import {
  formatConversationTranscript,
  resolveSceneUpdateJa,
  type ConversationExchange,
  type CounterpartReply,
  type CounterpartReplyService,
  type Question,
} from "@english-adlib/domain";
import { EmptyAnswerError } from "../errors/empty-answer-error.js";

export type SubmitConversationTurnInput = {
  question: Question;
  userText: string;
  priorExchanges: readonly ConversationExchange[];
  turnIndex: number;
  totalTurns: number;
};

/** 中間ターン: 学習者発話 → 相手の返答（採点なし） */
export class SubmitConversationTurnUseCase {
  constructor(private readonly counterpartReplyService: CounterpartReplyService) {}

  async execute(input: SubmitConversationTurnInput): Promise<ConversationExchange> {
    const trimmed = input.userText.trim();
    if (!trimmed) {
      throw new EmptyAnswerError();
    }

    const reply = await this.counterpartReplyService.generateReply({
      question: input.question,
      userText: trimmed,
      priorExchanges: input.priorExchanges,
      turnIndex: input.turnIndex,
      totalTurns: input.totalTurns,
    });

    return normalizeExchange(trimmed, reply, input.question);
  }
}

function normalizeExchange(
  userText: string,
  reply: CounterpartReply,
  question: Question,
): ConversationExchange {
  const sceneUpdateJa = resolveSceneUpdateJa(
    reply.sceneUpdateJa,
    question,
    userText,
  );
  return {
    userText,
    counterpartLineEn: reply.counterpartLineEn.trim(),
    sceneUpdateJa,
  };
}

/** 会話ログを採点用 transcript に変換 */
export function buildScoringTranscript(
  priorExchanges: readonly ConversationExchange[],
  finalUserText: string,
): string {
  const userTurns = [...priorExchanges.map((e) => e.userText), finalUserText.trim()];
  return formatConversationTranscript(userTurns);
}
