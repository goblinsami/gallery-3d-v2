import type { GalleryItem } from "../types/GalleryItem";
import type { GalleryProject } from "../types/GalleryProject";
import { premiumCorridorProject } from "./premiumCorridorProject";

export const PEXELS_PASS_THROUGH_TEMPLATE = "pexels-pass-through";
export const PEXELS_PASS_THROUGH_SPACING = 0.35;
export const PEXELS_PASS_THROUGH_SCROLL_STRENGTH = 4;
export const PEXELS_PASS_THROUGH_SEED = 7319;

const PEXELS_PHOTO_IDS = [
  417173,
  358457,
  3408744,
  1659438,
  169647,
  210186,
  327482,
  2486168,
  2087391,
  2747449,
  2387873,
  1103970,
  1761279,
  1433052,
  257360,
  1732414,
  2832034,
  2559941,
  235985,
  247599,
] as const;

const WELCOME_SLOT = 12;
const IMAGE_START_SLOT = 28;
const IMAGE_SLOT_STEP = 12;

const SIZE_PATTERN: Array<GalleryItem["appearance"]["size"]> = [
  "small",
  "medium",
  0.74,
  0.82,
  0.92,
  1,
  1.08,
];

const seededIndex = (index: number, seed: number, modulo: number): number =>
  Math.abs((seed * 31 + index * 17 + index * index * 7) % modulo);

const createPexelsUrl = (photoId: number, index: number, seed: number): string => {
  const width = 1100 + seededIndex(index, seed, 5) * 120;
  const height = 820 + seededIndex(index + 3, seed, 4) * 120;
  return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${width}&h=${height}`;
};

export const createPexelsPassThroughItems = (
  seed = PEXELS_PASS_THROUGH_SEED,
): GalleryItem[] => [
  {
    id: "pexels-welcome",
    type: "statement",
    placement: {
      side: "center",
      slot: WELCOME_SLOT,
    },
    appearance: {
      size: "large",
      material: "glass",
      lighting: "featured",
    },
    content: {
      eyebrow: "Pexels pass-through",
      title: "Bienvenida",
      description: "Una estacion de entrada seguida por un corredor denso de imagenes silenciosas.",
    },
  },
  ...PEXELS_PHOTO_IDS.map((photoId, index): GalleryItem => {
    const itemNumber = index + 1;
    return {
      id: `pexels-pass-through-${itemNumber}`,
      type: "image",
      passThrough: true,
      placement: {
        side: index % 2 === 0 ? "left" : "right",
        slot: IMAGE_START_SLOT + index * IMAGE_SLOT_STEP,
        offset: {
          y: (seededIndex(index + 5, seed, 5) - 2) * 0.08,
        },
        scale: 0.72 + seededIndex(index + 13, seed, 5) * 0.055,
      },
      appearance: {
        size: SIZE_PATTERN[seededIndex(index, seed, SIZE_PATTERN.length)],
        lighting: index % 3 === 0 ? "featured" : "subtle",
        media: [{
          src: createPexelsUrl(photoId, index, seed),
          type: "image",
          format: "jpg",
          quality: "high",
          alt: `Pexels seeded corridor image ${itemNumber}`,
        }],
      },
      content: {
        title: `Pexels Seed ${seed} / ${itemNumber}`,
      },
    };
  }),
];

export const createPexelsPassThroughProject = (
  sourceProject: GalleryProject = premiumCorridorProject,
  seed = PEXELS_PASS_THROUGH_SEED,
): GalleryProject => ({
  ...sourceProject,
  layout: {
    ...sourceProject.layout,
    spacing: PEXELS_PASS_THROUGH_SPACING,
  },
  journey: {
    ...sourceProject.journey,
    loop: true,
    scrollStrength: PEXELS_PASS_THROUGH_SCROLL_STRENGTH,
    mobileScrollStrength: 3.2,
  },
  items: createPexelsPassThroughItems(seed),
});
