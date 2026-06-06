import type { Object3D } from "three";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { ItemRenderer, RendererContext } from "../types/Renderer";
import { projectItemContent } from "../utils/contentProjection";
import { createTextPanel } from "./createTextPanel";

export class StatementRenderer implements ItemRenderer {
  readonly type = "statement";

  create(item: PositionedGalleryItem, context: RendererContext): Object3D {
    return createTextPanel(item, projectItemContent(item), {
      width: item.bounds?.width ?? 3.8,
      height: item.bounds?.height ?? 2.2,
      background: "#171716",
      foreground: "#f5f0e8",
      accent: "#d4b26a",
      showFrame: context.showItemBorders,
    }, context.resources);
  }
}
