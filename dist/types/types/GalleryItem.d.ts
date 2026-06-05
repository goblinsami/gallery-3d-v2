import type { TextureFormat, TextureSource } from "./Assets";
export type GalleryItemType = string;
export type PlacementSide = "left" | "right" | "center" | "auto";
export interface Vec3 {
    x: number;
    y: number;
    z: number;
}
export interface PlacementConfig {
    slot?: number;
    side?: PlacementSide;
    anchor?: string;
    offset?: Partial<Vec3>;
    scale?: number;
    priority?: number;
}
export interface MediaReference {
    src: string;
    type?: "image" | "video" | "texture";
    format?: TextureFormat;
    quality?: TextureSource["quality"];
    sources?: TextureSource[];
    alt?: string;
    width?: number;
    height?: number;
}
export interface AppearanceConfig {
    variant?: string;
    material?: string;
    size?: "small" | "medium" | "large" | number;
    lighting?: "none" | "subtle" | "featured";
    media?: MediaReference[];
}
export interface GalleryAction {
    label: string;
    href?: string;
    intent?: "primary" | "secondary" | "neutral";
}
export interface GalleryContentProjection {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    body?: string;
    metadata?: Record<string, string>;
    actions?: GalleryAction[];
    media?: MediaReference[];
}
export interface GalleryItem {
    id: string;
    type: GalleryItemType;
    placement: PlacementConfig;
    appearance: AppearanceConfig;
    content: Record<string, unknown>;
}
export interface PositionedGalleryItem extends GalleryItem {
    index: number;
    position: Vec3;
    rotation: Vec3;
    focusTarget: Vec3;
    bounds?: {
        width: number;
        height: number;
        depth: number;
    };
}
//# sourceMappingURL=GalleryItem.d.ts.map