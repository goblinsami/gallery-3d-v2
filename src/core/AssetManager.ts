import { SRGBColorSpace, Texture, TextureLoader } from "three";
import type { TextureSelectionCapabilities, TextureSource } from "../types/Assets";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { QualitySettings } from "../types/Quality";
import type { RenderAssets } from "../types/Renderer";
import { selectTextureSource } from "../utils/selectTextureSource";

export interface AssetManagerOptions {
  quality: QualitySettings;
  assetBaseUrl?: string;
  capabilities?: TextureSelectionCapabilities;
}

const DEFAULT_CAPABILITIES: TextureSelectionCapabilities = {
  ktx2: false,
  webp: true,
};

const getExtensionFormat = (src: string): TextureSource["format"] => {
  const extension = src.split("?")[0].split(".").pop()?.toLowerCase();
  if (extension === "ktx2" || extension === "webp" || extension === "jpg" || extension === "png") {
    return extension;
  }

  if (extension === "jpeg") {
    return "jpg";
  }

  return "webp";
};

export class AssetManager implements RenderAssets {
  private readonly quality: QualitySettings;
  private readonly assetBaseUrl?: string;
  private readonly capabilities: TextureSelectionCapabilities;
  private readonly textureLoader = new TextureLoader();
  private readonly textures = new Map<string, Promise<Texture | null>>();

  constructor(options: AssetManagerOptions) {
    this.quality = options.quality;
    this.assetBaseUrl = options.assetBaseUrl;
    this.capabilities = options.capabilities ?? DEFAULT_CAPABILITIES;
  }

  async getTextureForItem(item: PositionedGalleryItem): Promise<Texture | null> {
    const sources = this.getTextureSources(item);
    const selected = selectTextureSource(sources, this.quality.preset, this.capabilities);
    if (!selected) {
      return null;
    }

    return this.loadTexture(selected.src);
  }

  dispose(): void {
    this.textures.forEach((texturePromise) => {
      void texturePromise.then((texture) => texture?.dispose());
    });
    this.textures.clear();
  }

  private getTextureSources(item: PositionedGalleryItem): TextureSource[] {
    const media = item.appearance.media ?? [];
    return media.flatMap((entry) => {
      if (entry.sources && entry.sources.length > 0) {
        return entry.sources;
      }

      return [{
        src: entry.src,
        format: entry.format ?? getExtensionFormat(entry.src),
        quality: entry.quality,
        width: entry.width,
        height: entry.height,
      }];
    });
  }

  private loadTexture(src: string): Promise<Texture | null> {
    const resolved = this.resolveUrl(src);
    const existing = this.textures.get(resolved);
    if (existing) {
      return existing;
    }

    const texturePromise = this.textureLoader.loadAsync(resolved).then((texture) => {
      texture.colorSpace = SRGBColorSpace;
      texture.needsUpdate = true;
      return texture;
    }).catch(() => {
      return null;
    });
    this.textures.set(resolved, texturePromise);
    return texturePromise;
  }

  private resolveUrl(src: string): string {
    if (!this.assetBaseUrl || /^https?:\/\//.test(src) || src.startsWith("data:")) {
      return src;
    }

    return `${this.assetBaseUrl.replace(/\/$/, "")}/${src.replace(/^\//, "")}`;
  }
}
