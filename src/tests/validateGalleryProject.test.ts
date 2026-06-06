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

  it("accepts brick as a material family", () => {
    const project = createProject();
    project.theme.materials.primary = "brick";

    const validated = validateGalleryProject(project);

    expect(validated.theme.materials.primary).toBe("brick");
  });

  it("validates item border visibility with a true default", () => {
    const defaultProject = validateGalleryProject(createProject());
    const hiddenBordersProject = createProject();
    hiddenBordersProject.theme.items = {
      showBorders: false,
    };

    const hiddenBorders = validateGalleryProject(hiddenBordersProject);

    expect(defaultProject.theme.items?.showBorders).toBe(true);
    expect(hiddenBorders.theme.items?.showBorders).toBe(false);
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

  it("validates overlay framing mode and applies its preset values", () => {
    const project = createProject();
    project.journey.artworkOverlayFramingMode = "cinematic";
    project.journey.artworkOverlayAngleDistanceScale = 99;
    project.journey.artworkOverlayForwardOffset = 99;

    const validated = validateGalleryProject(project);

    expect(validated.journey.artworkOverlayFramingMode).toBe("cinematic");
    expect(validated.journey.artworkOverlayAngleDistanceScale).toBe(0.85);
    expect(validated.journey.artworkOverlayAngleDistanceMin).toBe(1.1);
    expect(validated.journey.artworkOverlayAngleDistanceMax).toBe(2.2);
    expect(validated.journey.artworkOverlayForwardOffset).toBe(0.2);
  });

  it("accepts the legacy root overlay framing mode shape", () => {
    const project = {
      ...createProject(),
      artworkOverlayFramingMode: "frontal",
    };

    const validated = validateGalleryProject(project);

    expect(validated.journey.artworkOverlayFramingMode).toBe("frontal");
    expect(validated.journey.artworkOverlayAngleDistanceMax).toBe(1.4);
  });
});
