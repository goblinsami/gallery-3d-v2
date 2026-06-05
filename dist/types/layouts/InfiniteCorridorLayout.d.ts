import type { GalleryProject } from "../types/GalleryProject";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { LayoutContext, LayoutStrategy } from "../types/Layout";
export declare class InfiniteCorridorLayout implements LayoutStrategy {
    readonly type = "infinite-corridor";
    private readonly corridor;
    layout(project: GalleryProject, _config: import("..").LayoutConfig | undefined, context: LayoutContext): PositionedGalleryItem[];
}
//# sourceMappingURL=InfiniteCorridorLayout.d.ts.map