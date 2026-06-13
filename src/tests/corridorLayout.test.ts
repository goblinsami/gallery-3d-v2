import { describe, expect, it } from "vitest";
import type { GalleryProject } from "../types/GalleryProject";
import { CorridorLayout } from "../layouts/CorridorLayout";
import { snapZToArchitecturalModuleCenter } from "../utils/architecturalModules";

const project: GalleryProject = {
  theme: {
    quality: "auto",
    atmosphere: "calm",
    materials: {
      primary: "stone",
    },
  },
  layout: {
    type: "corridor",
    spacing: 14,
    bounds: {
      width: 8,
      height: 4.2,
      depth: 120,
    },
  },
  journey: {
    mode: "scroll",
  },
  items: [
    {
      id: "wall-image",
      type: "image",
      placement: {
        side: "left",
      },
      appearance: {},
      content: {},
    },
    {
      id: "center-station",
      type: "statement",
      placement: {
        side: "center",
      },
      appearance: {},
      content: {},
    },
  ],
};

describe("CorridorLayout", () => {
  it("centers wall items between architectural LED modules", () => {
    const layout = new CorridorLayout().layout(project, project.layout, {
      viewportAspect: 16 / 9,
      qualityScale: 1,
    });

    expect(layout[0].position.z).toBeCloseTo(
      snapZToArchitecturalModuleCenter(120, 1, -14),
    );
    expect(layout[1].position.z).toBe(-28);
  });

  it("places explicit slots before snapping regular wall items", () => {
    const layout = new CorridorLayout().layout({
      ...project,
      items: [{
        ...project.items[0],
        placement: {
          side: "left",
          slot: 5,
        },
      }],
    }, project.layout, {
      viewportAspect: 16 / 9,
      qualityScale: 1,
    });

    expect(layout[0].position.z).toBeCloseTo(
      snapZToArchitecturalModuleCenter(120, 1, -70),
    );
  });

  it("does not snap pass-through wall items to architectural modules", () => {
    const layout = new CorridorLayout().layout({
      ...project,
      items: [{
        ...project.items[0],
        passThrough: true,
        placement: {
          side: "left",
          slot: 5,
        },
      }],
    }, project.layout, {
      viewportAspect: 16 / 9,
      qualityScale: 1,
    });

    expect(layout[0].position.z).toBe(-70);
  });
});
