import { describe, expect, it } from "vitest";
import {
  createPexelsPassThroughProject,
  PEXELS_PASS_THROUGH_SMOOTHING,
  PEXELS_PASS_THROUGH_SCROLL_STRENGTH,
  PEXELS_PASS_THROUGH_SPACING,
  PEXELS_PASS_THROUGH_TEMPLATE,
} from "../samples/pexelsPassThroughProject";
import { buildCameraKeyframes } from "../journey/cameraKeyframes";
import { InfiniteCorridorLayout } from "../layouts/InfiniteCorridorLayout";
import { getArchitecturalModuleCenterAtIndex } from "../utils/architecturalModules";
import { validateGalleryProject } from "../utils/validateGalleryProject";

describe("pexels pass-through playground template", () => {
  it("creates one welcome station followed by 20 pass-through Pexels images", () => {
    const validated = validateGalleryProject(createPexelsPassThroughProject());

    expect(PEXELS_PASS_THROUGH_TEMPLATE).toBe("pexels-pass-through");
    expect(validated.layout.spacing).toBe(PEXELS_PASS_THROUGH_SPACING);
    expect(validated.journey.smoothing).toBe(PEXELS_PASS_THROUGH_SMOOTHING);
    expect(validated.journey.scrollStrength).toBe(PEXELS_PASS_THROUGH_SCROLL_STRENGTH);
    expect(validated.journey.mobileScrollStrength).toBe(3.2);
    expect(validated.items).toHaveLength(41);
    expect(validated.items[0]).toMatchObject({
      id: "pexels-welcome",
      type: "statement",
      placement: { side: "center" },
    });

    const imageItems = validated.items.slice(1);
    expect(imageItems.every((item) => item.type === "image")).toBe(true);
    expect(imageItems.every((item) => item.passThrough === true)).toBe(true);
    expect(imageItems.filter((item) => item.placement.side === "left")).toHaveLength(20);
    expect(imageItems.filter((item) => item.placement.side === "right")).toHaveLength(20);
    for (let index = 0; index < imageItems.length; index += 2) {
      expect(imageItems[index]?.placement.side).toBe("left");
      expect(imageItems[index + 1]?.placement.side).toBe("right");
      expect(imageItems[index]?.placement.slot).toBe(imageItems[index + 1]?.placement.slot);
    }
    expect(imageItems.every((item) => item.appearance.media?.[0]?.src.startsWith("https://images.pexels.com/photos/")))
      .toBe(true);
    expect(imageItems.some((item) => item.appearance.media?.[0]?.src.includes("/35600/"))).toBe(false);
    const imageSizes = new Set(imageItems.map((item) => item.appearance.size));
    expect(imageSizes.size).toBeGreaterThan(3);
  });

  it("keeps the dense Pexels wall images separated and starts the camera forward", () => {
    const project = validateGalleryProject(createPexelsPassThroughProject());
    const layout = new InfiniteCorridorLayout().layout(project, project.layout, {
      viewportAspect: 16 / 9,
      qualityScale: 1,
    });
    const firstCycle = layout.slice(0, project.items.length);
    const welcome = firstCycle.find((item) => item.id === "pexels-welcome");
    const wallImages = firstCycle.filter((item) => item.passThrough === true);
    const segmentPairs = Array.from({ length: 20 }, (_, index) => {
      const slot = index;
      return wallImages.filter((item) => item.placement.slot === slot);
    });

    expect(welcome).toBeDefined();

    segmentPairs.forEach((pair, index) => {
      const next = segmentPairs[index + 1]?.[0];
      expect(pair).toHaveLength(2);
      expect(pair.map((item) => item.placement.side).sort()).toEqual(["left", "right"]);
      expect(pair[0]?.position.z).toBeCloseTo(pair[1]?.position.z ?? 0);
      expect(pair[0]?.position.z).toBeCloseTo(
        getArchitecturalModuleCenterAtIndex(
          project.layout.bounds?.depth ?? 360,
          1,
          index,
          (project.items.reduce((max, sourceItem, sourceIndex) =>
            Math.max(max, sourceItem.placement.slot ?? sourceIndex + 1),
          project.items.length) + 2) * (project.layout.spacing ?? 7),
        ),
      );
      if (!next || !pair[0]) {
        return;
      }

      expect(Math.abs(pair[0].position.z - next.position.z)).toBeGreaterThan(3.6);
      expect(Math.abs(pair[0].position.z - next.position.z)).toBeLessThan(5);
    });
    expect(welcome?.position.z).toBeGreaterThan(wallImages[0]?.position.z ?? 0);

    const keyframes = buildCameraKeyframes(firstCycle);
    const start = keyframes.find((frame) => frame.label === "start");
    const approach = keyframes.find((frame) => frame.label === "pexels-welcome:approach");
    const travelFrames = keyframes.filter((frame) => frame.label.endsWith(":travel"));
    const lastTravel = travelFrames[travelFrames.length - 1];
    const corridorFrames = keyframes.filter((frame) =>
      frame.label === "start" ||
      frame.label.startsWith("pexels-welcome:") ||
      frame.label.endsWith(":travel")
    );

    expect(start).toBeDefined();
    expect(approach).toBeDefined();
    expect(travelFrames).toHaveLength(20);
    expect(approach?.position.z).toBeLessThan(start?.position.z ?? 0);
    expect((start?.position.z ?? 0) - (welcome?.position.z ?? 0)).toBeGreaterThan(5.8);
    expect(approach?.progress).toBeLessThan(0.05);
    expect(lastTravel?.progress).toBeGreaterThan(0.9);
    corridorFrames.forEach((frame, index) => {
      const previous = corridorFrames[index - 1];
      if (!previous) {
        return;
      }

      expect(frame.position.z).toBeLessThan(previous.position.z);
    });
  });
});
