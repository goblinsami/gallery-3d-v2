export interface RenderSchedulerOptions {
  container: HTMLElement;
  onRender: () => void;
  onResize: () => void;
}

export class RenderScheduler {
  private readonly container: HTMLElement;
  private readonly onRender: () => void;
  private readonly onResize: () => void;
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private frameId: number | null = null;
  private visibleByIntersection = true;
  private visibleByDocument = true;
  private dirty = false;
  private disposed = false;

  constructor(options: RenderSchedulerOptions) {
    this.container = options.container;
    this.onRender = options.onRender;
    this.onResize = options.onResize;
  }

  start(): void {
    if (this.disposed) {
      throw new Error("RenderScheduler has been disposed.");
    }

    this.visibleByDocument = document.visibilityState !== "hidden";
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    this.resizeObserver = new ResizeObserver(() => {
      this.onResize();
      this.invalidate("resize");
    });
    this.resizeObserver.observe(this.container);
    this.intersectionObserver = new IntersectionObserver(this.handleIntersection);
    this.intersectionObserver.observe(this.container);
  }

  invalidate(_reason: string): void {
    if (this.disposed) {
      return;
    }

    this.dirty = true;

    if (!this.canRender() || this.frameId !== null) {
      return;
    }

    this.frameId = requestAnimationFrame(this.renderFrame);
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);

    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  private renderFrame = (): void => {
    this.frameId = null;

    if (!this.canRender()) {
      return;
    }

    this.onRender();
    this.dirty = false;
  };

  private handleVisibilityChange = (): void => {
    this.visibleByDocument = document.visibilityState !== "hidden";
    if (this.canRender() && this.dirty) {
      this.invalidate("document-visible");
    }
  };

  private handleIntersection = (entries: IntersectionObserverEntry[]): void => {
    const entry = entries[0];
    this.visibleByIntersection = entry ? entry.isIntersecting : true;
    if (this.canRender() && this.dirty) {
      this.invalidate("visibility-resume");
    }
  };

  private canRender(): boolean {
    return !this.disposed && this.visibleByDocument && this.visibleByIntersection;
  }
}
