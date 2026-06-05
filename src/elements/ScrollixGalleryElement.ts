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
  <div class="white-overlay" aria-hidden="true"></div>
  <div class="progress" aria-hidden="true"><div class="progress__fill"></div></div>
`;

export class ScrollixGalleryElement extends HTMLElement {
  static observedAttributes = ["project"];

  private readonly viewport: HTMLElement;
  private readonly whiteOverlay: HTMLElement;
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
    const whiteOverlay = shadow.querySelector(".white-overlay");
    const progressFill = shadow.querySelector(".progress__fill");
    if (
      !(viewport instanceof HTMLElement) ||
      !(whiteOverlay instanceof HTMLElement) ||
      !(progressFill instanceof HTMLElement)
    ) {
      throw new Error("ScrollixGalleryElement template was not created.");
    }

    this.viewport = viewport;
    this.whiteOverlay = whiteOverlay;
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
    this.currentProject = this.currentProject ?? this.parseProjectAttribute();
    void this.syncRuntime();
  }

  disconnectedCallback(): void {
    this.removeEventListener("keydown", this.handleKeydown);
    this.bottomSheet?.dispose();
    this.bottomSheet = null;
    this.desktopPanel?.dispose();
    this.desktopPanel = null;
    this.unsubscribeState?.();
    this.unsubscribeState = null;
    this.runtime?.dispose();
    this.runtime = null;
    delete this.viewport.dataset.g3dHostWhiteOverlay;
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

    this.viewport.dataset.g3dHostWhiteOverlay = "true";
    this.runtime = await mountGalleryRuntime({
      container: this.viewport,
      project: this.currentProject,
      scrollElement: this,
    });
    this.unsubscribeState = this.runtime.subscribeState((state) => {
      this.progressFill.style.transform = `scaleX(${state.progress})`;
      this.toggleAttribute("data-white-loop", state.whiteMix > 0.001);
      this.whiteOverlay.style.setProperty("opacity", String(state.whiteMix), "important");
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
