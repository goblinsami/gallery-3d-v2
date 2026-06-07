import { describe, expect, it } from "vitest";
import type { PlacementSide, PositionedGalleryItem } from "../types/GalleryItem";
import { buildCameraKeyframes } from "../journey/cameraKeyframes";
import { getCameraStateAtProgress } from "../journey/getCameraStateAtProgress";

const item = (id: string, z: number, side?: PlacementSide): PositionedGalleryItem => ({
  id,
  type: "statement",
  placement: side ? { side } : {},
  appearance: {},
  content: {},
  index: z,
  position: { x: 0, y: 1.6, z },
  rotation: { x: 0, y: 0, z: 0 },
  focusTarget: { x: 0, y: 1.6, z },
});

describe("camera journey", () => {
  it("builds bounded keyframes for positioned items", () => {
    const keyframes = buildCameraKeyframes([item("one", -4), item("two", -10)]);

    expect(keyframes[0].progress).toBe(0);
    expect(keyframes[keyframes.length - 1].progress).toBe(1);
    expect(keyframes.some((frame) => frame.activeItemId === "one")).toBe(true);
  });

  it("interpolates camera state from normalized progress", () => {
    const keyframes = buildCameraKeyframes([item("one", -4)]);
    const state = getCameraStateAtProgress(keyframes, 0.5);

    expect(state.position.y).toBeGreaterThan(0);
    expect(state.lookAt.z).toBeLessThanOrEqual(-4);
  });

  it("passes through center items", () => {
    const center = item("station", -6, "center");
    const keyframes = buildCameraKeyframes([center]);
    const passThrough = keyframes.find((frame) => frame.label === "station:pass-through");

    expect(passThrough?.position.x).toBe(0);
    expect(passThrough?.position.z).toBeLessThan(center.position.z);
  });

  it("offsets the camera to focus wall items", () => {
    const wall = {
      ...item("wall", -6, "left"),
      position: { x: -3, y: 1.6, z: -6 },
      focusTarget: { x: -3, y: 1.6, z: -6 },
    };
    const keyframes = buildCameraKeyframes([wall]);
    const focus = keyframes.find((frame) => frame.label === "wall:focus");

    expect(focus?.position.x).toBeLessThan(0);
    expect(focus?.position.z).toBe(wall.position.z);
  });

  it("moves farther back when a wide wall item needs mobile framing", () => {
    const wall = {
      ...item("wide-wall", -6, "left"),
      position: { x: -3, y: 1.6, z: -6 },
      focusTarget: { x: -3, y: 1.6, z: -6 },
      bounds: { width: 3.4, height: 1.25, depth: 0.08 },
    };
    const desktopFocus = buildCameraKeyframes([wall], { viewportAspect: 16 / 9 })
      .find((frame) => frame.label === "wide-wall:focus");
    const mobileFocus = buildCameraKeyframes([wall], { viewportAspect: 3 / 4 })
      .find((frame) => frame.label === "wide-wall:focus");

    expect(desktopFocus).toBeDefined();
    expect(mobileFocus).toBeDefined();
    expect((mobileFocus?.position.x ?? 0) - wall.focusTarget.x)
      .toBeGreaterThan((desktopFocus?.position.x ?? 0) - wall.focusTarget.x);
  });

  it("builds a loop seam toward the first cloned item", () => {
    const first = item("one", -4);
    const second = item("two", -10);
    const firstClone = item("one__loop_1", -16);
    const keyframes = buildCameraKeyframes([first, second], {}, { loopSeamItem: firstClone });
    const last = keyframes[keyframes.length - 1];

    expect(last.label).toBe("loop-seam");
    expect(last.position.z).toBeCloseTo(0.9 + firstClone.position.z - first.position.z);
    expect(last.lookAt.z).toBeCloseTo(firstClone.focusTarget.z - 2.2);
  });
});
