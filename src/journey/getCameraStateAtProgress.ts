import type { Vec3 } from "../types/GalleryItem";
import type { CameraKeyframe, CameraState } from "../types/Journey";
import { clamp } from "../utils/clamp";

const lerp = (from: number, to: number, t: number): number => from + (to - from) * t;

const smoothstep = (value: number): number => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

const lerpVec3 = (from: Vec3, to: Vec3, t: number): Vec3 => ({
  x: lerp(from.x, to.x, t),
  y: lerp(from.y, to.y, t),
  z: lerp(from.z, to.z, t),
});

const resolveActiveItem = (
  lower: CameraKeyframe,
  upper: CameraKeyframe,
  t: number,
): string | null => {
  if (lower.activeItemId === upper.activeItemId) {
    return lower.activeItemId;
  }

  return t < 0.5 ? lower.activeItemId : upper.activeItemId;
};

export const getCameraStateAtProgress = (
  keyframes: CameraKeyframe[],
  progress: number,
): CameraState => {
  if (keyframes.length === 0) {
    throw new Error("Cannot resolve camera state without keyframes.");
  }

  const clampedProgress = clamp(progress, 0, 1);
  const first = keyframes[0];
  const last = keyframes[keyframes.length - 1];

  if (clampedProgress <= first.progress) {
    return {
      position: first.position,
      lookAt: first.lookAt,
      activeItemId: first.activeItemId,
    };
  }

  if (clampedProgress >= last.progress) {
    return {
      position: last.position,
      lookAt: last.lookAt,
      activeItemId: last.activeItemId,
    };
  }

  let lower = first;
  let upper = last;

  for (let index = 0; index < keyframes.length - 1; index += 1) {
    const current = keyframes[index];
    const next = keyframes[index + 1];

    if (clampedProgress >= current.progress && clampedProgress <= next.progress) {
      lower = current;
      upper = next;
      break;
    }
  }

  const span = Math.max(0.0001, upper.progress - lower.progress);
  const linearT = clamp((clampedProgress - lower.progress) / span, 0, 1);
  const easedT = smoothstep(linearT);

  return {
    position: lerpVec3(lower.position, upper.position, easedT),
    lookAt: lerpVec3(lower.lookAt, upper.lookAt, easedT),
    activeItemId: resolveActiveItem(lower, upper, linearT),
  };
};
