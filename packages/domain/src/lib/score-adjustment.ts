import type { ScoreFeedback } from "../entities/score-feedback.js";
import { countWords } from "../entities/question.js";

function hasEnglishAttempt(answerText: string): boolean {
  const trimmed = answerText.trim();
  if (!trimmed || trimmed === "...") return false;
  return /[A-Za-z]{2,}/.test(trimmed) && countWords(trimmed) >= 1;
}

/** LLM が文法ミスを「0点一括」にしがちなときのヒューリスティック採点 */
function computeHeuristicScores(answerText: string): Pick<
  ScoreFeedback,
  "fluency" | "grammar" | "vocabulary" | "relevance" | "total"
> {
  const trimmed = answerText.trim();
  const wordCount = countWords(trimmed);
  const tokens = trimmed.toLowerCase().match(/\b[a-z]+\b/g) ?? [];
  const unique = new Set(tokens).size;

  const fluency = Math.min(100, Math.round(30 + wordCount * 9));
  let grammar = Math.min(100, Math.round(55 + Math.min(wordCount, 4) * 5));
  if (/\bI'd like to\s+\w+/i.test(trimmed) && !/\b(a|an|the)\s+/i.test(trimmed)) {
    grammar = Math.min(grammar, 48);
  }
  if (/\b(a|an|the)\s+\w+/i.test(trimmed)) {
    grammar = Math.max(grammar, 62);
  }
  const vocabulary = Math.min(100, Math.round(38 + unique * 10));
  const relevance = Math.min(100, Math.round(45 + wordCount * 8));
  const total = Math.round((fluency + grammar + vocabulary + relevance) / 4);

  return { fluency, grammar, vocabulary, relevance, total };
}

function isBrokenLlmScoring(feedback: ScoreFeedback): boolean {
  if (feedback.total === 0) return true;
  const subs = [feedback.fluency, feedback.grammar, feedback.vocabulary, feedback.relevance];
  return feedback.total < 15 && subs.every((s) => s < 15);
}

/**
 * 小さい LLM が「文法ミス = 0点」と返すのを防ぐ。
 * 英語でお題に沿った試みがあれば、最低限の点数を保証する。
 */
export function applyScoreFloor(
  feedback: ScoreFeedback,
  answerText: string,
): ScoreFeedback {
  if (!hasEnglishAttempt(answerText)) {
    return feedback;
  }

  const heuristic = computeHeuristicScores(answerText);

  if (isBrokenLlmScoring(feedback)) {
    return { ...feedback, ...heuristic };
  }

  const minTotal = countWords(answerText) >= 3 ? 30 : 25;
  if (feedback.total < minTotal) {
    const total = Math.max(feedback.total, minTotal, heuristic.total);
    return { ...feedback, total: Math.min(100, total) };
  }

  return feedback;
}
