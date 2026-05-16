export type Question = {
  id: string;
  stageKey: string;
  title: string;
  titleEn: string;
  situation: string;
  role: string;
  icon: string;
  hints: string[];
};

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
