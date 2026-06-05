import type { Object3D } from "three";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { ItemRenderer, RendererContext } from "../types/Renderer";
import { createMediaFrame } from "./createMediaFrame";

export class ImageRenderer implements ItemRenderer {
  readonly type = "image";

  async create(item: PositionedGalleryItem, context: RendererContext): Promise<Object3D> {
    const texture = await context.assets.getTextureForItem(item);
    return createMediaFrame(item, {
      width: item.bounds?.width ?? 2.4,
      height: item.bounds?.height ?? 1.6,
      surfaceColor: "#c4c9c4",
      frameColor: "#2d302e",
      texture,
    }, context.resources);
  }
}
