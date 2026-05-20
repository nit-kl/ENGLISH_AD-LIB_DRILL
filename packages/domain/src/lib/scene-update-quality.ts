import type { Question } from "../entities/question.js";

/** お題文の再掲・「〜してください」など、回答前の指示になっている */
export function looksLikeSetupRepeat(sceneUpdateJa: string, question: Question): boolean {
  const scene = sceneUpdateJa.trim();
  const situation = question.situation.trim();
  if (scene.length < 8) return true;

  if (situation.length >= 16) {
    const chunk = situation.slice(0, Math.min(48, situation.length));
    if (scene.includes(chunk)) return true;
  }

  const setupOnlyPhrases = [
    "自己紹介してください",
    "注文してください",
    "答えてください",
    "聞かれました。",
    "話しかけてきました。",
  ];
  const afterMarkers = [
    "あなたが",
    "あなたの",
    "伝え",
    "答え",
    "受け止め",
    "受け取",
    "進み",
    "進ん",
    "続け",
    "次は",
    "これから",
    "うなず",
    "笑顔",
    "返事",
  ];
  const hasSetupPhrase = setupOnlyPhrases.some((p) => scene.includes(p));
  const hasAfterMarker = afterMarkers.some((p) => scene.includes(p));
  if (hasSetupPhrase && !hasAfterMarker) return true;

  if (question.id === "beginner-2") {
    const repeatsSarahOpener =
      scene.includes("話しかけて") &&
      (scene.includes("Sarah") || scene.includes("サラ")) &&
      !scene.includes("自己紹介を") &&
      !scene.includes("伝え");
    if (repeatsSarahOpener) return true;
  }

  return false;
}

export function resolveSceneUpdateJa(
  sceneUpdateJa: string,
  question: Question,
  answerText: string,
): string {
  const trimmed = sceneUpdateJa.trim();
  if (trimmed.length >= 12 && !looksLikeSetupRepeat(trimmed, question)) {
    return trimmed;
  }
  return buildSceneUpdateFallback(question, answerText);
}
