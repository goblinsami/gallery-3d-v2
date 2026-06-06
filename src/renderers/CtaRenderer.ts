import type { Object3D } from "three";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { ItemRenderer, RendererContext } from "../types/Renderer";
import { projectItemContent } from "../utils/contentProjection";
import { createTextPanel } from "./createTextPanel";

export class CtaRenderer implements ItemRenderer {
  readonly type = "cta";

  create(item: PositionedGalleryItem, context: RendererContext): Object3D {
    return createTextPanel(item, projectItemContent(item), {
      width: item.bounds?.width ?? 3.2,
      height: item.bounds?.height ?? 1.8,
      background: "#f1eee6",
      foreground: "#181817",
      accent: "#b08d57",
      showFrame: context.showItemBorders,
    }, context.resources);
  }
}
