import type { Object3D } from "three";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { ItemRenderer, RendererContext } from "../types/Renderer";
export declare class ImageRenderer implements ItemRenderer {
    readonly type = "image";
    create(item: PositionedGalleryItem, context: RendererContext): Promise<Object3D>;
}
//# sourceMappingURL=ImageRenderer.d.ts.map