import { describe, expect, it } from "vitest";
import { extractJsonFromLlmText } from "../src/lib/extract-llm-json.js";

describe("extractJsonFromLlmText", () => {
  it("素の JSON をパースする", () => {
    const result = extractJsonFromLlmText('{"total": 80}');
    expect(result).toEqual({ total: 80 });
  });

  it("コードフェンス内の JSON をパースする", () => {
    const result = extractJsonFromLlmText('```json\n{"total": 70}\n```');
    expect(result).toEqual({ total: 70 });
  });

  it("JSON 末尾の説明文を無視する", () => {
    const json = JSON.stringify({ total: 60, reply: "よくできました" });
    const result = extractJsonFromLlmText(`${json}\n\n以上が採点結果です。`);
    expect(result).toEqual({ total: 60, reply: "よくできました" });
  });
});
