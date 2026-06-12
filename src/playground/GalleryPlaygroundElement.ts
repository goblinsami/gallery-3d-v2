import type { GalleryProject, MaterialFamily } from "../types/GalleryProject";
import type { ArtworkOverlayFramingMode } from "../types/Journey";
import { TEXTURE_FAMILY_OPTIONS } from "../config/architecturalTextureCatalog";

type ControlName =
  | "template"
  | "primary"
  | "quality"
  | "overlayFramingMode"
  | "showBorders"
  | "spacing"
  | "width"
  | "height"
  | "depth"
  | "wallTextureTiling"
  | "floorTextureTiling"
  | "ceilingTextureTiling"
  | "wallTextureDeformation"
  | "floorTextureDeformation"
  | "ceilingTextureDeformation"
  | "ceilingLightIntensity"
  | "ceilingLightRadius"
  | "fov"
  | "cameraHeight"
  | "lookAhead"
  | "desktopFramingDistance"
  | "mobileFramingDistance"
  | "mobileStationFramingDistance"
  | "smoothing"
  | "scrollStrength"
  | "mobileScrollStrength"
  | "loop"
  | "forceMobile";

export type PlaygroundTemplate = "default" | "reduced";
export type PlaygroundScrollStrength = "auto" | 0.5 | 0.75 | 1 | 1.5 | 2 | 3 | 4 | 5;

export interface GalleryPlaygroundValues {
  template: PlaygroundTemplate;
  primary: MaterialFamily;
  quality: GalleryProject["theme"]["quality"];
  overlayFramingMode: ArtworkOverlayFramingMode;
  showBorders: boolean;
  spacing: number;
  width: number;
  height: number;
  depth: number;
  wallTextureTiling: number;
  floorTextureTiling: number;
  ceilingTextureTiling: number;
  wallTextureDeformation: NonNullable<GalleryProject["theme"]["materials"]["textureTiling"]>["wallDeformation"];
  floorTextureDeformation: NonNullable<GalleryProject["theme"]["materials"]["textureTiling"]>["floorDeformation"];
  ceilingTextureDeformation: NonNullable<GalleryProject["theme"]["materials"]["textureTiling"]>["ceilingDeformation"];
  ceilingLightIntensity: number;
  ceilingLightRadius: number;
  fov: number;
  cameraHeight: number;
  lookAhead: number;
  desktopFramingDistance: number;
  mobileFramingDistance: number;
  mobileStationFramingDistance: number;
  smoothing: number;
  scrollStrength: PlaygroundScrollStrength;
  mobileScrollStrength: number;
  loop: boolean;
  forceMobile: boolean;
}

export interface GalleryPlaygroundChangeDetail {
  project: GalleryProject;
  values: GalleryPlaygroundValues;
}

const textureOptionsMarkup = TEXTURE_FAMILY_OPTIONS
  .map((option) => `<option value="${option.value}">${option.label}</option>`)
  .join("");

const getTextureLabel = (value: MaterialFamily): string =>
  TEXTURE_FAMILY_OPTIONS.find((option) => option.value === value)?.label ?? value;

const playgroundTemplate = document.createElement("template");
playgroundTemplate.innerHTML = `
  <style>
    :host {
      position: fixed;
      top: 12px;
      right: 12px;
      z-index: 40;
      width: min(300px, calc(100vw - 24px));
      max-height: calc(100dvh - 24px);
      color: #f8f2e8;
      font: 600 11px/1.2 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      letter-spacing: 0.04em;
    }

    .panel {
      box-sizing: border-box;
      display: grid;
      gap: 12px;
      max-height: inherit;
      padding: 12px;
      overflow-y: auto;
      overscroll-behavior: contain;
      scrollbar-gutter: stable;
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

    .header__top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .title {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }

    .panel-toggle {
      min-height: 26px;
      padding: 0 9px;
      border: 1px solid rgba(255, 248, 224, 0.2);
      border-radius: 999px;
      color: #fff8e8;
      background: rgba(255, 255, 255, 0.08);
      font: 700 10px/1 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
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

    :host([collapsed]) {
      width: auto;
      max-height: none;
    }

    :host([collapsed]) .panel {
      gap: 0;
      min-width: 176px;
      max-height: none;
      padding: 8px 10px;
      overflow: hidden;
    }

    :host([collapsed]) .summary,
    :host([collapsed]) .grid {
      display: none;
    }

    @media (max-width: 720px) {
      :host {
        top: auto;
        right: 10px;
        bottom: 10px;
        left: 10px;
        width: auto;
        max-height: 46vh;
      }

      .panel {
        max-height: inherit;
      }
    }
  </style>
  <form class="panel" aria-label="Gallery playground controls">
    <div class="header">
      <div class="header__top">
        <div class="title">Playground</div>
        <button class="panel-toggle" type="button" data-toggle-panel aria-expanded="true">Hide</button>
      </div>
      <div class="summary" data-summary>Waiting for project…</div>
    </div>
    <div class="grid">
      <label class="field">
        <span class="field__label">Template <span class="field__value" data-value="template">default</span></span>
        <span class="field__hint">Usa el recorrido completo o una version reducida de 3 items para depurar la journey.</span>
        <select data-control="template">
          <option value="default">Default</option>
          <option value="reduced">Reduced debug</option>
        </select>
      </label>
      <label class="field">
        <span class="field__label">Texture <span class="field__value" data-value="primary">Legacy stone</span></span>
        <span class="field__hint">Cambia el material arquitectónico base de paredes, suelo y atmósfera.</span>
        <select data-control="primary">
          ${textureOptionsMarkup}
        </select>
      </label>
      <label class="field">
        <span class="field__label">Quality <span class="field__value" data-value="quality">auto</span></span>
        <span class="field__hint">Ajusta el preset visual usado por geometría, sombras y coste de render.</span>
        <select data-control="quality">
          <option value="auto">Auto</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="ultra">Ultra</option>
        </select>
      </label>
      <label class="field">
        <span class="field__label">Overlay framing <span class="field__value" data-value="overlayFramingMode">balanced</span></span>
        <span class="field__hint">Define como se acerca la camara al abrir la ficha: frontal, equilibrado o cinematico.</span>
        <select data-control="overlayFramingMode">
          <option value="balanced">Balanced</option>
          <option value="frontal">Frontal</option>
          <option value="cinematic">Cinematic</option>
        </select>
      </label>
      <label class="toggle">
        <span>
          Item borders
          <span class="field__hint">Muestra u oculta marcos y bordes decorativos de las obras y paneles.</span>
        </span>
        <input data-control="showBorders" type="checkbox" />
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
        <span class="field__label">Wall tile <span class="field__value" data-value="wallTextureTiling">1</span></span>
        <span class="field__hint">Multiplica el tileado de la textura de las paredes.</span>
        <input data-control="wallTextureTiling" type="range" min="0.25" max="4" step="0.05" />
      </label>
      <label class="field">
        <span class="field__label">Wall shape <span class="field__value" data-value="wallTextureDeformation">stretched</span></span>
        <span class="field__hint">Elige si el tileado de pared se estira o conserva proporcion cuadrada.</span>
        <select data-control="wallTextureDeformation">
          <option value="stretched">Stretched</option>
          <option value="square">Square</option>
        </select>
      </label>
      <label class="field">
        <span class="field__label">Floor tile <span class="field__value" data-value="floorTextureTiling">1</span></span>
        <span class="field__hint">Multiplica el tileado de la textura del suelo.</span>
        <input data-control="floorTextureTiling" type="range" min="0.25" max="4" step="0.05" />
      </label>
      <label class="field">
        <span class="field__label">Floor shape <span class="field__value" data-value="floorTextureDeformation">stretched</span></span>
        <span class="field__hint">Elige si el tileado del suelo se estira o conserva proporcion cuadrada.</span>
        <select data-control="floorTextureDeformation">
          <option value="stretched">Stretched</option>
          <option value="square">Square</option>
        </select>
      </label>
      <label class="field">
        <span class="field__label">Ceiling tile <span class="field__value" data-value="ceilingTextureTiling">1</span></span>
        <span class="field__hint">Multiplica el tileado de la textura del techo.</span>
        <input data-control="ceilingTextureTiling" type="range" min="0.25" max="4" step="0.05" />
      </label>
      <label class="field">
        <span class="field__label">Ceiling shape <span class="field__value" data-value="ceilingTextureDeformation">stretched</span></span>
        <span class="field__hint">Elige si el tileado del techo se estira o conserva proporcion cuadrada.</span>
        <select data-control="ceilingTextureDeformation">
          <option value="stretched">Stretched</option>
          <option value="square">Square</option>
        </select>
      </label>
      <label class="field">
        <span class="field__label">Ceiling light <span class="field__value" data-value="ceilingLightIntensity">1</span></span>
        <span class="field__hint">Regula la intensidad de downlights, glow y rebote superior del techo.</span>
        <input data-control="ceilingLightIntensity" type="range" min="0" max="2.5" step="0.05" />
      </label>
      <label class="field">
        <span class="field__label">Light radius <span class="field__value" data-value="ceilingLightRadius">0.095</span></span>
        <span class="field__hint">Ajusta el tamano fisico del aro y nucleo de las luces superiores.</span>
        <input data-control="ceilingLightRadius" type="range" min="0.04" max="0.22" step="0.005" />
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
        <span class="field__label">Desktop frame <span class="field__value" data-value="desktopFramingDistance">1.18</span></span>
        <span class="field__hint">Aleja el encuadre desktop para incluir mas arquitectura y marcos de luz.</span>
        <input data-control="desktopFramingDistance" type="range" min="0.75" max="2.5" step="0.01" />
      </label>
      <label class="field">
        <span class="field__label">Mobile frame <span class="field__value" data-value="mobileFramingDistance">1</span></span>
        <span class="field__hint">Ajusta el encuadre mobile general de items de pared.</span>
        <input data-control="mobileFramingDistance" type="range" min="0.75" max="2.5" step="0.01" />
      </label>
      <label class="field">
        <span class="field__label">Mobile station <span class="field__value" data-value="mobileStationFramingDistance">1.55</span></span>
        <span class="field__hint">Aleja solo las estaciones centradas en mobile para evitar zoom excesivo.</span>
        <input data-control="mobileStationFramingDistance" type="range" min="0.75" max="3" step="0.01" />
      </label>
      <label class="field">
        <span class="field__label">Smoothing <span class="field__value" data-value="smoothing">0.16</span></span>
        <span class="field__hint">Suaviza la respuesta al scroll: más valor, movimiento más elástico.</span>
        <input data-control="smoothing" type="range" min="0.04" max="0.4" step="0.01" />
      </label>
      <label class="field">
        <span class="field__label">Scroll strength <span class="field__value" data-value="scrollStrength">auto</span></span>
        <span class="field__hint">Multiplica la fuerza del scroll. Auto mantiene el ritmo al usar templates reducidos.</span>
        <select data-control="scrollStrength">
          <option value="auto">Auto</option>
          <option value="0.5">0.5x</option>
          <option value="0.75">0.75x</option>
          <option value="1">1x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
          <option value="3">3x</option>
          <option value="4">4x</option>
          <option value="5">5x</option>
        </select>
      </label>
      <label class="field">
        <span class="field__label">Mobile scroll <span class="field__value" data-value="mobileScrollStrength">1.8</span></span>
        <span class="field__hint">Multiplica solo el gesto táctil en mobile para avanzar con menos arrastre.</span>
        <input data-control="mobileScrollStrength" type="range" min="0.5" max="4" step="0.1" />
      </label>
      <label class="toggle">
        <span>
          Infinite loop
          <span class="field__hint">Activa el fundido blanco y la vuelta continua al inicio.</span>
        </span>
        <input data-control="loop" type="checkbox" />
      </label>
      <label class="toggle">
        <span>
          Force mobile
          <span class="field__hint">Muestra la bottom sheet móvil aunque el viewport sea desktop.</span>
        </span>
        <input data-control="forceMobile" type="checkbox" />
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

const parseScrollStrength = (value: string): PlaygroundScrollStrength => {
  if (value === "auto") {
    return "auto";
  }

  const parsed = Number(value);
  return ([0.5, 0.75, 1, 1.5, 2, 3, 4, 5] as const).includes(parsed as Exclude<PlaygroundScrollStrength, "auto">)
    ? parsed as PlaygroundScrollStrength
    : "auto";
};

const formatScrollStrength = (value: PlaygroundScrollStrength): string =>
  value === "auto" ? "auto" : `${formatNumber(value)}x`;

export class GalleryPlaygroundElement extends HTMLElement {
  static observedAttributes = ["project"];

  private readonly form: HTMLFormElement;
  private readonly summary: HTMLElement;
  private readonly panelToggle: HTMLButtonElement;
  private readonly controls: Record<ControlName, HTMLInputElement | HTMLSelectElement>;
  private readonly valueLabels: Partial<Record<ControlName, HTMLElement>>;
  private currentProject: GalleryProject | null = null;
  private templateSourceItems: GalleryProject["items"] = [];
  private currentTemplate: PlaygroundTemplate = "default";

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(playgroundTemplate.content.cloneNode(true));

    const form = shadow.querySelector("form");
    const summary = shadow.querySelector("[data-summary]");
    const panelToggle = shadow.querySelector("[data-toggle-panel]");
    if (
      !(form instanceof HTMLFormElement) ||
      !(summary instanceof HTMLElement) ||
      !(panelToggle instanceof HTMLButtonElement)
    ) {
      throw new Error("GalleryPlaygroundElement template was not created.");
    }

    this.form = form;
    this.summary = summary;
    this.panelToggle = panelToggle;
    this.controls = {
      template: this.getControl("template", HTMLSelectElement),
      primary: this.getControl("primary", HTMLSelectElement),
      quality: this.getControl("quality", HTMLSelectElement),
      overlayFramingMode: this.getControl("overlayFramingMode", HTMLSelectElement),
      showBorders: this.getControl("showBorders", HTMLInputElement),
      spacing: this.getControl("spacing", HTMLInputElement),
      width: this.getControl("width", HTMLInputElement),
      height: this.getControl("height", HTMLInputElement),
      depth: this.getControl("depth", HTMLInputElement),
      wallTextureTiling: this.getControl("wallTextureTiling", HTMLInputElement),
      floorTextureTiling: this.getControl("floorTextureTiling", HTMLInputElement),
      ceilingTextureTiling: this.getControl("ceilingTextureTiling", HTMLInputElement),
      wallTextureDeformation: this.getControl("wallTextureDeformation", HTMLSelectElement),
      floorTextureDeformation: this.getControl("floorTextureDeformation", HTMLSelectElement),
      ceilingTextureDeformation: this.getControl("ceilingTextureDeformation", HTMLSelectElement),
      ceilingLightIntensity: this.getControl("ceilingLightIntensity", HTMLInputElement),
      ceilingLightRadius: this.getControl("ceilingLightRadius", HTMLInputElement),
      fov: this.getControl("fov", HTMLInputElement),
      cameraHeight: this.getControl("cameraHeight", HTMLInputElement),
      lookAhead: this.getControl("lookAhead", HTMLInputElement),
      desktopFramingDistance: this.getControl("desktopFramingDistance", HTMLInputElement),
      mobileFramingDistance: this.getControl("mobileFramingDistance", HTMLInputElement),
      mobileStationFramingDistance: this.getControl("mobileStationFramingDistance", HTMLInputElement),
      smoothing: this.getControl("smoothing", HTMLInputElement),
      scrollStrength: this.getControl("scrollStrength", HTMLSelectElement),
      mobileScrollStrength: this.getControl("mobileScrollStrength", HTMLInputElement),
      loop: this.getControl("loop", HTMLInputElement),
      forceMobile: this.getControl("forceMobile", HTMLInputElement),
    };
    this.valueLabels = {
      template: this.getValueLabel("template"),
      primary: this.getValueLabel("primary"),
      quality: this.getValueLabel("quality"),
      overlayFramingMode: this.getValueLabel("overlayFramingMode"),
      spacing: this.getValueLabel("spacing"),
      width: this.getValueLabel("width"),
      height: this.getValueLabel("height"),
      depth: this.getValueLabel("depth"),
      wallTextureTiling: this.getValueLabel("wallTextureTiling"),
      floorTextureTiling: this.getValueLabel("floorTextureTiling"),
      ceilingTextureTiling: this.getValueLabel("ceilingTextureTiling"),
      wallTextureDeformation: this.getValueLabel("wallTextureDeformation"),
      floorTextureDeformation: this.getValueLabel("floorTextureDeformation"),
      ceilingTextureDeformation: this.getValueLabel("ceilingTextureDeformation"),
      ceilingLightIntensity: this.getValueLabel("ceilingLightIntensity"),
      ceilingLightRadius: this.getValueLabel("ceilingLightRadius"),
      fov: this.getValueLabel("fov"),
      cameraHeight: this.getValueLabel("cameraHeight"),
      lookAhead: this.getValueLabel("lookAhead"),
      desktopFramingDistance: this.getValueLabel("desktopFramingDistance"),
      mobileFramingDistance: this.getValueLabel("mobileFramingDistance"),
      mobileStationFramingDistance: this.getValueLabel("mobileStationFramingDistance"),
      smoothing: this.getValueLabel("smoothing"),
      scrollStrength: this.getValueLabel("scrollStrength"),
      mobileScrollStrength: this.getValueLabel("mobileScrollStrength"),
    };
  }

  set project(project: GalleryProject | null) {
    this.currentProject = project;
    this.templateSourceItems = project?.items ?? [];
    this.currentTemplate = "default";
    this.syncControlsFromProject();
  }

  get project(): GalleryProject | null {
    return this.currentProject;
  }

  connectedCallback(): void {
    this.currentProject = this.currentProject ?? this.parseProjectAttribute();
    this.templateSourceItems = this.currentProject?.items ?? [];
    this.panelToggle.addEventListener("click", this.handlePanelToggleClick);
    this.form.addEventListener("input", this.handleControlsChange);
    this.form.addEventListener("change", this.handleControlsChange);
    this.syncControlsFromProject();
  }

  disconnectedCallback(): void {
    this.panelToggle.removeEventListener("click", this.handlePanelToggleClick);
    this.form.removeEventListener("input", this.handleControlsChange);
    this.form.removeEventListener("change", this.handleControlsChange);
  }

  attributeChangedCallback(name: string): void {
    if (name !== "project") {
      return;
    }

    this.currentProject = this.parseProjectAttribute();
    this.templateSourceItems = this.currentProject?.items ?? [];
    this.currentTemplate = "default";
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
      template: this.currentTemplate,
      primary: project.theme.materials.primary,
      quality: project.theme.quality,
      overlayFramingMode: project.journey.artworkOverlayFramingMode ?? "balanced",
      showBorders: project.theme.items?.showBorders ?? true,
      spacing: project.layout.spacing ?? 14,
      width: project.layout.bounds?.width ?? 8,
      height: project.layout.bounds?.height ?? 4.2,
      depth: project.layout.bounds?.depth ?? 360,
      wallTextureTiling: project.theme.materials.textureTiling?.wall ?? 1,
      floorTextureTiling: project.theme.materials.textureTiling?.floor ?? 1,
      ceilingTextureTiling: project.theme.materials.textureTiling?.ceiling ?? 1,
      wallTextureDeformation: project.theme.materials.textureTiling?.wallDeformation ?? "stretched",
      floorTextureDeformation: project.theme.materials.textureTiling?.floorDeformation ?? "stretched",
      ceilingTextureDeformation: project.theme.materials.textureTiling?.ceilingDeformation ?? "stretched",
      ceilingLightIntensity: project.theme.lighting?.ceilingLightIntensity ?? 1,
      ceilingLightRadius: project.theme.lighting?.ceilingLightRadius ?? 0.095,
      fov: project.journey.camera?.fov ?? 50,
      cameraHeight: project.journey.camera?.height ?? 1.72,
      lookAhead: project.journey.camera?.lookAhead ?? 3.2,
      desktopFramingDistance: project.journey.camera?.desktopFramingDistance ?? 1.18,
      mobileFramingDistance: project.journey.camera?.mobileFramingDistance ?? 1,
      mobileStationFramingDistance: project.journey.camera?.mobileStationFramingDistance ?? 1.55,
      smoothing: project.journey.smoothing ?? 0.16,
      scrollStrength: project.journey.scrollStrength ? parseScrollStrength(String(project.journey.scrollStrength)) : "auto",
      mobileScrollStrength: project.journey.mobileScrollStrength ?? 1.8,
      loop: project.journey.loop ?? false,
      forceMobile: (this.controls.forceMobile as HTMLInputElement).checked,
    };
  }

  private writeValuesToControls(values: GalleryPlaygroundValues): void {
    this.controls.template.value = values.template;
    this.controls.primary.value = values.primary;
    this.controls.quality.value = values.quality;
    this.controls.overlayFramingMode.value = values.overlayFramingMode;
    (this.controls.showBorders as HTMLInputElement).checked = values.showBorders;
    this.controls.spacing.value = String(values.spacing);
    this.controls.width.value = String(values.width);
    this.controls.height.value = String(values.height);
    this.controls.depth.value = String(values.depth);
    this.controls.wallTextureTiling.value = String(values.wallTextureTiling);
    this.controls.floorTextureTiling.value = String(values.floorTextureTiling);
    this.controls.ceilingTextureTiling.value = String(values.ceilingTextureTiling);
    this.controls.wallTextureDeformation.value = values.wallTextureDeformation ?? "stretched";
    this.controls.floorTextureDeformation.value = values.floorTextureDeformation ?? "stretched";
    this.controls.ceilingTextureDeformation.value = values.ceilingTextureDeformation ?? "stretched";
    this.controls.ceilingLightIntensity.value = String(values.ceilingLightIntensity);
    this.controls.ceilingLightRadius.value = String(values.ceilingLightRadius);
    this.controls.fov.value = String(values.fov);
    this.controls.cameraHeight.value = String(values.cameraHeight);
    this.controls.lookAhead.value = String(values.lookAhead);
    this.controls.desktopFramingDistance.value = String(values.desktopFramingDistance);
    this.controls.mobileFramingDistance.value = String(values.mobileFramingDistance);
    this.controls.mobileStationFramingDistance.value = String(values.mobileStationFramingDistance);
    this.controls.smoothing.value = String(values.smoothing);
    this.controls.scrollStrength.value = String(values.scrollStrength);
    this.controls.mobileScrollStrength.value = String(values.mobileScrollStrength);
    (this.controls.loop as HTMLInputElement).checked = values.loop;
    (this.controls.forceMobile as HTMLInputElement).checked = values.forceMobile;
  }

  private readValuesFromControls(): GalleryPlaygroundValues {
    return {
      template: this.controls.template.value as PlaygroundTemplate,
      primary: this.controls.primary.value as MaterialFamily,
      quality: this.controls.quality.value as GalleryProject["theme"]["quality"],
      overlayFramingMode: this.controls.overlayFramingMode.value as ArtworkOverlayFramingMode,
      showBorders: (this.controls.showBorders as HTMLInputElement).checked,
      spacing: getNumber(this.controls.spacing as HTMLInputElement, 14),
      width: getNumber(this.controls.width as HTMLInputElement, 8),
      height: getNumber(this.controls.height as HTMLInputElement, 4.2),
      depth: getNumber(this.controls.depth as HTMLInputElement, 360),
      wallTextureTiling: getNumber(this.controls.wallTextureTiling as HTMLInputElement, 1),
      floorTextureTiling: getNumber(this.controls.floorTextureTiling as HTMLInputElement, 1),
      ceilingTextureTiling: getNumber(this.controls.ceilingTextureTiling as HTMLInputElement, 1),
      wallTextureDeformation: this.controls.wallTextureDeformation.value === "square" ? "square" : "stretched",
      floorTextureDeformation: this.controls.floorTextureDeformation.value === "square" ? "square" : "stretched",
      ceilingTextureDeformation: this.controls.ceilingTextureDeformation.value === "square" ? "square" : "stretched",
      ceilingLightIntensity: getNumber(this.controls.ceilingLightIntensity as HTMLInputElement, 1),
      ceilingLightRadius: getNumber(this.controls.ceilingLightRadius as HTMLInputElement, 0.095),
      fov: getNumber(this.controls.fov as HTMLInputElement, 50),
      cameraHeight: getNumber(this.controls.cameraHeight as HTMLInputElement, 1.72),
      lookAhead: getNumber(this.controls.lookAhead as HTMLInputElement, 3.2),
      desktopFramingDistance: getNumber(this.controls.desktopFramingDistance as HTMLInputElement, 1.18),
      mobileFramingDistance: getNumber(this.controls.mobileFramingDistance as HTMLInputElement, 1),
      mobileStationFramingDistance: getNumber(this.controls.mobileStationFramingDistance as HTMLInputElement, 1.55),
      smoothing: getNumber(this.controls.smoothing as HTMLInputElement, 0.16),
      scrollStrength: parseScrollStrength(this.controls.scrollStrength.value),
      mobileScrollStrength: getNumber(this.controls.mobileScrollStrength as HTMLInputElement, 1.8),
      loop: (this.controls.loop as HTMLInputElement).checked,
      forceMobile: (this.controls.forceMobile as HTMLInputElement).checked,
    };
  }

  private buildProject(values: GalleryPlaygroundValues): GalleryProject | null {
    const project = this.currentProject;
    if (!project) {
      return null;
    }

    const sourceItems = this.templateSourceItems.length > 0 ? this.templateSourceItems : project.items;
    const items = values.template === "reduced"
      ? sourceItems.slice(0, 3)
      : sourceItems;
    const scrollStrength = values.scrollStrength === "auto"
      ? Math.min(6, Math.max(0.25, sourceItems.length / Math.max(1, items.length)))
      : values.scrollStrength;

    return {
      ...project,
      theme: {
        ...project.theme,
        quality: values.quality,
        materials: {
          ...project.theme.materials,
          primary: values.primary,
          textureTiling: {
            ...project.theme.materials.textureTiling,
            wall: values.wallTextureTiling,
            floor: values.floorTextureTiling,
            ceiling: values.ceilingTextureTiling,
            wallDeformation: values.wallTextureDeformation,
            floorDeformation: values.floorTextureDeformation,
            ceilingDeformation: values.ceilingTextureDeformation,
          },
        },
        lighting: {
          ...project.theme.lighting,
          ceilingLightIntensity: values.ceilingLightIntensity,
          ceilingLightRadius: values.ceilingLightRadius,
        },
        items: {
          ...project.theme.items,
          showBorders: values.showBorders,
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
        artworkOverlayFramingMode: values.overlayFramingMode,
        loop: values.loop,
        smoothing: values.smoothing,
        scrollStrength,
        mobileScrollStrength: values.mobileScrollStrength,
        camera: {
          ...project.journey.camera,
          fov: values.fov,
          height: values.cameraHeight,
          lookAhead: values.lookAhead,
          desktopFramingDistance: values.desktopFramingDistance,
          mobileFramingDistance: values.mobileFramingDistance,
          mobileStationFramingDistance: values.mobileStationFramingDistance,
        },
      },
      items,
    };
  }

  private renderValues(values: GalleryPlaygroundValues, itemCount: number): void {
    this.valueLabels.template!.textContent = values.template;
    this.valueLabels.primary!.textContent = getTextureLabel(values.primary);
    this.valueLabels.quality!.textContent = values.quality;
    this.valueLabels.overlayFramingMode!.textContent = values.overlayFramingMode;
    this.valueLabels.spacing!.textContent = formatNumber(values.spacing);
    this.valueLabels.width!.textContent = formatNumber(values.width);
    this.valueLabels.height!.textContent = formatNumber(values.height);
    this.valueLabels.depth!.textContent = formatNumber(values.depth);
    this.valueLabels.wallTextureTiling!.textContent = formatNumber(values.wallTextureTiling);
    this.valueLabels.floorTextureTiling!.textContent = formatNumber(values.floorTextureTiling);
    this.valueLabels.ceilingTextureTiling!.textContent = formatNumber(values.ceilingTextureTiling);
    this.valueLabels.wallTextureDeformation!.textContent = values.wallTextureDeformation ?? "stretched";
    this.valueLabels.floorTextureDeformation!.textContent = values.floorTextureDeformation ?? "stretched";
    this.valueLabels.ceilingTextureDeformation!.textContent = values.ceilingTextureDeformation ?? "stretched";
    this.valueLabels.ceilingLightIntensity!.textContent = formatNumber(values.ceilingLightIntensity);
    this.valueLabels.ceilingLightRadius!.textContent = formatNumber(values.ceilingLightRadius);
    this.valueLabels.fov!.textContent = formatNumber(values.fov);
    this.valueLabels.cameraHeight!.textContent = formatNumber(values.cameraHeight);
    this.valueLabels.lookAhead!.textContent = formatNumber(values.lookAhead);
    this.valueLabels.desktopFramingDistance!.textContent = formatNumber(values.desktopFramingDistance);
    this.valueLabels.mobileFramingDistance!.textContent = formatNumber(values.mobileFramingDistance);
    this.valueLabels.mobileStationFramingDistance!.textContent = formatNumber(values.mobileStationFramingDistance);
    this.valueLabels.smoothing!.textContent = formatNumber(values.smoothing);
    this.valueLabels.scrollStrength!.textContent = formatScrollStrength(values.scrollStrength);
    this.valueLabels.mobileScrollStrength!.textContent = formatNumber(values.mobileScrollStrength);
    this.summary.textContent = `${itemCount} items · ${getTextureLabel(values.primary)} · ${values.overlayFramingMode} · ${values.loop ? "loop" : "linear"}`;
  }

  private parseProjectAttribute(): GalleryProject | null {
    const rawProject = this.getAttribute("project");
    if (!rawProject) {
      return null;
    }

    return JSON.parse(rawProject) as GalleryProject;
  }

  private setPanelCollapsed(collapsed: boolean): void {
    this.toggleAttribute("collapsed", collapsed);
    this.panelToggle.textContent = collapsed ? "Show" : "Hide";
    this.panelToggle.setAttribute("aria-expanded", String(!collapsed));
  }

  private handlePanelToggleClick = (): void => {
    this.setPanelCollapsed(!this.hasAttribute("collapsed"));
  };

  private handleControlsChange = (): void => {
    const values = this.readValuesFromControls();
    const project = this.buildProject(values);
    if (!project) {
      return;
    }

    this.currentProject = project;
    this.currentTemplate = values.template;
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

