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
import { validateGalleryProject } from "../utils/validateGalleryProject";

export interface GalleryEngineOptions {
  container: HTMLElement;
  project: GalleryProject;
  renderers: RendererRegistry;
  layouts: LayoutRegistry;
  assetBaseUrl?: string;
}

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
  private buildSerial = 0;
  private bottomSheetState: BottomSheetState = "collapsed";
  private disposed = false;

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
    this.scene.background = new Color("#28251f");
    this.scene.fog = new Fog("#28251f", 30, 108);
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
    await this.rebuildScene();
    this.resize();
    this.setProgress(0);
  }

  applyJourneyState(state: JourneyState): void {
    this.assertActive();
    this.applyCameraState(state.camera);
  }

  setProgress(progress: number): CameraState {
    this.assertActive();
    this.progress = progress;
    const cameraState = this.getComposedCameraState(progress);
    this.applyCameraState(cameraState);
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
    this.keyframes = buildCameraKeyframes(this.positionedItems, {
      cameraHeight: this.project.journey.camera?.height ?? 1.7,
      lookAhead: this.project.journey.camera?.lookAhead ?? 2.2,
    });
    root.add(await createArchitectureShell(this.project.layout, this.quality));

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

  private getComposedCameraState(progress: number): CameraState {
    const baseState = getCameraStateAtProgress(this.keyframes, progress);
    const activeItem = this.positionedItems.find((item) => item.id === baseState.activeItemId) ?? null;
    return composeBottomSheetCamera(baseState, activeItem, this.bottomSheetState);
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
