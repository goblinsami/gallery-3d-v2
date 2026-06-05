export interface JourneyControllerOptions {
    element: HTMLElement;
    initialProgress?: number;
    sensitivity?: number;
    smoothing?: number;
    damping?: number;
    loop?: boolean;
    loopWhiteAfterEndWindow?: number;
    loopWhiteStartsBeforeEndWindow?: number;
    loopWhiteFadeOutWindow?: number;
    loopWhiteFadeOutRevealWindow?: number;
    loopProgressAdvanceDuringWhiteFadeOut?: number;
    onProgress: (state: JourneyProgressState) => void;
}
export interface JourneyProgressState {
    progress: number;
    whiteMix: number;
}
export declare class JourneyController {
    private readonly element;
    private readonly onProgress;
    private readonly smoothing;
    private readonly damping;
    private readonly loop;
    private readonly loopWhiteAfterEndWindow;
    private readonly loopWhiteStartsBeforeEndWindow;
    private readonly loopWhiteFadeOutWindow;
    private readonly loopWhiteFadeOutRevealWindow;
    private readonly loopProgressAdvanceDuringWhiteFadeOut;
    private sensitivity;
    private progress;
    private targetProgress;
    private hasCompletedInitialLoop;
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
    private getLoopCycleLength;
    private mapLoopCycleToJourneyProgress;
    private resolveProgressState;
    private smoothstep;
    private wrap;
}
//# sourceMappingURL=JourneyController.d.ts.map