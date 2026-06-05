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
    private buildSerial;
    private bottomSheetState;
    private disposed;
    constructor(options: GalleryEngineOptions);
    init(): Promise<void>;
    updateProject(project: GalleryProject): Promise<void>;
    applyJourneyState(state: JourneyState): void;
    setProgress(progress: number): CameraState;
    setBottomSheetState(state: BottomSheetState): CameraState;
    invalidate(_reason: string): void;
    dispose(): void;
    private rebuildScene;
    private applyCameraState;
    private getComposedCameraState;
    private renderFrame;
    private resize;
    private getViewportAspect;
    private assertActive;
}
//# sourceMappingURL=GalleryEngine.d.ts.map