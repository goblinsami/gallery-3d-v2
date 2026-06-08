export interface JourneyControllerOptions {
    element: HTMLElement;
    initialProgress?: number;
    sensitivity?: number;
    smoothing?: number;
    damping?: number;
    loop?: boolean;
    onProgress: (state: JourneyProgressState) => void;
}
export interface JourneyProgressState {
    progress: number;
    sequenceProgress: number;
    whiteMix: number;
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
    private hasCompletedInitialLoop;
    private velocity;
    private frameId;
    private activeTouchId;
    private lastTouchY;
    private running;
    private interactionEnabled;
    constructor(options: JourneyControllerOptions);
    start(): void;
    setProgress(progress: number): void;
    setSensitivity(sensitivity: number): void;
    setInteractionEnabled(enabled: boolean): void;
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
    private getLoopCycleLength;
    private resolveProgressState;
    private mapLoopRestartProgress;
    private wrap;
}
//# sourceMappingURL=JourneyController.d.ts.map