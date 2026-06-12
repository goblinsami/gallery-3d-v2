import { m as l, c as u, a } from "./mountGalleryRuntime-DN09aB1N.js";
import { s as h } from "./scrollixGalleryStyles-C4smxMtI.js";
const n = document.createElement("template");
n.innerHTML = `
  <style>${h}</style>
  <div class="viewport"></div>
  <div class="progress" aria-hidden="true"><div class="progress__fill"></div></div>
`;
class c extends HTMLElement {
  static observedAttributes = [
    "asset-base-url",
    "auto-start-journey",
    "bottom-sheet-state",
    "initial-progress",
    "project"
  ];
  viewport;
  progressFill;
  runtime = null;
  bottomSheet = null;
  desktopPanel = null;
  unsubscribeState = null;
  currentProject = null;
  mountedAssetBaseUrl;
  mountedAutoStartJourney;
  constructor() {
    super();
    const t = this.attachShadow({ mode: "open" });
    t.appendChild(n.content.cloneNode(!0));
    const e = t.querySelector(".viewport"), i = t.querySelector(".progress__fill");
    if (!(e instanceof HTMLElement) || !(i instanceof HTMLElement))
      throw new Error("ScrollixGalleryElement template was not created.");
    this.viewport = e, this.progressFill = i;
  }
  set project(t) {
    this.currentProject = t, this.syncRuntime();
  }
  get project() {
    return this.currentProject;
  }
  connectedCallback() {
    this.tabIndex = this.tabIndex >= 0 ? this.tabIndex : 0, this.addEventListener("keydown", this.handleKeydown), this.viewport.addEventListener("click", this.handleViewportClick), this.currentProject = this.currentProject ?? this.parseProjectAttribute(), this.syncRuntime();
  }
  disconnectedCallback() {
    this.removeEventListener("keydown", this.handleKeydown), this.viewport.removeEventListener("click", this.handleViewportClick), this.disposeRuntime();
  }
  attributeChangedCallback(t) {
    t === "project" && (this.currentProject = this.parseProjectAttribute()), this.syncRuntime();
  }
  async syncRuntime() {
    if (!this.isConnected || !this.currentProject)
      return;
    const t = this.getAssetBaseUrl(), e = this.getAutoStartJourney();
    if (this.runtime && (t !== this.mountedAssetBaseUrl || e !== this.mountedAutoStartJourney) && this.disposeRuntime(), this.runtime) {
      await this.runtime.updateProject(this.currentProject), this.applyRuntimeState();
      return;
    }
    this.runtime = await l({
      container: this.viewport,
      project: this.currentProject,
      assetBaseUrl: t,
      scrollElement: this,
      autoStartJourney: e
    }), this.mountedAssetBaseUrl = t, this.mountedAutoStartJourney = e, this.unsubscribeState = this.runtime.subscribeState((o) => {
      this.progressFill.style.transform = `scaleX(${o.progress})`;
    }), this.bottomSheet = u(this.runtime), this.desktopPanel = a(this.runtime), this.shadowRoot?.appendChild(this.bottomSheet.element), this.shadowRoot?.appendChild(this.desktopPanel.element), this.applyRuntimeState();
  }
  parseProjectAttribute() {
    const t = this.getAttribute("project");
    return t ? JSON.parse(t) : null;
  }
  getAssetBaseUrl() {
    return this.getAttribute("asset-base-url")?.trim() || void 0;
  }
  getAutoStartJourney() {
    const t = this.getAttribute("auto-start-journey");
    if (t !== null)
      return t !== "false";
  }
  getInitialProgress() {
    const t = this.getAttribute("initial-progress");
    if (t === null)
      return null;
    const e = Number(t);
    return Number.isFinite(e) ? Math.min(Math.max(e, 0), 1) : null;
  }
  applyRuntimeState() {
    if (!this.runtime)
      return;
    const t = this.getAttribute("bottom-sheet-state");
    (t === "collapsed" || t === "half" || t === "full") && this.runtime.setBottomSheetState(t);
    const e = this.getInitialProgress();
    e !== null && this.runtime.setProgress(e);
  }
  disposeRuntime() {
    this.bottomSheet?.dispose(), this.bottomSheet = null, this.desktopPanel?.dispose(), this.desktopPanel = null, this.unsubscribeState?.(), this.unsubscribeState = null, this.runtime?.dispose(), this.runtime = null, this.mountedAssetBaseUrl = void 0, this.mountedAutoStartJourney = void 0;
  }
  handleKeydown = (t) => {
    if (this.runtime) {
      if (t.key === "ArrowDown" || t.key === "ArrowRight") {
        t.preventDefault(), this.runtime.nextItem();
        return;
      }
      if (t.key === "ArrowUp" || t.key === "ArrowLeft") {
        t.preventDefault(), this.runtime.previousItem();
        return;
      }
      t.key === "Escape" && (t.preventDefault(), this.runtime.setBottomSheetState("collapsed"));
    }
  };
  handleViewportClick = (t) => {
    !this.runtime || t.button !== 0 || this.runtime.getContentSurface().state === "collapsed" && this.runtime.selectItemAtClientPoint(t.clientX, t.clientY);
  };
}
const m = (s = "scrollix-gallery") => {
  customElements.get(s) || customElements.define(s, c);
}, r = (s = "scrollix-gallery") => {
  m(s);
};
typeof window < "u" && window.customElements && (r(), window.ScrollixGalleryRuntime = {
  init: r,
  registerWebComponents: r
});
export {
  c as ScrollixGalleryElement,
  m as defineScrollixGalleryElement,
  r as registerScrollixGalleryRuntime
};
//# sourceMappingURL=element.js.map
