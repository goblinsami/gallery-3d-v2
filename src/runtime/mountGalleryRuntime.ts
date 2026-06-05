import type { GalleryProject } from "../types/GalleryProject";
import type { RuntimeInstance } from "../types/Runtime";
import { createDefaultRuntimeManager } from "./createDefaultRuntimeManager";

export interface MountGalleryRuntimeOptions {
  container: HTMLElement;
  project: GalleryProject;
  assetBaseUrl?: string;
  scrollElement?: HTMLElement;
  autoStartJourney?: boolean;
}

export const mountGalleryRuntime = async (
  options: MountGalleryRuntimeOptions,
): Promise<RuntimeInstance> => {
  const manager = createDefaultRuntimeManager();
  return manager.mount({
    container: options.container,
    project: options.project,
    assetBaseUrl: options.assetBaseUrl,
    scrollElement: options.scrollElement,
    autoStartJourney: options.autoStartJourney,
  });
};
