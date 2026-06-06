import type { GalleryItem } from "./GalleryItem";
import type { JourneyConfig } from "./Journey";
import type { QualityPreset } from "./Quality";
export type MaterialFamily = "stone" | "brick" | "concrete" | "wood" | "metal" | "glass";
export type LayoutType = "corridor" | "infinite-corridor" | "gallery-room" | string;
export type AtmospherePreset = "calm" | "bright" | "nocturne" | "neutral" | string;
export interface ThemeConfig {
    quality: QualityPreset | "auto";
    atmosphere: AtmospherePreset;
    materials: {
        primary: MaterialFamily;
        accent?: MaterialFamily;
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