/** 1往復分の会話（学習者発話 + 相手の返答） */
export type ConversationExchange = {
  userText: string;
  counterpartLineEn: string;
  sceneUpdateJa: string;
};

/** 中間ターンで相手が返す内容 */
export type CounterpartReply = {
  counterpartLineEn: string;
  sceneUpdateJa: string;
};
