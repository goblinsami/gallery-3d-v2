import { describe, expect, it } from "vitest";
import type { GalleryItem, PlacementSide } from "../types/GalleryItem";
import {
  buildItemProgressMap,
  getAdjacentItemProgress,
  getItemProgress,
  getLoopResetProgress,
  getSequentialActiveItemId,
} from "../journey/itemProgress";

const item = (id: string, side?: PlacementSide): GalleryItem => ({
  id,
  type: "statement",
  placement: { side },
  appearance: {},
  content: {},
});

describe("itemProgress", () => {
  it("maps each item to a stable focus progress", () => {
    const entries = buildItemProgressMap([item("one"), item("two")]);

    expect(entries).toEqual([
      { itemId: "one", sourceItemId: "one", index: 0, progress: 0.31, placementSide: "auto" },
      { itemId: "two", sourceItemId: "two", index: 1, progress: 0.81, placementSide: "auto" },
    ]);
    expect(getItemProgress(entries, "two")).toBe(0.81);
  });

  it("resolves loop clone ids back to their source item", () => {
    const entries = buildItemProgressMap([item("one"), item("two__loop_1")]);

    expect(getItemProgress(entries, "two")).toBe(0.81);
  });

  it("resolves adjacent items from the active id", () => {
    const entries = buildItemProgressMap([item("one"), item("two"), item("three")]);

    expect(getAdjacentItemProgress(entries, "two", 1)?.itemId).toBe("three");
    expect(getAdjacentItemProgress(entries, "two", -1)?.itemId).toBe("one");
    expect(getAdjacentItemProgress(entries, "three", 1)).toBeNull();
  });

  it("resolves the active item as a strict sequential counter", () => {
    const entries = buildItemProgressMap([item("one"), item("two"), item("three")]);

    expect(getSequentialActiveItemId(entries, 0)).toBe("one");
    expect(getSequentialActiveItemId(entries, 0.32)).toBe("one");
    expect(getSequentialActiveItemId(entries, 1 / 3)).toBe("two");
    expect(getSequentialActiveItemId(entries, 0.67)).toBe("three");
    expect(getSequentialActiveItemId(entries, 1)).toBe("three");
    expect(getSequentialActiveItemId(entries, 0)).toBe("one");
  });

  it("can anticipate the next active item by item fraction", () => {
    const entries = buildItemProgressMap([item("one"), item("two"), item("three")]);

    expect(getSequentialActiveItemId(entries, 0.25, 0)).toBe("one");
    expect(getSequentialActiveItemId(entries, 0.25, 0.25)).toBe("two");
    expect(getSequentialActiveItemId(entries, 0.58, 0.35)).toBe("three");
  });

  it("uses separate lead values for station and wall items", () => {
    const entries = buildItemProgressMap([
      item("intro", "center"),
      item("wall", "left"),
      item("station", "center"),
    ]);

    expect(getSequentialActiveItemId(entries, 0.25, { stationLead: 0.4, wallLead: 0.05 })).toBe("intro");
    expect(getSequentialActiveItemId(entries, 0.32, { stationLead: 0.4, wallLead: 0.05 })).toBe("wall");
    expect(getSequentialActiveItemId(entries, 0.55, { stationLead: 0.4, wallLead: 0.05 })).toBe("station");
  });

  it("places the loop reset at the last item exit keyframe", () => {
    const stationEntries = buildItemProgressMap([
      item("intro", "center"),
      item("outro", "center"),
    ]);
    const wallEntries = buildItemProgressMap([
      item("intro", "center"),
      item("case", "left"),
    ]);

    expect(getLoopResetProgress(stationEntries)).toBeCloseTo(0.86);
    expect(getLoopResetProgress(wallEntries)).toBeCloseTo(0.93);
  });
});
