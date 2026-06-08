import { describe, expect, it } from "vitest";
import { composeBottomSheetCamera } from "../journey/composeBottomSheetCamera";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { CameraState } from "../types/Journey";

const camera: CameraState = {
  position: { x: 0, y: 1.7, z: 2 },
  lookAt: { x: 0, y: 1.6, z: -4 },
  activeItemId: "item-1",
};

const item: PositionedGalleryItem = {
  id: "item-1",
  type: "statement",
  placement: { side: "left" },
  appearance: {},
  content: {},
  index: 0,
  position: { x: 1.2, y: 1.6, z: -4 },
  rotation: { x: 0, y: 0, z: 0 },
  focusTarget: { x: 1.2, y: 1.6, z: -4 },
  bounds: { width: 3.2, height: 1.2, depth: 0.08 },
};

describe("composeBottomSheetCamera", () => {
  it("keeps camera unchanged when sheet is collapsed", () => {
    expect(composeBottomSheetCamera(camera, item, "collapsed")).toEqual(camera);
  });

  it("reframes toward the active item when sheet is full", () => {
    const composed = composeBottomSheetCamera(camera, item, "full");

    expect(composed.position.x).toBeGreaterThan(camera.position.x);
    expect(composed.position.y).toBe(item.focusTarget.y);
    expect(composed.lookAt.x).toBe(item.focusTarget.x);
  });

  it("fully reframes the active item when the sheet opens half from a click", () => {
    const composed = composeBottomSheetCamera(camera, item, "half", {
      viewportAspect: 16 / 9,
      overlayDistanceScale: 0.72,
      overlayDistanceMin: 0.95,
      overlayDistanceMax: 1.8,
      overlayForwardOffset: 0.14,
    });

    expect(composed.lookAt).toEqual(item.focusTarget);
    expect(composed.position.x - item.focusTarget.x).toBeGreaterThan(1.8);
    expect(composed.position.z).toBeCloseTo(item.focusTarget.z + 0.14);
  });

  it("keeps wide artwork inside narrower mobile viewports", () => {
    const desktop = composeBottomSheetCamera(camera, item, "full", { viewportAspect: 16 / 9 });
    const mobile = composeBottomSheetCamera(camera, item, "full", { viewportAspect: 3 / 4 });

    expect(mobile.position.x - item.focusTarget.x).toBeGreaterThan(desktop.position.x - item.focusTarget.x);
    expect(mobile.lookAt).toEqual(item.focusTarget);
  });

  it("applies framing distance when opening an item", () => {
    const defaultFrame = composeBottomSheetCamera(camera, item, "full", {
      viewportAspect: 16 / 9,
    });
    const pulledBackFrame = composeBottomSheetCamera(camera, item, "full", {
      viewportAspect: 16 / 9,
      framingDistance: 1.25,
    });

    expect(pulledBackFrame.position.x - item.focusTarget.x)
      .toBeGreaterThan(defaultFrame.position.x - item.focusTarget.x);
  });

  it("uses overlay framing preset values for wall item targets", () => {
    const frontal = composeBottomSheetCamera(camera, item, "full", {
      viewportAspect: 16 / 9,
      overlayDistanceScale: 0.62,
      overlayDistanceMin: 0.8,
      overlayDistanceMax: 1.4,
      overlayForwardOffset: 0.08,
    });
    const cinematic = composeBottomSheetCamera(camera, item, "full", {
      viewportAspect: 16 / 9,
      overlayDistanceScale: 0.85,
      overlayDistanceMin: 1.1,
      overlayDistanceMax: 2.2,
      overlayForwardOffset: 0.2,
    });

    expect(frontal.position.x - item.focusTarget.x).toBeGreaterThan(1.4);
    expect(cinematic.position.x - item.focusTarget.x).toBeGreaterThan(frontal.position.x - item.focusTarget.x);
    expect(cinematic.position.z).toBeGreaterThan(frontal.position.z);
  });

  it("keeps the whole artwork visible on narrow mobile overlay viewports", () => {
    const frontal = composeBottomSheetCamera(camera, item, "half", {
      viewportAspect: 0.55,
      overlayDistanceScale: 0.62,
      overlayDistanceMin: 0.8,
      overlayDistanceMax: 1.4,
      overlayForwardOffset: 0.08,
    });
    const cinematic = composeBottomSheetCamera(camera, item, "half", {
      viewportAspect: 0.55,
      overlayDistanceScale: 0.85,
      overlayDistanceMin: 1.1,
      overlayDistanceMax: 2.2,
      overlayForwardOffset: 0.2,
    });

    expect(frontal.position.x - item.focusTarget.x).toBeGreaterThan(6);
    expect(cinematic.position.x - item.focusTarget.x).toBeGreaterThan(frontal.position.x - item.focusTarget.x);
    expect(cinematic.lookAt).toEqual(item.focusTarget);
  });
});
