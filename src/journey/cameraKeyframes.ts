import type { PositionedGalleryItem, Vec3 } from "../types/GalleryItem";
import type { CameraKeyframe, JourneyMetrics } from "../types/Journey";
import { getFramedFocusDistance, getItemFramingBounds } from "./framing";
import { getCameraStateAtProgress } from "./getCameraStateAtProgress";
import { LOOP_RESTART_PROGRESS } from "./loopProgress";

const DEFAULT_METRICS: JourneyMetrics = {
  cameraHeight: 1.7,
  focusDistance: 4.2,
  lookAhead: 2.2,
  fov: 50,
  viewportAspect: 16 / 9,
  focusFill: 0.74,
  framingDistance: 1,
  stationFramingDistance: 1,
};

const add = (value: Vec3, x: number, y: number, z: number): Vec3 => ({
  x: value.x + x,
  y: value.y + y,
  z: value.z + z,
});

const offsetZ = (value: Vec3, z: number): Vec3 => add(value, 0, 0, z);

const getJourneyStops = (items: PositionedGalleryItem[]): PositionedGalleryItem[] => {
  const stops: PositionedGalleryItem[] = [];

  items.forEach((item) => {
    const previous = stops[stops.length - 1];
    if (
      item.passThrough === true &&
      previous?.passThrough === true &&
      Math.abs(previous.position.z - item.position.z) < 0.001
    ) {
      return;
    }

    stops.push(item);
  });

  return stops;
};

const getWallFocusDistance = (item: PositionedGalleryItem): number => {
  const bounds = getItemFramingBounds(item);
  return Math.max(1.35, bounds.width * 0.6, bounds.height * 0.75);
};

const getForwardCameraZ = (
  requestedZ: number,
  frames: CameraKeyframe[],
  minimumStep = 0.35,
): number => {
  const previousCameraZ = frames[frames.length - 1]?.position.z;
  if (previousCameraZ === undefined) {
    return requestedZ;
  }

  return Math.min(requestedZ, previousCameraZ - minimumStep);
};

export interface CameraKeyframeOptions {
  loopSeamItem?: PositionedGalleryItem;
}

export const buildCameraKeyframes = (
  items: PositionedGalleryItem[],
  metrics: Partial<JourneyMetrics> = {},
  options: CameraKeyframeOptions = {},
): CameraKeyframe[] => {
  const resolved = { ...DEFAULT_METRICS, ...metrics };
  const focusableItems = items.filter((item) => item.passThrough !== true);
  const journeyStops = getJourneyStops(items);

  if (focusableItems.length === 0) {
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

  const first = focusableItems[0];
  const startZ = first.position.z + Math.max(resolved.focusDistance * 1.85, resolved.lookAhead * 2.7, 8.6);
  const step = 1 / Math.max(1, journeyStops.length);
  const frames: CameraKeyframe[] = [
    {
      progress: 0,
      position: { x: 0, y: resolved.cameraHeight, z: startZ },
      lookAt: add(first.focusTarget, 0, 0, -resolved.lookAhead),
      activeItemId: null,
      label: "start",
    },
  ];

  journeyStops.forEach((item, index) => {
    const start = index * step;
    const side = item.placement.side ?? "auto";
    const isCenter = side === "center";

    if (item.passThrough === true) {
      const travelLead = Math.max(0.25, Math.min(0.55, resolved.lookAhead * 0.18));
      const travelZ = getForwardCameraZ(item.position.z + travelLead, frames);
      frames.push({
        progress: Math.min(1, start + step * 0.5),
        position: {
          x: 0,
          y: resolved.cameraHeight,
          z: travelZ,
        },
        lookAt: {
          x: 0,
          y: resolved.cameraHeight,
          z: item.position.z - Math.max(2.2, resolved.lookAhead * 1.6),
        },
        activeItemId: null,
        label: `${item.id}:travel`,
      });
      return;
    }

    if (isCenter) {
      const approach = Math.min(1, start + step * 0.32);
      const passThrough = Math.min(1, start + step * 0.72);
      const focusDistance = getFramedFocusDistance(getItemFramingBounds(item), {
        fov: resolved.fov,
        viewportAspect: resolved.viewportAspect,
        fill: resolved.focusFill,
        minDistance: 1.35,
      }) * resolved.stationFramingDistance;
      const approachZ = getForwardCameraZ(item.position.z + focusDistance, frames, 0.7);

      frames.push({
        progress: approach,
        position: { x: 0, y: resolved.cameraHeight, z: approachZ },
        lookAt: add(item.focusTarget, 0, 0, -resolved.lookAhead),
        activeItemId: item.id,
        label: `${item.id}:approach`,
      });
      const passThroughZ = getForwardCameraZ(item.position.z - focusDistance * 0.28, frames, 0.35);
      frames.push({
        progress: passThrough,
        position: { x: 0, y: resolved.cameraHeight, z: passThroughZ },
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
    }) * resolved.framingDistance;
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

  const loopSeamItem = options.loopSeamItem?.passThrough === true ? undefined : options.loopSeamItem;
  if (loopSeamItem) {
    const first = focusableItems[0];
    const loopOffsetZ = loopSeamItem.position.z - first.position.z;
    const restartState = getCameraStateAtProgress(
      [...frames].sort((a, b) => a.progress - b.progress),
      LOOP_RESTART_PROGRESS,
    );
    const requestedPosition = offsetZ(restartState.position, loopOffsetZ);
    const requestedLookAt = offsetZ(restartState.lookAt, loopOffsetZ);
    const previousCameraZ = frames[frames.length - 1]?.position.z;
    const seamZ = previousCameraZ !== undefined && requestedPosition.z > previousCameraZ
      ? previousCameraZ - 0.001
      : requestedPosition.z;
    const seamDeltaZ = seamZ - requestedPosition.z;
    frames.push({
      progress: 1,
      position: { ...requestedPosition, z: seamZ },
      lookAt: { ...requestedLookAt, z: requestedLookAt.z + seamDeltaZ },
      activeItemId: null,
      label: "loop-seam",
    });
  } else {
    const last = items[items.length - 1] ?? focusableItems[focusableItems.length - 1];
    const endTailDistance = resolved.focusDistance * 2.35;
    frames.push({
      progress: 1,
      position: { x: 0, y: resolved.cameraHeight, z: last.position.z - endTailDistance },
      lookAt: add(last.focusTarget, 0, 0, -resolved.lookAhead * 4),
      activeItemId: null,
      label: "empty-corridor-tail",
    });
  }

  return frames.sort((a, b) => a.progress - b.progress);
};
