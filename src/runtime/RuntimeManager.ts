import { GalleryEngine } from "../core/GalleryEngine";
import { JourneyController } from "../journey/JourneyController";
import { buildItemProgressMap, getAdjacentItemProgress, getItemProgress } from "../journey/itemProgress";
import { BottomSheetController } from "./BottomSheetController";
import type { LayoutRegistry, RendererRegistry } from "../core/Registry";
import type { GalleryProject, ValidatedGalleryProject } from "../types/GalleryProject";
import type { BottomSheetState } from "../types/Journey";
import type { RuntimeState, RuntimeStateListener } from "../types/Runtime";
import type { RuntimeInstance, RuntimeMountOptions } from "../types/Runtime";
import { validateGalleryProject } from "../utils/validateGalleryProject";

export interface RuntimeManagerOptions {
  renderers: RendererRegistry;
  layouts: LayoutRegistry;
}

export class RuntimeManager {
  private readonly renderers: RendererRegistry;
  private readonly layouts: LayoutRegistry;

  constructor(options: RuntimeManagerOptions) {
    this.renderers = options.renderers;
    this.layouts = options.layouts;
  }

  async mount(options: RuntimeMountOptions): Promise<RuntimeInstance> {
    let currentProject = validateGalleryProject(options.project);
    let itemProgress = buildItemProgressMap(currentProject.items);
    let controller: JourneyController | null = null;
    let runtimeState: RuntimeState = {
      progress: 0,
      activeItemId: null,
    };
    const stateListeners = new Set<RuntimeStateListener>();
    const bottomSheet = new BottomSheetController();
    const engine = new GalleryEngine({
      container: options.container,
      project: currentProject,
      renderers: this.renderers,
      layouts: this.layouts,
      assetBaseUrl: options.assetBaseUrl,
    });
    await engine.init();
    const syncProgress = (progress: number): void => {
      const state = engine.setProgress(progress);
      runtimeState = {
        progress,
        activeItemId: state.activeItemId,
      };
      const activeSourceId = state.activeItemId?.split("__loop_")[0] ?? null;
      bottomSheet.setActiveItem(
        currentProject.items.find((item) => item.id === activeSourceId) ?? null,
      );
      stateListeners.forEach((listener) => listener(runtimeState));
    };
    const setRuntimeProgress = (progress: number): void => {
      controller?.setProgress(progress);
      if (!controller) {
        syncProgress(progress);
      }
    };
    const createJourneyController = (project: ValidatedGalleryProject): JourneyController | null => {
      if (project.journey.mode !== "scroll" || options.autoStartJourney === false) {
        return null;
      }

      return new JourneyController({
        element: options.scrollElement ?? options.container,
        smoothing: project.journey.smoothing,
        damping: project.journey.damping,
        loop: project.journey.loop,
        onProgress: syncProgress,
      });
    };
    const resetJourneyController = (project: ValidatedGalleryProject): void => {
      controller?.dispose();
      controller = createJourneyController(project);
      controller?.start();
    };

    resetJourneyController(currentProject);
    syncProgress(0);

    return {
      updateProject: async (project: GalleryProject) => {
        currentProject = validateGalleryProject(project);
        itemProgress = buildItemProgressMap(currentProject.items);
        await engine.updateProject(currentProject);
        resetJourneyController(currentProject);
        syncProgress(0);
      },
      setProgress: setRuntimeProgress,
      focusItem: (itemId: string) => {
        const progress = getItemProgress(itemProgress, itemId);
        if (progress === null) {
          return false;
        }

        setRuntimeProgress(progress);
        return true;
      },
      nextItem: () => {
        const next = getAdjacentItemProgress(itemProgress, bottomSheet.getModel().activeItemId, 1);
        if (!next) {
          return false;
        }

        setRuntimeProgress(next.progress);
        return true;
      },
      previousItem: () => {
        const previous = getAdjacentItemProgress(itemProgress, bottomSheet.getModel().activeItemId, -1);
        if (!previous) {
          return false;
        }

        setRuntimeProgress(previous.progress);
        return true;
      },
      setBottomSheetState: (state: BottomSheetState) => {
        bottomSheet.setState(state);
        engine.setBottomSheetState(state);
      },
      getState: () => runtimeState,
      subscribeState: (listener) => {
        stateListeners.add(listener);
        listener(runtimeState);
        return () => {
          stateListeners.delete(listener);
        };
      },
      getContentSurface: () => bottomSheet.getModel(),
      subscribeContentSurface: (listener) => bottomSheet.subscribe(listener),
      dispose: () => {
        controller?.dispose();
        stateListeners.clear();
        engine.dispose();
      },
    };
  }
}
