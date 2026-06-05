export interface JourneyControllerOptions {
    element: HTMLElement;
    initialProgress?: number;
    sensitivity?: number;
    smoothing?: number;
    damping?: number;
    loop?: boolean;
    onProgress: (progress: number) => void;
}
export declare class JourneyController {
    private readonly element;
    private readonly onProgress;
    private readonly smoothing;
    private readonly damping;
    private readonly loop;
    private sensitivity;
    private progress;
    private targetProgress;
    private velocity;
    private frameId;
    private activeTouchId;
    private lastTouchY;
    private running;
    constructor(options: JourneyControllerOptions);
    start(): void;
    setProgress(progress: number): void;
    setSensitivity(sensitivity: number): void;
    dispose(): void;
    private handleWheel;
    private handleTouchStart;
    private handleTouchMove;
    private handleTouchEnd;
    private handleTouchCancel;
    private tick;
    private requestTick;
    private emit;
    private getTrackedTouch;
    private normalizeWheelDelta;
    private normalizePixelDelta;
    private normalizeProgress;
}
//# sourceMappingURL=JourneyController.d.ts.map