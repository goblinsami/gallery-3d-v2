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
  static observedAttributes = ["project"];

  private readonly viewport: HTMLElement;
  private readonly progressFill: HTMLElement;
  private runtime: RuntimeInstance | null = null;
  private bottomSheet: BottomSheetView | null = null;
  private desktopPanel: DesktopPanelView | null = null;
  private unsubscribeState: RuntimeStateUnsubscribe | null = null;
  private currentProject: GalleryProject | null = null;

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
    this.bottomSheet?.dispose();
    this.bottomSheet = null;
    this.desktopPanel?.dispose();
    this.desktopPanel = null;
    this.unsubscribeState?.();
    this.unsubscribeState = null;
    this.runtime?.dispose();
    this.runtime = null;
  }

  attributeChangedCallback(name: string): void {
    if (name !== "project") {
      return;
    }

    this.currentProject = this.parseProjectAttribute();
    void this.syncRuntime();
  }

  private async syncRuntime(): Promise<void> {
    if (!this.isConnected || !this.currentProject) {
      return;
    }

    if (this.runtime) {
      await this.runtime.updateProject(this.currentProject);
      return;
    }

    this.runtime = await mountGalleryRuntime({
      container: this.viewport,
      project: this.currentProject,
      scrollElement: this,
    });
    this.unsubscribeState = this.runtime.subscribeState((state) => {
      this.progressFill.style.transform = `scaleX(${state.progress})`;
    });
    this.bottomSheet = createBottomSheetView(this.runtime);
    this.desktopPanel = createDesktopPanelView(this.runtime);
    this.shadowRoot?.appendChild(this.bottomSheet.element);
    this.shadowRoot?.appendChild(this.desktopPanel.element);
  }

  private parseProjectAttribute(): GalleryProject | null {
    const rawProject = this.getAttribute("project");
    if (!rawProject) {
      return null;
    }

    const parsed: unknown = JSON.parse(rawProject);
    return parsed as GalleryProject;
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

declare global {
  interface HTMLElementTagNameMap {
    "scrollix-gallery": ScrollixGalleryElement;
  }
}
