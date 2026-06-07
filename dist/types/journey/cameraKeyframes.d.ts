import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { CameraKeyframe, JourneyMetrics } from "../types/Journey";
export interface CameraKeyframeOptions {
    loopSeamItem?: PositionedGalleryItem;
}
export declare const buildCameraKeyframes: (items: PositionedGalleryItem[], metrics?: Partial<JourneyMetrics>, options?: CameraKeyframeOptions) => CameraKeyframe[];
//# sourceMappingURL=cameraKeyframes.d.ts.map