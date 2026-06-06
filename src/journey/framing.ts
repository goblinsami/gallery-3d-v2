import type { PositionedGalleryItem } from "../types/GalleryItem";

export interface FramingBounds {
  width: number;
  height: number;
}

export interface FramingOptions {
  fov: number;
  viewportAspect: number;
  fill?: number;
  minDistance?: number;
}

const MIN_TAN = 0.0001;

export const getFramedFocusDistance = (
  bounds: FramingBounds,
  options: FramingOptions,
): number => {
  const fill = Math.min(0.98, Math.max(0.28, options.fill ?? 0.74));
  const verticalFov = (options.fov * Math.PI) / 180;
  const halfVerticalFov = verticalFov / 2;
  const viewportAspect = Math.max(0.2, options.viewportAspect);
  const halfHorizontalFov = Math.atan(Math.tan(halfVerticalFov) * viewportAspect);
  const distanceByHeight = (bounds.height * 0.5) / Math.max(MIN_TAN, Math.tan(halfVerticalFov) * fill);
  const distanceByWidth = (bounds.width * 0.5) / Math.max(MIN_TAN, Math.tan(halfHorizontalFov) * fill);

  return Math.max(options.minDistance ?? 0.9, distanceByHeight, distanceByWidth);
};

export const getItemFramingBounds = (item: PositionedGalleryItem): FramingBounds => ({
  width: item.bounds?.width ?? 2.4,
  height: item.bounds?.height ?? 1.6,
});
