import type { Question } from "@english-adlib/domain";

/** プロンプト用（Workers AI JSON Schema モードは複雑な採点で失敗しやすい） */
export const SCORING_JSON_SCHEMA_PROMPT = `{
  "total": number 0-100,
  "fluency": number 0-100,
  "grammar": number 0-100,
  "vocabulary": number 0-100,
  "relevance": number 0-100,
  "sceneUpdateJa": string (REQUIRED: plain Japanese prose, 2-4 sentences — NOT a nested object or conversation log),
  "goodPoints": string[] (1-3 items, Japanese),
  "improvements": string[] (1-3 items, Japanese)
}`;

const SCENE_UPDATE_ANTI_PATTERNS = `sceneUpdateJa must be PLAIN JAPANESE PROSE inside the JSON string value.
These formats are FORBIDDEN and will break the app:
- {"Learner said": "...", "フロント係 said": "..."}
- {"Learner": "...", "Counterpart": "..."}
- Learner: ... / Counterpart: ...
- Repeating the "Situation (before learner spoke)" text verbatim
- English-only sceneUpdateJa or bullet lists of dialogue turns`;

function sceneUpdateExample(question: Question): string {
  if (question.id === "beginner-1") {
    return `EXAMPLE for "I'd like a tall iced latte, please":
GOOD sceneUpdateJa:
「トールのアイスラテ」を注文したと受け止められ、店員は笑顔でうなずきました。次は店内かテイクアウトかを聞かれる段階です。
BAD (never): {"Learner said": "I'd like a tall iced latte"} or restating "注文してください".`;
  }
  if (question.id === "beginner-2") {
    return `EXAMPLE for "Nice to meet you. I'm Leo, I'm from Japan.":
GOOD sceneUpdateJa:
レオさんが日本から来て留学中だと自己紹介したので、サラは笑顔でうなずき、学校や英語学習の話を続ける場面に進みました。
BAD (never): 「サラが Hi と話しかけてきました。自己紹介してください。」— that is BEFORE the learner spoke.`;
  }
  if (question.id === "intermediate-1") {
    return `EXAMPLE for "I have a reservation under the name Tanaka. Could you please check again? I also have a confirmation email on my phone.":
GOOD sceneUpdateJa:
予約名「Tanaka」での再確認と、スマホに確認メールがあることを伝えた。フロント係は表情を和らげ、システムを再度検索し始め、確認メールの提示を促す段階に進みました。
BAD (never): {"Learner said": "I have a reservation...", "フロント係 said": "予約記録がないと言われました"}
BAD (never): repeating only「予約記録がないと言われました」without ${question.counterpart}'s NEW reaction.`;
  }
  if (question.id === "intermediate-2") {
    return `EXAMPLE for a STAR-style interview answer about a product launch:
GOOD sceneUpdateJa:
プロジェクトの困難とチームでの対応、売上目標超過の成果を伝えた。面接官はうなずき受け止め、続けて具体的な数字やチームの規模について深掘りする質問に移りました。
BAD (never): {"Learner said": "In my previous role..."} or repeating「Tell me about a time...」.`;
  }
  if (question.id === "intermediate-3") {
    return `EXAMPLE for "It was pretty good! I ended up going hiking with some friends on Saturday.":
GOOD sceneUpdateJa:
週末はハイキングに行ったと伝え、天気も良かったと話した。同僚は興味深そうにうなずき、自分の週末の話や今日の会議の話に続く場面になりました。
BAD (never): {"Learner said": "How was your weekend?"} or repeating the opening question.`;
  }
  return `GOOD sceneUpdateJa must describe the NEW scene after the learner's line — ${question.counterpart}'s reaction and what happens next.
BAD: repeating the situation field or writing a conversation log.`;
}

function sceneUpdateTemplate(question: Question): string {
  return `Use this sentence pattern for sceneUpdateJa:
「[学習者の回答から具体的な内容]」と伝え/示した/説明した。${question.counterpart}は[反応・行動]。次は[会話の次の段階]に進みました。`;
}

export function buildScoringSystemPrompt(question: Question): string {
  return `You score English role-play answers for Japanese learners.

LEARNER plays: ${question.role}
Scene counterpart: ${question.counterpart}

TASK ORDER (think in this order before writing JSON):
1. sceneUpdateJa — plain Japanese narrative of the NEW scene (highest priority)
2. Score fields (total, fluency, grammar, vocabulary, relevance)
3. goodPoints and improvements (Japanese)

sceneUpdateJa RULES (most important for the learner):
- Write ONLY in Japanese — never write sceneUpdateJa in English
- Describe what the scene looks like AFTER the learner's line — the NEW state, not the setup
- Include ${question.counterpart}'s reaction (expression, action) and what happens next
- MUST reference specific content from the learner's answer (names, numbers, actions, requests, etc.)
- Write 2-4 natural Japanese sentences as continuous prose
- Do NOT use curly braces { } inside sceneUpdateJa
- Do NOT use "Learner said" / "Counterpart said" keys — that is for the outer JSON only

${SCENE_UPDATE_ANTI_PATTERNS}

${sceneUpdateTemplate(question)}

${sceneUpdateExample(question)}

SCORING: Never give total 0 if the learner attempted on-topic English. Minor grammar mistakes should still score roughly 40-70. Reserve below 20 for empty or completely off-topic answers.

JSON OUTPUT RULES:
- Respond with ONLY valid JSON (no markdown, no text before or after)
- sceneUpdateJa is a single JSON string value containing Japanese prose — never a nested JSON object
- Inside JSON string values, do NOT use raw ASCII double quotes; use 「」 for quoted speech
- Escape any double quote that must appear as \\"

Use this schema:
${SCORING_JSON_SCHEMA_PROMPT}`;
}

export function buildScoringUserPrompt(question: Question, answerText: string): string {
  return [
    `Title: ${question.title} (${question.titleEn})`,
    `Learner role: ${question.role}`,
    `Counterpart: ${question.counterpart}`,
    `Situation (before learner spoke): ${question.situation}`,
    `Hints (optional expressions): ${question.hints.join(", ")}`,
    `Learner said: ${answerText}`,
    "",
    `Now write sceneUpdateJa as 2-4 plain Japanese sentences describing what ${question.counterpart} does and how the scene changes AFTER the learner's line above.`,
    `Reference specific details from the learner's answer (e.g. reservation name, email, numbers, weekend activity).`,
    `Do NOT repeat the situation text. Do NOT write a conversation log or {"Learner said": ...} inside sceneUpdateJa.`,
  ].join("\n");
}
