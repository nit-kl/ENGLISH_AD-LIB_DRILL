/** 採点 LLM 向けに学習者の全発話を整形する */
export function formatConversationTranscript(userTurns: readonly string[]): string {
  if (userTurns.length === 1) {
    return userTurns[0]!;
  }
  return userTurns
    .map((text, index) => `Turn ${index + 1} (Learner): ${text}`)
    .join("\n");
}

/** 0-based の turnIndex が最終ターンか */
export function isFinalConversationTurn(turnIndex: number, totalTurns: number): boolean {
  return turnIndex + 1 >= totalTurns;
}
