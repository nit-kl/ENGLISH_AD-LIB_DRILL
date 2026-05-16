import { describe, expect, it } from "vitest";
import { Grade } from "../src/value-objects/grade.js";

describe("Grade", () => {
  it("平均90以上で「神」級を返す", () => {
    const grade = Grade.fromAverageScore(92);
    expect(grade.rank).toBe("神");
    expect(grade.label).toBe("アドリブの神");
  });

  it("平均80以上90未満で1級を返す", () => {
    const grade = Grade.fromAverageScore(85);
    expect(grade.rank).toBe("1");
    expect(grade.label).toBe("1級");
  });

  it("平均50未満で5級を返す", () => {
    const grade = Grade.fromAverageScore(40);
    expect(grade.rank).toBe("5");
    expect(grade.label).toBe("5級");
  });

  it("境界値70で2級を返す", () => {
    const grade = Grade.fromAverageScore(70);
    expect(grade.rank).toBe("2");
  });
});
