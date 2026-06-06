import {
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  Texture,
} from "three";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { RenderResources } from "../types/Renderer";

export interface MediaFrameOptions {
  width: number;
  height: number;
  surfaceColor: string;
  frameColor: string;
  emissive?: string;
  texture?: Texture | null;
  showFrame?: boolean;
}

const createFrameBar = (
  resources: RenderResources,
  width: number,
  height: number,
  depth: number,
  color: string,
): Mesh =>
  new Mesh(
    resources.unitBox,
    resources.getStandardSurface(color, 0.48, 0.32),
  );

export const createMediaFrame = (
  item: PositionedGalleryItem,
  options: MediaFrameOptions,
  resources: RenderResources,
): Group => {
  const root = new Group();
  const showFrame = options.showFrame ?? true;
  const frameThickness = 0.08;
  const depth = 0.08;
  const surface = new Mesh(
    resources.unitPlane,
    options.texture
      ? new MeshBasicMaterial({
          map: options.texture,
          side: DoubleSide,
          toneMapped: false,
        })
      : resources.getBasicSurface(options.surfaceColor),
  );
  surface.scale.set(options.width, options.height, 1);

  if (showFrame && options.emissive) {
    const glow = new Mesh(
      resources.unitPlane,
      resources.getGlow(options.emissive, 0.16),
    );
    glow.scale.set(options.width + 0.28, options.height + 0.28, 1);
    glow.position.z = -0.04;
    root.add(glow);
  }

  root.add(surface);

  if (showFrame) {
    const top = createFrameBar(resources, options.width + frameThickness * 2, frameThickness, depth, options.frameColor);
    const bottom = top.clone();
    const left = createFrameBar(resources, frameThickness, options.height, depth, options.frameColor);
    const right = left.clone();

    top.scale.set(options.width + frameThickness * 2, frameThickness, depth);
    bottom.scale.copy(top.scale);
    left.scale.set(frameThickness, options.height, depth);
    right.scale.copy(left.scale);
    top.position.y = options.height / 2 + frameThickness / 2;
    bottom.position.y = -options.height / 2 - frameThickness / 2;
    left.position.x = -options.width / 2 - frameThickness / 2;
    right.position.x = options.width / 2 + frameThickness / 2;
    root.add(top, bottom, left, right);
  }
  root.position.set(item.position.x, item.position.y, item.position.z);
  root.rotation.set(item.rotation.x, item.rotation.y, item.rotation.z);
  root.name = `${item.type}:${item.id}`;

  return root;
};
