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
  return `GOOD sceneUpdateJa must change when the learner's line changes. BAD: repeating the situation field.`;
}

export function buildScoringSystemPrompt(question: Question): string {
  return `You score English role-play answers for Japanese learners.

LEARNER plays: ${question.role}
Scene counterpart: ${question.counterpart}

sceneUpdateJa RULES (most important for the learner):
- Write ONLY in Japanese (no English in sceneUpdateJa)
- Describe ONLY what happened AFTER "Learner said" — the NEW state of the scene
- MUST mention something from the learner's answer (name, country, order, direction, etc.)
- Describe ${question.counterpart}'s reaction and the NEXT step in the conversation
- FORBIDDEN: copying "Situation (before learner spoke)" text, quoting the opening line, or ending with "〜してください" (that is the task instruction, not the update)
- FORBIDDEN: narrating how ${question.counterpart} first approached the learner if the learner already replied
- Do NOT list grammar scores or coaching in sceneUpdateJa
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
  const isMultiTurn = answerText.includes("Turn ") && answerText.includes("Learner):");
  const learnerSection = isMultiTurn
    ? `Learner's lines across the conversation:\n${answerText}`
    : `Learner said: ${answerText}`;

  return [
    `Title: ${question.title} (${question.titleEn})`,
    `Learner role: ${question.role}`,
    `Counterpart: ${question.counterpart}`,
    `Situation (before learner spoke): ${question.situation}`,
    `Hints (optional expressions): ${question.hints.join(", ")}`,
    learnerSection,
    isMultiTurn
      ? `Score the learner's English across ALL turns above. Write sceneUpdateJa as Japanese prose summarizing the scene AFTER the full exchange — NOT a JSON log of who said what.`
      : `Write sceneUpdateJa describing the situation AFTER this line.`,
  ].join("\n");
}
