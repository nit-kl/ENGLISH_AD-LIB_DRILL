import { describe, expect, it } from "vitest";
import {
  createTranscriptDeduper,
  shouldPreferWhisperOnMobile,
} from "../src/presentation/hooks/voice-input-platform";

describe("shouldPreferWhisperOnMobile", () => {
  it("Android Chrome をモバイルと判定する", () => {
    const ua =
      "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36";
    expect(shouldPreferWhisperOnMobile(ua)).toBe(true);
  });

  it("デスクトップ Chrome はモバイルと判定しない", () => {
    const ua =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";
    expect(shouldPreferWhisperOnMobile(ua)).toBe(false);
  });
});

describe("createTranscriptDeduper", () => {
  it("連続同一テキストを除外する", () => {
    const dedupe = createTranscriptDeduper(3000);
    expect(dedupe("hello", 1000)).toBe("hello");
    expect(dedupe("hello", 1500)).toBeNull();
  });

  it("時間経過後は同じテキストも通す", () => {
    const dedupe = createTranscriptDeduper(3000);
    expect(dedupe("hello", 1000)).toBe("hello");
    expect(dedupe("hello", 5000)).toBe("hello");
  });

  it("異なるテキストは連続でも通す", () => {
    const dedupe = createTranscriptDeduper(3000);
    expect(dedupe("hello", 1000)).toBe("hello");
    expect(dedupe("world", 1100)).toBe("world");
  });
});
