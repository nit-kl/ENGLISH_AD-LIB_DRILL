/**
 * お題の「場所（setting）＋会話の目的（goal）」の登録簿。
 * 全難易度で同じ組み合わせを禁止する（stages.test.ts で検証）。
 *
 * 新しいお題を追加するときは、必ずここに1行追加してから stages/*.ts に定義すること。
 */
export type QuestionTopic = {
  id: string;
  /** 場所・舞台（カフェ、空港、ホテル など） */
  setting: string;
  /** 学習者が達成する会話の目的 */
  goal: string;
};

export const QUESTION_TOPICS: QuestionTopic[] = [
  { id: "beginner-1", setting: "カフェ", goal: "飲み物を注文する" },
  { id: "beginner-2", setting: "語学学校", goal: "自己紹介する" },
  { id: "beginner-3", setting: "街中（観光地）", goal: "道案内をする" },
  { id: "beginner-4", setting: "空港（入国審査）", goal: "滞在目的と期間を伝える" },
  { id: "beginner-5", setting: "タクシー", goal: "目的地を伝える" },
  { id: "beginner-6", setting: "レストラン", goal: "席と人数（予約の有無）を伝える" },
  { id: "intermediate-1", setting: "ホテル", goal: "チェックインの予約トラブルを解決する" },
  { id: "intermediate-2", setting: "面接会場", goal: "職場のチャレンジ経験を話す" },
  { id: "intermediate-3", setting: "職場（リモート会議前）", goal: "週末の出来事を雑談する" },
  { id: "advanced-1", setting: "国際カンファレンス", goal: "プレゼンのオープニングを話す" },
  { id: "advanced-2", setting: "職場（会議）", goal: "上司の提案に丁寧に反論する" },
  { id: "advanced-3", setting: "カスタマーサポート", goal: "怒っている顧客のクレームに対応する" },
  { id: "legendary-1", setting: "タイムスリップ（歴史）", goal: "現代のSNSを説明する" },
  { id: "legendary-2", setting: "国連", goal: "気候変動についてスピーチする" },
  { id: "legendary-3", setting: "砂漠", goal: "商品を営業する" },
];

export function findDuplicateQuestionTopics(
  topics: QuestionTopic[],
): { setting: string; goal: string; ids: string[] }[] {
  const byKey = new Map<string, string[]>();
  for (const topic of topics) {
    const key = `${topic.setting}\0${topic.goal}`;
    const ids = byKey.get(key) ?? [];
    ids.push(topic.id);
    byKey.set(key, ids);
  }
  return [...byKey.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([key, ids]) => {
      const [setting, goal] = key.split("\0");
      return { setting, goal, ids };
    });
}
