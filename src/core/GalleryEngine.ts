import {
  ACESFilmicToneMapping,
  Color,
  Fog,
  Group,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from "three";
import type { BottomSheetState, CameraKeyframe, CameraState, JourneyState } from "../types/Journey";
import type { GalleryProject, ValidatedGalleryProject } from "../types/GalleryProject";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { QualitySettings } from "../types/Quality";
import type { LayoutRegistry, RendererRegistry } from "./Registry";
import { buildCameraKeyframes } from "../journey/cameraKeyframes";
import { composeBottomSheetCamera } from "../journey/composeBottomSheetCamera";
import { createArchitectureShell } from "./createArchitectureShell";
import { disposeObject3D } from "./disposeObject3D";
import { getCameraStateAtProgress } from "../journey/getCameraStateAtProgress";
import { getDeviceProfile, resolveQuality } from "../utils/resolveQuality";
import { AssetManager } from "./AssetManager";
import { RenderScheduler } from "./RenderScheduler";
import { ResourceLibrary } from "./ResourceLibrary";
import { clamp } from "../utils/clamp";
import { validateGalleryProject } from "../utils/validateGalleryProject";

export interface GalleryEngineOptions {
  container: HTMLElement;
  project: GalleryProject;
  renderers: RendererRegistry;
  layouts: LayoutRegistry;
  assetBaseUrl?: string;
}

const BASE_BACKGROUND_COLOR = "#28251f";
const BASE_FOG_COLOR = "#28251f";
const LOOP_WHITE_COLOR = "#ffffff";
const BASE_FOG_NEAR = 30;
const BASE_FOG_FAR = 108;
const LOOP_FOG_NEAR_PULL = 34;
const LOOP_FOG_FAR_PULL = 46;
const JOURNEY_PROGRESS_EPSILON = 0.000001;
const LOOP_WHITE_MIX_EPSILON = 0.000001;

export class GalleryEngine {
  private readonly container: HTMLElement;
  private readonly renderers: RendererRegistry;
  private readonly layouts: LayoutRegistry;
  private readonly assetBaseUrl?: string;
  private project: ValidatedGalleryProject;
  private quality: QualitySettings | null = null;
  private scene: Scene | null = null;
  private camera: PerspectiveCamera | null = null;
  private renderer: WebGLRenderer | null = null;
  private sceneRoot: Group | null = null;
  private assets: AssetManager | null = null;
  private scheduler: RenderScheduler | null = null;
  private keyframes: CameraKeyframe[] = [];
  private positionedItems: PositionedGalleryItem[] = [];
  private progress = 0;
  private loopWhiteMix = 0;
  private buildSerial = 0;
  private bottomSheetState: BottomSheetState = "collapsed";
  private disposed = false;
  private baseFogNear = BASE_FOG_NEAR;
  private baseFogFar = BASE_FOG_FAR;
  private readonly whiteColor = new Color(LOOP_WHITE_COLOR);
  private readonly baseBackgroundColor = new Color(BASE_BACKGROUND_COLOR);
  private readonly baseFogColor = new Color(BASE_FOG_COLOR);
  private readonly mixedBackgroundColor = new Color(BASE_BACKGROUND_COLOR);
  private readonly mixedFogColor = new Color(BASE_FOG_COLOR);

  constructor(options: GalleryEngineOptions) {
    this.container = options.container;
    this.renderers = options.renderers;
    this.layouts = options.layouts;
    this.assetBaseUrl = options.assetBaseUrl;
    this.project = validateGalleryProject(options.project);
  }

  async init(): Promise<void> {
    this.assertActive();
    this.quality = resolveQuality(this.project.theme.quality, getDeviceProfile());
    this.scene = new Scene();
    this.scene.background = new Color(BASE_BACKGROUND_COLOR);
    this.scene.fog = new Fog(BASE_FOG_COLOR, BASE_FOG_NEAR, BASE_FOG_FAR);
    this.resetAtmosphereBase();
    this.camera = new PerspectiveCamera(this.project.journey.camera?.fov ?? 52, 1, 0.1, 160);
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: this.quality.preset !== "low",
      powerPreference: "high-performance",
    });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = this.quality.preset === "low" ? 1.18 : 1.34;
    this.renderer.shadowMap.enabled = this.quality.shadows;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.domElement.style.display = "block";
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
    this.container.appendChild(this.renderer.domElement);
    this.scheduler = new RenderScheduler({
      container: this.container,
      onRender: this.renderFrame,
      onResize: this.resize,
    });
    this.scheduler.start();
    await this.rebuildScene();
    this.resize();
    this.setProgress(0);
  }

  async updateProject(project: GalleryProject): Promise<void> {
    this.assertActive();
    this.project = validateGalleryProject(project);
    this.quality = resolveQuality(this.project.theme.quality, getDeviceProfile());
    this.loopWhiteMix = 0;
    this.resetAtmosphereBase();
    await this.rebuildScene();
    this.resize();
    this.setProgress(0);
  }

  applyJourneyState(state: JourneyState): void {
    this.assertActive();
    this.applyCameraState(state.camera);
  }

  setProgress(progress: number): CameraState {
    return this.setJourneyState(progress, this.loopWhiteMix);
  }

  setJourneyState(progress: number, whiteMix: number): CameraState {
    this.assertActive();
    const clampedProgress = clamp(progress, 0, 1);
    const clampedWhiteMix = this.project.journey.loop ? clamp(whiteMix, 0, 1) : 0;
    const progressChanged = Math.abs(clampedProgress - this.progress) > JOURNEY_PROGRESS_EPSILON;
    const whiteMixChanged = Math.abs(clampedWhiteMix - this.loopWhiteMix) > LOOP_WHITE_MIX_EPSILON;
    this.progress = clampedProgress;
    this.loopWhiteMix = clampedWhiteMix;
    const cameraState = this.getComposedCameraState(clampedProgress);
    this.applyAtmosphere(clampedWhiteMix);
    this.applyCameraState(cameraState);
    if (whiteMixChanged && !progressChanged) {
      this.invalidate("loop-white-mix");
    }
    return cameraState;
  }

  setBottomSheetState(state: BottomSheetState): CameraState {
    this.assertActive();
    this.bottomSheetState = state;
    const cameraState = this.getComposedCameraState(this.progress);
    this.applyCameraState(cameraState);
    return cameraState;
  }

  invalidate(_reason: string): void {
    this.assertActive();
    this.scheduler?.invalidate(_reason);
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;
    this.scheduler?.dispose();

    if (this.sceneRoot) {
      disposeObject3D(this.sceneRoot);
      this.scene?.remove(this.sceneRoot);
    }
    this.assets?.dispose();

    this.renderer?.dispose();
    if (this.renderer?.domElement.parentElement === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.sceneRoot = null;
    this.assets = null;
    this.scheduler = null;
    this.keyframes = [];
    this.positionedItems = [];
    this.loopWhiteMix = 0;
    this.bottomSheetState = "collapsed";
  }

  private async rebuildScene(): Promise<void> {
    if (!this.scene || !this.quality) {
      return;
    }

    const buildId = this.buildSerial + 1;
    this.buildSerial = buildId;

    if (this.sceneRoot) {
      disposeObject3D(this.sceneRoot);
      this.scene.remove(this.sceneRoot);
    }

    const root = new Group();
    const resources = new ResourceLibrary();
    this.assets?.dispose();
    this.assets = new AssetManager({
      quality: this.quality,
      assetBaseUrl: this.assetBaseUrl,
    });
    const context = {
      viewportAspect: this.getViewportAspect(),
      qualityScale: this.quality.geometryDetail,
    };
    this.positionedItems = this.layouts
      .get(this.project.layout.type)
      .layout(this.project, this.project.layout, context);
    const journeyItems = this.getJourneyItemsForKeyframes();
    this.keyframes = buildCameraKeyframes(journeyItems, {
      cameraHeight: this.project.journey.camera?.height ?? 1.7,
      lookAhead: this.project.journey.camera?.lookAhead ?? 2.2,
    });
    root.add(await createArchitectureShell(
      this.project.layout,
      this.quality,
      this.project.theme.materials.primary,
      this.project.theme.lighting?.ceilingLightIntensity,
    ));

    const itemObjects = await Promise.all(this.positionedItems.map((item) => {
      const itemRenderer = this.renderers.get(item.type);
      return itemRenderer.create(item, {
        quality: this.quality as QualitySettings,
        resources,
        assets: this.assets as AssetManager,
        assetBaseUrl: this.assetBaseUrl,
      });
    }));
    itemObjects.forEach((object) => root.add(object));

    if (this.disposed || buildId !== this.buildSerial || !this.scene) {
      disposeObject3D(root);
      return;
    }

    this.sceneRoot = root;
    this.scene.add(root);
    this.invalidate("scene-rebuild");
  }

  private applyCameraState(state: CameraState): void {
    if (!this.camera) {
      return;
    }

    this.camera.position.set(state.position.x, state.position.y, state.position.z);
    this.camera.lookAt(state.lookAt.x, state.lookAt.y, state.lookAt.z);
    this.invalidate("camera-state");
  }

  private resetAtmosphereBase(): void {
    this.baseBackgroundColor.set(BASE_BACKGROUND_COLOR);
    this.baseFogColor.set(BASE_FOG_COLOR);
    this.baseFogNear = BASE_FOG_NEAR;
    this.baseFogFar = BASE_FOG_FAR;
  }

  private applyAtmosphere(whiteMix: number): void {
    if (!this.scene || !this.renderer) {
      return;
    }

    this.mixedBackgroundColor.copy(this.baseBackgroundColor).lerp(this.whiteColor, whiteMix);
    this.mixedFogColor.copy(this.baseFogColor).lerp(this.whiteColor, whiteMix);

    if (this.scene.background instanceof Color) {
      this.scene.background.copy(this.mixedBackgroundColor);
    } else {
      this.scene.background = this.mixedBackgroundColor.clone();
    }

    if (this.scene.fog instanceof Fog) {
      this.scene.fog.color.copy(this.mixedFogColor);
      this.scene.fog.near = Math.max(0, this.baseFogNear - whiteMix * LOOP_FOG_NEAR_PULL);
      this.scene.fog.far = Math.max(
        this.scene.fog.near + 1,
        this.baseFogFar - whiteMix * LOOP_FOG_FAR_PULL,
      );
    }

    this.renderer.setClearColor(this.mixedBackgroundColor, 0);
  }

  private getComposedCameraState(progress: number): CameraState {
    const baseState = getCameraStateAtProgress(this.keyframes, progress);
    const activeItem = this.positionedItems.find((item) => item.id === baseState.activeItemId) ?? null;
    return composeBottomSheetCamera(baseState, activeItem, this.bottomSheetState);
  }

  private getJourneyItemsForKeyframes(): PositionedGalleryItem[] {
    if (!this.project.journey.loop) {
      return this.positionedItems;
    }

    const firstLoopCloneIndex = this.positionedItems.findIndex((item) => item.id.includes("__loop_"));
    return firstLoopCloneIndex > 0
      ? this.positionedItems.slice(0, firstLoopCloneIndex)
      : this.positionedItems;
  }

  private renderFrame = (): void => {
    if (!this.renderer || !this.scene || !this.camera) {
      return;
    }

    this.resize();
    this.renderer.render(this.scene, this.camera);
  };

  private resize(): void {
    if (!this.renderer || !this.camera || !this.quality) {
      return;
    }

    const width = Math.max(1, this.container.clientWidth || window.innerWidth);
    const height = Math.max(1, this.container.clientHeight || window.innerHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.quality.pixelRatioCap, 2));
    this.renderer.setSize(width, height, false);
  }

  private getViewportAspect(): number {
    const width = Math.max(1, this.container.clientWidth || window.innerWidth);
    const height = Math.max(1, this.container.clientHeight || window.innerHeight);
    return width / height;
  }

  private assertActive(): void {
    if (this.disposed) {
      throw new Error("GalleryEngine has been disposed.");
    }
  }
}
