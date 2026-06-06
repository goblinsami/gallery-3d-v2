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
    const emitted: Array<{ progress: number; whiteMix: number }> = [];
    const controller = new JourneyController({
      element,
      onProgress: (state) => emitted.push(state),
    });

    controller.setProgress(1.4);
    controller.setProgress(-0.2);

    expect(emitted).toEqual([
      { progress: 1, whiteMix: 0 },
      { progress: 0, whiteMix: 0 },
    ]);
  });

  it("adds a white transition after the final loop progress", () => {
    const emitted: Array<{ progress: number; whiteMix: number }> = [];
    const controller = new JourneyController({
      element,
      loop: true,
      loopWhiteAfterEndWindow: 0.2,
      loopWhiteStartsBeforeEndWindow: 0.1,
      loopWhiteFadeOutWindow: 0.3,
      loopWhiteFadeOutRevealWindow: 0.15,
      loopProgressAdvanceDuringWhiteFadeOut: 0.2,
      onProgress: (state) => emitted.push(state),
    });

    controller.setProgress(0.95);
    controller.setProgress(1.1);
    controller.setProgress(1.25);
    controller.setProgress(1.425);

    expect(emitted[0].progress).toBeCloseTo(0.95);
    expect(emitted[0].whiteMix).toBeGreaterThan(0);
    expect(emitted[0].whiteMix).toBeLessThan(1);
    expect(emitted[1].progress).toBe(1);
    expect(emitted[1].whiteMix).toBeGreaterThan(emitted[0].whiteMix);
    expect(emitted[2].progress).toBeGreaterThan(0);
    expect(emitted[2].progress).toBeLessThanOrEqual(0.2);
    expect(emitted[2].whiteMix).toBeGreaterThan(0);
    expect(emitted[2].whiteMix).toBeLessThan(1);
    expect(emitted[3].progress).toBeGreaterThan(emitted[2].progress);
    expect(emitted[3].progress).toBeLessThanOrEqual(0.2);
    expect(emitted[3].whiteMix).toBe(0);
  });

  it("ignores wheel interactions while interaction is disabled", () => {
    const emitted: Array<{ progress: number; whiteMix: number }> = [];
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

    expect(emitted).toEqual([{ progress: 0, whiteMix: 0 }]);
  });
});
