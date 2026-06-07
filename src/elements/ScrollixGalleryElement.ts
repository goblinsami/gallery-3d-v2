import type { GalleryProject } from "../types/GalleryProject";
import type { BottomSheetView } from "../runtime/createBottomSheetView";
import type { DesktopPanelView } from "../runtime/createDesktopPanelView";
import type { RuntimeInstance, RuntimeStateUnsubscribe } from "../types/Runtime";
import { createBottomSheetView } from "../runtime/createBottomSheetView";
import { createDesktopPanelView } from "../runtime/createDesktopPanelView";
import { mountGalleryRuntime } from "../runtime/mountGalleryRuntime";
import { scrollixGalleryStyles } from "./scrollixGalleryStyles";

const template = document.createElement("template");
template.innerHTML = `
  <style>${scrollixGalleryStyles}</style>
  <div class="viewport"></div>
  <div class="progress" aria-hidden="true"><div class="progress__fill"></div></div>
`;

export class ScrollixGalleryElement extends HTMLElement {
  static observedAttributes = [
    "asset-base-url",
    "auto-start-journey",
    "bottom-sheet-state",
    "initial-progress",
    "project",
  ];

  private readonly viewport: HTMLElement;
  private readonly progressFill: HTMLElement;
  private runtime: RuntimeInstance | null = null;
  private bottomSheet: BottomSheetView | null = null;
  private desktopPanel: DesktopPanelView | null = null;
  private unsubscribeState: RuntimeStateUnsubscribe | null = null;
  private currentProject: GalleryProject | null = null;
  private mountedAssetBaseUrl: string | undefined;
  private mountedAutoStartJourney: boolean | undefined;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));
    const viewport = shadow.querySelector(".viewport");
    const progressFill = shadow.querySelector(".progress__fill");
    if (
      !(viewport instanceof HTMLElement) ||
      !(progressFill instanceof HTMLElement)
    ) {
      throw new Error("ScrollixGalleryElement template was not created.");
    }

    this.viewport = viewport;
    this.progressFill = progressFill;
  }

  set project(project: GalleryProject | null) {
    this.currentProject = project;
    void this.syncRuntime();
  }

  get project(): GalleryProject | null {
    return this.currentProject;
  }

  connectedCallback(): void {
    this.tabIndex = this.tabIndex >= 0 ? this.tabIndex : 0;
    this.addEventListener("keydown", this.handleKeydown);
    this.viewport.addEventListener("click", this.handleViewportClick);
    this.currentProject = this.currentProject ?? this.parseProjectAttribute();
    void this.syncRuntime();
  }

  disconnectedCallback(): void {
    this.removeEventListener("keydown", this.handleKeydown);
    this.viewport.removeEventListener("click", this.handleViewportClick);
    this.disposeRuntime();
  }

  attributeChangedCallback(name: string): void {
    if (name === "project") {
      this.currentProject = this.parseProjectAttribute();
    }

    void this.syncRuntime();
  }

  private async syncRuntime(): Promise<void> {
    if (!this.isConnected || !this.currentProject) {
      return;
    }

    const assetBaseUrl = this.getAssetBaseUrl();
    const autoStartJourney = this.getAutoStartJourney();
    const shouldRemount = this.runtime &&
      (assetBaseUrl !== this.mountedAssetBaseUrl || autoStartJourney !== this.mountedAutoStartJourney);

    if (shouldRemount) {
      this.disposeRuntime();
    }

    if (this.runtime) {
      await this.runtime.updateProject(this.currentProject);
      this.applyRuntimeState();
      return;
    }

    this.runtime = await mountGalleryRuntime({
      container: this.viewport,
      project: this.currentProject,
      assetBaseUrl,
      scrollElement: this,
      autoStartJourney,
    });
    this.mountedAssetBaseUrl = assetBaseUrl;
    this.mountedAutoStartJourney = autoStartJourney;
    this.unsubscribeState = this.runtime.subscribeState((state) => {
      this.progressFill.style.transform = `scaleX(${state.progress})`;
    });
    this.bottomSheet = createBottomSheetView(this.runtime);
    this.desktopPanel = createDesktopPanelView(this.runtime);
    this.shadowRoot?.appendChild(this.bottomSheet.element);
    this.shadowRoot?.appendChild(this.desktopPanel.element);
    this.applyRuntimeState();
  }

  private parseProjectAttribute(): GalleryProject | null {
    const rawProject = this.getAttribute("project");
    if (!rawProject) {
      return null;
    }

    const parsed: unknown = JSON.parse(rawProject);
    return parsed as GalleryProject;
  }

  private getAssetBaseUrl(): string | undefined {
    const value = this.getAttribute("asset-base-url")?.trim();
    return value || undefined;
  }

  private getAutoStartJourney(): boolean | undefined {
    const value = this.getAttribute("auto-start-journey");
    if (value === null) {
      return undefined;
    }

    return value !== "false";
  }

  private getInitialProgress(): number | null {
    const value = this.getAttribute("initial-progress");
    if (value === null) {
      return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), 1) : null;
  }

  private applyRuntimeState(): void {
    if (!this.runtime) {
      return;
    }

    const bottomSheetState = this.getAttribute("bottom-sheet-state");
    if (bottomSheetState === "collapsed" || bottomSheetState === "half" || bottomSheetState === "full") {
      this.runtime.setBottomSheetState(bottomSheetState);
    }

    const initialProgress = this.getInitialProgress();
    if (initialProgress !== null) {
      this.runtime.setProgress(initialProgress);
    }
  }

  private disposeRuntime(): void {
    this.bottomSheet?.dispose();
    this.bottomSheet = null;
    this.desktopPanel?.dispose();
    this.desktopPanel = null;
    this.unsubscribeState?.();
    this.unsubscribeState = null;
    this.runtime?.dispose();
    this.runtime = null;
    this.mountedAssetBaseUrl = undefined;
    this.mountedAutoStartJourney = undefined;
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    if (!this.runtime) {
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      this.runtime.nextItem();
      return;
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      this.runtime.previousItem();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      this.runtime.setBottomSheetState("collapsed");
    }
  };

  private handleViewportClick = (event: MouseEvent): void => {
    if (!this.runtime || event.button !== 0) {
      return;
    }

    if (this.runtime.getContentSurface().state !== "collapsed") {
      return;
    }

    this.runtime.selectItemAtClientPoint(event.clientX, event.clientY);
  };
}

export const defineScrollixGalleryElement = (
  tagName = "scrollix-gallery",
): void => {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, ScrollixGalleryElement);
  }
};

export const registerScrollixGalleryRuntime = (
  tagName = "scrollix-gallery",
): void => {
  defineScrollixGalleryElement(tagName);
};

if (typeof window !== "undefined" && window.customElements) {
  registerScrollixGalleryRuntime();
  window.ScrollixGalleryRuntime = {
    init: registerScrollixGalleryRuntime,
    registerWebComponents: registerScrollixGalleryRuntime,
  };
}

declare global {
  interface Window {
    ScrollixGalleryRuntime?: {
      init(tagName?: string): void;
      registerWebComponents(tagName?: string): void;
    };
  }

  interface HTMLElementTagNameMap {
    "scrollix-gallery": ScrollixGalleryElement;
  }
}
