const MODULE_START_OFFSET = 0.16;
const HIGH_DETAIL_MODULE_DEPTH = 4.2;
const LOW_DETAIL_MODULE_DEPTH = 5.6;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const getArchitecturalModuleCount = (
  depth: number,
  geometryDetail: number,
): number =>
  Math.max(
    8,
    Math.round(depth / (geometryDetail > 0.75 ? HIGH_DETAIL_MODULE_DEPTH : LOW_DETAIL_MODULE_DEPTH)),
  );

export const getArchitecturalModuleSegmentDepth = (
  depth: number,
  count: number,
): number =>
  (depth - MODULE_START_OFFSET * 2) / Math.max(1, count - 1);

export const getArchitecturalModuleZ = (
  depth: number,
  count: number,
  index: number,
): number =>
  -MODULE_START_OFFSET - index * getArchitecturalModuleSegmentDepth(depth, count);

export const getArchitecturalModuleCenterZ = (
  depth: number,
  count: number,
  index: number,
): number =>
  getArchitecturalModuleZ(depth, count, index)
  - getArchitecturalModuleSegmentDepth(depth, count) * 0.5;

export const snapZToArchitecturalModuleCenter = (
  depth: number,
  geometryDetail: number,
  z: number,
): number => {
  const count = getArchitecturalModuleCount(depth, geometryDetail);
  if (count < 2) {
    return z;
  }

  const segmentDepth = getArchitecturalModuleSegmentDepth(depth, count);
  const rawIndex = ((-z - MODULE_START_OFFSET) / segmentDepth) - 0.5;
  const intervalIndex = clamp(Math.round(rawIndex), 0, count - 2);
  return getArchitecturalModuleCenterZ(depth, count, intervalIndex);
};
