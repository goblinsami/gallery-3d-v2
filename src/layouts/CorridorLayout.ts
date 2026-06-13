import type { GalleryProject } from "../types/GalleryProject";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { LayoutContext, LayoutStrategy } from "../types/Layout";
import { snapZToArchitecturalModuleCenter } from "../utils/architecturalModules";
import { applyOffset, getItemBounds, toVec3 } from "./layoutUtils";

export class CorridorLayout implements LayoutStrategy {
  readonly type = "corridor";

  layout(project: GalleryProject, _config = project.layout, context: LayoutContext): PositionedGalleryItem[] {
    const spacing = project.layout.spacing ?? 7;
    const width = project.layout.bounds?.width ?? 5.4;
    const height = project.layout.bounds?.height ?? 3.4;
    const depth = Math.max(project.layout.bounds?.depth ?? 44, 20);
    const wallInset = 0.08;

    return project.items.map((item, index) => ({
      ...item,
      ...this.placeItem(
        item,
        index,
        spacing,
        width,
        height,
        depth,
        context.qualityScale,
        wallInset,
        context.architecturalCycleDepth,
      ),
    }));
  }

  private placeItem(
    item: GalleryProject["items"][number],
    index: number,
    spacing: number,
    width: number,
    height: number,
    depth: number,
    qualityScale: number,
    wallInset: number,
    architecturalCycleDepth: number | undefined,
  ): Omit<PositionedGalleryItem, keyof typeof item> {
    const side = item.placement.side === "right" ? "right" : item.placement.side === "center" ? "center" : "left";
    const bounds = getItemBounds(item);
    const slot = item.placement.slot ?? index + 1;
    const baseZ = -slot * spacing;
    const z = side === "center" || item.passThrough === true
      ? baseZ
      : snapZToArchitecturalModuleCenter(depth, qualityScale, baseZ, architecturalCycleDepth);
    const y = Math.min(height - bounds.height * 0.5 - 0.25, 1.65);

    if (side === "center") {
      const position = applyOffset(toVec3(0, y, z), item.placement.offset);
      return {
        index,
        position,
        rotation: toVec3(0, 0, 0),
        focusTarget: position,
        bounds,
      };
    }

    const direction = side === "left" ? -1 : 1;
    const position = applyOffset(toVec3(direction * (width / 2 - wallInset), y, z), item.placement.offset);

    return {
      index,
      position,
      rotation: toVec3(0, side === "left" ? Math.PI / 2 : -Math.PI / 2, 0),
      focusTarget: position,
      bounds,
    };
  }
}
