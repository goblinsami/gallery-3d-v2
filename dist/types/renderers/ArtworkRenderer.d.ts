import type { Object3D } from "three";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { ItemRenderer, RendererContext } from "../types/Renderer";
export declare class ArtworkRenderer implements ItemRenderer {
    readonly type = "artwork";
    create(item: PositionedGalleryItem, context: RendererContext): Promise<Object3D>;
}
//# sourceMappingURL=ArtworkRenderer.d.ts.map