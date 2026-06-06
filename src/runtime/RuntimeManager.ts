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

const getLoopWhiteHoldProgress = (project: ValidatedGalleryProject): number => {
  const afterEndWindow = project.journey.loopWhiteAfterEndWindow ?? 0.14;
  return 1 + afterEndWindow;
};

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
    const hasHostWhiteOverlay = options.container.dataset.g3dHostWhiteOverlay === "true";
    const previousContainerPosition = options.container.style.position;
    const shouldOwnContainerPosition =
      !hasHostWhiteOverlay && window.getComputedStyle(options.container).position === "static";
    const whiteOverlay = hasHostWhiteOverlay ? null : document.createElement("div");

    if (shouldOwnContainerPosition) {
      options.container.style.position = "relative";
    }

    if (whiteOverlay) {
      whiteOverlay.setAttribute("aria-hidden", "true");
      Object.assign(whiteOverlay.style, {
        position: "absolute",
        inset: "0",
        zIndex: "10000",
        pointerEvents: "none",
        background: "#ffffff",
        opacity: "0",
        transition: "opacity 80ms linear",
        willChange: "opacity",
      });
      options.container.appendChild(whiteOverlay);
    }

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
      const visibleWhiteMix = currentProject.journey.loop ? whiteMix : 0;
      const state = engine.setJourneyState(progress, visibleWhiteMix);
      if (whiteOverlay) {
        whiteOverlay.style.setProperty("opacity", String(visibleWhiteMix), "important");
      }
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
        loop: project.journey.loop,
        loopWhiteAfterEndWindow: project.journey.loopWhiteAfterEndWindow,
        loopWhiteStartsBeforeEndWindow: project.journey.loopWhiteStartsBeforeEndWindow,
        loopWhiteFadeOutWindow: project.journey.loopWhiteFadeOutWindow,
        loopWhiteFadeOutRevealWindow: project.journey.loopWhiteFadeOutRevealWindow,
        loopProgressAdvanceDuringWhiteFadeOut: project.journey.loopProgressAdvanceDuringWhiteFadeOut,
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
          setRuntimeProgress(getLoopWhiteHoldProgress(currentProject));
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
        whiteOverlay?.remove();
        if (shouldOwnContainerPosition) {
          options.container.style.position = previousContainerPosition;
        }
        engine.dispose();
      },
    };
  }
}
