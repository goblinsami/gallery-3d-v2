import {
  ACESFilmicToneMapping,
  Color,
  Fog,
  Group,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Vector3,
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
const JOURNEY_ASPECT_EPSILON = 0.01;
const MOBILE_BREAKPOINT = 820;
const DESKTOP_PANEL_MAX_WIDTH = 468;
const DESKTOP_PANEL_MIN_WIDTH = 360;
const DESKTOP_PANEL_WIDTH_RATIO = 0.255;
const DESKTOP_PANEL_GAP = 32;

interface RenderViewport {
  x: number;
  y: number;
  width: number;
  height: number;
  aspect: number;
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
  private readonly projectedItemPoint = new Vector3();
  private renderViewport: RenderViewport | null = null;
  private effectiveRenderViewport: RenderViewport | null = null;
  private journeyViewportAspect = 16 / 9;
  private bottomSheetFocusItemId: string | null = null;
  private lastContainerWidth = 0;
  private lastContainerHeight = 0;

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
    this.renderer.domElement.style.maxWidth = "100%";
    this.renderer.domElement.style.maxHeight = "100%";
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
    this.bottomSheetFocusItemId = null;
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
    this.resize(true);
    const cameraState = this.getComposedCameraState(this.progress);
    this.applyCameraState(cameraState);
    return cameraState;
  }

  setBottomSheetFocus(itemId: string | null, state: BottomSheetState): CameraState {
    this.assertActive();
    this.bottomSheetFocusItemId = itemId;
    this.bottomSheetState = state;
    this.resize(true);
    const cameraState = this.getComposedCameraState(this.progress);
    this.applyCameraState(cameraState);
    return cameraState;
  }

  getClosestItemIdFromClientPoint(clientX: number, clientY: number): string | null {
    if (!this.camera || this.positionedItems.length === 0) {
      return null;
    }

    const rect = this.container.getBoundingClientRect();
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;
    const viewport = this.effectiveRenderViewport ?? this.renderViewport ?? {
      x: 0,
      y: 0,
      width: Math.max(1, Math.round(rect.width)),
      height: Math.max(1, Math.round(rect.height)),
      aspect: Math.max(1, Math.round(rect.width)) / Math.max(1, Math.round(rect.height)),
    };

    if (
      localX < viewport.x ||
      localX > viewport.x + viewport.width ||
      localY < viewport.y ||
      localY > viewport.y + viewport.height
    ) {
      return null;
    }

    const maxDistancePx = clamp(viewport.width * 0.2, 64, 180);
    let closestItemId: string | null = null;
    let closestScore = Number.POSITIVE_INFINITY;

    for (const item of this.getJourneyItemsForKeyframes()) {
      const projected = this.projectedItemPoint
        .set(item.focusTarget.x, item.focusTarget.y, item.focusTarget.z)
        .project(this.camera);

      if (
        !Number.isFinite(projected.x) ||
        !Number.isFinite(projected.y) ||
        !Number.isFinite(projected.z) ||
        projected.z < -1 ||
        projected.z > 1
      ) {
        continue;
      }

      const screenX = viewport.x + ((projected.x + 1) * 0.5) * viewport.width;
      const screenY = viewport.y + ((1 - projected.y) * 0.5) * viewport.height;
      const dx = localX - screenX;
      const dy = localY - screenY;
      const centerDistanceSq = dx * dx + dy * dy;
      const artworkScreenBounds = this.getProjectedItemScreenBounds(item, viewport);
      const distanceSq = artworkScreenBounds
        ? this.getDistanceToScreenBoundsSq(localX, localY, artworkScreenBounds)
        : centerDistanceSq;
      const captureRadiusSq = artworkScreenBounds ? 28 * 28 : maxDistancePx * maxDistancePx;
      if (distanceSq > captureRadiusSq && centerDistanceSq > maxDistancePx * maxDistancePx) {
        continue;
      }

      const score = (distanceSq + centerDistanceSq * 0.02) * (1 + Math.max(0, projected.z) * 0.35);
      if (score < closestScore) {
        closestScore = score;
        closestItemId = item.id.split("__loop_")[0];
      }
    }

    return closestItemId;
  }

  private getProjectedItemScreenBounds(
    item: PositionedGalleryItem,
    viewport: RenderViewport,
  ): { minX: number; maxX: number; minY: number; maxY: number } | null {
    if (!this.camera || !item.bounds) {
      return null;
    }

    const halfWidth = item.bounds.width * 0.5;
    const halfHeight = item.bounds.height * 0.5;
    const side = item.placement.side ?? "auto";
    const isWallItem = side !== "center";
    const corners = isWallItem
      ? [
          { x: item.focusTarget.x, y: item.focusTarget.y - halfHeight, z: item.focusTarget.z - halfWidth },
          { x: item.focusTarget.x, y: item.focusTarget.y - halfHeight, z: item.focusTarget.z + halfWidth },
          { x: item.focusTarget.x, y: item.focusTarget.y + halfHeight, z: item.focusTarget.z - halfWidth },
          { x: item.focusTarget.x, y: item.focusTarget.y + halfHeight, z: item.focusTarget.z + halfWidth },
        ]
      : [
          { x: item.focusTarget.x - halfWidth, y: item.focusTarget.y - halfHeight, z: item.focusTarget.z },
          { x: item.focusTarget.x + halfWidth, y: item.focusTarget.y - halfHeight, z: item.focusTarget.z },
          { x: item.focusTarget.x - halfWidth, y: item.focusTarget.y + halfHeight, z: item.focusTarget.z },
          { x: item.focusTarget.x + halfWidth, y: item.focusTarget.y + halfHeight, z: item.focusTarget.z },
        ];
    const points = corners
      .map((corner) => this.projectedItemPoint
        .set(corner.x, corner.y, corner.z)
        .project(this.camera as PerspectiveCamera)
        .clone())
      .filter((point) =>
        Number.isFinite(point.x) &&
        Number.isFinite(point.y) &&
        Number.isFinite(point.z) &&
        point.z >= -1 &&
        point.z <= 1,
      );

    if (points.length < 2) {
      return null;
    }

    const screenPoints = points.map((point) => ({
      x: viewport.x + ((point.x + 1) * 0.5) * viewport.width,
      y: viewport.y + ((1 - point.y) * 0.5) * viewport.height,
    }));

    return screenPoints.reduce(
      (bounds, point) => ({
        minX: Math.min(bounds.minX, point.x),
        maxX: Math.max(bounds.maxX, point.x),
        minY: Math.min(bounds.minY, point.y),
        maxY: Math.max(bounds.maxY, point.y),
      }),
      {
        minX: Number.POSITIVE_INFINITY,
        maxX: Number.NEGATIVE_INFINITY,
        minY: Number.POSITIVE_INFINITY,
        maxY: Number.NEGATIVE_INFINITY,
      },
    );
  }

  private getDistanceToScreenBoundsSq(
    x: number,
    y: number,
    bounds: { minX: number; maxX: number; minY: number; maxY: number },
  ): number {
    const dx = x < bounds.minX ? bounds.minX - x : x > bounds.maxX ? x - bounds.maxX : 0;
    const dy = y < bounds.minY ? bounds.minY - y : y > bounds.maxY ? y - bounds.maxY : 0;
    return dx * dx + dy * dy;
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
    this.bottomSheetFocusItemId = null;
    this.renderViewport = null;
    this.effectiveRenderViewport = null;
    this.journeyViewportAspect = 16 / 9;
    this.lastContainerWidth = 0;
    this.lastContainerHeight = 0;
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
    this.journeyViewportAspect = this.getViewportAspect();
    const context = {
      viewportAspect: this.journeyViewportAspect,
      qualityScale: this.quality.geometryDetail,
    };
    this.positionedItems = this.layouts
      .get(this.project.layout.type)
      .layout(this.project, this.project.layout, context);
    this.rebuildKeyframes();
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
        showItemBorders: this.project.theme.items?.showBorders ?? true,
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
    const focusItemId = this.bottomSheetState === "collapsed"
      ? baseState.activeItemId
      : this.bottomSheetFocusItemId ?? baseState.activeItemId;
    const activeItem = focusItemId ? this.findPositionedItemById(focusItemId) : null;
    return composeBottomSheetCamera(baseState, activeItem, this.bottomSheetState, {
      fov: this.project.journey.camera?.fov ?? 50,
      viewportAspect: this.effectiveRenderViewport?.aspect ?? this.journeyViewportAspect,
      overlayDistanceScale: this.project.journey.artworkOverlayAngleDistanceScale,
      overlayDistanceMin: this.project.journey.artworkOverlayAngleDistanceMin,
      overlayDistanceMax: this.project.journey.artworkOverlayAngleDistanceMax,
      overlayForwardOffset: this.project.journey.artworkOverlayForwardOffset,
    });
  }

  private findPositionedItemById(itemId: string): PositionedGalleryItem | null {
    const sourceId = itemId.split("__loop_")[0];
    return this.positionedItems.find((item) => item.id === itemId || item.id.split("__loop_")[0] === sourceId) ?? null;
  }

  private rebuildKeyframes(): void {
    const journeyItems = this.getJourneyItemsForKeyframes();
    this.keyframes = buildCameraKeyframes(journeyItems, {
      cameraHeight: this.project.journey.camera?.height ?? 1.7,
      lookAhead: this.project.journey.camera?.lookAhead ?? 2.2,
      fov: this.project.journey.camera?.fov ?? 50,
      viewportAspect: this.journeyViewportAspect,
    });
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
    this.renderer.setScissorTest(false);
    this.renderer.clear(true, true, true);
    const viewport = this.effectiveRenderViewport;
    if (viewport) {
      this.applyRendererViewport(viewport);
    }
    this.renderer.render(this.scene, this.camera);
  };

  private resize(force = false): void {
    if (!this.renderer || !this.camera || !this.quality) {
      return;
    }

    const width = Math.max(1, this.container.clientWidth || window.innerWidth);
    const height = Math.max(1, this.container.clientHeight || window.innerHeight);
    const nextViewport = this.calculateRenderViewport(width, height);
    const effectiveViewport = this.resolveEffectiveRenderViewport(nextViewport);
    const changed =
      force ||
      width !== this.lastContainerWidth ||
      height !== this.lastContainerHeight ||
      !this.effectiveRenderViewport ||
      effectiveViewport.x !== this.effectiveRenderViewport.x ||
      effectiveViewport.y !== this.effectiveRenderViewport.y ||
      effectiveViewport.width !== this.effectiveRenderViewport.width ||
      effectiveViewport.height !== this.effectiveRenderViewport.height;

    if (!changed) {
      return;
    }

    this.lastContainerWidth = width;
    this.lastContainerHeight = height;
    this.renderViewport = nextViewport;
    this.effectiveRenderViewport = effectiveViewport;
    this.camera.aspect = effectiveViewport.aspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.quality.pixelRatioCap, 2));
    this.renderer.setSize(width, height, false);
    this.applyRendererViewport(effectiveViewport);
    this.container.style.setProperty("--gallery-vp-left", `${effectiveViewport.x}px`);
    this.container.style.setProperty("--gallery-vp-top", `${effectiveViewport.y}px`);
    this.container.style.setProperty("--gallery-vp-right", `${Math.max(0, width - (effectiveViewport.x + effectiveViewport.width))}px`);
    this.container.style.setProperty("--gallery-vp-bottom", `${Math.max(0, height - (effectiveViewport.y + effectiveViewport.height))}px`);

    if (Math.abs(effectiveViewport.aspect - this.journeyViewportAspect) >= JOURNEY_ASPECT_EPSILON) {
      this.journeyViewportAspect = effectiveViewport.aspect;
      this.rebuildKeyframes();
      this.applyCameraState(this.getComposedCameraState(this.progress));
    }
  }

  private getViewportAspect(): number {
    const width = Math.max(1, this.container.clientWidth || window.innerWidth);
    const height = Math.max(1, this.container.clientHeight || window.innerHeight);
    return width / height;
  }

  private calculateRenderViewport(width: number, height: number): RenderViewport {
    return {
      x: 0,
      y: 0,
      width,
      height,
      aspect: width / height,
    };
  }

  private resolveEffectiveRenderViewport(baseViewport: RenderViewport): RenderViewport {
    if (this.bottomSheetState === "collapsed") {
      return baseViewport;
    }

    const isMobileViewport = this.isMobileViewport();
    if (!isMobileViewport) {
      const panelWidth = clamp(
        baseViewport.width * DESKTOP_PANEL_WIDTH_RATIO,
        DESKTOP_PANEL_MIN_WIDTH,
        DESKTOP_PANEL_MAX_WIDTH,
      );
      const x = Math.min(baseViewport.width - 1, Math.round(panelWidth + DESKTOP_PANEL_GAP));
      const width = Math.max(1, baseViewport.width - x);
      return {
        x,
        y: 0,
        width,
        height: baseViewport.height,
        aspect: width / baseViewport.height,
      };
    }

    const visibleRatio = this.getVisibleRatioForBottomSheet(isMobileViewport);
    if (visibleRatio >= 0.999) {
      return baseViewport;
    }

    const croppedHeight = Math.max(1, Math.round(baseViewport.height * visibleRatio));
    return {
      x: baseViewport.x,
      y: baseViewport.y,
      width: baseViewport.width,
      height: croppedHeight,
      aspect: baseViewport.width / croppedHeight,
    };
  }

  private getVisibleRatioForBottomSheet(isMobileViewport: boolean): number {
    if (this.bottomSheetState === "full") {
      return isMobileViewport ? 0.2 : 1;
    }

    if (this.bottomSheetState === "half") {
      return isMobileViewport ? 0.82 : 1;
    }

    return 1;
  }

  private isMobileViewport(): boolean {
    const root = this.container.getRootNode();
    const host = root instanceof ShadowRoot ? root.host : null;
    return this.container.clientWidth <= MOBILE_BREAKPOINT ||
      (host instanceof HTMLElement && host.hasAttribute("force-mobile"));
  }

  private applyRendererViewport(viewport: RenderViewport): void {
    if (!this.renderer) {
      return;
    }

    const rendererY = Math.max(0, this.lastContainerHeight - (viewport.y + viewport.height));
    this.renderer.setViewport(viewport.x, rendererY, viewport.width, viewport.height);
    this.renderer.setScissor(viewport.x, rendererY, viewport.width, viewport.height);
    this.renderer.setScissorTest(true);
  }

  private assertActive(): void {
    if (this.disposed) {
      throw new Error("GalleryEngine has been disposed.");
    }
  }
}
