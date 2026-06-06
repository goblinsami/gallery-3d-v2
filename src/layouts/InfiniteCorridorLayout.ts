import type { GalleryProject } from "../types/GalleryProject";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { LayoutContext, LayoutStrategy } from "../types/Layout";
import { snapZToArchitecturalModuleCenter } from "../utils/architecturalModules";
import { CorridorLayout } from "./CorridorLayout";

const DEFAULT_REPEAT_CYCLES = 3;

export class InfiniteCorridorLayout implements LayoutStrategy {
  readonly type = "infinite-corridor";
  private readonly corridor = new CorridorLayout();

  layout(project: GalleryProject, _config = project.layout, context: LayoutContext): PositionedGalleryItem[] {
    const base = this.corridor.layout(project, project.layout, context);
    if (base.length === 0) {
      return [];
    }

    const spacing = project.layout.spacing ?? 7;
    const depth = Math.max(project.layout.bounds?.depth ?? 44, 20);
    const cycleDepth = base.length * spacing;
    return Array.from({ length: DEFAULT_REPEAT_CYCLES }, (_, cycleIndex) =>
      base.map((item) => {
        const rawZ = item.position.z - cycleIndex * cycleDepth;
        const isWallItem = item.placement.side !== "center";
        const z = isWallItem
          ? snapZToArchitecturalModuleCenter(depth, context.qualityScale, rawZ)
          : rawZ;
        return {
          ...item,
          id: cycleIndex === 0 ? item.id : `${item.id}__loop_${cycleIndex}`,
          index: cycleIndex * base.length + item.index,
          position: {
            ...item.position,
            z,
          },
          focusTarget: {
            ...item.focusTarget,
            z,
          },
        };
      }),
    ).flat();
  }
}
