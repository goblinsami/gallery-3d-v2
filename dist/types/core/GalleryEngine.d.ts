import type { BottomSheetState, CameraState, JourneyState } from "../types/Journey";
import type { GalleryProject } from "../types/GalleryProject";
import type { LayoutRegistry, RendererRegistry } from "./Registry";
export interface GalleryEngineOptions {
    container: HTMLElement;
    project: GalleryProject;
    renderers: RendererRegistry;
    layouts: LayoutRegistry;
    assetBaseUrl?: string;
}
export declare class GalleryEngine {
    private readonly container;
    private readonly renderers;
    private readonly layouts;
    private readonly assetBaseUrl?;
    private project;
    private quality;
    private scene;
    private camera;
    private renderer;
    private sceneRoot;
    private assets;
    private scheduler;
    private keyframes;
    private positionedItems;
    private progress;
    private loopWhiteMix;
    private buildSerial;
    private bottomSheetState;
    private disposed;
    private baseFogNear;
    private baseFogFar;
    private readonly whiteColor;
    private readonly baseBackgroundColor;
    private readonly baseFogColor;
    private readonly mixedBackgroundColor;
    private readonly mixedFogColor;
    constructor(options: GalleryEngineOptions);
    init(): Promise<void>;
    updateProject(project: GalleryProject): Promise<void>;
    applyJourneyState(state: JourneyState): void;
    setProgress(progress: number): CameraState;
    setJourneyState(progress: number, whiteMix: number): CameraState;
    setBottomSheetState(state: BottomSheetState): CameraState;
    invalidate(_reason: string): void;
    dispose(): void;
    private rebuildScene;
    private applyCameraState;
    private resetAtmosphereBase;
    private applyAtmosphere;
    private getComposedCameraState;
    private getJourneyItemsForKeyframes;
    private renderFrame;
    private resize;
    private getViewportAspect;
    private assertActive;
}
//# sourceMappingURL=GalleryEngine.d.ts.map