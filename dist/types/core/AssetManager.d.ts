import { Texture } from "three";
import type { TextureSelectionCapabilities } from "../types/Assets";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { QualitySettings } from "../types/Quality";
import type { RenderAssets } from "../types/Renderer";
export interface AssetManagerOptions {
    quality: QualitySettings;
    assetBaseUrl?: string;
    capabilities?: TextureSelectionCapabilities;
}
export declare class AssetManager implements RenderAssets {
    private readonly quality;
    private readonly assetBaseUrl?;
    private readonly capabilities;
    private readonly textureLoader;
    private readonly textures;
    constructor(options: AssetManagerOptions);
    getTextureForItem(item: PositionedGalleryItem): Promise<Texture | null>;
    dispose(): void;
    private getTextureSources;
    private loadTexture;
    private resolveUrl;
}
//# sourceMappingURL=AssetManager.d.ts.map