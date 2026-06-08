import { describe, expect, it } from "vitest";
import type { GalleryItem } from "../types/GalleryItem";
import { projectItemContent } from "../utils/contentProjection";

describe("contentProjection", () => {
  it("projects thumbnails, progress, metadata sections and links", () => {
    const item: GalleryItem = {
      id: "campaign",
      type: "artwork",
      placement: {},
      appearance: {
        media: [{
          src: "/images/campaign.jpg",
          type: "image",
          alt: "Campaign image",
        }],
      },
      content: {
        eyebrow: "Artwork",
        title: "Nike Air Max Campaign",
        subtitle: "Campaign Direction",
        description: "A global campaign.",
        metadata: {
          artist: "Nike",
          category: "Campaign Direction",
          year: "2025",
          tags: ["Creative Director"],
        },
        socialLinks: [{ label: "Case", url: "https://example.com" }],
      },
    };

    const projected = projectItemContent(item, 0, 7);

    expect(projected.thumbnailUrl).toBe("/images/campaign.jpg");
    expect(projected.progressLabel).toBe("1 / 7");
    expect(projected.sections?.find((section) => section.id === "details")?.lines).toEqual([
      "Artist: Nike",
      "Category: Campaign Direction",
      "Year: 2025",
    ]);
    expect(projected.sections?.find((section) => section.id === "tags")?.lines).toEqual([
      "Creative Director",
    ]);
    expect(projected.socialLinks).toEqual([{ label: "Case", url: "https://example.com" }]);
  });

  it("does not create empty lower sections", () => {
    const item: GalleryItem = {
      id: "minimal",
      type: "statement",
      placement: {},
      appearance: {},
      content: {
        title: "Minimal",
      },
    };

    expect(projectItemContent(item).sections).toEqual([]);
  });
});
