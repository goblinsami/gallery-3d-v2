import { describe, expect, it } from "vitest";
import type { GalleryProject } from "../types/GalleryProject";
import { InfiniteCorridorLayout } from "../layouts/InfiniteCorridorLayout";

const project: GalleryProject = {
  theme: {
    quality: "auto",
    atmosphere: "calm",
    materials: {
      primary: "concrete",
    },
  },
  layout: {
    type: "infinite-corridor",
    spacing: 5,
  },
  journey: {
    mode: "scroll",
    loop: true,
  },
  items: [
    {
      id: "intro",
      type: "statement",
      placement: {},
      appearance: {},
      content: {},
    },
    {
      id: "image",
      type: "image",
      placement: {},
      appearance: {},
      content: {},
    },
  ],
};

describe("InfiniteCorridorLayout", () => {
  it("repeats items in depth-offset cycles", () => {
    const layout = new InfiniteCorridorLayout().layout(project, project.layout, {
      viewportAspect: 16 / 9,
      qualityScale: 1,
    });

    expect(layout).toHaveLength(6);
    expect(layout[2].id).toBe("intro__loop_1");
    expect(layout[2].position.z).toBeLessThan(layout[0].position.z);
  });
});
