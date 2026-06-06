import { describe, expect, it } from "vitest";
import {
  containsJapaneseScript,
  normalizeEnglishTranscript,
  sanitizeEnglishTranscript,
} from "../src/presentation/hooks/transcript-language-guard";

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

describe("sanitizeEnglishTranscript", () => {
  it("英語のみはそのまま", () => {
    expect(sanitizeEnglishTranscript("Hello world")).toBe("Hello world");
  });

  it("混在テキストから日本語を除去する", () => {
    expect(sanitizeEnglishTranscript("Hello ワールド today")).toBe("Hello today");
    expect(sanitizeEnglishTranscript("今日は I think so")).toBe("I think so");
  });

  it("日本語のみは空文字", () => {
    expect(sanitizeEnglishTranscript("こんにちは")).toBe("");
    expect(sanitizeEnglishTranscript("テスト")).toBe("");
  });
});

describe("normalizeEnglishTranscript", () => {
  it("混在テキストから英語部分を採用する", () => {
    expect(normalizeEnglishTranscript("Hello ワールド")).toBe("Hello");
  });

  it("英語のみはそのまま", () => {
    expect(normalizeEnglishTranscript("I want to practice")).toBe("I want to practice");
  });

  it("英字が残らなければ null", () => {
    expect(normalizeEnglishTranscript("こんにちは")).toBeNull();
    expect(normalizeEnglishTranscript("123")).toBeNull();
  });
});
