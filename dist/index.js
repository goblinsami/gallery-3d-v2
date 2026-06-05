import { m as u, v as i } from "./mountGalleryRuntime-BunLrSbU.js";
import { B, C, G as x, b as T, I as j, J as M, R as z, d as W, e as k, f as A, g as E, h as F, i as G, c as D, j as I, k as O, l as q, a as L, n as J, o as N, p as U, q as V, r as Q, s as K, t as _, u as H, w as X } from "./mountGalleryRuntime-BunLrSbU.js";
const p = (e) => typeof e != "string" ? e : JSON.parse(e), s = (e) => {
  const t = i(p(e.project));
  return e.qualityOverride ? i({
    ...t,
    theme: {
      ...t.theme,
      quality: e.qualityOverride
    }
  }) : t;
}, g = (e) => Math.min(Math.max(e, 0), 1), n = (e, t) => {
  t.bottomSheetState && e.setBottomSheetState(t.bottomSheetState), typeof t.initialProgress == "number" && e.setProgress(g(t.initialProgress));
}, y = async (e) => {
  const t = await u({
    container: e.container,
    project: s(e.props),
    assetBaseUrl: e.props.assetBaseUrl,
    scrollElement: e.scrollElement,
    autoStartJourney: e.props.autoStartJourney
  });
  return n(t, e.props), {
    runtime: t,
    update: async (a) => {
      await t.updateProject(s(a)), n(t, a);
    },
    dispose: () => {
      t.dispose();
    }
  };
}, w = y, P = {
  theme: {
    quality: "auto",
    atmosphere: "calm",
    materials: {
      primary: "wood",
      accent: "metal"
    }
  },
  layout: {
    type: "infinite-corridor",
    spacing: 14,
    bounds: {
      width: 8,
      height: 4.2,
      depth: 360
    }
  },
  journey: {
    mode: "scroll",
    loop: !0,
    smoothing: 0.16,
    damping: 0.84,
    loopWhiteAfterEndWindow: 0.14,
    loopWhiteStartsBeforeEndWindow: 0.05,
    loopWhiteFadeOutRevealWindow: 0.12,
    loopWhiteFadeOutWindow: 0.22,
    loopProgressAdvanceDuringWhiteFadeOut: 0.18,
    camera: {
      height: 1.72,
      fov: 50,
      lookAhead: 3.2
    }
  },
  items: [
    {
      id: "station-intro",
      type: "statement",
      placement: {
        side: "center"
      },
      appearance: {
        size: "large",
        material: "concrete",
        lighting: "featured"
      },
      content: {
        eyebrow: "1/8 Station Template",
        title: "Creative Direction",
        description: "Template intro generated from a single GalleryProject."
      }
    },
    {
      id: "portfolio-left",
      type: "artwork",
      placement: {
        side: "left"
      },
      appearance: {
        size: "medium",
        material: "metal"
      },
      content: {
        eyebrow: "Portfolio",
        title: "Campaign System",
        description: "Wall items pull the camera toward the surface instead of blocking the corridor."
      }
    },
    {
      id: "launch-right",
      type: "quote",
      placement: {
        side: "right"
      },
      appearance: {
        size: "medium",
        material: "wood"
      },
      content: {
        eyebrow: "Statement",
        title: "Make the space tell the story before the UI does.",
        description: "The content layer stays synchronized with the camera journey."
      }
    },
    {
      id: "station-services",
      type: "statement",
      placement: {
        side: "center"
      },
      appearance: {
        size: "large",
        lighting: "featured"
      },
      content: {
        eyebrow: "4/8 Station Template",
        title: "Brand Experience",
        description: "Central stations are crossed by the camera instead of treated like wall cards."
      }
    },
    {
      id: "profile-left",
      type: "profile",
      placement: {
        side: "left"
      },
      appearance: {
        size: "medium",
        material: "wood"
      },
      content: {
        eyebrow: "Profile",
        title: "Founder Spotlight",
        description: "Profiles, quotes, images, CTAs and video share the same item contract."
      }
    },
    {
      id: "video-right",
      type: "video",
      placement: {
        side: "right"
      },
      appearance: {
        size: "medium",
        material: "metal"
      },
      content: {
        eyebrow: "Motion",
        title: "Launch Film",
        description: "Video is an item type, not a separate gallery subsystem."
      }
    },
    {
      id: "case-left",
      type: "image",
      placement: {
        side: "left"
      },
      appearance: {
        size: "medium",
        material: "metal"
      },
      content: {
        eyebrow: "Case Study",
        title: "Spatial Narrative",
        description: "The same runtime can present portfolios, launches and personal stories."
      }
    },
    {
      id: "station-outro",
      type: "cta",
      placement: {
        side: "center"
      },
      appearance: {
        size: "large",
        lighting: "featured"
      },
      content: {
        eyebrow: "8/8 Station Template",
        title: "Build The Next Room",
        description: "Runtime adapters consume the same project object."
      }
    }
  ]
}, l = ["low", "medium", "high", "ultra"], h = (e) => 1e3 / Math.max(1, e), f = (e) => {
  const t = l.indexOf(e);
  return t > 0 ? l[t - 1] : null;
}, b = (e, t, a) => {
  if (e.length === 0)
    return {
      averageFrameTimeMs: 0,
      overBudget: !1,
      suggestedPreset: null
    };
  const r = e.reduce((m, d) => m + d.frameTimeMs, 0) / e.length, c = h(a), o = r > c * 1.18;
  return {
    averageFrameTimeMs: r,
    overBudget: o,
    suggestedPreset: o ? f(t) : null
  };
};
export {
  B as BottomSheetController,
  C as CorridorLayout,
  x as GalleryEngine,
  T as GalleryRoomLayout,
  j as InfiniteCorridorLayout,
  M as JourneyController,
  z as Registry,
  W as RenderScheduler,
  k as RuntimeManager,
  w as ScrollixGallery,
  b as assessFrameBudget,
  A as buildCameraKeyframes,
  E as buildItemProgressMap,
  g as clampScrollixProgress,
  F as composeBottomSheetCamera,
  G as createArchitecturalBake,
  D as createBottomSheetView,
  I as createDefaultLayoutRegistry,
  O as createDefaultRendererRegistry,
  q as createDefaultRuntimeManager,
  L as createDesktopPanelView,
  J as createLayoutRegistry,
  N as createRendererRegistry,
  U as getAdjacentItemProgress,
  V as getCameraStateAtProgress,
  Q as getDeviceProfile,
  h as getFrameBudgetMs,
  K as getItemProgress,
  f as getLowerQualityPreset,
  u as mountGalleryRuntime,
  y as mountScrollixGallery,
  s as normalizeScrollixGalleryProject,
  _ as planArchitecturalBake,
  P as premiumCorridorProject,
  H as resolveQuality,
  X as selectTextureSource,
  i as validateGalleryProject
};
//# sourceMappingURL=index.js.map
