import type { GalleryProject } from "../types/GalleryProject";
import type { RuntimeInstance } from "../types/Runtime";
export interface MountGalleryRuntimeOptions {
    container: HTMLElement;
    project: GalleryProject;
    assetBaseUrl?: string;
    scrollElement?: HTMLElement;
    autoStartJourney?: boolean;
}
export declare const mountGalleryRuntime: (options: MountGalleryRuntimeOptions) => Promise<RuntimeInstance>;
//# sourceMappingURL=mountGalleryRuntime.d.ts.map