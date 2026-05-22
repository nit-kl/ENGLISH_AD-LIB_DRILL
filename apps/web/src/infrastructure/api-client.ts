import {
  applyScoreFloor,
  getQuestionById,
  parseScoreFeedback,
  resolveSceneUpdateJa,
  type Question,
  type ScoreFeedback,
} from "@english-adlib/domain";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export type ApiErrorCode =
  | "QUOTA_EXCEEDED"
  | "SCORING_FAILED"
  | "TRANSCRIPTION_FAILED"
  | "INVALID_REQUEST"
  | "NOT_FOUND";

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly code: ApiErrorCode,
    readonly status: number,
    readonly retryable: boolean,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

async function parseApiError(res: Response): Promise<ApiClientError> {
  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    code?: ApiErrorCode;
    retryable?: boolean;
  };
  return new ApiClientError(
    data.error ?? `Request failed (${res.status})`,
    data.code ?? "SCORING_FAILED",
    res.status,
    data.retryable ?? res.status >= 500,
  );
}

export type StageSummary = {
  key: string;
  label: string;
  sublabel: string;
  desc: string;
  colorClass: string;
  questionCount: number;
  questions: Question[];
};

export async function fetchStages(): Promise<StageSummary[]> {
  const res = await fetch(`${baseUrl}/api/stages`);
  if (!res.ok) throw await parseApiError(res);
  const data = (await res.json()) as { stages: StageSummary[] };
  return data.stages;
}

async function scoreAnswerOnce(
  questionId: string,
  answerText: string,
): Promise<ScoreFeedback> {
  const res = await fetch(`${baseUrl}/api/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionId, answerText }),
  });
  if (!res.ok) throw await parseApiError(res);
  const data = (await res.json()) as { feedback?: unknown };
  if (data.feedback == null) {
    throw new ApiClientError("Invalid scoring response", "SCORING_FAILED", 502, true);
  }
  try {
    const parsed = parseScoreFeedback(data.feedback);
    const adjusted = applyScoreFloor(parsed, answerText);
    const question = getQuestionById(questionId);
    if (question) {
      return {
        ...adjusted,
        sceneUpdateJa: resolveSceneUpdateJa(
          adjusted.sceneUpdateJa,
          question,
          answerText,
        ),
      };
    }
    return adjusted;
  } catch {
    throw new ApiClientError(
      "採点結果の形式が正しくありません",
      "SCORING_FAILED",
      502,
      true,
    );
  }
}

export async function scoreAnswer(
  questionId: string,
  answerText: string,
): Promise<ScoreFeedback> {
  return scoreAnswerOnce(questionId, answerText);
}

export async function transcribeAudio(
  blob: Blob,
  language?: "en" | "ja",
): Promise<string> {
  const form = new FormData();
  const ext = blob.type.includes("mp4") ? "m4a" : "webm";
  form.append("audio", blob, `recording.${ext}`);
  if (language) {
    form.append("language", language);
  }
  const res = await fetch(`${baseUrl}/api/transcribe`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw await parseApiError(res);
  const data = (await res.json()) as { text?: string };
  if (!data.text?.trim()) {
    throw new ApiClientError("Empty transcription", "TRANSCRIPTION_FAILED", 502, true);
  }
  return data.text.trim();
}
