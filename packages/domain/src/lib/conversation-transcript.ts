import type { ConversationExchange } from "../entities/conversation.js";

/** 採点 LLM 向けに学習者の全発話を整形する（表示用・後方互換） */
export function formatConversationTranscript(userTurns: readonly string[]): string {
  if (userTurns.length === 1) {
    return userTurns[0]!;
  }
  return userTurns
    .map((text, index) => `Turn ${index + 1} (Learner): ${text}`)
    .join("\n");
}

/** 採点 LLM 向けに学習者と相手の全会話を整形する */
export function formatFullConversationForScoring(
  priorExchanges: readonly ConversationExchange[],
  finalUserText: string,
  counterpart: string,
): string {
  if (priorExchanges.length === 0) {
    return finalUserText.trim();
  }

  const lines: string[] = [];
  for (const ex of priorExchanges) {
    lines.push(`Learner: ${ex.userText}`);
    lines.push(`${counterpart}: ${ex.counterpartLineEn}`);
  }
  const final = finalUserText.trim();
  if (final) {
    lines.push(`Learner: ${final}`);
  }
  return lines.join("\n");
}

/** 0-based の turnIndex が最終ターンか */
export function isFinalConversationTurn(turnIndex: number, totalTurns: number): boolean {
  return turnIndex + 1 >= totalTurns;
}
