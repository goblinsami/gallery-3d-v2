import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { BottomSheetState, CameraState } from "../types/Journey";
export declare const composeBottomSheetCamera: (camera: CameraState, item: PositionedGalleryItem | null, sheetState: BottomSheetState, options?: {
    fov?: number;
    viewportAspect?: number;
    focusFill?: number;
    overlayDistanceScale?: number;
    overlayDistanceMin?: number;
    overlayDistanceMax?: number;
    overlayForwardOffset?: number;
}) => CameraState;
//# sourceMappingURL=composeBottomSheetCamera.d.ts.map