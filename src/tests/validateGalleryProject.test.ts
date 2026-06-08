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

  it("validates texture tiling with per-surface defaults", () => {
    const defaultProject = validateGalleryProject(createProject());
    const customProject = createProject();
    customProject.theme.materials.textureTiling = {
      wall: 6,
      floor: 0.1,
      ceiling: 1.75,
      wallDeformation: "square",
      floorDeformation: "not-real" as never,
      ceilingDeformation: "square",
    };

    const custom = validateGalleryProject(customProject);

    expect(defaultProject.theme.materials.textureTiling).toEqual({
      wall: 1,
      floor: 1,
      ceiling: 1,
      wallDeformation: "stretched",
      floorDeformation: "stretched",
      ceilingDeformation: "stretched",
    });
    expect(custom.theme.materials.textureTiling).toEqual({
      wall: 4,
      floor: 0.25,
      ceiling: 1.75,
      wallDeformation: "square",
      floorDeformation: "stretched",
      ceilingDeformation: "square",
    });
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

  it("validates ceiling light radius with a fixture-sized default", () => {
    const defaultProject = validateGalleryProject(createProject());
    const oversizedProject = createProject();
    oversizedProject.theme.lighting = {
      ceilingLightIntensity: 1,
      ceilingLightRadius: 1,
    };

    const oversized = validateGalleryProject(oversizedProject);

    expect(defaultProject.theme.lighting?.ceilingLightRadius).toBe(0.095);
    expect(oversized.theme.lighting?.ceilingLightRadius).toBe(0.22);
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

  it("validates camera framing distances", () => {
    const project = createProject();
    project.journey.camera = {
      desktopFramingDistance: 99,
      mobileFramingDistance: 0.1,
      mobileStationFramingDistance: 1.7,
    };

    const validated = validateGalleryProject(project);

    expect(validated.journey.camera?.desktopFramingDistance).toBe(2.5);
    expect(validated.journey.camera?.mobileFramingDistance).toBe(0.75);
    expect(validated.journey.camera?.mobileStationFramingDistance).toBe(1.7);
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
