import type { Object3D } from "three";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { ItemRenderer, RendererContext } from "../types/Renderer";
import { projectItemContent } from "../utils/contentProjection";
import { createTextPanel } from "./createTextPanel";

export class ProfileRenderer implements ItemRenderer {
  readonly type = "profile";

  create(item: PositionedGalleryItem, context: RendererContext): Object3D {
    return createTextPanel(item, projectItemContent(item), {
      width: item.bounds?.width ?? 3.4,
      height: item.bounds?.height ?? 2.1,
      background: "#202322",
      foreground: "#f3eee3",
      accent: "#9bb3a5",
      showFrame: context.showItemBorders,
    }, context.resources);
  }
}
