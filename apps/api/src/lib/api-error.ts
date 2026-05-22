export type ApiErrorCode =
  | "QUOTA_EXCEEDED"
  | "SCORING_FAILED"
  | "TRANSCRIPTION_FAILED"
  | "INVALID_REQUEST"
  | "NOT_FOUND";

export type ApiErrorBody = {
  error: string;
  code: ApiErrorCode;
  retryable: boolean;
};

export function apiErrorResponse(
  code: ApiErrorCode,
  message: string,
  status: number,
  retryable: boolean,
): Response {
  const body: ApiErrorBody = { error: message, code, retryable };
  return Response.json(body, { status });
}

export function classifyScoringError(error: unknown): {
  code: ApiErrorCode;
  message: string;
  status: number;
  retryable: boolean;
} {
  const message = error instanceof Error ? error.message : "Scoring failed";
  const lower = message.toLowerCase();

  if (
    lower.includes("neuron") ||
    lower.includes("quota") ||
    lower.includes("limit") ||
    lower.includes("rate") ||
    lower.includes("429")
  ) {
    return {
      code: "QUOTA_EXCEEDED",
      message: "本日の無料採点枠を超えました。明日（UTC 0時）以降に再度お試しください。",
      status: 503,
      retryable: false,
    };
  }

  if (
    lower.includes("empty response") ||
    lower.includes("json") ||
    lower.includes("syntax") ||
    lower.includes("parse") ||
    lower.includes("reply must") ||
    lower.includes("must be a") ||
    lower.includes("json mode couldn't be met")
  ) {
    return {
      code: "SCORING_FAILED",
      message: "採点結果の取得に失敗しました。もう一度お試しください。",
      status: 502,
      retryable: true,
    };
  }

  return {
    code: "SCORING_FAILED",
    message: "採点に失敗しました。もう一度お試しください。",
    status: 502,
    retryable: true,
  };
}

export function classifyTranscriptionError(error: unknown): {
  code: ApiErrorCode;
  message: string;
  status: number;
  retryable: boolean;
} {
  const base = classifyScoringError(error);
  if (base.code === "QUOTA_EXCEEDED") {
    return {
      ...base,
      message: "本日の無料音声認識枠を超えました。キーボード入力をご利用ください。",
    };
  }
  return {
    code: "TRANSCRIPTION_FAILED",
    message: "音声の認識に失敗しました。もう一度録音するか、キーボードで入力してください。",
    status: 502,
    retryable: true,
  };
}
