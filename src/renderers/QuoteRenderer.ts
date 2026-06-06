import type { Object3D } from "three";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { ItemRenderer, RendererContext } from "../types/Renderer";
import { projectItemContent } from "../utils/contentProjection";
import { createTextPanel } from "./createTextPanel";

export class QuoteRenderer implements ItemRenderer {
  readonly type = "quote";

  create(item: PositionedGalleryItem, context: RendererContext): Object3D {
    return createTextPanel(item, projectItemContent(item), {
      width: item.bounds?.width ?? 3.2,
      height: item.bounds?.height ?? 2,
      background: "#eee8da",
      foreground: "#20201d",
      accent: "#6f7569",
      showFrame: context.showItemBorders,
    }, context.resources);
  }
}
