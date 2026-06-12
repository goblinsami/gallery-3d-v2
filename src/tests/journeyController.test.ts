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

  it("keeps the final loop progress stable until scroll continues past it", () => {
    const emitted: Array<{ progress: number; sequenceProgress: number; whiteMix: number }> = [];
    const controller = new JourneyController({
      element,
      loop: true,
      onProgress: (state) => emitted.push(state),
    });

    controller.setProgress(0.98);
    controller.setProgress(1);
    controller.setProgress(1.08);

    expect(emitted[0]).toEqual({ progress: 0.98, sequenceProgress: 0.98, whiteMix: 0 });
    expect(emitted[1]).toEqual({ progress: 1, sequenceProgress: 1, whiteMix: 0 });
    expect(emitted[2].progress).toBeGreaterThan(0.08);
    expect(emitted[2].sequenceProgress).toBeCloseTo(0.08);
    expect(emitted[2].whiteMix).toBe(0);
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
