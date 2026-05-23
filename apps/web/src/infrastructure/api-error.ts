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

export async function parseApiError(res: Response): Promise<ApiClientError> {
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
