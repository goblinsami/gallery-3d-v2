import { describe, expect, it } from "vitest";
import { getArchitecturalModulePattern } from "../utils/architecturalModules";

describe("architectural modules", () => {
  it("creates cycle-aligned module positions for looped corridors", () => {
    const pattern = getArchitecturalModulePattern(120, 1, 40);
    const firstCyclePosition = pattern.positions[0];
    const secondCyclePosition = pattern.positions.find((position) =>
      Math.abs(position - (firstCyclePosition - 40)) < 0.0001,
    );

    expect(secondCyclePosition).toBeDefined();
    expect(pattern.segmentDepth).toBeGreaterThan(0);
  });
});

