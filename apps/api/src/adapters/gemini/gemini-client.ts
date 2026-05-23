export type GeminiClientConfig = {
  apiKey: string;
  model: string;
};

type GeminiGenerateResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: { message?: string };
};

export class GeminiClient {
  constructor(private readonly config: GeminiClientConfig) {}

  async generateText(params: {
    systemInstruction?: string;
    userText: string;
    maxOutputTokens: number;
    temperature: number;
    jsonMode?: boolean;
  }): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(this.config.model)}:generateContent?key=${encodeURIComponent(this.config.apiKey)}`;

    const body: Record<string, unknown> = {
      contents: [
        {
          role: "user",
          parts: [{ text: params.userText }],
        },
      ],
      generationConfig: {
        maxOutputTokens: params.maxOutputTokens,
        temperature: params.temperature,
        ...(params.jsonMode ? { responseMimeType: "application/json" } : {}),
      },
    };

    if (params.systemInstruction?.trim()) {
      body.systemInstruction = {
        parts: [{ text: params.systemInstruction }],
      };
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const payload = (await response.json()) as GeminiGenerateResponse;

    if (!response.ok) {
      const detail =
        payload.error?.message ?? JSON.stringify(payload).slice(0, 500);
      throw new Error(`Gemini API error ${response.status}: ${detail}`);
    }

    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return text;
  }

  async generateFromAudio(params: {
    audioBytes: Uint8Array;
    mimeType: string;
    prompt: string;
    maxOutputTokens: number;
    temperature: number;
  }): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(this.config.model)}:generateContent?key=${encodeURIComponent(this.config.apiKey)}`;

    const base64 = bytesToBase64(params.audioBytes);

    const body = {
      contents: [
        {
          role: "user",
          parts: [
            { text: params.prompt },
            {
              inlineData: {
                mimeType: params.mimeType,
                data: base64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: params.maxOutputTokens,
        temperature: params.temperature,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const payload = (await response.json()) as GeminiGenerateResponse;

    if (!response.ok) {
      const detail =
        payload.error?.message ?? JSON.stringify(payload).slice(0, 500);
      throw new Error(`Gemini API error ${response.status}: ${detail}`);
    }

    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) {
      throw new Error("Empty transcription from Gemini");
    }

    return text;
  }
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    const slice = bytes.subarray(i, i + chunk);
    binary += String.fromCharCode(...slice);
  }
  return btoa(binary);
}
