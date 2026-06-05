import type { GalleryItem, PositionedGalleryItem, Vec3 } from "../types/GalleryItem";

const DEFAULT_WIDTH = 2.4;
const DEFAULT_HEIGHT = 1.6;
const DEFAULT_DEPTH = 0.08;

export const toVec3 = (x: number, y: number, z: number): Vec3 => ({ x, y, z });

export const getItemBounds = (item: GalleryItem): NonNullable<PositionedGalleryItem["bounds"]> => {
  const size = item.appearance.size;
  const scale = item.placement.scale ?? 1;
  const semanticScale = size === "large" ? 1.48 : size === "small" ? 0.82 : 1;
  const numericScale = typeof size === "number" ? size : semanticScale;
  const resolvedScale = Math.max(0.2, scale * numericScale);

  return {
    width: DEFAULT_WIDTH * resolvedScale,
    height: DEFAULT_HEIGHT * resolvedScale,
    depth: DEFAULT_DEPTH,
  };
};

export const applyOffset = (position: Vec3, offset: Partial<Vec3> | undefined): Vec3 => ({
  x: position.x + (offset?.x ?? 0),
  y: position.y + (offset?.y ?? 0),
  z: position.z + (offset?.z ?? 0),
});
