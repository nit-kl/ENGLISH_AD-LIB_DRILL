import type { Question } from "../entities/question.js";
import { isLowQualitySceneUpdateJa } from "./scene-update-quality.js";

function extractNameFromAnswer(answerText: string): string | null {
  const m = answerText.match(/\bI['']?m\s+([A-Za-z]+)/i);
  return m?.[1] ?? null;
}

function extractCountryHint(answerText: string): string | null {
  if (/japan/i.test(answerText)) return "日本";
  if (/america|usa|u\.s\./i.test(answerText)) return "アメリカ";
  if (/korea/i.test(answerText)) return "韓国";
  if (/from\s+([A-Za-z]+)/i.test(answerText)) {
    return answerText.match(/from\s+([A-Za-z]+)/i)?.[1] ?? null;
  }
  return null;
}

/** LLM が不適切な sceneUpdateJa を返したときの、回答内容を反映した説明 */
export function buildSceneUpdateFallback(question: Question, answerText: string): string {
  const said = answerText.trim() || "（回答）";
  const name = extractNameFromAnswer(answerText);
  const country = extractCountryHint(answerText);

  switch (question.id) {
    case "beginner-1":
      return `あなたが「${said}」と注文したので、店員は内容を受け取りました。会話は注文の確認から、サイズやホット／アイス、店内かお持ち帰りかを聞く段階に進んでいます。`;
    case "beginner-2": {
      const who = name ? `${name}さん` : "あなた";
      const origin = country ? `${country}から来た` : "出身を伝えた";
      return `あなたの自己紹介（「${said}」）を受けて、${question.counterpart}は笑顔でうなずきました。${who}が${origin}留学中だと分かったので、英語学習や学校生活について話が続く場面になっています。`;
    }
    case "beginner-3":
      return `あなたが「${said}」と道案内や説明をしたので、相手は礼を言いながら納得した様子です。場面は道順の確認が終わり、次の行動（出発・お礼のやり取り）に進んでいます。`;
    default:
      return `あなたの発言「${said}」のあと、${question.counterpart}がそれを受け止め、場面は「${question.title}」の次のやり取りに進みました。お題の説明を繰り返すのではなく、この新しい状態を想像してください。`;
  }
}

/** @deprecated use buildSceneUpdateFallback */
export function getSceneUpdateFallback(question: Question, answerText: string): string {
  return buildSceneUpdateFallback(question, answerText);
}

export function resolveSceneUpdateJa(
  sceneUpdateJa: string,
  question: Question,
  answerText: string,
): string {
  const trimmed = sceneUpdateJa.trim();
  if (trimmed.length >= 12 && !isLowQualitySceneUpdateJa(trimmed, question)) {
    return trimmed;
  }
  return buildSceneUpdateFallback(question, answerText);
}
