import type { PositionedGalleryItem, Vec3 } from "../types/GalleryItem";
import type { BottomSheetState, CameraState } from "../types/Journey";
import { getFramedFocusDistance, getItemFramingBounds } from "./framing";

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
  options: {
    fov?: number;
    viewportAspect?: number;
    focusFill?: number;
  } = {},
): CameraState => {
  const mix = getSheetMix(sheetState);
  if (mix === 0 || !item) {
    return camera;
  }

  const side = item.placement.side ?? "auto";
  const isWallItem = side !== "center";
  const focusDistance = getFramedFocusDistance(getItemFramingBounds(item), {
    fov: options.fov ?? 50,
    viewportAspect: options.viewportAspect ?? 16 / 9,
    fill: options.focusFill ?? (sheetState === "full" ? 0.66 : 0.72),
    minDistance: isWallItem ? 1.35 : 1.6,
  });
  const normalX = side === "left" ? 1 : -1;
  const targetPosition: Vec3 = isWallItem
    ? {
        x: item.focusTarget.x + normalX * focusDistance,
        y: item.focusTarget.y,
        z: item.focusTarget.z,
      }
    : {
        x: 0,
        y: item.focusTarget.y,
        z: item.focusTarget.z + focusDistance,
      };
  const composedPosition: Vec3 = lerpVec3(camera.position, targetPosition, mix);
  const composedLookAt: Vec3 = lerpVec3(camera.lookAt, {
    x: item.focusTarget.x,
    y: item.focusTarget.y,
    z: item.focusTarget.z,
  }, mix);

  return {
    ...camera,
    position: composedPosition,
    lookAt: composedLookAt,
  };
};
