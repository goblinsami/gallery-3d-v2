import type { GalleryItem } from "../types/GalleryItem";
import type { BottomSheetState } from "../types/Journey";
import type { ContentSurfaceController, ContentSurfaceListener, ContentSurfaceModel, ContentSurfaceUnsubscribe } from "../types/ContentSurface";
export declare class BottomSheetController implements ContentSurfaceController {
    private state;
    private item;
    private readonly listeners;
    setActiveItem(item: GalleryItem | null): void;
    setState(state: BottomSheetState): void;
    expand(): void;
    collapse(): void;
    getModel(): ContentSurfaceModel;
    subscribe(listener: ContentSurfaceListener): ContentSurfaceUnsubscribe;
    private notify;
}
//# sourceMappingURL=BottomSheetController.d.ts.map