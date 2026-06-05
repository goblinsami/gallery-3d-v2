import type { Object3D } from "three";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { ItemRenderer, RendererContext } from "../types/Renderer";
export declare class ProfileRenderer implements ItemRenderer {
    readonly type = "profile";
    create(item: PositionedGalleryItem, context: RendererContext): Object3D;
}
//# sourceMappingURL=ProfileRenderer.d.ts.map