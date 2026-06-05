import type { TextureSelectionCapabilities, TextureSource } from "../types/Assets";
import type { QualityPreset } from "../types/Quality";

const FORMAT_PRIORITY: Record<string, number> = {
  ktx2: 0,
  webp: 1,
  jpg: 2,
  png: 3,
};

const isSupportedFormat = (
  source: TextureSource,
  capabilities: TextureSelectionCapabilities,
): boolean => {
  if (source.format === "ktx2") {
    return capabilities.ktx2;
  }

  if (source.format === "webp") {
    return capabilities.webp;
  }

  return true;
};

const qualityScore = (source: TextureSource, targetQuality: QualityPreset): number => {
  if (!source.quality || source.quality === "fallback") {
    return 10;
  }

  const order: QualityPreset[] = ["low", "medium", "high", "ultra"];
  return Math.abs(order.indexOf(source.quality) - order.indexOf(targetQuality));
};

export const selectTextureSource = (
  sources: TextureSource[],
  targetQuality: QualityPreset,
  capabilities: TextureSelectionCapabilities,
): TextureSource | null => {
  const supported = sources.filter((source) => isSupportedFormat(source, capabilities));
  if (supported.length === 0) {
    return null;
  }

  return [...supported].sort((a, b) => {
    const qualityDelta = qualityScore(a, targetQuality) - qualityScore(b, targetQuality);
    if (qualityDelta !== 0) {
      return qualityDelta;
    }

    return FORMAT_PRIORITY[a.format] - FORMAT_PRIORITY[b.format];
  })[0];
};
