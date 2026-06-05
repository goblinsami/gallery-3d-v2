import type { GalleryContentProjection, GalleryItem } from "./GalleryItem";
import type { BottomSheetState } from "./Journey";

export interface ContentSurfaceModel {
  state: BottomSheetState;
  activeItemId: string | null;
  item: GalleryItem | null;
  content: GalleryContentProjection | null;
}

export type ContentSurfaceListener = (model: ContentSurfaceModel) => void;
export type ContentSurfaceUnsubscribe = () => void;

export interface ContentSurfaceController {
  setActiveItem(item: GalleryItem | null): void;
  setState(state: BottomSheetState): void;
  getModel(): ContentSurfaceModel;
  subscribe(listener: ContentSurfaceListener): ContentSurfaceUnsubscribe;
}
