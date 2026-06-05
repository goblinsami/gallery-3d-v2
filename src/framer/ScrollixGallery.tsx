import type { GalleryProject } from "../types/GalleryProject";
import type { BottomSheetState } from "../types/Journey";
import type { QualityPreset } from "../types/Quality";
import type { RuntimeInstance } from "../types/Runtime";
import { mountGalleryRuntime } from "../runtime/mountGalleryRuntime";
import { validateGalleryProject } from "../utils/validateGalleryProject";

export interface ScrollixGalleryProps {
  project: GalleryProject | string;
  assetBaseUrl?: string;
  bottomSheetState?: BottomSheetState;
  initialProgress?: number;
  qualityOverride?: QualityPreset;
  autoStartJourney?: boolean;
}

export interface ScrollixGalleryMountOptions {
  container: HTMLElement;
  props: ScrollixGalleryProps;
  scrollElement?: HTMLElement;
}

export interface ScrollixGalleryAdapter {
  runtime: RuntimeInstance;
  update(props: ScrollixGalleryProps): Promise<void>;
  dispose(): void;
}

const parseProjectInput = (project: GalleryProject | string): unknown => {
  if (typeof project !== "string") {
    return project;
  }

  return JSON.parse(project) as unknown;
};

export const normalizeScrollixGalleryProject = (
  props: ScrollixGalleryProps,
): GalleryProject => {
  const validated = validateGalleryProject(parseProjectInput(props.project));
  if (!props.qualityOverride) {
    return validated;
  }

  return validateGalleryProject({
    ...validated,
    theme: {
      ...validated.theme,
      quality: props.qualityOverride,
    },
  });
};

export const clampScrollixProgress = (progress: number): number =>
  Math.min(Math.max(progress, 0), 1);

const applyInitialAdapterState = (
  runtime: RuntimeInstance,
  props: ScrollixGalleryProps,
): void => {
  if (props.bottomSheetState) {
    runtime.setBottomSheetState(props.bottomSheetState);
  }

  if (typeof props.initialProgress === "number") {
    runtime.setProgress(clampScrollixProgress(props.initialProgress));
  }
};

export const mountScrollixGallery = async (
  options: ScrollixGalleryMountOptions,
): Promise<ScrollixGalleryAdapter> => {
  const runtime = await mountGalleryRuntime({
    container: options.container,
    project: normalizeScrollixGalleryProject(options.props),
    assetBaseUrl: options.props.assetBaseUrl,
    scrollElement: options.scrollElement,
    autoStartJourney: options.props.autoStartJourney,
  });
  applyInitialAdapterState(runtime, options.props);

  return {
    runtime,
    update: async (props) => {
      await runtime.updateProject(normalizeScrollixGalleryProject(props));
      applyInitialAdapterState(runtime, props);
    },
    dispose: () => {
      runtime.dispose();
    },
  };
}

export const ScrollixGallery = mountScrollixGallery;
