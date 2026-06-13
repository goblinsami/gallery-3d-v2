import { describe, expect, it } from "vitest";
import {
  createPexelsPassThroughProject,
  PEXELS_PASS_THROUGH_SCROLL_STRENGTH,
  PEXELS_PASS_THROUGH_SPACING,
  PEXELS_PASS_THROUGH_TEMPLATE,
} from "../samples/pexelsPassThroughProject";
import { buildCameraKeyframes } from "../journey/cameraKeyframes";
import { InfiniteCorridorLayout } from "../layouts/InfiniteCorridorLayout";
import { validateGalleryProject } from "../utils/validateGalleryProject";

describe("pexels pass-through playground template", () => {
  it("creates one welcome station followed by 20 pass-through Pexels images", () => {
    const validated = validateGalleryProject(createPexelsPassThroughProject());

    expect(PEXELS_PASS_THROUGH_TEMPLATE).toBe("pexels-pass-through");
    expect(validated.layout.spacing).toBe(PEXELS_PASS_THROUGH_SPACING);
    expect(validated.journey.scrollStrength).toBe(PEXELS_PASS_THROUGH_SCROLL_STRENGTH);
    expect(validated.journey.mobileScrollStrength).toBe(3.2);
    expect(validated.items).toHaveLength(21);
    expect(validated.items[0]).toMatchObject({
      id: "pexels-welcome",
      type: "statement",
      placement: { side: "center" },
    });

    const imageItems = validated.items.slice(1);
    expect(imageItems.every((item) => item.type === "image")).toBe(true);
    expect(imageItems.every((item) => item.passThrough === true)).toBe(true);
    imageItems.forEach((item, index) => {
      expect(item.placement.side).toBe(index % 2 === 0 ? "left" : "right");
    });
    expect(imageItems.every((item) => item.appearance.media?.[0]?.src.startsWith("https://images.pexels.com/photos/")))
      .toBe(true);
    expect(imageItems.some((item) => item.appearance.media?.[0]?.src.includes("/35600/"))).toBe(false);
    const imageSizes = new Set(imageItems.map((item) => item.appearance.size));
    expect(imageSizes.size).toBeGreaterThan(3);
  });

  it("validates near-zero corridor spacing for dense templates", () => {
    const validated = validateGalleryProject({
      ...createPexelsPassThroughProject(),
      layout: {
        type: "infinite-corridor",
        spacing: 0.1,
      },
    });

    expect(validated.layout.spacing).toBe(0.25);
  });

  it("keeps the dense Pexels wall images separated and starts the camera forward", () => {
    const project = validateGalleryProject(createPexelsPassThroughProject());
    const layout = new InfiniteCorridorLayout().layout(project, project.layout, {
      viewportAspect: 16 / 9,
      qualityScale: 1,
    });
    const firstCycle = layout.slice(0, project.items.length);
    const wallImages = firstCycle
      .filter((item) => item.passThrough === true)
      .sort((a, b) => b.position.z - a.position.z);

    wallImages.forEach((item, index) => {
      const next = wallImages[index + 1];
      if (!next) {
        return;
      }

      expect(item.placement.side).not.toBe(next.placement.side);
      expect(Math.abs(item.position.z - next.position.z)).toBeCloseTo(4.2, 1);
    });

    const keyframes = buildCameraKeyframes(firstCycle);
    const start = keyframes.find((frame) => frame.label === "start");
    const approach = keyframes.find((frame) => frame.label === "pexels-welcome:approach");

    expect(start).toBeDefined();
    expect(approach).toBeDefined();
    expect(approach?.position.z).toBeLessThan(start?.position.z ?? 0);
  });
});
