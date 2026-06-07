import { describe, expect, it } from "vitest";
import {
  buildScrollixGalleryFramerProject,
  scrollixGalleryFramerDefaults,
  type ScrollixGalleryFramerProps,
} from "../framer/framerProjectAdapter";
import {
  clampScrollixProgress,
  normalizeScrollixGalleryProject,
} from "../framer/ScrollixGallery";
import { premiumCorridorProject } from "../samples/premiumCorridorProject";

const framerProps = (
  overrides: Partial<ScrollixGalleryFramerProps> = {},
): ScrollixGalleryFramerProps => ({
  ...scrollixGalleryFramerDefaults,
  ...overrides,
});

describe("framer adapter", () => {
  it("normalizes JSON project input", () => {
    const project = normalizeScrollixGalleryProject({
      project: JSON.stringify(premiumCorridorProject),
    });

    expect(project.items.length).toBe(premiumCorridorProject.items.length);
    expect(project.theme.quality).toBe("auto");
  });

  it("applies quality overrides at the adapter boundary", () => {
    const project = normalizeScrollixGalleryProject({
      project: premiumCorridorProject,
      qualityOverride: "low",
    });

    expect(project.theme.quality).toBe("low");
  });

  it("clamps initial progress", () => {
    expect(clampScrollixProgress(-1)).toBe(0);
    expect(clampScrollixProgress(0.4)).toBe(0.4);
    expect(clampScrollixProgress(2)).toBe(1);
  });

  it("maps playground controls to a GalleryProject", () => {
    const project = buildScrollixGalleryFramerProject(framerProps({
      primary: "brick",
      quality: "high",
      overlayFramingMode: "cinematic",
      showBorders: false,
      spacing: 18,
      width: 10,
      height: 5,
      depth: 240,
      ceilingLightIntensity: 1.6,
      fov: 58,
      cameraHeight: 1.9,
      lookAhead: 4.5,
      smoothing: 0.22,
      scrollStrength: 2,
      loop: false,
    }));

    expect(project.theme.materials.primary).toBe("brick");
    expect(project.theme.quality).toBe("high");
    expect(project.theme.items?.showBorders).toBe(false);
    expect(project.layout.spacing).toBe(18);
    expect(project.layout.bounds?.width).toBe(10);
    expect(project.layout.bounds?.height).toBe(5);
    expect(project.layout.bounds?.depth).toBe(240);
    expect(project.theme.lighting?.ceilingLightIntensity).toBe(1.6);
    expect(project.journey.artworkOverlayFramingMode).toBe("cinematic");
    expect(project.journey.camera?.fov).toBe(58);
    expect(project.journey.camera?.height).toBe(1.9);
    expect(project.journey.camera?.lookAhead).toBe(4.5);
    expect(project.journey.smoothing).toBe(0.22);
    expect(project.journey.scrollStrength).toBe(2);
    expect(project.journey.loop).toBe(false);
  });

  it("maps controlled item content, placement and images", () => {
    const project = buildScrollixGalleryFramerProject(framerProps({
      items: [{
        type: "artwork",
        placement: "wall-right",
        title: "Hero Case",
        eyebrow: "Portfolio",
        description: "A controlled Framer item.",
        image: "https://example.com/hero.png",
        imageAlt: "Hero image",
        size: "large",
        material: "metal",
        lighting: "featured",
      }],
    }));

    expect(project.items).toHaveLength(1);
    expect(project.items[0]?.type).toBe("artwork");
    expect(project.items[0]?.placement.side).toBe("right");
    expect(project.items[0]?.appearance.media?.[0]?.src).toBe("https://example.com/hero.png");
    expect(project.items[0]?.appearance.media?.[0]?.format).toBe("png");
    expect(project.items[0]?.content.title).toBe("Hero Case");
  });

  it("keeps reduced template scroll strength proportional in auto mode", () => {
    const project = buildScrollixGalleryFramerProject(framerProps({
      template: "reduced",
      scrollStrength: "auto",
    }));

    expect(project.items).toHaveLength(3);
    expect(project.journey.scrollStrength).toBeCloseTo(scrollixGalleryFramerDefaults.items.length / 3);
  });
});
