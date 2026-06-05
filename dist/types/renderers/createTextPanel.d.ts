import { Group } from "three";
import type { GalleryContentProjection, PositionedGalleryItem } from "../types/GalleryItem";
import type { RenderResources } from "../types/Renderer";
export interface TextPanelOptions {
    width: number;
    height: number;
    background: string;
    foreground: string;
    accent: string;
}
export declare const createTextPanel: (item: PositionedGalleryItem, content: GalleryContentProjection, options: TextPanelOptions, resources: RenderResources) => Group;
//# sourceMappingURL=createTextPanel.d.ts.map