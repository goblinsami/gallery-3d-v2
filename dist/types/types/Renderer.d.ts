import type { BoxGeometry, MeshBasicMaterial, MeshStandardMaterial, Object3D, PlaneGeometry, Texture } from "three";
import type { PositionedGalleryItem } from "./GalleryItem";
import type { QualitySettings } from "./Quality";
export interface RenderResources {
    readonly unitPlane: PlaneGeometry;
    readonly unitBox: BoxGeometry;
    getBasicSurface(color: string): MeshBasicMaterial;
    getStandardSurface(color: string, roughness: number, metalness: number): MeshStandardMaterial;
    getGlow(color: string, opacity: number): MeshBasicMaterial;
}
export interface RenderAssets {
    getTextureForItem(item: PositionedGalleryItem): Promise<Texture | null>;
}
export interface RendererContext {
    quality: QualitySettings;
    resources: RenderResources;
    assets: RenderAssets;
    assetBaseUrl?: string;
}
export interface ItemRenderer {
    readonly type: string;
    create(item: PositionedGalleryItem, context: RendererContext): Object3D | Promise<Object3D>;
    dispose?(object: Object3D): void;
}
//# sourceMappingURL=Renderer.d.ts.map