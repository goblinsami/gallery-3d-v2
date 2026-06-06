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
  if (state === "full" || state === "half") {
    return 1;
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
    overlayDistanceScale?: number;
    overlayDistanceMin?: number;
    overlayDistanceMax?: number;
    overlayForwardOffset?: number;
  } = {},
): CameraState => {
  const mix = getSheetMix(sheetState);
  if (mix === 0 || !item) {
    return camera;
  }

  const side = item.placement.side ?? "auto";
  const isWallItem = side !== "center";
  const bounds = getItemFramingBounds(item);
  const baseDistance = getFramedFocusDistance(bounds, {
    fov: options.fov ?? 50,
    viewportAspect: options.viewportAspect ?? 16 / 9,
    fill: options.focusFill ?? (sheetState === "full" ? 0.66 : 0.72),
    minDistance: isWallItem ? 1.35 : 1.6,
  });
  const overlayDistanceScale = options.overlayDistanceScale ?? 1;
  const normalizedArtworkScale = Math.max(1, bounds.width / 1.2, bounds.height / 0.8);
  const minDistance = (options.overlayDistanceMin ?? 0) * normalizedArtworkScale;
  const maxDistance = (options.overlayDistanceMax ?? Number.POSITIVE_INFINITY) * normalizedArtworkScale;
  const presetDistance = Math.min(
    maxDistance,
    Math.max(minDistance, baseDistance * overlayDistanceScale),
  );
  const framingExpansion = 1 + Math.max(0, overlayDistanceScale - 0.62) * 0.75;
  const focusDistance = Math.max(baseDistance * framingExpansion, presetDistance);
  const forwardOffset = options.overlayForwardOffset ?? 0;
  const normalX = side === "left" ? 1 : -1;
  const targetPosition: Vec3 = isWallItem
    ? {
        x: item.focusTarget.x + normalX * focusDistance,
        y: item.focusTarget.y,
        z: item.focusTarget.z + forwardOffset,
      }
    : {
      x: 0,
      y: item.focusTarget.y,
      z: item.focusTarget.z + focusDistance + forwardOffset,
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
