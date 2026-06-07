import { B as y, C as R, G as P, b as f, I as T, J as x, R as E, d as S, e as M, f as L, g as h, h as A, i as p, c as B, j as I, k as G, l as v, a as C, n as F, o as _, p as D, q as b, r as j, s as w, m as U, t as k, u as O, w as V, v as Y } from "./mountGalleryRuntime-BaidRSMr.js";
import { M as J, T as Q, a as q, b as z, i as K, r as N } from "./architecturalTextureCatalog-Dh0fUe_M.js";
import { S as W, c as Z, m as $, n as ee, p as re } from "./ScrollixGallery-DYEi7ESO.js";
import { GalleryPlaygroundElement as te, defineGalleryPlaygroundElement as se } from "./playground.js";
const s = ["low", "medium", "high", "ultra"], u = (e) => 1e3 / Math.max(1, e), m = (e) => {
  const r = s.indexOf(e);
  return r > 0 ? s[r - 1] : null;
}, c = (e, r, o) => {
  if (e.length === 0)
    return {
      averageFrameTimeMs: 0,
      overBudget: !1,
      suggestedPreset: null
    };
  const a = e.reduce((i, n) => i + n.frameTimeMs, 0) / e.length, l = u(o), t = a > l * 1.18;
  return {
    averageFrameTimeMs: a,
    overBudget: t,
    suggestedPreset: t ? m(r) : null
  };
};
export {
  y as BottomSheetController,
  R as CorridorLayout,
  P as GalleryEngine,
  te as GalleryPlaygroundElement,
  f as GalleryRoomLayout,
  T as InfiniteCorridorLayout,
  x as JourneyController,
  J as MATERIAL_FAMILY_VALUES,
  E as Registry,
  S as RenderScheduler,
  M as RuntimeManager,
  W as ScrollixGallery,
  Q as TEXTURE_FAMILY_OPTIONS,
  q as TEXTURE_FAMILY_VALUES,
  z as TEXTURE_LIBRARY,
  c as assessFrameBudget,
  L as buildCameraKeyframes,
  h as buildItemProgressMap,
  Z as clampScrollixProgress,
  A as composeBottomSheetCamera,
  p as createArchitecturalBake,
  B as createBottomSheetView,
  I as createDefaultLayoutRegistry,
  G as createDefaultRendererRegistry,
  v as createDefaultRuntimeManager,
  C as createDesktopPanelView,
  F as createLayoutRegistry,
  _ as createRendererRegistry,
  se as defineGalleryPlaygroundElement,
  D as getAdjacentItemProgress,
  b as getCameraStateAtProgress,
  j as getDeviceProfile,
  u as getFrameBudgetMs,
  w as getItemProgress,
  m as getLowerQualityPreset,
  K as isTexturedMaterialFamily,
  U as mountGalleryRuntime,
  $ as mountScrollixGallery,
  ee as normalizeScrollixGalleryProject,
  k as planArchitecturalBake,
  re as premiumCorridorProject,
  O as resolveQuality,
  N as resolveTextureFamily,
  V as selectTextureSource,
  Y as validateGalleryProject
};
//# sourceMappingURL=index.js.map
