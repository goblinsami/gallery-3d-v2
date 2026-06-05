import type { Object3D } from "three";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { ItemRenderer, RendererContext } from "../types/Renderer";
export declare class StatementRenderer implements ItemRenderer {
    readonly type = "statement";
    create(item: PositionedGalleryItem, context: RendererContext): Object3D;
}
//# sourceMappingURL=StatementRenderer.d.ts.map