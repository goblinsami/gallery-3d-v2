export interface RenderSchedulerOptions {
    container: HTMLElement;
    onRender: () => void;
    onResize: () => void;
}
export declare class RenderScheduler {
    private readonly container;
    private readonly onRender;
    private readonly onResize;
    private resizeObserver;
    private intersectionObserver;
    private frameId;
    private visibleByIntersection;
    private visibleByDocument;
    private dirty;
    private disposed;
    constructor(options: RenderSchedulerOptions);
    start(): void;
    invalidate(_reason: string): void;
    dispose(): void;
    private renderFrame;
    private handleVisibilityChange;
    private handleIntersection;
    private canRender;
}
//# sourceMappingURL=RenderScheduler.d.ts.map