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

  it("keeps the final loop progress stable until scroll continues past it", () => {
    const emitted: Array<{ progress: number; whiteMix: number }> = [];
    const controller = new JourneyController({
      element,
      loop: true,
      onProgress: (state) => emitted.push(state),
    });

    controller.setProgress(0.98);
    controller.setProgress(1);
    controller.setProgress(1.08);

    expect(emitted[0]).toEqual({ progress: 0.98, whiteMix: 0 });
    expect(emitted[1]).toEqual({ progress: 1, whiteMix: 0 });
    expect(emitted[2].progress).toBeCloseTo(0.08);
    expect(emitted[2].whiteMix).toBe(0);
  });

  it("always emits zero white mix in loop journeys", () => {
    const emitted: Array<{ progress: number; whiteMix: number }> = [];
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
