import type { ConversationExchange, CounterpartReply } from "../entities/conversation.js";
import type { Question } from "../entities/question.js";

export type CounterpartReplyInput = {
  question: Question;
  userText: string;
  priorExchanges: readonly ConversationExchange[];
  turnIndex: number;
  totalTurns: number;
};

export interface CounterpartReplyService {
  generateReply(input: CounterpartReplyInput): Promise<CounterpartReply>;
}
