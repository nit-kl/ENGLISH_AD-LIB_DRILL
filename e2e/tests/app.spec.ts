import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/score", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        feedback: {
          total: 80,
          fluency: 78,
          grammar: 82,
          vocabulary: 75,
          relevance: 85,
          goodPoints: ["自然な流れ"],
          improvements: ["冠詞に注意"],
          modelAnswer: "I'd like a tall iced latte, please.",
        },
      }),
    });
  });
});

test("タイトルからモード選択まで遷移できる", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /英会話/ })).toBeVisible();
  await page.getByRole("button", { name: "はじめる" }).click();
  await expect(page.getByRole("heading", { name: "モードを選ぶ" })).toBeVisible();
  await expect(page.getByRole("button", { name: "検定モード" })).toBeVisible();
});

test("ステージモードで1問回答して採点結果が表示される", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "はじめる" }).click();
  await page.getByRole("button", { name: "ステージモード" }).click();
  await page.getByRole("button", { name: /初級/ }).click();

  await page.getByPlaceholder(/英語で入力/).fill("I'd like a tall iced latte please");
  await page.getByRole("button", { name: "回答する" }).click();

  await expect(page.getByText("AI採点結果")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("80")).toBeVisible();
});
