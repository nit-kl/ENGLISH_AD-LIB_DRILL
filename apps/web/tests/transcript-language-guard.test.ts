import { describe, expect, it } from "vitest";
import { containsJapaneseScript } from "../src/presentation/hooks/transcript-language-guard";

describe("containsJapaneseScript", () => {
  it("英語のみは false", () => {
    expect(containsJapaneseScript("Hello world")).toBe(false);
  });

  it("ひらがなを含むと true", () => {
    expect(containsJapaneseScript("hello こんにちは")).toBe(true);
  });

  it("カタカナを含むと true", () => {
    expect(containsJapaneseScript("テスト")).toBe(true);
  });

  it("漢字を含むと true", () => {
    expect(containsJapaneseScript("今日は sunny")).toBe(true);
  });
});
