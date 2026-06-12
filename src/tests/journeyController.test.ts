import { describe, expect, it, vi } from "vitest";
import { JourneyController } from "../journey/JourneyController";

const element = {} as HTMLElement;
const interactiveElement = () => {
  const listeners = new Map<string, EventListenerOrEventListenerObject>();
  return {
    element: {
      addEventListener: vi.fn((type: string, listener: EventListenerOrEventListenerObject) => {
        listeners.set(type, listener);
      }),
      removeEventListener: vi.fn(),
    } as unknown as HTMLElement,
    emit: (type: string, event: unknown) => {
      const listener = listeners.get(type);
      if (typeof listener === "function") {
        listener(event as Event);
      }
    },
  };
};

describe("JourneyController", () => {
  it("clamps manual progress in finite journeys", () => {
    const emitted: Array<{ progress: number; sequenceProgress: number; whiteMix: number }> = [];
    const controller = new JourneyController({
      element,
      onProgress: (state) => emitted.push(state),
    });

    controller.setProgress(1.4);
    controller.setProgress(-0.2);

    expect(emitted).toEqual([
      { progress: 1, sequenceProgress: 1, whiteMix: 0 },
      { progress: 0, sequenceProgress: 0, whiteMix: 0 },
    ]);
  });

  it("restarts loop progress at the first item when it reaches the seam", () => {
    const emitted: Array<{ progress: number; sequenceProgress: number; whiteMix: number }> = [];
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const controller = new JourneyController({
      element,
      loop: true,
      onProgress: (state) => emitted.push(state),
    });

    controller.setProgress(0.98);
    controller.setProgress(1);
    controller.setProgress(1.08);

    expect(emitted[0]).toEqual({ progress: 0.98, sequenceProgress: 0.98, whiteMix: 0 });
    expect(emitted[1]).toEqual({ progress: 0.08, sequenceProgress: 0, whiteMix: 0 });
    expect(emitted[2].progress).toBeGreaterThan(0.08);
    expect(emitted[2].sequenceProgress).toBeCloseTo(0.08);
    expect(emitted[2].whiteMix).toBe(0);
    expect(log).toHaveBeenCalledWith("[Scrollix] loop reset", expect.objectContaining({
      sequenceProgress: 0,
      progress: 0.08,
    }));
    log.mockRestore();
  });

  it("resets only sequence progress when crossing the configured visual seam", () => {
    const emitted: Array<{ progress: number; sequenceProgress: number; whiteMix: number }> = [];
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const target = interactiveElement();
    const frameCallbacks: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", vi.fn((callback: FrameRequestCallback) => {
      frameCallbacks.push(callback);
      return frameCallbacks.length;
    }));
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    const controller = new JourneyController({
      element: target.element,
      loop: true,
      loopResetProgress: 0.86,
      smoothing: 0.16,
      damping: 0.2,
      sensitivity: 0.01,
      onProgress: (state) => emitted.push(state),
    });

    controller.start();
    controller.setProgress(0.84);
    target.emit("wheel", {
      ctrlKey: false,
      deltaMode: 0,
      deltaY: 10000,
      preventDefault: vi.fn(),
    });
    frameCallbacks[0]?.(0);

    expect(emitted.at(-1)?.progress).toBeGreaterThan(0.84);
    expect(emitted.at(-1)?.progress).toBeLessThan(1);
    expect(emitted.at(-1)?.sequenceProgress).toBe(0);
    expect(emitted.at(-1)?.whiteMix).toBe(0);
    expect(log).toHaveBeenCalledWith("[Scrollix] loop reset", expect.objectContaining({
      previousSequenceProgress: 0.84,
      sequenceProgress: 0,
    }));
    controller.dispose();
    log.mockRestore();
    vi.unstubAllGlobals();
  });

  it("snaps fast mobile gestures to the first item at the loop seam", () => {
    const emitted: Array<{ progress: number; sequenceProgress: number; whiteMix: number }> = [];
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const target = interactiveElement();
    const frameCallbacks: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", vi.fn((callback: FrameRequestCallback) => {
      frameCallbacks.push(callback);
      return frameCallbacks.length;
    }));
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    const controller = new JourneyController({
      element: target.element,
      loop: true,
      loopResetProgress: 0.86,
      smoothing: 0.16,
      damping: 0.2,
      sensitivity: 0.01,
      touchSensitivityMultiplier: 4,
      onProgress: (state) => emitted.push(state),
    });

    controller.start();
    controller.setProgress(0.85);
    target.emit("touchstart", {
      touches: [{ identifier: 1, clientY: 100 }],
    });
    target.emit("touchmove", {
      touches: [{ identifier: 1, clientY: -1000000 }],
      cancelable: true,
      preventDefault: vi.fn(),
    });
    frameCallbacks[0]?.(0);

    expect(emitted.at(-1)?.progress).toBeGreaterThan(0.85);
    expect(emitted.at(-1)?.progress).toBeLessThan(1);
    expect(emitted.at(-1)?.sequenceProgress).toBe(0);
    expect(emitted.at(-1)?.whiteMix).toBe(0);
    expect(log).toHaveBeenCalledWith("[Scrollix] loop reset", expect.objectContaining({
      previousSequenceProgress: 0.85,
      sequenceProgress: 0,
    }));
    controller.dispose();
    log.mockRestore();
    vi.unstubAllGlobals();
  });

  it("always emits zero white mix in loop journeys", () => {
    const emitted: Array<{ progress: number; sequenceProgress: number; whiteMix: number }> = [];
    const controller = new JourneyController({
      element,
      loop: true,
      onProgress: (state) => emitted.push(state),
    });

    controller.setProgress(0.5);
    controller.setProgress(1);
    controller.setProgress(1.5);

    expect(emitted.every((state) => state.whiteMix === 0)).toBe(true);
  });

  it("re-enters completed loops past the initial start frame", () => {
    const emitted: Array<{ progress: number; sequenceProgress: number; whiteMix: number }> = [];
    const controller = new JourneyController({
      element,
      loop: true,
      onProgress: (state) => emitted.push(state),
    });

    controller.setProgress(1.001);

    expect(emitted.at(-1)?.progress).toBeGreaterThan(0.08);
    expect(emitted.at(-1)?.sequenceProgress).toBeCloseTo(0.001);
  });

  it("ignores wheel interactions while interaction is disabled", () => {
    const emitted: Array<{ progress: number; sequenceProgress: number; whiteMix: number }> = [];
    const target = interactiveElement();
    const controller = new JourneyController({
      element: target.element,
      onProgress: (state) => emitted.push(state),
    });

    controller.start();
    controller.setInteractionEnabled(false);
    target.emit("wheel", {
      ctrlKey: false,
      deltaMode: 0,
      deltaY: 400,
      preventDefault: vi.fn(),
    });

    expect(emitted).toEqual([{ progress: 0, sequenceProgress: 0, whiteMix: 0 }]);
  });

  it("applies the touch sensitivity multiplier to touch movement", () => {
    const emitted: Array<{ progress: number; sequenceProgress: number; whiteMix: number }> = [];
    const target = interactiveElement();
    const frameCallbacks: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", vi.fn((callback: FrameRequestCallback) => {
      frameCallbacks.push(callback);
      return 1;
    }));
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    const controller = new JourneyController({
      element: target.element,
      sensitivity: 0.001,
      smoothing: 1,
      touchSensitivityMultiplier: 2,
      onProgress: (state) => emitted.push(state),
    });

    controller.start();
    target.emit("touchstart", {
      touches: [{ identifier: 1, clientY: 100 }],
    });
    target.emit("touchmove", {
      touches: [{ identifier: 1, clientY: 0 }],
      cancelable: true,
      preventDefault: vi.fn(),
    });
    frameCallbacks[0]?.(0);

    expect(emitted.at(-1)?.progress).toBeCloseTo(0.002);
    controller.dispose();
    vi.unstubAllGlobals();
  });
});
