import type { Object3D } from "three";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { ItemRenderer, RendererContext } from "../types/Renderer";
import { createMediaFrame } from "./createMediaFrame";
import { fitFrameToAspectRatio, getTextureAspectRatio } from "./mediaAspectRatio";

export class ImageRenderer implements ItemRenderer {
  readonly type = "image";

  async create(item: PositionedGalleryItem, context: RendererContext): Promise<Object3D> {
    const texture = await context.assets.getTextureForItem(item);
    const frameSize = fitFrameToAspectRatio({
      width: item.bounds?.width ?? 2.4,
      height: item.bounds?.height ?? 1.6,
    }, getTextureAspectRatio(texture));
    return createMediaFrame(item, {
      width: frameSize.width,
      height: frameSize.height,
      surfaceColor: "#c4c9c4",
      frameColor: "#2d302e",
      texture,
      showFrame: context.showItemBorders,
    }, context.resources);
  }
}
