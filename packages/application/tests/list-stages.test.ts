import { describe, expect, it } from "vitest";
import { staticStageRepository } from "@english-adlib/content";
import { ListStagesUseCase } from "../src/use-cases/list-stages.js";

/** 責務: 全ステージ一覧を repository から返す */
describe("ListStagesUseCase", () => {
  it("4 ステージを返す", () => {
    const useCase = new ListStagesUseCase(staticStageRepository);
    const stages = useCase.execute();
    expect(stages).toHaveLength(4);
    expect(stages.map((s) => s.key)).toEqual([
      "beginner",
      "intermediate",
      "advanced",
      "legendary",
    ]);
  });

  it("各ステージに問題が含まれる", () => {
    const useCase = new ListStagesUseCase(staticStageRepository);
    for (const stage of useCase.execute()) {
      expect(stage.questions.length).toBeGreaterThan(0);
    }
  });
});
