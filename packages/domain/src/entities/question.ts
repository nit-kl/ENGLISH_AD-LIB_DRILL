import type { QuestionMedia } from "./question-media.js";

export type Question = {
  id: string;
  stageKey: string;
  title: string;
  titleEn: string;
  situation: string;
  /** 学習者が演じる役 */
  role: string;
  /** 場面で学習者の相手（採点後チャットの返答者） */
  counterpart: string;
  icon: string;
  hints: string[];
  /** 設定時は動画お題 UI（字幕は YouTube CC） */
  media?: QuestionMedia;
};

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
