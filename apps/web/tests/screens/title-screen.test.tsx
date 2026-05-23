import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TitleScreen } from "../../src/presentation/screens/TitleScreen.js";

/** 責務: タイトル画面の表示と開始操作 */
describe("TitleScreen", () => {
  it("見出しと開始ボタンを表示する", () => {
    render(<TitleScreen onStart={() => {}} />);
    expect(screen.getByRole("heading", { name: /英会話/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /はじめる/i })).toBeTruthy();
  });
});
