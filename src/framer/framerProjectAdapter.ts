import type { GalleryProject, MaterialFamily } from "../types/GalleryProject";
import type { AppearanceConfig, GalleryItem, PlacementSide } from "../types/GalleryItem";
import type { ArtworkOverlayFramingMode, BottomSheetState } from "../types/Journey";
import type { QualityPreset } from "../types/Quality";
import { premiumCorridorProject } from "../samples/premiumCorridorProject";
import { validateGalleryProject } from "../utils/validateGalleryProject";

export type FramerGalleryTemplate = "default" | "reduced";
export type FramerContentSource = "controls" | "projectJson";
export type FramerGalleryItemType = "statement" | "artwork" | "quote" | "profile" | "image" | "video" | "cta";
export type FramerPlacementMode = "station" | "wall-left" | "wall-right" | "wall-auto";
export type FramerScrollStrength = "auto" | 0.5 | 0.75 | 1 | 1.5 | 2 | 3 | 4 | 5;

export interface ScrollixGalleryFramerItemInput {
  id?: string;
  type: FramerGalleryItemType;
  placement: FramerPlacementMode;
  title: string;
  eyebrow?: string;
  subtitle?: string;
  description?: string;
  body?: string;
  image?: string;
  imageAlt?: string;
  size?: AppearanceConfig["size"];
  material?: MaterialFamily;
  lighting?: AppearanceConfig["lighting"];
  variant?: string;
  slot?: number;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  offsetZ?: number;
}

export interface ScrollixGalleryFramerProps {
  contentSource: FramerContentSource;
  projectJson?: string;
  assetBaseUrl?: string;
  template: FramerGalleryTemplate;
  primary: MaterialFamily;
  accent?: MaterialFamily;
  quality: GalleryProject["theme"]["quality"];
  atmosphere: GalleryProject["theme"]["atmosphere"];
  overlayFramingMode: ArtworkOverlayFramingMode;
  showBorders: boolean;
  spacing: number;
  width: number;
  height: number;
  depth: number;
  ceilingLightIntensity: number;
  fov: number;
  cameraHeight: number;
  lookAhead: number;
  smoothing: number;
  damping: number;
  scrollStrength: FramerScrollStrength;
  loop: boolean;
  forceMobile: boolean;
  autoStartJourney: boolean;
  initialProgress: number;
  bottomSheetState: BottomSheetState;
  showContentUi: boolean;
  showProgress: boolean;
  items: ScrollixGalleryFramerItemInput[];
}

const cloneProject = (project: GalleryProject): GalleryProject =>
  JSON.parse(JSON.stringify(project)) as GalleryProject;

const toSlug = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const placementModeToSide = (placement: FramerPlacementMode): PlacementSide => {
  if (placement === "station") {
    return "center";
  }

  if (placement === "wall-left") {
    return "left";
  }

  if (placement === "wall-right") {
    return "right";
  }

  return "auto";
};

const inferMediaFormat = (src: string): "jpg" | "png" | "webp" | "ktx2" | undefined => {
  const extension = src.split("?")[0]?.split(".").pop()?.toLowerCase();
  if (extension === "jpg" || extension === "jpeg") {
    return "jpg";
  }

  if (extension === "png" || extension === "webp" || extension === "ktx2") {
    return extension;
  }

  return undefined;
};

const createItemId = (
  item: ScrollixGalleryFramerItemInput,
  index: number,
  usedIds: Set<string>,
): string => {
  const base = toSlug(item.id ?? item.title ?? `${item.type}-${index + 1}`) || `${item.type}-${index + 1}`;
  let id = base;
  let suffix = 2;

  while (usedIds.has(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }

  usedIds.add(id);
  return id;
};

export const createGalleryItemFromFramerInput = (
  item: ScrollixGalleryFramerItemInput,
  index: number,
  usedIds = new Set<string>(),
): GalleryItem => {
  const id = createItemId(item, index, usedIds);
  const image = typeof item.image === "string" && item.image.trim().length > 0
    ? item.image.trim()
    : undefined;

  return {
    id,
    type: item.type,
    placement: {
      side: placementModeToSide(item.placement),
      slot: typeof item.slot === "number" ? item.slot : undefined,
      scale: typeof item.scale === "number" ? item.scale : undefined,
      offset: {
        x: typeof item.offsetX === "number" ? item.offsetX : undefined,
        y: typeof item.offsetY === "number" ? item.offsetY : undefined,
        z: typeof item.offsetZ === "number" ? item.offsetZ : undefined,
      },
    },
    appearance: {
      size: item.size,
      material: item.material,
      lighting: item.lighting,
      variant: item.variant,
      media: image
        ? [{
          src: image,
          type: item.type === "video" ? "video" : "image",
          format: inferMediaFormat(image),
          quality: "high",
          alt: item.imageAlt ?? item.title,
        }]
        : undefined,
    },
    content: {
      eyebrow: item.eyebrow,
      title: item.title,
      subtitle: item.subtitle,
      description: item.description,
      body: item.body,
    },
  };
};

const parseProjectJson = (projectJson: string | undefined): GalleryProject => {
  if (!projectJson?.trim()) {
    return cloneProject(premiumCorridorProject);
  }

  return validateGalleryProject(JSON.parse(projectJson)) as GalleryProject;
};

export const getDefaultFramerGalleryItems = (): ScrollixGalleryFramerItemInput[] =>
  premiumCorridorProject.items.map((item) => ({
    id: item.id,
    type: item.type as FramerGalleryItemType,
    placement: item.placement.side === "center"
      ? "station"
      : item.placement.side === "right"
        ? "wall-right"
        : item.placement.side === "left"
          ? "wall-left"
          : "wall-auto",
    title: typeof item.content.title === "string" ? item.content.title : item.id,
    eyebrow: typeof item.content.eyebrow === "string" ? item.content.eyebrow : undefined,
    subtitle: typeof item.content.subtitle === "string" ? item.content.subtitle : undefined,
    description: typeof item.content.description === "string" ? item.content.description : undefined,
    body: typeof item.content.body === "string" ? item.content.body : undefined,
    image: item.appearance.media?.[0]?.src,
    imageAlt: item.appearance.media?.[0]?.alt,
    size: item.appearance.size,
    material: item.appearance.material as MaterialFamily | undefined,
    lighting: item.appearance.lighting,
    variant: item.appearance.variant,
    slot: item.placement.slot,
    scale: item.placement.scale,
    offsetX: item.placement.offset?.x,
    offsetY: item.placement.offset?.y,
    offsetZ: item.placement.offset?.z,
  }));

export const scrollixGalleryFramerDefaults: ScrollixGalleryFramerProps = {
  contentSource: "controls",
  projectJson: "",
  assetBaseUrl: "",
  template: "default",
  primary: "stone",
  accent: "metal",
  quality: "auto",
  atmosphere: "calm",
  overlayFramingMode: "balanced",
  showBorders: true,
  spacing: 14,
  width: 8,
  height: 4.2,
  depth: 360,
  ceilingLightIntensity: 1,
  fov: 50,
  cameraHeight: 1.72,
  lookAhead: 3.2,
  smoothing: 0.16,
  damping: 0.84,
  scrollStrength: "auto",
  loop: true,
  forceMobile: false,
  autoStartJourney: true,
  initialProgress: 0,
  bottomSheetState: "collapsed",
  showContentUi: true,
  showProgress: true,
  items: getDefaultFramerGalleryItems(),
};

export const buildScrollixGalleryFramerProject = (
  props: ScrollixGalleryFramerProps,
): GalleryProject => {
  const sourceProject = props.contentSource === "projectJson"
    ? parseProjectJson(props.projectJson)
    : cloneProject(premiumCorridorProject);
  const usedIds = new Set<string>();
  const sourceItems = props.contentSource === "controls"
    ? props.items.map((item, index) => createGalleryItemFromFramerInput(item, index, usedIds))
    : sourceProject.items;
  const visibleItems = props.template === "reduced" ? sourceItems.slice(0, 3) : sourceItems;
  const scrollStrength = props.scrollStrength === "auto"
    ? Math.min(6, Math.max(0.25, sourceItems.length / Math.max(1, visibleItems.length)))
    : props.scrollStrength;

  return validateGalleryProject({
    ...sourceProject,
    theme: {
      ...sourceProject.theme,
      quality: props.quality,
      atmosphere: props.atmosphere,
      materials: {
        ...sourceProject.theme.materials,
        primary: props.primary,
        accent: props.accent,
      },
      lighting: {
        ...sourceProject.theme.lighting,
        ceilingLightIntensity: props.ceilingLightIntensity,
      },
      items: {
        ...sourceProject.theme.items,
        showBorders: props.showBorders,
      },
    },
    layout: {
      ...sourceProject.layout,
      spacing: props.spacing,
      bounds: {
        ...sourceProject.layout.bounds,
        width: props.width,
        height: props.height,
        depth: props.depth,
      },
    },
    journey: {
      ...sourceProject.journey,
      artworkOverlayFramingMode: props.overlayFramingMode,
      loop: props.loop,
      smoothing: props.smoothing,
      damping: props.damping,
      scrollStrength,
      camera: {
        ...sourceProject.journey.camera,
        fov: props.fov,
        height: props.cameraHeight,
        lookAhead: props.lookAhead,
      },
    },
    items: visibleItems,
  });
};

export const normalizeQualityOverride = (
  quality: GalleryProject["theme"]["quality"],
): QualityPreset | undefined => (quality === "auto" ? undefined : quality);
