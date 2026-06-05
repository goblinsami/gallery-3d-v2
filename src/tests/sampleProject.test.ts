import { describe, expect, it } from "vitest";
import { premiumCorridorProject } from "../samples/premiumCorridorProject";
import { validateGalleryProject } from "../utils/validateGalleryProject";

describe("premiumCorridorProject", () => {
  it("is a valid GalleryProject sample", () => {
    const validated = validateGalleryProject(premiumCorridorProject);

    expect(validated.items.length).toBeGreaterThan(0);
    expect(validated.layout.type).toBe("corridor");
  });
});
