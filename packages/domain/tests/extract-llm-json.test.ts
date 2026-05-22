import { describe, expect, it } from "vitest";
import {
  extractJsonFromLlmText,
  repairUnescapedQuotesInJsonStrings,
} from "../src/lib/extract-llm-json.js";

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

  it("文字列値内の未エスケープ引用符を修復してパースする", () => {
    const broken =
      '{"total":80,"sceneUpdateJa":"サラが "Hi!" と話しかけたあと、レオさんは自己紹介を終えました。","goodPoints":["良い"]}';
    const result = extractJsonFromLlmText(broken) as {
      total: number;
      sceneUpdateJa: string;
    };
    expect(result.total).toBe(80);
    expect(result.sceneUpdateJa).toContain("Hi!");
  });
});

describe("repairUnescapedQuotesInJsonStrings", () => {
  it("文字列の終端以外の二重引用符をエスケープする", () => {
    const input = '{"sceneUpdateJa":"彼は "OK" と言った"}';
    const repaired = repairUnescapedQuotesInJsonStrings(input);
    expect(repaired).toBe('{"sceneUpdateJa":"彼は \\"OK\\" と言った"}');
    expect(JSON.parse(repaired)).toEqual({
      sceneUpdateJa: '彼は "OK" と言った',
    });
  });
});
