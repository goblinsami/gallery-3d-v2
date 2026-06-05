import { describe, expect, it } from "vitest";
import type { GalleryProject } from "../types/GalleryProject";
import { validateGalleryProject } from "../utils/validateGalleryProject";

const createProject = (): GalleryProject => ({
  theme: {
    quality: "auto",
    atmosphere: "calm",
    materials: {
      primary: "concrete",
    },
  },
  layout: {
    type: "corridor",
  },
  journey: {
    mode: "scroll",
  },
  items: [
    {
      id: "intro",
      type: "statement",
      placement: {},
      appearance: {},
      content: {
        title: "Intro",
      },
    },
  ],
});

describe("validateGalleryProject", () => {
  it("fills defaults without mutating the input project", () => {
    const project = createProject();
    const validated = validateGalleryProject(project);

    expect(validated.__validated).toBe(true);
    expect(validated.layout.spacing).toBe(7);
    expect(validated.journey.smoothing).toBe(0.18);
    expect(project.layout.spacing).toBeUndefined();
  });

  it("rejects duplicate item ids", () => {
    const project = createProject();
    project.items.push({
      ...project.items[0],
      content: {},
    });

    expect(() => validateGalleryProject(project)).toThrow("Duplicate GalleryItem id");
  });

  it("rejects non-object project inputs", () => {
    expect(() => validateGalleryProject(null)).toThrow("GalleryProject must be an object");
  });

  it("rejects items without a valid type", () => {
    const project = createProject();
    project.items[0] = {
      ...project.items[0],
      type: "",
    };

    expect(() => validateGalleryProject(project)).toThrow("missing a valid type");
  });

  it("preserves validated media texture sources", () => {
    const project = createProject();
    project.items[0] = {
      ...project.items[0],
      appearance: {
        media: [
          {
            src: "fallback.webp",
            format: "webp",
            sources: [
              { src: "image-high.ktx2", format: "ktx2", quality: "high" },
              { src: "image-high.webp", format: "webp", quality: "high" },
            ],
          },
        ],
      },
    };

    const validated = validateGalleryProject(project);

    expect(validated.items[0].appearance.media?.[0].sources?.[0]).toMatchObject({
      src: "image-high.ktx2",
      format: "ktx2",
      quality: "high",
    });
  });
});
