import { describe, expect, it } from "vitest";
import {
  clampScrollixProgress,
  normalizeScrollixGalleryProject,
} from "../framer/ScrollixGallery";
import { premiumCorridorProject } from "../samples/premiumCorridorProject";

describe("framer adapter", () => {
  it("normalizes JSON project input", () => {
    const project = normalizeScrollixGalleryProject({
      project: JSON.stringify(premiumCorridorProject),
    });

    expect(project.items.length).toBe(premiumCorridorProject.items.length);
    expect(project.theme.quality).toBe("auto");
  });

  it("applies quality overrides at the adapter boundary", () => {
    const project = normalizeScrollixGalleryProject({
      project: premiumCorridorProject,
      qualityOverride: "low",
    });

    expect(project.theme.quality).toBe("low");
  });

  it("clamps initial progress", () => {
    expect(clampScrollixProgress(-1)).toBe(0);
    expect(clampScrollixProgress(0.4)).toBe(0.4);
    expect(clampScrollixProgress(2)).toBe(1);
  });
});
