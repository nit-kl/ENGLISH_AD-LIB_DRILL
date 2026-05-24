import type { Question } from "@english-adlib/domain";

/** プロンプト用（Workers AI JSON Schema モードは複雑な採点で失敗しやすい） */
export const SCORING_JSON_SCHEMA_PROMPT = `{
  "total": number 0-100,
  "fluency": number 0-100,
  "grammar": number 0-100,
  "vocabulary": number 0-100,
  "relevance": number 0-100,
  "sceneUpdateJa": string (REQUIRED: Japanese only, 2-4 sentences),
  "goodPoints": string[] (1-3 items, Japanese),
  "improvements": string[] (1-3 items, Japanese)
}`;

function sceneUpdateExample(question: Question): string {
  if (question.id === "beginner-1") {
    return `GOOD sceneUpdateJa for "I'd like a tall iced latte, please":
「トールのアイスラテ」を注文したと受け止められ、店員は受け取りました。次は店内かテイクアウトかを聞かれる段階です。
BAD (never): restating the café greeting or "注文してください".`;
  }
  if (question.id === "beginner-2") {
    return `GOOD for "Nice to meet you. I'm Leo, I'm from Japan.":
レオさんが日本から来て留学中だと自己紹介したので、サラは笑顔でうなずき、学校や英語学習の話を続ける場面に進みました。
BAD (never): 「サラが Hi と話しかけてきました。自己紹介してください。」— that is BEFORE the learner spoke.`;
  }
  if (question.id === "intermediate-1") {
    return `GOOD for multi-turn hotel check-in (reservation + confirmation email):
フロント係が予約名「Kojima」を再検索し、確認メールの提示を求めたあと、あなたがメールアドレスを伝えたので、画面を確認する段階に進みました。
BAD (never): JSON logs like {"Learner said": ...}, repeating「予約記録がないと言われました」, or English-only sceneUpdateJa.`;
  }
  if (question.id === "intermediate-2") {
    return `GOOD after full interview exchange (learner describes challenge + follow-up):
面接官は STAR 形式の回答をうなずき受け止め、続けて具体的な数字やチームの規模について深掘りする質問に移りました。
BAD (never): repeating「Tell me about a time...」or dumping the conversation log.`;
  }
  return `GOOD sceneUpdateJa must describe the NEW scene after the conversation. BAD: repeating the situation field.`;
}

function isFullConversationTranscript(answerText: string, counterpart: string): boolean {
  return (
    answerText.includes("\n") &&
    answerText.includes(`${counterpart}:`) &&
    answerText.includes("Learner:")
  );
}

export function buildScoringSystemPrompt(question: Question): string {
  return `You score English role-play answers for Japanese learners.

LEARNER plays: ${question.role}
Scene counterpart: ${question.counterpart}

sceneUpdateJa RULES (most important for the learner):
- Write ONLY in Japanese — never write sceneUpdateJa in English
- Describe what the scene looks like AFTER the full conversation — the NEW state
- Include ${question.counterpart}'s reaction and what happens next in the interaction
- MUST reference specific content from the learner's answer (project, numbers, actions, etc.)
- FORBIDDEN: copying "Situation (before learner spoke)" text or ending with "〜してください"
- FORBIDDEN in sceneUpdateJa: JSON objects, {"Learner said": ...} format, conversation logs, bullet lists of turns, or English sentences
- sceneUpdateJa must be 2-4 natural Japanese sentences ONLY (no curly braces)

SCORING: Never give total 0 if the learner attempted on-topic English. Minor grammar mistakes should still score roughly 40-70. Reserve below 20 for empty or completely off-topic answers.

${sceneUpdateExample(question)}

JSON OUTPUT RULES:
- Respond with ONLY valid JSON (no markdown, no text before or after)
- Inside JSON string values, do NOT use raw ASCII double quotes; use 「」 for quoted speech
- Escape any double quote that must appear as \\"

Use this schema:
${SCORING_JSON_SCHEMA_PROMPT}`;
}

export function buildScoringUserPrompt(question: Question, answerText: string): string {
  const fullConversation = isFullConversationTranscript(answerText, question.counterpart);

  const conversationSection = fullConversation
    ? `Full conversation (Learner and ${question.counterpart}):\n${answerText}`
    : answerText.includes("Turn ") && answerText.includes("Learner):")
      ? `Learner's lines across the conversation:\n${answerText}`
      : `Learner said: ${answerText}`;

  const sceneUpdateInstruction = fullConversation
    ? `Score the learner's English across all Learner lines above. Write sceneUpdateJa in Japanese: describe how the scene changed AFTER this full exchange — ${question.counterpart}'s reaction and the next step. Do NOT repeat the opening question or situation setup.`
    : answerText.includes("Turn ")
      ? `Score the learner's English across ALL turns above. Write sceneUpdateJa as Japanese prose summarizing the scene AFTER the full exchange.`
      : `Write sceneUpdateJa describing the situation AFTER this line.`;

  return [
    `Title: ${question.title} (${question.titleEn})`,
    `Learner role: ${question.role}`,
    `Counterpart: ${question.counterpart}`,
    `Situation (before conversation started): ${question.situation}`,
    `Hints (optional expressions): ${question.hints.join(", ")}`,
    conversationSection,
    sceneUpdateInstruction,
  ].join("\n");
}
