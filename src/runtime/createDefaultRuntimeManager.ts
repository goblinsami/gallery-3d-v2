import { createDefaultLayoutRegistry } from "../layouts/registerDefaultLayouts";
import { createDefaultRendererRegistry } from "../renderers/registerDefaultRenderers";
import { RuntimeManager } from "./RuntimeManager";

export const createDefaultRuntimeManager = (): RuntimeManager =>
  new RuntimeManager({
    renderers: createDefaultRendererRegistry(),
    layouts: createDefaultLayoutRegistry(),
  });
