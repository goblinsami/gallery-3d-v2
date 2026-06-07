import { m as n, c as o, a as l } from "./mountGalleryRuntime-BaidRSMr.js";
import { s as c } from "./scrollixGalleryStyles-CDojAq-C.js";
const s = document.createElement("template");
s.innerHTML = `
  <style>${c}</style>
  <div class="viewport"></div>
  <div class="progress" aria-hidden="true"><div class="progress__fill"></div></div>
`;
class a extends HTMLElement {
  static observedAttributes = ["project"];
  viewport;
  progressFill;
  runtime = null;
  bottomSheet = null;
  desktopPanel = null;
  unsubscribeState = null;
  currentProject = null;
  constructor() {
    super();
    const t = this.attachShadow({ mode: "open" });
    t.appendChild(s.content.cloneNode(!0));
    const r = t.querySelector(".viewport"), i = t.querySelector(".progress__fill");
    if (!(r instanceof HTMLElement) || !(i instanceof HTMLElement))
      throw new Error("ScrollixGalleryElement template was not created.");
    this.viewport = r, this.progressFill = i;
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
    this.removeEventListener("keydown", this.handleKeydown), this.viewport.removeEventListener("click", this.handleViewportClick), this.bottomSheet?.dispose(), this.bottomSheet = null, this.desktopPanel?.dispose(), this.desktopPanel = null, this.unsubscribeState?.(), this.unsubscribeState = null, this.runtime?.dispose(), this.runtime = null;
  }
  attributeChangedCallback(t) {
    t === "project" && (this.currentProject = this.parseProjectAttribute(), this.syncRuntime());
  }
  async syncRuntime() {
    if (!(!this.isConnected || !this.currentProject)) {
      if (this.runtime) {
        await this.runtime.updateProject(this.currentProject);
        return;
      }
      this.runtime = await n({
        container: this.viewport,
        project: this.currentProject,
        scrollElement: this
      }), this.unsubscribeState = this.runtime.subscribeState((t) => {
        this.progressFill.style.transform = `scaleX(${t.progress})`;
      }), this.bottomSheet = o(this.runtime), this.desktopPanel = l(this.runtime), this.shadowRoot?.appendChild(this.bottomSheet.element), this.shadowRoot?.appendChild(this.desktopPanel.element);
    }
  }
  parseProjectAttribute() {
    const t = this.getAttribute("project");
    return t ? JSON.parse(t) : null;
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
const d = (e = "scrollix-gallery") => {
  customElements.get(e) || customElements.define(e, a);
};
export {
  a as ScrollixGalleryElement,
  d as defineScrollixGalleryElement
};
//# sourceMappingURL=element.js.map
