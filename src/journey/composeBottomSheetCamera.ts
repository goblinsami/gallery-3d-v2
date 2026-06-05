import type { PositionedGalleryItem, Vec3 } from "../types/GalleryItem";
import type { BottomSheetState, CameraState } from "../types/Journey";

const lerp = (from: number, to: number, t: number): number => from + (to - from) * t;

const lerpVec3 = (from: Vec3, to: Vec3, t: number): Vec3 => ({
  x: lerp(from.x, to.x, t),
  y: lerp(from.y, to.y, t),
  z: lerp(from.z, to.z, t),
});

const getSheetMix = (state: BottomSheetState): number => {
  if (state === "full") {
    return 1;
  }

  if (state === "half") {
    return 0.48;
  }

  return 0;
};

export const composeBottomSheetCamera = (
  camera: CameraState,
  item: PositionedGalleryItem | null,
  sheetState: BottomSheetState,
): CameraState => {
  const mix = getSheetMix(sheetState);
  if (mix === 0 || !item) {
    return camera;
  }

  const distance = Math.max(2.8, Math.abs(camera.position.z - item.focusTarget.z));
  const composedPosition: Vec3 = {
    x: lerp(camera.position.x, item.focusTarget.x * 0.18, mix),
    y: camera.position.y + mix * 0.28,
    z: lerp(camera.position.z, item.focusTarget.z + distance * 0.72, mix),
  };
  const composedLookAt: Vec3 = lerpVec3(camera.lookAt, {
    x: item.focusTarget.x,
    y: item.focusTarget.y + mix * 0.18,
    z: item.focusTarget.z,
  }, mix);

  return {
    ...camera,
    position: composedPosition,
    lookAt: composedLookAt,
  };
};
