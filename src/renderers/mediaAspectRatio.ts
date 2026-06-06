import type { Texture } from "three";

interface ImageLike {
  width?: unknown;
  height?: unknown;
  naturalWidth?: unknown;
  naturalHeight?: unknown;
}

export interface FrameSize {
  width: number;
  height: number;
}

const getPositiveNumber = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;

export const getTextureAspectRatio = (texture: Texture | null | undefined): number | null => {
  const image = texture?.image as ImageLike | undefined;
  if (!image) {
    return null;
  }

  const width = getPositiveNumber(image.naturalWidth) ?? getPositiveNumber(image.width);
  const height = getPositiveNumber(image.naturalHeight) ?? getPositiveNumber(image.height);
  return width && height ? width / height : null;
};

export const fitFrameToAspectRatio = (
  maxSize: FrameSize,
  aspectRatio: number | null,
): FrameSize => {
  if (!aspectRatio || aspectRatio <= 0) {
    return maxSize;
  }

  const maxAspectRatio = maxSize.width / maxSize.height;
  if (aspectRatio > maxAspectRatio) {
    return {
      width: maxSize.width,
      height: maxSize.width / aspectRatio,
    };
  }

  return {
    width: maxSize.height * aspectRatio,
    height: maxSize.height,
  };
};
