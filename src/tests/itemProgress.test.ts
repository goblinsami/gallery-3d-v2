import { describe, expect, it } from "vitest";
import type { GalleryItem } from "../types/GalleryItem";
import {
  buildItemProgressMap,
  getAdjacentItemProgress,
  getItemProgress,
} from "../journey/itemProgress";

const item = (id: string): GalleryItem => ({
  id,
  type: "statement",
  placement: {},
  appearance: {},
  content: {},
});

describe("itemProgress", () => {
  it("maps each item to a stable focus progress", () => {
    const entries = buildItemProgressMap([item("one"), item("two")]);

    expect(entries).toEqual([
      { itemId: "one", sourceItemId: "one", index: 0, progress: 0.31 },
      { itemId: "two", sourceItemId: "two", index: 1, progress: 0.81 },
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
});
