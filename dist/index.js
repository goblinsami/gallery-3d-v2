import { B as y, C as R, G as P, b as f, I as x, J as S, R as T, d as E, e as L, f as M, g as A, h as I, i as h, c as p, j as B, k as v, l as G, a as C, n as F, o as _, p as D, q as b, r as j, s as w, t as U, u as k, m as O, w as V, x as Y, y as X, v as q } from "./mountGalleryRuntime-BItnALnw.js";
import { M as Q, T as z, a as K, b as N, i as H, r as W } from "./architecturalTextureCatalog-DMfVXQqA.js";
import { S as $, c as ee, m as re, n as ae, p as te } from "./ScrollixGallery-Q8C_o9d9.js";
import { GalleryPlaygroundElement as oe, defineGalleryPlaygroundElement as le } from "./playground.js";
const s = ["low", "medium", "high", "ultra"], u = (e) => 1e3 / Math.max(1, e), m = (e) => {
  const r = s.indexOf(e);
  return r > 0 ? s[r - 1] : null;
}, g = (e, r, o) => {
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
  oe as GalleryPlaygroundElement,
  f as GalleryRoomLayout,
  x as InfiniteCorridorLayout,
  S as JourneyController,
  Q as MATERIAL_FAMILY_VALUES,
  T as Registry,
  E as RenderScheduler,
  L as RuntimeManager,
  $ as ScrollixGallery,
  z as TEXTURE_FAMILY_OPTIONS,
  K as TEXTURE_FAMILY_VALUES,
  N as TEXTURE_LIBRARY,
  g as assessFrameBudget,
  M as buildCameraKeyframes,
  A as buildItemProgressMap,
  ee as clampScrollixProgress,
  I as composeBottomSheetCamera,
  h as createArchitecturalBake,
  p as createBottomSheetView,
  B as createDefaultLayoutRegistry,
  v as createDefaultRendererRegistry,
  G as createDefaultRuntimeManager,
  C as createDesktopPanelView,
  F as createLayoutRegistry,
  _ as createRendererRegistry,
  le as defineGalleryPlaygroundElement,
  D as getAdjacentItemProgress,
  b as getCameraStateAtProgress,
  j as getDeviceProfile,
  u as getFrameBudgetMs,
  w as getItemProgress,
  U as getLoopResetProgress,
  m as getLowerQualityPreset,
  k as getSequentialActiveItemId,
  H as isTexturedMaterialFamily,
  O as mountGalleryRuntime,
  re as mountScrollixGallery,
  ae as normalizeScrollixGalleryProject,
  V as planArchitecturalBake,
  te as premiumCorridorProject,
  Y as resolveQuality,
  W as resolveTextureFamily,
  X as selectTextureSource,
  q as validateGalleryProject
};
//# sourceMappingURL=index.js.map
