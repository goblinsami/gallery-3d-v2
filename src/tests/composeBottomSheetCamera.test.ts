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
  placement: {},
  appearance: {},
  content: {},
  index: 0,
  position: { x: 1.2, y: 1.6, z: -4 },
  rotation: { x: 0, y: 0, z: 0 },
  focusTarget: { x: 1.2, y: 1.6, z: -4 },
};

describe("composeBottomSheetCamera", () => {
  it("keeps camera unchanged when sheet is collapsed", () => {
    expect(composeBottomSheetCamera(camera, item, "collapsed")).toEqual(camera);
  });

  it("reframes toward the active item when sheet is full", () => {
    const composed = composeBottomSheetCamera(camera, item, "full");

    expect(composed.position.x).toBeGreaterThan(camera.position.x);
    expect(composed.position.y).toBeGreaterThan(camera.position.y);
    expect(composed.lookAt.x).toBe(item.focusTarget.x);
  });
});
