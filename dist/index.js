import { m as p, v as o } from "./mountGalleryRuntime-C-Z5-5xx.js";
import { B as R, C as B, G as x, b as C, I as E, J as T, R as k, d as G, e as M, f as q, g as z, h as I, i as W, c as A, j as D, k as F, l as L, a as O, n as J, o as N, p as V, q as U, r as Q, s as K, t as _, u as H, w as X } from "./mountGalleryRuntime-C-Z5-5xx.js";
import { GalleryPlaygroundElement as Z, defineGalleryPlaygroundElement as $ } from "./playground.js";
const u = (e) => typeof e != "string" ? e : JSON.parse(e), s = (e) => {
  const t = o(u(e.project));
  return e.qualityOverride ? o({
    ...t,
    theme: {
      ...t.theme,
      quality: e.qualityOverride
    }
  }) : t;
}, g = (e) => Math.min(Math.max(e, 0), 1), l = (e, t) => {
  t.bottomSheetState && e.setBottomSheetState(t.bottomSheetState), typeof t.initialProgress == "number" && e.setProgress(g(t.initialProgress));
}, y = async (e) => {
  const t = await p({
    container: e.container,
    project: s(e.props),
    assetBaseUrl: e.props.assetBaseUrl,
    scrollElement: e.scrollElement,
    autoStartJourney: e.props.autoStartJourney
  });
  return l(t, e.props), {
    runtime: t,
    update: async (a) => {
      await t.updateProject(s(a)), l(t, a);
    },
    dispose: () => {
      t.dispose();
    }
  };
}, S = y, b = {
  theme: {
    quality: "auto",
    atmosphere: "calm",
    materials: {
      primary: "stone",
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
    loopWhiteStartsBeforeEndWindow: 0,
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
        material: "metal",
        media: [{
          src: "/images/work1.jpg",
          type: "image",
          format: "jpg",
          quality: "high",
          alt: "Campaign visual from the public images library"
        }]
      },
      content: {
        eyebrow: "Portfolio",
        title: "Campaign System",
        description: "Wall items use real project imagery while the camera moves toward the surface."
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
      id: "identity-right",
      type: "artwork",
      placement: {
        side: "right"
      },
      appearance: {
        size: "medium",
        material: "metal",
        media: [{
          src: "/images/project4.png",
          type: "image",
          format: "png",
          quality: "high",
          alt: "Identity system artwork from public images"
        }]
      },
      content: {
        eyebrow: "Identity",
        title: "Modular Visual System",
        description: "PNG portfolio assets from public/images can be dropped into the same item contract."
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
        material: "metal",
        media: [{
          src: "/images/project2.png",
          type: "image",
          format: "png",
          quality: "high",
          alt: "Launch film poster from public images"
        }]
      },
      content: {
        eyebrow: "Motion",
        title: "Launch Film",
        description: "Video can carry a real poster image without becoming a separate gallery subsystem."
      }
    },
    {
      id: "editorial-left",
      type: "image",
      placement: {
        side: "left"
      },
      appearance: {
        size: "medium",
        material: "wood",
        media: [{
          src: "/images/work3.jpg",
          type: "image",
          format: "jpg",
          quality: "high",
          alt: "Editorial image from public images"
        }]
      },
      content: {
        eyebrow: "Editorial",
        title: "Tactile Direction",
        description: "Image stations can mix JPEG work samples with architectural materials."
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
        material: "metal",
        media: [{
          src: "/images/project3.png",
          type: "image",
          format: "png",
          quality: "high",
          alt: "Spatial narrative case image from public images"
        }]
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
}, n = ["low", "medium", "high", "ultra"], h = (e) => 1e3 / Math.max(1, e), f = (e) => {
  const t = n.indexOf(e);
  return t > 0 ? n[t - 1] : null;
}, P = (e, t, a) => {
  if (e.length === 0)
    return {
      averageFrameTimeMs: 0,
      overBudget: !1,
      suggestedPreset: null
    };
  const r = e.reduce((c, d) => c + d.frameTimeMs, 0) / e.length, m = h(a), i = r > m * 1.18;
  return {
    averageFrameTimeMs: r,
    overBudget: i,
    suggestedPreset: i ? f(t) : null
  };
};
export {
  R as BottomSheetController,
  B as CorridorLayout,
  x as GalleryEngine,
  Z as GalleryPlaygroundElement,
  C as GalleryRoomLayout,
  E as InfiniteCorridorLayout,
  T as JourneyController,
  k as Registry,
  G as RenderScheduler,
  M as RuntimeManager,
  S as ScrollixGallery,
  P as assessFrameBudget,
  q as buildCameraKeyframes,
  z as buildItemProgressMap,
  g as clampScrollixProgress,
  I as composeBottomSheetCamera,
  W as createArchitecturalBake,
  A as createBottomSheetView,
  D as createDefaultLayoutRegistry,
  F as createDefaultRendererRegistry,
  L as createDefaultRuntimeManager,
  O as createDesktopPanelView,
  J as createLayoutRegistry,
  N as createRendererRegistry,
  $ as defineGalleryPlaygroundElement,
  V as getAdjacentItemProgress,
  U as getCameraStateAtProgress,
  Q as getDeviceProfile,
  h as getFrameBudgetMs,
  K as getItemProgress,
  f as getLowerQualityPreset,
  p as mountGalleryRuntime,
  y as mountScrollixGallery,
  s as normalizeScrollixGalleryProject,
  _ as planArchitecturalBake,
  b as premiumCorridorProject,
  H as resolveQuality,
  X as selectTextureSource,
  o as validateGalleryProject
};
//# sourceMappingURL=index.js.map
