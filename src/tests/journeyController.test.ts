import { describe, expect, it } from "vitest";
import { JourneyController } from "../journey/JourneyController";

const element = {} as HTMLElement;

describe("JourneyController", () => {
  it("clamps manual progress in finite journeys", () => {
    const emitted: number[] = [];
    const controller = new JourneyController({
      element,
      onProgress: (progress) => emitted.push(progress),
    });

    controller.setProgress(1.4);
    controller.setProgress(-0.2);

    expect(emitted).toEqual([1, 0]);
  });

  it("wraps manual progress in looped journeys", () => {
    const emitted: number[] = [];
    const controller = new JourneyController({
      element,
      loop: true,
      onProgress: (progress) => emitted.push(progress),
    });

    controller.setProgress(1.25);
    controller.setProgress(-0.25);

    expect(emitted).toEqual([0.25, 0.75]);
  });
});
