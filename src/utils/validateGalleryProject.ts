import type {
  AtmospherePreset,
  GalleryProject,
  LayoutType,
  MaterialFamily,
  ValidatedGalleryProject,
} from "../types/GalleryProject";
import type {
  AppearanceConfig,
  GalleryItem,
  MediaReference,
  PlacementConfig,
  PlacementSide,
} from "../types/GalleryItem";
import type { TextureFormat, TextureSource } from "../types/Assets";
import type { ArtworkOverlayFramingMode, JourneyMode } from "../types/Journey";
import type { QualityPreset } from "../types/Quality";
import { MATERIAL_FAMILY_VALUES } from "../config/architecturalTextureCatalog";
import { clamp } from "./clamp";

const QUALITY_PRESETS: Array<QualityPreset | "auto"> = ["low", "medium", "high", "ultra", "auto"];
const TEXTURE_QUALITIES: Array<QualityPreset | "fallback"> = ["low", "medium", "high", "ultra", "fallback"];
const PLACEMENT_SIDES: PlacementSide[] = ["left", "right", "center", "auto"];
const JOURNEY_MODES: JourneyMode[] = ["scroll", "manual"];
const ARTWORK_OVERLAY_FRAMING_MODES: ArtworkOverlayFramingMode[] = ["frontal", "balanced", "cinematic"];
const TEXTURE_FORMATS: TextureFormat[] = ["ktx2", "webp", "jpg", "png"];
const ARTWORK_OVERLAY_FRAMING_PRESETS: Record<ArtworkOverlayFramingMode, {
  scale: number;
  min: number;
  max: number;
  forwardOffset: number;
}> = {
  frontal: {
    scale: 0.62,
    min: 0.8,
    max: 1.4,
    forwardOffset: 0.08,
  },
  balanced: {
    scale: 0.72,
    min: 0.95,
    max: 1.8,
    forwardOffset: 0.14,
  },
  cinematic: {
    scale: 0.85,
    min: 1.1,
    max: 2.2,
    forwardOffset: 0.2,
  },
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const getRecord = (source: Record<string, unknown>, key: string): Record<string, unknown> => {
  const value = source[key];
  return isRecord(value) ? value : {};
};

const getString = (source: Record<string, unknown>, key: string): string | undefined => {
  const value = source[key];
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
};

const getNumber = (
  source: Record<string, unknown>,
  key: string,
  fallback: number | undefined,
  min: number,
  max: number,
): number | undefined => {
  const value = source[key];
  if (typeof value !== "number") {
    return fallback;
  }

  return clamp(value, min, max);
};

const getBoolean = (
  source: Record<string, unknown>,
  key: string,
  fallback: boolean | undefined,
): boolean | undefined => {
  const value = source[key];
  return typeof value === "boolean" ? value : fallback;
};

const resolveEnum = <T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T => (typeof value === "string" && allowed.includes(value as T) ? (value as T) : fallback);

const validateTheme = (source: Record<string, unknown>): GalleryProject["theme"] => {
  const materials = getRecord(source, "materials");
  const lighting = getRecord(source, "lighting");
  const items = getRecord(source, "items");
  return {
    quality: resolveEnum(source.quality, QUALITY_PRESETS, "auto"),
    atmosphere: (getString(source, "atmosphere") ?? "calm") as AtmospherePreset,
    materials: {
      primary: resolveEnum(materials.primary, MATERIAL_FAMILY_VALUES, "concrete"),
      accent: materials.accent
        ? resolveEnum(materials.accent, MATERIAL_FAMILY_VALUES, "metal")
        : undefined,
    },
    lighting: {
      ceilingLightIntensity: getNumber(lighting, "ceilingLightIntensity", 1, 0, 2.5),
    },
    items: {
      showBorders: getBoolean(items, "showBorders", true),
    },
  };
};

const validateLayout = (source: Record<string, unknown>): GalleryProject["layout"] => {
  const bounds = getRecord(source, "bounds");
  return {
    type: (getString(source, "type") ?? "corridor") as LayoutType,
    spacing: getNumber(source, "spacing", 7, 1, 40),
    scale: getNumber(source, "scale", 1, 0.1, 8),
    seed: getString(source, "seed"),
    bounds: {
      width: getNumber(bounds, "width", undefined, 1, 40),
      height: getNumber(bounds, "height", undefined, 1, 20),
      depth: getNumber(bounds, "depth", undefined, 4, 400),
    },
  };
};

const validateJourney = (source: Record<string, unknown>): GalleryProject["journey"] => {
  const camera = getRecord(source, "camera");
  const artworkOverlayFramingMode = resolveEnum(
    source.artworkOverlayFramingMode,
    ARTWORK_OVERLAY_FRAMING_MODES,
    "balanced",
  );
  const overlayPreset = ARTWORK_OVERLAY_FRAMING_PRESETS[artworkOverlayFramingMode];

  return {
    mode: resolveEnum(source.mode, JOURNEY_MODES, "scroll"),
    loop: getBoolean(source, "loop", false),
    smoothing: getNumber(source, "smoothing", 0.18, 0.04, 1),
    damping: getNumber(source, "damping", 0.86, 0.2, 0.98),
    artworkOverlayFramingMode,
    artworkOverlayAngleDistanceScale: overlayPreset.scale,
    artworkOverlayAngleDistanceMin: overlayPreset.min,
    artworkOverlayAngleDistanceMax: overlayPreset.max,
    artworkOverlayForwardOffset: overlayPreset.forwardOffset,
    loopWhiteAfterEndWindow: getNumber(source, "loopWhiteAfterEndWindow", 0.14, 0.02, 0.45),
    loopWhiteStartsBeforeEndWindow: getNumber(source, "loopWhiteStartsBeforeEndWindow", 0, 0, 0.45),
    loopWhiteFadeOutWindow: getNumber(source, "loopWhiteFadeOutWindow", 0.22, 0.05, 0.6),
    loopWhiteFadeOutRevealWindow: getNumber(source, "loopWhiteFadeOutRevealWindow", 0.12, 0.03, 0.45),
    loopProgressAdvanceDuringWhiteFadeOut: getNumber(
      source,
      "loopProgressAdvanceDuringWhiteFadeOut",
      0.18,
      0,
      0.45,
    ),
    camera: {
      height: getNumber(camera, "height", undefined, 0.8, 4),
      fov: getNumber(camera, "fov", undefined, 28, 82),
      lookAhead: getNumber(camera, "lookAhead", undefined, 0.2, 12),
    },
  };
};

const validatePlacement = (source: Record<string, unknown>): PlacementConfig => {
  const offset = getRecord(source, "offset");
  return {
    slot: getNumber(source, "slot", undefined, 0, 10000),
    side: source.side ? resolveEnum(source.side, PLACEMENT_SIDES, "auto") : undefined,
    anchor: getString(source, "anchor"),
    offset: {
      x: getNumber(offset, "x", undefined, -20, 20),
      y: getNumber(offset, "y", undefined, -20, 20),
      z: getNumber(offset, "z", undefined, -40, 40),
    },
    scale: getNumber(source, "scale", undefined, 0.1, 8),
    priority: getNumber(source, "priority", undefined, -1000, 1000),
  };
};

const validateAppearance = (source: Record<string, unknown>): AppearanceConfig => {
  const size = source.size;
  return {
    variant: getString(source, "variant"),
    material: getString(source, "material"),
    size:
      size === "small" || size === "medium" || size === "large" || typeof size === "number"
        ? size
        : undefined,
    lighting:
      source.lighting === "none" || source.lighting === "subtle" || source.lighting === "featured"
        ? source.lighting
        : undefined,
    media: validateMediaArray(source.media),
  };
};

const validateTextureSource = (source: unknown): TextureSource | null => {
  if (!isRecord(source)) {
    return null;
  }

  const src = getString(source, "src");
  if (!src) {
    return null;
  }

  return {
    src,
    format: resolveEnum(source.format, TEXTURE_FORMATS, "webp"),
    quality: resolveEnum(source.quality, TEXTURE_QUALITIES, "fallback"),
    width: getNumber(source, "width", undefined, 1, 16384),
    height: getNumber(source, "height", undefined, 1, 16384),
  };
};

const validateMediaReference = (source: unknown): MediaReference | null => {
  if (!isRecord(source)) {
    return null;
  }

  const src = getString(source, "src");
  if (!src) {
    return null;
  }

  const sources = Array.isArray(source.sources)
    ? source.sources.map(validateTextureSource).filter((entry): entry is TextureSource => entry !== null)
    : undefined;

  return {
    src,
    type:
      source.type === "image" || source.type === "video" || source.type === "texture"
        ? source.type
        : undefined,
    format: source.format ? resolveEnum(source.format, TEXTURE_FORMATS, "webp") : undefined,
    quality: source.quality ? resolveEnum(source.quality, TEXTURE_QUALITIES, "fallback") : undefined,
    sources,
    alt: getString(source, "alt"),
    width: getNumber(source, "width", undefined, 1, 16384),
    height: getNumber(source, "height", undefined, 1, 16384),
  };
};

const validateMediaArray = (source: unknown): MediaReference[] | undefined => {
  if (!Array.isArray(source)) {
    return undefined;
  }

  const media = source
    .map(validateMediaReference)
    .filter((entry): entry is MediaReference => entry !== null);
  return media.length > 0 ? media : undefined;
};

const validateItem = (source: unknown, index: number): GalleryItem => {
  if (!isRecord(source)) {
    throw new Error(`GalleryItem at index ${index} must be an object.`);
  }

  const id = getString(source, "id");
  const type = getString(source, "type");
  if (!id) {
    throw new Error(`GalleryItem at index ${index} is missing a valid id.`);
  }

  if (!type) {
    throw new Error(`GalleryItem ${id} is missing a valid type.`);
  }

  return {
    id,
    type,
    placement: validatePlacement(getRecord(source, "placement")),
    appearance: validateAppearance(getRecord(source, "appearance")),
    content: { ...getRecord(source, "content") },
  };
};

const assertUniqueItemIds = (items: GalleryItem[]): void => {
  const ids = new Set<string>();

  for (const item of items) {
    if (ids.has(item.id)) {
      throw new Error(`Duplicate GalleryItem id: ${item.id}`);
    }

    ids.add(item.id);
  }
};

export const validateGalleryProject = (project: unknown): ValidatedGalleryProject => {
  if (!isRecord(project)) {
    throw new Error("GalleryProject must be an object.");
  }

  const rawItems = Array.isArray(project.items) ? project.items : [];
  const items = rawItems.map(validateItem);
  assertUniqueItemIds(items);

  const journeySource = {
    ...(typeof project.artworkOverlayFramingMode === "string"
      ? { artworkOverlayFramingMode: project.artworkOverlayFramingMode }
      : {}),
    ...getRecord(project, "journey"),
  };

  return {
    theme: validateTheme(getRecord(project, "theme")),
    layout: validateLayout(getRecord(project, "layout")),
    journey: validateJourney(journeySource),
    items,
    __validated: true,
  };
};
