import { describe, expect, it } from "vitest";
import type { GalleryProject } from "../types/GalleryProject";
import { InfiniteCorridorLayout } from "../layouts/InfiniteCorridorLayout";
import { snapZToArchitecturalModuleCenter } from "../utils/architecturalModules";

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
    bounds: {
      depth: 44,
    },
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

  it("centers wall items against the cycle-aligned LED module pattern", () => {
    const layout = new InfiniteCorridorLayout().layout(project, project.layout, {
      viewportAspect: 16 / 9,
      qualityScale: 1,
    });
    const cycleDepth = project.items.length * (project.layout.spacing ?? 7);
    const expectedFirstCycleZ = snapZToArchitecturalModuleCenter(44, 1, -5, cycleDepth);

    expect(layout[0].position.z).toBeCloseTo(expectedFirstCycleZ);
    expect(layout[2].position.z).toBeCloseTo(expectedFirstCycleZ - cycleDepth);
  });

  it("uses explicit item slots when calculating loop cycle depth", () => {
    const slottedProject: GalleryProject = {
      ...project,
      items: [
        {
          ...project.items[0],
          placement: { side: "center", slot: 3 },
        },
        {
          ...project.items[1],
          placement: { side: "center", slot: 9 },
        },
      ],
    };
    const layout = new InfiniteCorridorLayout().layout(slottedProject, slottedProject.layout, {
      viewportAspect: 16 / 9,
      qualityScale: 1,
    });

    expect(layout[2].position.z).toBeCloseTo(layout[0].position.z - 55);
  });
});
