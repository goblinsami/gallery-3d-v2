import { B as y, C as R, G as P, b as f, I as x, J as S, R as T, d as E, e as M, f as A, g as I, h as L, i as h, c as p, j as B, k as v, l as G, a as C, n as F, o as _, p as D, q as b, r as j, s as w, t as U, m as k, u as O, w as V, x as Y, v as X } from "./mountGalleryRuntime-pxowlMJ0.js";
import { M as J, T as Q, a as z, b as K, i as N, r as H } from "./architecturalTextureCatalog-DMfVXQqA.js";
import { S as Z, c as $, m as ee, n as ae, p as re } from "./ScrollixGallery-C2fbU6YP.js";
import { GalleryPlaygroundElement as se, defineGalleryPlaygroundElement as oe } from "./playground.js";
const s = ["low", "medium", "high", "ultra"], u = (e) => 1e3 / Math.max(1, e), m = (e) => {
  const a = s.indexOf(e);
  return a > 0 ? s[a - 1] : null;
}, c = (e, a, o) => {
  if (e.length === 0)
    return {
      averageFrameTimeMs: 0,
      overBudget: !1,
      suggestedPreset: null
    };
  const r = e.reduce((i, n) => i + n.frameTimeMs, 0) / e.length, l = u(o), t = r > l * 1.18;
  return {
    averageFrameTimeMs: r,
    overBudget: t,
    suggestedPreset: t ? m(a) : null
  };
};
export {
  y as BottomSheetController,
  R as CorridorLayout,
  P as GalleryEngine,
  se as GalleryPlaygroundElement,
  f as GalleryRoomLayout,
  x as InfiniteCorridorLayout,
  S as JourneyController,
  J as MATERIAL_FAMILY_VALUES,
  T as Registry,
  E as RenderScheduler,
  M as RuntimeManager,
  Z as ScrollixGallery,
  Q as TEXTURE_FAMILY_OPTIONS,
  z as TEXTURE_FAMILY_VALUES,
  K as TEXTURE_LIBRARY,
  c as assessFrameBudget,
  A as buildCameraKeyframes,
  I as buildItemProgressMap,
  $ as clampScrollixProgress,
  L as composeBottomSheetCamera,
  h as createArchitecturalBake,
  p as createBottomSheetView,
  B as createDefaultLayoutRegistry,
  v as createDefaultRendererRegistry,
  G as createDefaultRuntimeManager,
  C as createDesktopPanelView,
  F as createLayoutRegistry,
  _ as createRendererRegistry,
  oe as defineGalleryPlaygroundElement,
  D as getAdjacentItemProgress,
  b as getCameraStateAtProgress,
  j as getDeviceProfile,
  u as getFrameBudgetMs,
  w as getItemProgress,
  m as getLowerQualityPreset,
  U as getSequentialActiveItemId,
  N as isTexturedMaterialFamily,
  k as mountGalleryRuntime,
  ee as mountScrollixGallery,
  ae as normalizeScrollixGalleryProject,
  O as planArchitecturalBake,
  re as premiumCorridorProject,
  V as resolveQuality,
  H as resolveTextureFamily,
  Y as selectTextureSource,
  X as validateGalleryProject
};
//# sourceMappingURL=index.js.map
