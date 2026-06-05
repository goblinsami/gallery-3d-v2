import { describe, expect, it } from "vitest";
import { JourneyController } from "../journey/JourneyController";

const element = {} as HTMLElement;

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
});
