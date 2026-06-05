import { describe, expect, it } from "vitest";
import { assessFrameBudget, getLowerQualityPreset } from "../utils/frameBudget";

describe("frameBudget", () => {
  it("suggests the next lower preset when frame time is over budget", () => {
    const assessment = assessFrameBudget(
      [{ frameTimeMs: 28 }, { frameTimeMs: 30 }],
      "high",
      60,
    );

    expect(assessment.overBudget).toBe(true);
    expect(assessment.suggestedPreset).toBe("medium");
  });

  it("does not suggest lower than low", () => {
    expect(getLowerQualityPreset("low")).toBeNull();
  });
});
