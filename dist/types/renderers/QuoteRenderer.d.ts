import type { Object3D } from "three";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { ItemRenderer, RendererContext } from "../types/Renderer";
export declare class QuoteRenderer implements ItemRenderer {
    readonly type = "quote";
    create(item: PositionedGalleryItem, context: RendererContext): Object3D;
}
//# sourceMappingURL=QuoteRenderer.d.ts.map