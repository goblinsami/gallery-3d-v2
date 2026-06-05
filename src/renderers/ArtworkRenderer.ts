import type { Object3D } from "three";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { ItemRenderer, RendererContext } from "../types/Renderer";
import { createMediaFrame } from "./createMediaFrame";

export class ArtworkRenderer implements ItemRenderer {
  readonly type = "artwork";

  async create(item: PositionedGalleryItem, context: RendererContext): Promise<Object3D> {
    const texture = await context.assets.getTextureForItem(item);
    return createMediaFrame(item, {
      width: item.bounds?.width ?? 2.2,
      height: item.bounds?.height ?? 1.55,
      surfaceColor: "#d8d1bf",
      frameColor: "#1f1e1b",
      emissive: "#d4b26a",
      texture,
    }, context.resources);
  }
}
