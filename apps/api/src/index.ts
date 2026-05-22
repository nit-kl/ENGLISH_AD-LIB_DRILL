import { Hono } from "hono";
import { cors } from "hono/cors";
import { SubmitAnswerUseCase } from "@english-adlib/application";
import { getQuestionById, STAGES } from "@english-adlib/domain";
import { WhisperTranscriptionService } from "./adapters/whisper-transcription-service.js";
import {
  WorkersAiScoringService,
  type AiBinding,
} from "./adapters/workers-ai-scoring-service.js";
import {
  apiErrorResponse,
  classifyScoringError,
  classifyTranscriptionError,
} from "./lib/api-error.js";

const MAX_AUDIO_BYTES = 5 * 1024 * 1024;

export type ApiBindings = {
  AI: AiBinding;
  SCORING_MODEL: string;
  ALLOWED_ORIGIN?: string;
};

type WorkerEnv = { Bindings: ApiBindings };

const app = new Hono<WorkerEnv>();

app.use("*", async (c, next) => {
  const origin = c.env.ALLOWED_ORIGIN ?? "*";
  return cors({
    origin,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })(c, next);
});

app.get("/api/health", (c) => c.json({ status: "ok" }));

app.get("/api/stages", (c) => {
  const payload = Object.values(STAGES).map((stage) => ({
    key: stage.key,
    label: stage.label,
    sublabel: stage.sublabel,
    desc: stage.desc,
    colorClass: stage.colorClass,
    questionCount: stage.questions.length,
    questions: stage.questions,
  }));
  return c.json({ stages: payload });
});

app.post("/api/transcribe", async (c) => {
  const form = await c.req.formData();
  const file = form.get("audio");

  if (!(file instanceof File)) {
    return apiErrorResponse(
      "INVALID_REQUEST",
      "audio file is required",
      400,
      false,
    );
  }

  if (file.size > MAX_AUDIO_BYTES) {
    return apiErrorResponse(
      "INVALID_REQUEST",
      "audio file is too large (max 5MB)",
      400,
      false,
    );
  }

  const languageField = form.get("language");
  const language =
    typeof languageField === "string" && languageField.trim()
      ? languageField.trim()
      : undefined;

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const service = new WhisperTranscriptionService(c.env.AI);
    const text = await service.transcribe(bytes, { language });
    return c.json({ text });
  } catch (error) {
    const classified = classifyTranscriptionError(error);
    return apiErrorResponse(
      classified.code,
      classified.message,
      classified.status,
      classified.retryable,
    );
  }
});

app.post("/api/score", async (c) => {
  const body = await c.req.json<{
    questionId: string;
    answerText: string;
  }>();

  const question = getQuestionById(body.questionId);
  if (!question) {
    return apiErrorResponse("NOT_FOUND", "Question not found", 404, false);
  }

  if (!body.answerText?.trim()) {
    return apiErrorResponse(
      "INVALID_REQUEST",
      "answerText is required",
      400,
      false,
    );
  }

  try {
    const scoringService = new WorkersAiScoringService(c.env.AI, c.env.SCORING_MODEL);
    const useCase = new SubmitAnswerUseCase(scoringService);
    const feedback = await useCase.execute({
      question,
      answerText: body.answerText,
    });
    return c.json({ feedback });
  } catch (error) {
    const classified = classifyScoringError(error);
    return apiErrorResponse(
      classified.code,
      classified.message,
      classified.status,
      classified.retryable,
    );
  }
});

export default app;
