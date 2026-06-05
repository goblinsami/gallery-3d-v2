import type { GalleryProject } from "../types/GalleryProject";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { LayoutContext, LayoutStrategy } from "../types/Layout";
export declare class CorridorLayout implements LayoutStrategy {
    readonly type = "corridor";
    layout(project: GalleryProject, _config: import("..").LayoutConfig | undefined, _context: LayoutContext): PositionedGalleryItem[];
    private placeItem;
}
//# sourceMappingURL=CorridorLayout.d.ts.map