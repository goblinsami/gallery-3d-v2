import type { GalleryItem } from "./GalleryItem";
import type { JourneyConfig } from "./Journey";
import type { QualityPreset } from "./Quality";
import type { MaterialFamily } from "../config/architecturalTextureCatalog";
export type { MaterialFamily };
export type LayoutType = "corridor" | "infinite-corridor" | "gallery-room" | string;
export type AtmospherePreset = "calm" | "bright" | "nocturne" | "neutral" | string;
export type TextureTilingDeformation = "stretched" | "square";
export interface TextureTilingConfig {
    wall?: number;
    floor?: number;
    ceiling?: number;
    wallDeformation?: TextureTilingDeformation;
    floorDeformation?: TextureTilingDeformation;
    ceilingDeformation?: TextureTilingDeformation;
}
export interface ThemeConfig {
    quality: QualityPreset | "auto";
    atmosphere: AtmospherePreset;
    materials: {
        primary: MaterialFamily;
        accent?: MaterialFamily;
        textureTiling?: TextureTilingConfig;
    };
    lighting?: {
        ceilingLightIntensity?: number;
        ceilingLightRadius?: number;
    };
    items?: {
        showBorders?: boolean;
    };
}
export interface LayoutConfig {
    type: LayoutType;
    spacing?: number;
    scale?: number;
    seed?: string;
    bounds?: {
        width?: number;
        height?: number;
        depth?: number;
    };
}
export interface GalleryProject {
    theme: ThemeConfig;
    layout: LayoutConfig;
    journey: JourneyConfig;
    items: GalleryItem[];
}
export interface ValidatedGalleryProject extends GalleryProject {
    readonly __validated: true;
}
//# sourceMappingURL=GalleryProject.d.ts.map