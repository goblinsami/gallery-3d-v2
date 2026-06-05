import type { GalleryProject } from "../types/GalleryProject";
import type { BottomSheetState } from "../types/Journey";
import type { QualityPreset } from "../types/Quality";
import type { RuntimeInstance } from "../types/Runtime";
export interface ScrollixGalleryProps {
    project: GalleryProject | string;
    assetBaseUrl?: string;
    bottomSheetState?: BottomSheetState;
    initialProgress?: number;
    qualityOverride?: QualityPreset;
    autoStartJourney?: boolean;
}
export interface ScrollixGalleryMountOptions {
    container: HTMLElement;
    props: ScrollixGalleryProps;
    scrollElement?: HTMLElement;
}
export interface ScrollixGalleryAdapter {
    runtime: RuntimeInstance;
    update(props: ScrollixGalleryProps): Promise<void>;
    dispose(): void;
}
export declare const normalizeScrollixGalleryProject: (props: ScrollixGalleryProps) => GalleryProject;
export declare const clampScrollixProgress: (progress: number) => number;
export declare const mountScrollixGallery: (options: ScrollixGalleryMountOptions) => Promise<ScrollixGalleryAdapter>;
export declare const ScrollixGallery: (options: ScrollixGalleryMountOptions) => Promise<ScrollixGalleryAdapter>;
//# sourceMappingURL=ScrollixGallery.d.ts.map