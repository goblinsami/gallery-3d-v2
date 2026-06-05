import type { GalleryProject, LayoutConfig } from "./GalleryProject";
import type { PositionedGalleryItem } from "./GalleryItem";

export interface LayoutContext {
  viewportAspect: number;
  qualityScale: number;
}

export interface LayoutStrategy {
  readonly type: string;
  layout(project: GalleryProject, config: LayoutConfig, context: LayoutContext): PositionedGalleryItem[];
}
