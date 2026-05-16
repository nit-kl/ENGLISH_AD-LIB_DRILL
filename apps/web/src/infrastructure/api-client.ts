import type { Question, ScoreFeedback } from "@english-adlib/domain";

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

export async function scoreAnswer(
  questionId: string,
  answerText: string,
): Promise<ScoreFeedback> {
  const res = await fetch(`${baseUrl}/api/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionId, answerText }),
  });
  if (!res.ok) throw await parseApiError(res);
  const data = (await res.json()) as { feedback?: ScoreFeedback };
  if (!data.feedback) {
    throw new ApiClientError("Invalid scoring response", "SCORING_FAILED", 502, true);
  }
  return data.feedback;
}

export async function transcribeAudio(blob: Blob): Promise<string> {
  const form = new FormData();
  form.append("audio", blob, "recording.webm");
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
