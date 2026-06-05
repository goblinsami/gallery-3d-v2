import type { DeviceProfile, QualityPreset, QualitySettings } from "../types/Quality";

const QUALITY_SETTINGS: Record<QualityPreset, QualitySettings> = {
  low: {
    preset: "low",
    pixelRatioCap: 1,
    textureScale: 0.5,
    lightBudget: 1,
    shadows: false,
    geometryDetail: 0.55,
  },
  medium: {
    preset: "medium",
    pixelRatioCap: 1.25,
    textureScale: 0.75,
    lightBudget: 2,
    shadows: false,
    geometryDetail: 0.75,
  },
  high: {
    preset: "high",
    pixelRatioCap: 1.6,
    textureScale: 1,
    lightBudget: 3,
    shadows: false,
    geometryDetail: 1,
  },
  ultra: {
    preset: "ultra",
    pixelRatioCap: 2,
    textureScale: 1,
    lightBudget: 4,
    shadows: true,
    geometryDetail: 1.2,
  },
};

export const getDeviceProfile = (): DeviceProfile => ({
  mobile: window.innerWidth <= 820,
  reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  devicePixelRatio: window.devicePixelRatio,
  viewportWidth: window.innerWidth,
  viewportHeight: window.innerHeight,
});

export const resolveQuality = (
  preset: QualityPreset | "auto",
  device: DeviceProfile,
): QualitySettings => {
  if (preset !== "auto") {
    return QUALITY_SETTINGS[preset];
  }

  if (device.mobile || device.reducedMotion) {
    return QUALITY_SETTINGS.medium;
  }

  if (device.devicePixelRatio > 1.6 || device.viewportWidth >= 1600) {
    return QUALITY_SETTINGS.high;
  }

  return QUALITY_SETTINGS.medium;
};
