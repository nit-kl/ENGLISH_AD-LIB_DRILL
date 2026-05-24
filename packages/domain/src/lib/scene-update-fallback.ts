import { looksLikeMalformedSceneUpdate } from "./scene-update-quality.js";

const MALFORMED_SCENE_PLACEHOLDER = "場面の描写を取得できませんでした。";

/**
 * JSON ログなど明らかに壊れた sceneUpdateJa を差し替える。
 * 空のときだけ conversationFallback（中間ターンの場面描写）を使う。
 */
export function resolveSceneUpdateJa(
  sceneUpdateJa: string,
  conversationFallback?: string,
): string {
  const trimmed = sceneUpdateJa.trim();
  if (trimmed.length > 0 && !looksLikeMalformedSceneUpdate(trimmed)) {
    return trimmed;
  }

  const fallback = conversationFallback?.trim();
  if (fallback && fallback.length > 0 && !looksLikeMalformedSceneUpdate(fallback)) {
    return fallback;
  }

  return MALFORMED_SCENE_PLACEHOLDER;
}
