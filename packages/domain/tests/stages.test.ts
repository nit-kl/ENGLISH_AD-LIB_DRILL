import { describe, expect, it } from "vitest";
import { CERT_QUESTION_IDS, getCertQuestions } from "../src/data/stages.js";

describe("stages data", () => {
  it("検定は10問", () => {
    expect(CERT_QUESTION_IDS).toHaveLength(10);
    expect(getCertQuestions()).toHaveLength(10);
  });
});
