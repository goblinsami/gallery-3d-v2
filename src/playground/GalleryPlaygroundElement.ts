import type { GalleryProject, MaterialFamily } from "../types/GalleryProject";

type ControlName =
  | "primary"
  | "quality"
  | "spacing"
  | "width"
  | "height"
  | "depth"
  | "fov"
  | "cameraHeight"
  | "lookAhead"
  | "smoothing"
  | "loop";

export interface GalleryPlaygroundValues {
  primary: MaterialFamily;
  quality: GalleryProject["theme"]["quality"];
  spacing: number;
  width: number;
  height: number;
  depth: number;
  fov: number;
  cameraHeight: number;
  lookAhead: number;
  smoothing: number;
  loop: boolean;
}

export interface GalleryPlaygroundChangeDetail {
  project: GalleryProject;
  values: GalleryPlaygroundValues;
}

const playgroundTemplate = document.createElement("template");
playgroundTemplate.innerHTML = `
  <style>
    :host {
      position: fixed;
      top: 12px;
      right: 12px;
      z-index: 40;
      width: min(300px, calc(100vw - 24px));
      color: #f8f2e8;
      font: 600 11px/1.2 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      letter-spacing: 0.04em;
    }

    .panel {
      display: grid;
      gap: 12px;
      padding: 12px;
      background: rgba(7, 7, 6, 0.76);
      border: 1px solid rgba(255, 248, 224, 0.18);
      border-radius: 12px;
      box-shadow: 0 18px 52px rgba(0, 0, 0, 0.28);
      backdrop-filter: blur(14px);
    }

    .header {
      display: grid;
      gap: 4px;
    }

    .title {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }

    .summary {
      color: rgba(255, 248, 232, 0.62);
      font: 500 11px/1.35 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      letter-spacing: 0;
    }

    .grid {
      display: grid;
      gap: 10px;
    }

    .field {
      display: grid;
      gap: 5px;
    }

    .field__label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .field__value {
      color: rgba(255, 248, 232, 0.68);
      font-size: 10px;
      text-transform: none;
      letter-spacing: 0;
    }

    .field__hint {
      color: rgba(255, 248, 232, 0.5);
      font: 500 10px/1.35 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      letter-spacing: 0;
    }

    select,
    input {
      width: 100%;
      box-sizing: border-box;
      accent-color: #d4b26a;
    }

    select {
      min-height: 34px;
      color: #fff8e8;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 248, 224, 0.24);
      border-radius: 8px;
      padding: 0 8px;
      font: 600 13px/1.1 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    select option {
      color: #1b1711;
      background: #f8f2e8;
    }

    input[type="range"] {
      margin: 0;
    }

    .toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-top: 2px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .toggle input {
      width: auto;
    }

    @media (max-width: 720px) {
      :host {
        top: auto;
        right: 10px;
        bottom: 10px;
        left: 10px;
        width: auto;
      }

      .panel {
        max-height: 46vh;
        overflow: auto;
      }
    }
  </style>
  <form class="panel" aria-label="Gallery playground controls">
    <div class="header">
      <div class="title">Playground</div>
      <div class="summary" data-summary>Waiting for project…</div>
    </div>
    <div class="grid">
      <label class="field">
        <span class="field__label">Texture <span class="field__value" data-value="primary">stone</span></span>
        <span class="field__hint">Cambia el material arquitectónico base de paredes, suelo y atmósfera.</span>
        <select data-control="primary">
          <option value="stone">Legacy stone</option>
          <option value="brick">Brick</option>
          <option value="wood">Wood</option>
        </select>
      </label>
      <label class="field">
        <span class="field__label">Quality <span class="field__value" data-value="quality">auto</span></span>
        <span class="field__hint">Ajusta el preset visual usado por geometría, sombras y coste de render.</span>
        <select data-control="quality">
          <option value="auto">Auto</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="ultra">Ultra</option>
          <option value="low">Low</option>
        </select>
      </label>
      <label class="field">
        <span class="field__label">Spacing <span class="field__value" data-value="spacing">14</span></span>
        <span class="field__hint">Controla la distancia entre estaciones dentro del recorrido.</span>
        <input data-control="spacing" type="range" min="8" max="22" step="0.5" />
      </label>
      <label class="field">
        <span class="field__label">Width <span class="field__value" data-value="width">8</span></span>
        <span class="field__hint">Ensacha o estrecha el corredor para cambiar la sensación espacial.</span>
        <input data-control="width" type="range" min="5" max="14" step="0.25" />
      </label>
      <label class="field">
        <span class="field__label">Height <span class="field__value" data-value="height">4.2</span></span>
        <span class="field__hint">Define la altura de la arquitectura y cuánto aire tiene la sala.</span>
        <input data-control="height" type="range" min="3" max="7" step="0.1" />
      </label>
      <label class="field">
        <span class="field__label">Depth <span class="field__value" data-value="depth">360</span></span>
        <span class="field__hint">Ajusta la profundidad total disponible para el loop y sus estaciones.</span>
        <input data-control="depth" type="range" min="120" max="400" step="10" />
      </label>
      <label class="field">
        <span class="field__label">FOV <span class="field__value" data-value="fov">50</span></span>
        <span class="field__hint">Modifica la apertura de cámara: más alto se siente más angular.</span>
        <input data-control="fov" type="range" min="36" max="68" step="1" />
      </label>
      <label class="field">
        <span class="field__label">Camera <span class="field__value" data-value="cameraHeight">1.72</span></span>
        <span class="field__hint">Sube o baja el punto de vista del visitante dentro del espacio.</span>
        <input data-control="cameraHeight" type="range" min="1.2" max="2.3" step="0.01" />
      </label>
      <label class="field">
        <span class="field__label">Look ahead <span class="field__value" data-value="lookAhead">3.2</span></span>
        <span class="field__hint">Decide cuánto anticipa la cámara el siguiente punto de interés.</span>
        <input data-control="lookAhead" type="range" min="0.8" max="7" step="0.1" />
      </label>
      <label class="field">
        <span class="field__label">Smoothing <span class="field__value" data-value="smoothing">0.16</span></span>
        <span class="field__hint">Suaviza la respuesta al scroll: más valor, movimiento más elástico.</span>
        <input data-control="smoothing" type="range" min="0.04" max="0.4" step="0.01" />
      </label>
      <label class="toggle">
        <span>
          Infinite loop
          <span class="field__hint">Activa el fundido blanco y la vuelta continua al inicio.</span>
        </span>
        <input data-control="loop" type="checkbox" />
      </label>
    </div>
  </form>
`;

const getNumber = (input: HTMLInputElement, fallback: number): number => {
  const value = Number(input.value);
  return Number.isFinite(value) ? value : fallback;
};

const formatNumber = (value: number): string =>
  Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, "");

export class GalleryPlaygroundElement extends HTMLElement {
  static observedAttributes = ["project"];

  private readonly form: HTMLFormElement;
  private readonly summary: HTMLElement;
  private readonly controls: Record<ControlName, HTMLInputElement | HTMLSelectElement>;
  private readonly valueLabels: Partial<Record<ControlName, HTMLElement>>;
  private currentProject: GalleryProject | null = null;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(playgroundTemplate.content.cloneNode(true));

    const form = shadow.querySelector("form");
    const summary = shadow.querySelector("[data-summary]");
    if (!(form instanceof HTMLFormElement) || !(summary instanceof HTMLElement)) {
      throw new Error("GalleryPlaygroundElement template was not created.");
    }

    this.form = form;
    this.summary = summary;
    this.controls = {
      primary: this.getControl("primary", HTMLSelectElement),
      quality: this.getControl("quality", HTMLSelectElement),
      spacing: this.getControl("spacing", HTMLInputElement),
      width: this.getControl("width", HTMLInputElement),
      height: this.getControl("height", HTMLInputElement),
      depth: this.getControl("depth", HTMLInputElement),
      fov: this.getControl("fov", HTMLInputElement),
      cameraHeight: this.getControl("cameraHeight", HTMLInputElement),
      lookAhead: this.getControl("lookAhead", HTMLInputElement),
      smoothing: this.getControl("smoothing", HTMLInputElement),
      loop: this.getControl("loop", HTMLInputElement),
    };
    this.valueLabels = {
      primary: this.getValueLabel("primary"),
      quality: this.getValueLabel("quality"),
      spacing: this.getValueLabel("spacing"),
      width: this.getValueLabel("width"),
      height: this.getValueLabel("height"),
      depth: this.getValueLabel("depth"),
      fov: this.getValueLabel("fov"),
      cameraHeight: this.getValueLabel("cameraHeight"),
      lookAhead: this.getValueLabel("lookAhead"),
      smoothing: this.getValueLabel("smoothing"),
    };
  }

  set project(project: GalleryProject | null) {
    this.currentProject = project;
    this.syncControlsFromProject();
  }

  get project(): GalleryProject | null {
    return this.currentProject;
  }

  connectedCallback(): void {
    this.currentProject = this.currentProject ?? this.parseProjectAttribute();
    this.form.addEventListener("input", this.handleControlsChange);
    this.form.addEventListener("change", this.handleControlsChange);
    this.syncControlsFromProject();
  }

  disconnectedCallback(): void {
    this.form.removeEventListener("input", this.handleControlsChange);
    this.form.removeEventListener("change", this.handleControlsChange);
  }

  attributeChangedCallback(name: string): void {
    if (name !== "project") {
      return;
    }

    this.currentProject = this.parseProjectAttribute();
    this.syncControlsFromProject();
  }

  private getControl<T extends HTMLInputElement | HTMLSelectElement>(
    name: ControlName,
    constructorType: { new (...args: never[]): T },
  ): T {
    const control = this.shadowRoot?.querySelector(`[data-control="${name}"]`);
    if (!(control instanceof constructorType)) {
      throw new Error(`GalleryPlaygroundElement control "${name}" was not created.`);
    }

    return control;
  }

  private getValueLabel(name: ControlName): HTMLElement | undefined {
    const label = this.shadowRoot?.querySelector(`[data-value="${name}"]`);
    return label instanceof HTMLElement ? label : undefined;
  }

  private syncControlsFromProject(): void {
    const project = this.currentProject;
    if (!project) {
      return;
    }

    const values = this.getValuesFromProject(project);
    this.writeValuesToControls(values);
    this.renderValues(values, project.items.length);
  }

  private getValuesFromProject(project: GalleryProject): GalleryPlaygroundValues {
    return {
      primary: project.theme.materials.primary,
      quality: project.theme.quality,
      spacing: project.layout.spacing ?? 14,
      width: project.layout.bounds?.width ?? 8,
      height: project.layout.bounds?.height ?? 4.2,
      depth: project.layout.bounds?.depth ?? 360,
      fov: project.journey.camera?.fov ?? 50,
      cameraHeight: project.journey.camera?.height ?? 1.72,
      lookAhead: project.journey.camera?.lookAhead ?? 3.2,
      smoothing: project.journey.smoothing ?? 0.16,
      loop: project.journey.loop ?? false,
    };
  }

  private writeValuesToControls(values: GalleryPlaygroundValues): void {
    this.controls.primary.value = values.primary;
    this.controls.quality.value = values.quality;
    this.controls.spacing.value = String(values.spacing);
    this.controls.width.value = String(values.width);
    this.controls.height.value = String(values.height);
    this.controls.depth.value = String(values.depth);
    this.controls.fov.value = String(values.fov);
    this.controls.cameraHeight.value = String(values.cameraHeight);
    this.controls.lookAhead.value = String(values.lookAhead);
    this.controls.smoothing.value = String(values.smoothing);
    (this.controls.loop as HTMLInputElement).checked = values.loop;
  }

  private readValuesFromControls(): GalleryPlaygroundValues {
    return {
      primary: this.controls.primary.value as MaterialFamily,
      quality: this.controls.quality.value as GalleryProject["theme"]["quality"],
      spacing: getNumber(this.controls.spacing as HTMLInputElement, 14),
      width: getNumber(this.controls.width as HTMLInputElement, 8),
      height: getNumber(this.controls.height as HTMLInputElement, 4.2),
      depth: getNumber(this.controls.depth as HTMLInputElement, 360),
      fov: getNumber(this.controls.fov as HTMLInputElement, 50),
      cameraHeight: getNumber(this.controls.cameraHeight as HTMLInputElement, 1.72),
      lookAhead: getNumber(this.controls.lookAhead as HTMLInputElement, 3.2),
      smoothing: getNumber(this.controls.smoothing as HTMLInputElement, 0.16),
      loop: (this.controls.loop as HTMLInputElement).checked,
    };
  }

  private buildProject(values: GalleryPlaygroundValues): GalleryProject | null {
    const project = this.currentProject;
    if (!project) {
      return null;
    }

    return {
      ...project,
      theme: {
        ...project.theme,
        quality: values.quality,
        materials: {
          ...project.theme.materials,
          primary: values.primary,
        },
      },
      layout: {
        ...project.layout,
        spacing: values.spacing,
        bounds: {
          ...project.layout.bounds,
          width: values.width,
          height: values.height,
          depth: values.depth,
        },
      },
      journey: {
        ...project.journey,
        loop: values.loop,
        smoothing: values.smoothing,
        camera: {
          ...project.journey.camera,
          fov: values.fov,
          height: values.cameraHeight,
          lookAhead: values.lookAhead,
        },
      },
    };
  }

  private renderValues(values: GalleryPlaygroundValues, itemCount: number): void {
    this.valueLabels.primary!.textContent = values.primary;
    this.valueLabels.quality!.textContent = values.quality;
    this.valueLabels.spacing!.textContent = formatNumber(values.spacing);
    this.valueLabels.width!.textContent = formatNumber(values.width);
    this.valueLabels.height!.textContent = formatNumber(values.height);
    this.valueLabels.depth!.textContent = formatNumber(values.depth);
    this.valueLabels.fov!.textContent = formatNumber(values.fov);
    this.valueLabels.cameraHeight!.textContent = formatNumber(values.cameraHeight);
    this.valueLabels.lookAhead!.textContent = formatNumber(values.lookAhead);
    this.valueLabels.smoothing!.textContent = formatNumber(values.smoothing);
    this.summary.textContent = `${itemCount} items · ${values.primary} · ${values.loop ? "loop" : "linear"}`;
  }

  private parseProjectAttribute(): GalleryProject | null {
    const rawProject = this.getAttribute("project");
    if (!rawProject) {
      return null;
    }

    return JSON.parse(rawProject) as GalleryProject;
  }

  private handleControlsChange = (): void => {
    const values = this.readValuesFromControls();
    const project = this.buildProject(values);
    if (!project) {
      return;
    }

    this.currentProject = project;
    this.renderValues(values, project.items.length);
    this.dispatchEvent(new CustomEvent<GalleryPlaygroundChangeDetail>(
      "gallery-playground-change",
      {
        detail: { project, values },
        bubbles: true,
        composed: true,
      },
    ));
  };
}

export const defineGalleryPlaygroundElement = (
  tagName = "gallery-playground",
): void => {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, GalleryPlaygroundElement);
  }
};

declare global {
  interface HTMLElementTagNameMap {
    "gallery-playground": GalleryPlaygroundElement;
  }

  interface HTMLElementEventMap {
    "gallery-playground-change": CustomEvent<GalleryPlaygroundChangeDetail>;
  }
}
