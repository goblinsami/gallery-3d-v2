import type { GalleryItem } from "../types/GalleryItem";
import type { BottomSheetState } from "../types/Journey";
import type {
  ContentSurfaceController,
  ContentSurfaceListener,
  ContentSurfaceModel,
  ContentSurfaceUnsubscribe,
} from "../types/ContentSurface";
import { projectItemContent } from "../utils/contentProjection";

export class BottomSheetController implements ContentSurfaceController {
  private state: BottomSheetState = "collapsed";
  private item: GalleryItem | null = null;
  private itemIndex: number | undefined;
  private itemTotal: number | undefined;
  private readonly listeners = new Set<ContentSurfaceListener>();

  setActiveItem(item: GalleryItem | null, index?: number, total?: number): void {
    if (this.item === item && this.itemIndex === index && this.itemTotal === total) {
      return;
    }

    this.item = item;
    this.itemIndex = index;
    this.itemTotal = total;
    this.notify();
  }

  setState(state: BottomSheetState): void {
    if (this.state === state) {
      return;
    }

    this.state = state;
    this.notify();
  }

  expand(): void {
    this.setState(this.state === "collapsed" ? "half" : "full");
  }

  collapse(): void {
    this.setState(this.state === "full" ? "half" : "collapsed");
  }

  getModel(): ContentSurfaceModel {
    return {
      state: this.state,
      activeItemId: this.item?.id ?? null,
      item: this.item,
      content: this.item ? projectItemContent(this.item, this.itemIndex, this.itemTotal) : null,
    };
  }

  subscribe(listener: ContentSurfaceListener): ContentSurfaceUnsubscribe {
    this.listeners.add(listener);
    listener(this.getModel());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const model = this.getModel();
    this.listeners.forEach((listener) => listener(model));
  }
}
