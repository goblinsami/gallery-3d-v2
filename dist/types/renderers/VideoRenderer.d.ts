import type { Object3D } from "three";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { ItemRenderer, RendererContext } from "../types/Renderer";
export declare class VideoRenderer implements ItemRenderer {
    readonly type = "video";
    create(item: PositionedGalleryItem, context: RendererContext): Object3D;
}
//# sourceMappingURL=VideoRenderer.d.ts.map