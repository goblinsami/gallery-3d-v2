import type { GalleryProject } from "./GalleryProject";
import type { BottomSheetState } from "./Journey";
import type { ContentSurfaceListener, ContentSurfaceModel, ContentSurfaceUnsubscribe } from "./ContentSurface";

export interface RuntimeState {
  progress: number;
  whiteMix: number;
  activeItemId: string | null;
}

export type RuntimeStateListener = (state: RuntimeState) => void;
export type RuntimeStateUnsubscribe = () => void;

export interface RuntimeMountOptions {
  container: HTMLElement;
  project: GalleryProject;
  assetBaseUrl?: string;
  scrollElement?: HTMLElement;
  autoStartJourney?: boolean;
}

export interface RuntimeInstance {
  updateProject(project: GalleryProject): Promise<void>;
  setProgress(progress: number): void;
  focusItem(itemId: string): boolean;
  selectItem(itemId: string): boolean;
  selectItemAtClientPoint(clientX: number, clientY: number): boolean;
  nextItem(): boolean;
  previousItem(): boolean;
  setBottomSheetState(state: BottomSheetState): void;
  getState(): RuntimeState;
  subscribeState(listener: RuntimeStateListener): RuntimeStateUnsubscribe;
  getContentSurface(): ContentSurfaceModel;
  subscribeContentSurface(listener: ContentSurfaceListener): ContentSurfaceUnsubscribe;
  dispose(): void;
}
