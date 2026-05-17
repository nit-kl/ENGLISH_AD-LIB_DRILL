import type { Question } from "../entities/question.js";

/** ひらがな・カタカナ・CJK の割合が高いと場面返答として不適切 */
const JAPANESE_CHAR =
  /[\u3040-\u309F\u30A0-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/g;

const SCENE_REPLY_FALLBACKS: Record<string, string> = {
  "beginner-1":
    "Sure, one tall iced latte. Would you like that for here or to go?",
  "beginner-2":
    "Nice to meet you too! Where are you from?",
  "beginner-3":
    "Thank you so much! Is it far from here?",
  "intermediate-1":
    "I understand. Let me check our system again for your reservation.",
  "intermediate-2":
    "Thank you for sharing that. What was the outcome?",
  "intermediate-3":
    "That sounds great! Did you get up to anything fun?",
  "advanced-1":
    "Thank you. That's a compelling opening—please go on.",
  "advanced-2":
    "I hear your concern. What alternative would you propose?",
  "advanced-3":
    "I'm very sorry about that. Let me see what we can do for you right away.",
  "legendary-1":
    "Hmm, I see. So messengers can reach many people at once?",
  "legendary-2":
    "Thank you, delegate. The floor recognizes Japan.",
  "legendary-3":
    "Interesting. Why would I need special sand in the desert?",
};

export function containsJapanese(text: string): boolean {
  return JAPANESE_CHAR.test(text);
}

export function isValidSceneReply(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 8) return false;

  const latin = trimmed.match(/[A-Za-z]/g);
  if (!latin || latin.length < 6) return false;

  const jpMatches = trimmed.match(JAPANESE_CHAR);
  const jpCount = jpMatches?.length ?? 0;
  if (jpCount > 0 && jpCount / trimmed.length > 0.15) return false;

  return true;
}

export function getSceneReplyFallback(question: Question): string {
  return (
    SCENE_REPLY_FALLBACKS[question.id] ??
    "Thanks! Could you tell me a little more about that?"
  );
}

/** LLM の reply を場面用英語に正規化（日本語・無関係文はお題別フォールバックへ） */
export function normalizeSceneReply(reply: string, question: Question): string {
  const trimmed = reply.trim();
  if (isValidSceneReply(trimmed)) {
    return trimmed;
  }
  return getSceneReplyFallback(question);
}
