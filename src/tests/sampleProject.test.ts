import { describe, expect, it } from "vitest";
import { premiumCorridorProject } from "../samples/premiumCorridorProject";
import { validateGalleryProject } from "../utils/validateGalleryProject";

describe("premiumCorridorProject", () => {
  it("is a valid GalleryProject sample", () => {
    const validated = validateGalleryProject(premiumCorridorProject);

    expect(validated.items.length).toBeGreaterThan(0);
    expect(validated.layout.type).toBe("infinite-corridor");
    expect(validated.journey.loop).toBe(true);
    expect(validated.theme.lighting?.ceilingLightColor).toBe("#fff6df");
    expect(validated.theme.lighting?.ledColor).toBe("#fff8df");
    expect(validated.items.filter((item) => item.passThrough === true)).toHaveLength(5);
    expect(validated.items.find((item) => item.id === "silent-1")?.appearance.media?.[0]?.src)
      .toBe("/images/silent1.webp");
  });
});
