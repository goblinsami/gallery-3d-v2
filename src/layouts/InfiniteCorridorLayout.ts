import type { GalleryProject } from "../types/GalleryProject";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { LayoutContext, LayoutStrategy } from "../types/Layout";
import { CorridorLayout } from "./CorridorLayout";

const DEFAULT_REPEAT_CYCLES = 3;

export class InfiniteCorridorLayout implements LayoutStrategy {
  readonly type = "infinite-corridor";
  private readonly corridor = new CorridorLayout();

  layout(project: GalleryProject, _config = project.layout, context: LayoutContext): PositionedGalleryItem[] {
    const spacing = project.layout.spacing ?? 7;
    const maxSlot = project.items.reduce(
      (max, item, index) => Math.max(max, item.placement.slot ?? index + 1),
      project.items.length,
    );
    const cycleDepth = maxSlot * spacing;
    const base = this.corridor.layout(project, project.layout, {
      ...context,
      architecturalCycleDepth: project.journey.loop ? cycleDepth : undefined,
    });
    if (base.length === 0) {
      return [];
    }

    return Array.from({ length: DEFAULT_REPEAT_CYCLES }, (_, cycleIndex) =>
      base.map((item) => {
        const z = item.position.z - cycleIndex * cycleDepth;
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
