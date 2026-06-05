import { clamp } from "../utils/clamp";

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

const VELOCITY_EPSILON = 0.00001;
const PROGRESS_EPSILON = 0.000001;

export class JourneyController {
  private readonly element: HTMLElement;
  private readonly onProgress: (state: JourneyProgressState) => void;
  private readonly smoothing: number;
  private readonly damping: number;
  private readonly loop: boolean;
  private readonly loopWhiteAfterEndWindow: number;
  private readonly loopWhiteStartsBeforeEndWindow: number;
  private readonly loopWhiteFadeOutWindow: number;
  private readonly loopWhiteFadeOutRevealWindow: number;
  private readonly loopProgressAdvanceDuringWhiteFadeOut: number;
  private sensitivity: number;
  private progress: number;
  private targetProgress: number;
  private hasCompletedInitialLoop = false;
  private velocity = 0;
  private frameId: number | null = null;
  private activeTouchId: number | null = null;
  private lastTouchY: number | null = null;
  private running = false;

  constructor(options: JourneyControllerOptions) {
    this.element = options.element;
    this.onProgress = options.onProgress;
    this.sensitivity = clamp(options.sensitivity ?? 0.00028, 0.00005, 0.01);
    this.smoothing = clamp(options.smoothing ?? 0.18, 0.04, 1);
    this.damping = clamp(options.damping ?? 0.86, 0.2, 0.98);
    this.loop = options.loop ?? false;
    this.loopWhiteAfterEndWindow = clamp(options.loopWhiteAfterEndWindow ?? 0.14, 0.02, 0.45);
    this.loopWhiteStartsBeforeEndWindow = clamp(options.loopWhiteStartsBeforeEndWindow ?? 0.05, 0, 0.45);
    this.loopWhiteFadeOutWindow = clamp(options.loopWhiteFadeOutWindow ?? 0.22, 0.05, 0.6);
    this.loopWhiteFadeOutRevealWindow = clamp(options.loopWhiteFadeOutRevealWindow ?? 0.12, 0.03, 0.45);
    this.loopProgressAdvanceDuringWhiteFadeOut = clamp(
      options.loopProgressAdvanceDuringWhiteFadeOut ?? 0.18,
      0,
      0.45,
    );
    this.hasCompletedInitialLoop = this.loop && (options.initialProgress ?? 0) >= this.getLoopCycleLength();
    this.progress = this.normalizeProgress(options.initialProgress ?? 0);
    this.targetProgress = this.progress;
  }

  start(): void {
    if (this.running) {
      return;
    }

    this.running = true;
    this.element.addEventListener("wheel", this.handleWheel, { passive: false });
    this.element.addEventListener("touchstart", this.handleTouchStart, { passive: true });
    this.element.addEventListener("touchmove", this.handleTouchMove, { passive: false });
    this.element.addEventListener("touchend", this.handleTouchEnd, { passive: true });
    this.element.addEventListener("touchcancel", this.handleTouchCancel, { passive: true });
    this.emit();
  }

  setProgress(progress: number): void {
    this.progress = this.normalizeProgress(progress);
    this.targetProgress = this.progress;
    this.velocity = 0;
    this.emit();
  }

  setSensitivity(sensitivity: number): void {
    this.sensitivity = clamp(sensitivity, 0.00005, 0.01);
  }

  dispose(): void {
    this.running = false;
    this.element.removeEventListener("wheel", this.handleWheel);
    this.element.removeEventListener("touchstart", this.handleTouchStart);
    this.element.removeEventListener("touchmove", this.handleTouchMove);
    this.element.removeEventListener("touchend", this.handleTouchEnd);
    this.element.removeEventListener("touchcancel", this.handleTouchCancel);

    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  private handleWheel = (event: WheelEvent): void => {
    if (event.ctrlKey) {
      return;
    }

    event.preventDefault();
    this.velocity += this.normalizeWheelDelta(event) * this.sensitivity;
    this.requestTick();
  };

  private handleTouchStart = (event: TouchEvent): void => {
    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    this.activeTouchId = touch.identifier;
    this.lastTouchY = touch.clientY;
  };

  private handleTouchMove = (event: TouchEvent): void => {
    if (this.lastTouchY === null) {
      return;
    }

    const touch = this.getTrackedTouch(event.touches);
    if (!touch) {
      return;
    }

    if (event.cancelable) {
      event.preventDefault();
    }

    const pixelDelta = this.lastTouchY - touch.clientY;
    this.lastTouchY = touch.clientY;
    this.activeTouchId = touch.identifier;
    this.velocity += this.normalizePixelDelta(pixelDelta) * this.sensitivity;
    this.requestTick();
  };

  private handleTouchEnd = (event: TouchEvent): void => {
    const touch = this.getTrackedTouch(event.touches);
    this.activeTouchId = touch?.identifier ?? null;
    this.lastTouchY = touch?.clientY ?? null;
  };

  private handleTouchCancel = (): void => {
    this.activeTouchId = null;
    this.lastTouchY = null;
  };

  private tick = (): void => {
    this.frameId = null;
    if (!this.running) {
      return;
    }

    if (this.loop) {
      const nextTarget = this.targetProgress + this.velocity;
      this.targetProgress = this.hasCompletedInitialLoop ? nextTarget : Math.max(0, nextTarget);

      if (!this.hasCompletedInitialLoop && this.targetProgress >= this.getLoopCycleLength() - PROGRESS_EPSILON) {
        this.hasCompletedInitialLoop = true;
      }
    } else {
      this.targetProgress = this.normalizeProgress(this.targetProgress + this.velocity);
    }

    this.velocity *= this.damping;

    if (Math.abs(this.velocity) < VELOCITY_EPSILON) {
      this.velocity = 0;
    }

    this.progress += (this.targetProgress - this.progress) * this.smoothing;

    if (Math.abs(this.targetProgress - this.progress) < PROGRESS_EPSILON) {
      this.progress = this.targetProgress;
    }

    if (this.loop && (Math.abs(this.progress) > 1000 || Math.abs(this.targetProgress) > 1000)) {
      const wrappedTarget = this.wrap(this.targetProgress, this.getLoopCycleLength());
      const delta = this.progress - this.targetProgress;
      this.targetProgress = wrappedTarget;
      this.progress = wrappedTarget + delta;
    }

    this.emit();

    if (this.velocity !== 0 || Math.abs(this.targetProgress - this.progress) >= PROGRESS_EPSILON) {
      this.requestTick();
    }
  };

  private requestTick(): void {
    if (this.frameId !== null || !this.running) {
      return;
    }

    this.frameId = requestAnimationFrame(this.tick);
  }

  private emit(): void {
    this.onProgress(this.resolveProgressState(this.progress));
  }

  private getTrackedTouch(touchList: TouchList): Touch | null {
    const touches = Array.from(touchList);
    if (touches.length === 0) {
      return null;
    }

    return touches.find((touch) => touch.identifier === this.activeTouchId) ?? touches[0];
  }

  private normalizeWheelDelta(event: WheelEvent): number {
    if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
      return this.normalizePixelDelta(event.deltaY * 16);
    }

    if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
      return this.normalizePixelDelta(event.deltaY * window.innerHeight * 0.85);
    }

    return this.normalizePixelDelta(event.deltaY);
  }

  private normalizePixelDelta(pixelDelta: number): number {
    if (!Number.isFinite(pixelDelta)) {
      return 0;
    }

    const units = pixelDelta / 100;
    const absUnits = Math.abs(units);
    const compressed =
      absUnits <= 1 ? units : Math.sign(units) * (1 + Math.log10(Math.max(1, absUnits)));

    return clamp(compressed, -4, 4);
  }

  private normalizeProgress(progress: number): number {
    if (!Number.isFinite(progress)) {
      return 0;
    }

    if (!this.loop) {
      return clamp(progress, 0, 1);
    }

    if (progress >= this.getLoopCycleLength() - PROGRESS_EPSILON) {
      this.hasCompletedInitialLoop = true;
    }

    return this.hasCompletedInitialLoop
      ? this.wrap(progress, this.getLoopCycleLength())
      : clamp(progress, 0, this.getLoopCycleLength());
  }

  private getLoopCycleLength(): number {
    return 1 + this.loopWhiteAfterEndWindow + this.loopWhiteFadeOutWindow;
  }

  private mapLoopCycleToJourneyProgress(cycleProgress: number): number {
    const clampedCycleProgress = clamp(cycleProgress, 0, 1);
    if (!this.hasCompletedInitialLoop) {
      return clampedCycleProgress;
    }

    const loopOffset = clamp(this.loopProgressAdvanceDuringWhiteFadeOut, 0, 0.45);
    return clamp(loopOffset + clampedCycleProgress * (1 - loopOffset), 0, 1);
  }

  private resolveProgressState(rawProgress: number): JourneyProgressState {
    if (!this.loop) {
      return {
        progress: clamp(rawProgress, 0, 1),
        whiteMix: 0,
      };
    }

    const whiteInWindow = Math.max(0.0001, this.loopWhiteAfterEndWindow);
    const whiteLeadWindow = clamp(this.loopWhiteStartsBeforeEndWindow, 0, 0.45);
    const whiteOutWindow = Math.max(0.0001, this.loopWhiteFadeOutWindow);
    const cycleProgress = this.wrap(rawProgress, this.getLoopCycleLength());
    const whiteInEnd = 1 + whiteInWindow;
    const leadStart = Math.max(0, 1 - whiteLeadWindow);
    const whiteInTotalWindow = Math.max(0.0001, whiteLeadWindow + whiteInWindow);

    if (cycleProgress <= whiteInEnd) {
      const mappedCycleProgress = cycleProgress <= 1
        ? this.mapLoopCycleToJourneyProgress(cycleProgress)
        : 1;

      if (whiteLeadWindow > 0 && cycleProgress >= leadStart) {
        const phase = clamp((cycleProgress - leadStart) / whiteInTotalWindow, 0, 1);
        return {
          progress: mappedCycleProgress,
          whiteMix: this.smoothstep(phase),
        };
      }

      return {
        progress: mappedCycleProgress,
        whiteMix: cycleProgress <= 1 ? 0 : this.smoothstep(clamp((cycleProgress - 1) / whiteInWindow, 0, 1)),
      };
    }

    const phaseOut = clamp((cycleProgress - whiteInEnd) / whiteOutWindow, 0, 1);
    const revealRatio = clamp(this.loopWhiteFadeOutRevealWindow / whiteOutWindow, 0.1, 1);
    const fadeOutPhase = clamp(phaseOut / revealRatio, 0, 1);
    const whiteMix = 1 - this.smoothstep(fadeOutPhase);
    const restartProgress = this.loopProgressAdvanceDuringWhiteFadeOut * this.smoothstep(phaseOut);

    return {
      progress: clamp(restartProgress, 0, 1),
      whiteMix: clamp(whiteMix, 0, 1),
    };
  }

  private smoothstep(value: number): number {
    const t = clamp(value, 0, 1);
    return t * t * (3 - 2 * t);
  }

  private wrap(value: number, modulus: number): number {
    return ((value % modulus) + modulus) % modulus;
  }
}
