import { Group, Texture } from "three";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { RenderResources } from "../types/Renderer";
export interface MediaFrameOptions {
    width: number;
    height: number;
    surfaceColor: string;
    frameColor: string;
    emissive?: string;
    texture?: Texture | null;
}
export declare const createMediaFrame: (item: PositionedGalleryItem, options: MediaFrameOptions, resources: RenderResources) => Group;
//# sourceMappingURL=createMediaFrame.d.ts.map