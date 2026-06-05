import { m as u, v as o } from "./mountGalleryRuntime-BTC_DqIO.js";
import { B, C, G as x, b as T, I as j, J as M, R as z, d as k, e as G, f as I, g as q, h as A, i as D, c as E, j as L, k as F, l as J, a as O, n as N, o as U, p as V, q as Q, r as K, s as W, t as _, u as H, w as X } from "./mountGalleryRuntime-BTC_DqIO.js";
const p = (e) => typeof e != "string" ? e : JSON.parse(e), s = (e) => {
  const t = o(p(e.project));
  return e.qualityOverride ? o({
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
    type: "corridor",
    spacing: 6.4,
    bounds: {
      width: 6.4,
      height: 3.65,
      depth: 72
    }
  },
  journey: {
    mode: "scroll",
    loop: !1,
    smoothing: 0.16,
    damping: 0.84,
    camera: {
      height: 1.68,
      fov: 46,
      lookAhead: 2.8
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
  const r = e.reduce((m, d) => m + d.frameTimeMs, 0) / e.length, c = h(a), i = r > c * 1.18;
  return {
    averageFrameTimeMs: r,
    overBudget: i,
    suggestedPreset: i ? f(t) : null
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
  k as RenderScheduler,
  G as RuntimeManager,
  w as ScrollixGallery,
  b as assessFrameBudget,
  I as buildCameraKeyframes,
  q as buildItemProgressMap,
  g as clampScrollixProgress,
  A as composeBottomSheetCamera,
  D as createArchitecturalBake,
  E as createBottomSheetView,
  L as createDefaultLayoutRegistry,
  F as createDefaultRendererRegistry,
  J as createDefaultRuntimeManager,
  O as createDesktopPanelView,
  N as createLayoutRegistry,
  U as createRendererRegistry,
  V as getAdjacentItemProgress,
  Q as getCameraStateAtProgress,
  K as getDeviceProfile,
  h as getFrameBudgetMs,
  W as getItemProgress,
  f as getLowerQualityPreset,
  u as mountGalleryRuntime,
  y as mountScrollixGallery,
  s as normalizeScrollixGalleryProject,
  _ as planArchitecturalBake,
  P as premiumCorridorProject,
  H as resolveQuality,
  X as selectTextureSource,
  o as validateGalleryProject
};
//# sourceMappingURL=index.js.map
