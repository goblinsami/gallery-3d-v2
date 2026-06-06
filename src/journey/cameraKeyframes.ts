import type { PositionedGalleryItem, Vec3 } from "../types/GalleryItem";
import type { CameraKeyframe, JourneyMetrics } from "../types/Journey";
import { getFramedFocusDistance, getItemFramingBounds } from "./framing";

const DEFAULT_METRICS: JourneyMetrics = {
  cameraHeight: 1.7,
  focusDistance: 4.2,
  lookAhead: 2.2,
  fov: 50,
  viewportAspect: 16 / 9,
  focusFill: 0.74,
};

const add = (value: Vec3, x: number, y: number, z: number): Vec3 => ({
  x: value.x + x,
  y: value.y + y,
  z: value.z + z,
});

const getWallFocusDistance = (item: PositionedGalleryItem): number => {
  const bounds = getItemFramingBounds(item);
  return Math.max(1.35, bounds.width * 0.6, bounds.height * 0.75);
};

export const buildCameraKeyframes = (
  items: PositionedGalleryItem[],
  metrics: Partial<JourneyMetrics> = {},
): CameraKeyframe[] => {
  const resolved = { ...DEFAULT_METRICS, ...metrics };

  if (items.length === 0) {
    return [
      {
        progress: 0,
        position: { x: 0, y: resolved.cameraHeight, z: 4 },
        lookAt: { x: 0, y: resolved.cameraHeight, z: -4 },
        activeItemId: null,
        label: "empty",
      },
    ];
  }

  const step = 1 / Math.max(1, items.length);
  const frames: CameraKeyframe[] = [
    {
      progress: 0,
      position: { x: 0, y: resolved.cameraHeight, z: 0.9 },
      lookAt: add(items[0].focusTarget, 0, 0, -resolved.lookAhead),
      activeItemId: null,
      label: "start",
    },
  ];

  items.forEach((item, index) => {
    const start = index * step;
    const side = item.placement.side ?? "auto";
    const isCenter = side === "center";

    if (isCenter) {
      const approach = Math.min(1, start + step * 0.32);
      const passThrough = Math.min(1, start + step * 0.72);
      const focusDistance = getFramedFocusDistance(getItemFramingBounds(item), {
        fov: resolved.fov,
        viewportAspect: resolved.viewportAspect,
        fill: resolved.focusFill,
        minDistance: 1.35,
      });

      frames.push({
        progress: approach,
        position: { x: 0, y: resolved.cameraHeight, z: item.position.z + focusDistance },
        lookAt: add(item.focusTarget, 0, 0, -resolved.lookAhead),
        activeItemId: item.id,
        label: `${item.id}:approach`,
      });
      frames.push({
        progress: passThrough,
        position: { x: 0, y: resolved.cameraHeight, z: item.position.z - resolved.focusDistance * 0.28 },
        lookAt: add(item.focusTarget, 0, 0, -resolved.lookAhead * 1.8),
        activeItemId: item.id,
        label: `${item.id}:pass-through`,
      });
      return;
    }

    const normalX = side === "left" ? 1 : -1;
    const focusDistance = getFramedFocusDistance(getItemFramingBounds(item), {
      fov: resolved.fov,
      viewportAspect: resolved.viewportAspect,
      fill: resolved.focusFill,
      minDistance: getWallFocusDistance(item),
    });
    const centerPosition = {
      x: 0,
      y: resolved.cameraHeight,
      z: item.position.z + Math.max(1.45, resolved.lookAhead * 0.72),
    };
    const focusPosition = {
      x: item.position.x + normalX * focusDistance,
      y: resolved.cameraHeight,
      z: item.position.z,
    };

    frames.push({
      progress: Math.min(1, start + step * 0.36),
      position: centerPosition,
      lookAt: add(item.focusTarget, normalX * 0.24, 0, -resolved.lookAhead * 0.26),
      activeItemId: null,
      label: `${item.id}:turn-start`,
    });
    frames.push({
      progress: Math.min(1, start + step * 0.64),
      position: focusPosition,
      lookAt: item.focusTarget,
      activeItemId: item.id,
      label: `${item.id}:focus`,
    });
    frames.push({
      progress: Math.min(1, start + step * 0.86),
      position: focusPosition,
      lookAt: item.focusTarget,
      activeItemId: item.id,
      label: `${item.id}:hold`,
    });
  });

  const last = items[items.length - 1];
  const endTailDistance = resolved.focusDistance * 2.35;
  frames.push({
    progress: 1,
    position: { x: 0, y: resolved.cameraHeight, z: last.position.z - endTailDistance },
    lookAt: add(last.focusTarget, 0, 0, -resolved.lookAhead * 4),
    activeItemId: null,
    label: "empty-corridor-tail",
  });

  return frames.sort((a, b) => a.progress - b.progress);
};
