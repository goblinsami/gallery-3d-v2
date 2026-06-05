import type { QualityPreset } from "./Quality";

export type TextureFormat = "ktx2" | "webp" | "jpg" | "png";

export interface TextureSource {
  src: string;
  format: TextureFormat;
  quality?: QualityPreset | "fallback";
  width?: number;
  height?: number;
}

export interface TextureSelectionCapabilities {
  ktx2: boolean;
  webp: boolean;
}
