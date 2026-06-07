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

const BASE_SCROLL_SENSITIVITY = 0.00028;

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
      whiteMix: 0,
      activeItemId: null,
    };
    let selectedSourceItemId: string | null = currentProject.items[0]?.id ?? null;
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
    const getSourceItem = (itemId: string | null) =>
      itemId
        ? currentProject.items.find((item) => item.id === itemId.split("__loop_")[0]) ?? null
        : null;
    const getSelectedItem = () => getSourceItem(selectedSourceItemId);
    const syncBottomSheetFocus = (): void => {
      controller?.setInteractionEnabled(bottomSheet.getModel().state === "collapsed");
      engine.setBottomSheetFocus(selectedSourceItemId, bottomSheet.getModel().state);
    };
    const selectSourceItem = (itemId: string, state: BottomSheetState): boolean => {
      const sourceItem = getSourceItem(itemId);
      if (!sourceItem) {
        return false;
      }

      selectedSourceItemId = sourceItem.id;
      bottomSheet.setActiveItem(sourceItem);
      bottomSheet.setState(state);
      syncBottomSheetFocus();
      runtimeState = {
        ...runtimeState,
        activeItemId: sourceItem.id,
      };
      stateListeners.forEach((listener) => listener(runtimeState));
      return true;
    };
    const syncProgress = (progress: number, whiteMix = 0): void => {
      const visibleWhiteMix = 0;
      const state = engine.setJourneyState(progress, visibleWhiteMix);
      runtimeState = {
        progress,
        whiteMix: visibleWhiteMix,
        activeItemId: state.activeItemId,
      };
      const activeSourceId = state.activeItemId?.split("__loop_")[0] ?? null;
      if (activeSourceId) {
        selectedSourceItemId = activeSourceId;
      }
      bottomSheet.setActiveItem(getSourceItem(activeSourceId) ?? getSelectedItem());
      syncBottomSheetFocus();
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
        sensitivity: BASE_SCROLL_SENSITIVITY * (project.journey.scrollStrength ?? 1),
        loop: project.journey.loop,
        onProgress: (state) => syncProgress(state.progress, state.whiteMix),
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
        selectedSourceItemId = currentProject.items[0]?.id ?? null;
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
      selectItem: (itemId: string) => selectSourceItem(itemId, "half"),
      selectItemAtClientPoint: (clientX: number, clientY: number) => {
        const itemId = engine.getClosestItemIdFromClientPoint(clientX, clientY);
        return itemId ? selectSourceItem(itemId, "half") : false;
      },
      nextItem: () => {
        if (currentProject.journey.loop && runtimeState.progress >= 0.999) {
          setRuntimeProgress(1);
          return true;
        }

        const next = getAdjacentItemProgress(itemProgress, bottomSheet.getModel().activeItemId, 1);
        if (!next) {
          if (currentProject.journey.loop) {
            setRuntimeProgress(1);
            return true;
          }

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
        syncBottomSheetFocus();
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
