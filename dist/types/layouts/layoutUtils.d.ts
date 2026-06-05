import type { GalleryItem, PositionedGalleryItem, Vec3 } from "../types/GalleryItem";
export declare const toVec3: (x: number, y: number, z: number) => Vec3;
export declare const getItemBounds: (item: GalleryItem) => NonNullable<PositionedGalleryItem["bounds"]>;
export declare const applyOffset: (position: Vec3, offset: Partial<Vec3> | undefined) => Vec3;
//# sourceMappingURL=layoutUtils.d.ts.map