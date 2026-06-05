import type { GalleryProject } from "../types/GalleryProject";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { LayoutContext, LayoutStrategy } from "../types/Layout";
export declare class GalleryRoomLayout implements LayoutStrategy {
    readonly type = "gallery-room";
    layout(project: GalleryProject, _config: import("..").LayoutConfig | undefined, _context: LayoutContext): PositionedGalleryItem[];
}
//# sourceMappingURL=GalleryRoomLayout.d.ts.map