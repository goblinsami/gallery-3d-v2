import type { Object3D } from "three";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { ItemRenderer, RendererContext } from "../types/Renderer";
export declare class CtaRenderer implements ItemRenderer {
    readonly type = "cta";
    create(item: PositionedGalleryItem, context: RendererContext): Object3D;
}
//# sourceMappingURL=CtaRenderer.d.ts.map