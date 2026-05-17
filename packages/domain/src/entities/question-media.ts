/** YouTube 埋め込み用（Part1: お題 / Part2: 続き・模範・解説） */
export type QuestionVideoSegment = {
  youtubeVideoId: string;
  startSeconds?: number;
  endSeconds?: number;
};

export type QuestionMedia = {
  setup: QuestionVideoSegment;
  reveal: QuestionVideoSegment;
};

export function hasQuestionMedia(
  question: { media?: QuestionMedia },
): question is { media: QuestionMedia } {
  const { media } = question;
  if (media == null) return false;
  const { setup, reveal } = media;
  return (
    setup.youtubeVideoId.length > 0 &&
    reveal.youtubeVideoId.length > 0 &&
    setup.endSeconds != null &&
    setup.endSeconds > 0
  );
}
