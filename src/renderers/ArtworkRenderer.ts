import type { Object3D } from "three";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { ItemRenderer, RendererContext } from "../types/Renderer";
import { createMediaFrame } from "./createMediaFrame";
import { fitFrameToAspectRatio, getTextureAspectRatio } from "./mediaAspectRatio";

export class ArtworkRenderer implements ItemRenderer {
  readonly type = "artwork";

  async create(item: PositionedGalleryItem, context: RendererContext): Promise<Object3D> {
    const texture = await context.assets.getTextureForItem(item);
    const frameSize = fitFrameToAspectRatio({
      width: item.bounds?.width ?? 2.2,
      height: item.bounds?.height ?? 1.55,
    }, getTextureAspectRatio(texture));
    return createMediaFrame(item, {
      width: frameSize.width,
      height: frameSize.height,
      surfaceColor: "#d8d1bf",
      frameColor: "#1f1e1b",
      emissive: "#d4b26a",
      texture,
    }, context.resources);
  }
}
