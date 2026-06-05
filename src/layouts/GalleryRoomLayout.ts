import type { GalleryProject } from "../types/GalleryProject";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { LayoutContext, LayoutStrategy } from "../types/Layout";
import { applyOffset, getItemBounds, toVec3 } from "./layoutUtils";

export class GalleryRoomLayout implements LayoutStrategy {
  readonly type = "gallery-room";

  layout(project: GalleryProject, _config = project.layout, _context: LayoutContext): PositionedGalleryItem[] {
    return project.items.map((item, index) => {
      const bounds = getItemBounds(item);
      const x = (index % 3) * 3 - 3;
      const z = -Math.floor(index / 3) * 4;
      const position = applyOffset(toVec3(x, 1.6, z), item.placement.offset);

      return {
        ...item,
        index,
        position,
        rotation: toVec3(0, 0, 0),
        focusTarget: position,
        bounds,
      };
    });
  }
}
