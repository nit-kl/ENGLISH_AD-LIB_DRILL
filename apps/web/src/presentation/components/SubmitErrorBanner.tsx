import { RotateCcw } from "lucide-react";
import type { ApiClientError } from "../../infrastructure/scoring-api-client";

type Props = {
  error: ApiClientError | null;
  fallbackMessage?: string | null;
  onRetry?: () => void;
};

export function SubmitErrorBanner({ error, fallbackMessage, onRetry }: Props) {
  const message = error?.message ?? fallbackMessage;
  if (!message) return null;

  const retryable = error?.retryable ?? false;

  return (
    <div className="mt-3 rounded-2xl border border-rose-400/40 bg-rose-500/15 p-4">
      <p className="text-rose-200 text-sm leading-relaxed">{message}</p>
      {retryable && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 flex items-center gap-2 text-sm font-bold text-yellow-300 hover:text-yellow-200"
        >
          <RotateCcw className="w-4 h-4" />
          もう一度採点する
        </button>
      )}
    </div>
  );
}
