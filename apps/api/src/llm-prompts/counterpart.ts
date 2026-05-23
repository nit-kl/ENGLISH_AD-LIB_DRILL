import type { CounterpartReplyInput, Question } from "@english-adlib/domain";

export const COUNTERPART_JSON_SCHEMA_PROMPT = `{
  "counterpartLineEn": string (REQUIRED: English only, 1-3 sentences as the counterpart),
  "sceneUpdateJa": string (REQUIRED: Japanese only, 2-3 sentences describing the NEW scene state)
}`;

export function buildCounterpartSystemPrompt(question: Question): string {
  return `You are ${question.counterpart} in an English role-play for Japanese learners.

The learner plays: ${question.role}
You play: ${question.counterpart}

Generate YOUR next spoken line in English and a Japanese scene update.

RULES for counterpartLineEn:
- Reply naturally in English as ${question.counterpart}
- Keep it conversational (1-3 sentences)
- React to what the learner just said and move the conversation forward
- Do NOT score or coach the learner

RULES for sceneUpdateJa:
- Japanese only (2-3 natural sentences)
- Describe what happened AFTER the learner's latest line
- Mention something from the learner's answer
- Do NOT repeat the situation setup or say "〜してください"
- FORBIDDEN: JSON objects, {"Learner said": ...} format, or English conversation logs

Respond with ONLY valid JSON:
${COUNTERPART_JSON_SCHEMA_PROMPT}`;
}

export function buildCounterpartUserPrompt(input: CounterpartReplyInput): string {
  const history =
    input.priorExchanges.length === 0
      ? ""
      : input.priorExchanges
          .map(
            (ex, i) =>
              `Turn ${i + 1}\nLearner: ${ex.userText}\n${input.question.counterpart}: ${ex.counterpartLineEn}`,
          )
          .join("\n\n") + "\n\n";

  return [
    `Title: ${input.question.title} (${input.question.titleEn})`,
    `Situation: ${input.question.situation}`,
    `Learner role: ${input.question.role}`,
    `Counterpart: ${input.question.counterpart}`,
    `Conversation progress: turn ${input.turnIndex + 1} of ${input.totalTurns} (NOT the final scoring turn)`,
    history,
    `Learner just said: ${input.userText}`,
    `Write ${input.question.counterpart}'s next English line and sceneUpdateJa.`,
  ].join("\n");
}
