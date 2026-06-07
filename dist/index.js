import { m as p, v as o } from "./mountGalleryRuntime-Di_qbToc.js";
import { B as v, C as E, G as j, b as M, I as x, J as I, R as B, d as L, e as A, f as C, g as k, h as G, i as q, c as z, j as F, k as D, l as O, a as U, n as _, o as J, p as V, q as N, r as Y, s as X, t as Q, u as K, w as W } from "./mountGalleryRuntime-Di_qbToc.js";
import { M as Z, T as $, a as ee, b as te, i as ae, r as re } from "./architecturalTextureCatalog-Dh0fUe_M.js";
import { GalleryPlaygroundElement as oe, defineGalleryPlaygroundElement as se } from "./playground.js";
const g = (e) => typeof e != "string" ? e : JSON.parse(e), s = (e) => {
  const t = o(g(e.project));
  return e.qualityOverride ? o({
    ...t,
    theme: {
      ...t.theme,
      quality: e.qualityOverride
    }
  }) : t;
}, u = (e) => Math.min(Math.max(e, 0), 1), l = (e, t) => {
  t.bottomSheetState && e.setBottomSheetState(t.bottomSheetState), typeof t.initialProgress == "number" && e.setProgress(u(t.initialProgress));
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
    },
    lighting: {
      ceilingLightIntensity: 1
    },
    items: {
      showBorders: !0
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
    artworkOverlayFramingMode: "balanced",
    loop: !0,
    smoothing: 0.16,
    damping: 0.84,
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
  v as BottomSheetController,
  E as CorridorLayout,
  j as GalleryEngine,
  oe as GalleryPlaygroundElement,
  M as GalleryRoomLayout,
  x as InfiniteCorridorLayout,
  I as JourneyController,
  Z as MATERIAL_FAMILY_VALUES,
  B as Registry,
  L as RenderScheduler,
  A as RuntimeManager,
  S as ScrollixGallery,
  $ as TEXTURE_FAMILY_OPTIONS,
  ee as TEXTURE_FAMILY_VALUES,
  te as TEXTURE_LIBRARY,
  P as assessFrameBudget,
  C as buildCameraKeyframes,
  k as buildItemProgressMap,
  u as clampScrollixProgress,
  G as composeBottomSheetCamera,
  q as createArchitecturalBake,
  z as createBottomSheetView,
  F as createDefaultLayoutRegistry,
  D as createDefaultRendererRegistry,
  O as createDefaultRuntimeManager,
  U as createDesktopPanelView,
  _ as createLayoutRegistry,
  J as createRendererRegistry,
  se as defineGalleryPlaygroundElement,
  V as getAdjacentItemProgress,
  N as getCameraStateAtProgress,
  Y as getDeviceProfile,
  h as getFrameBudgetMs,
  X as getItemProgress,
  f as getLowerQualityPreset,
  ae as isTexturedMaterialFamily,
  p as mountGalleryRuntime,
  y as mountScrollixGallery,
  s as normalizeScrollixGalleryProject,
  Q as planArchitecturalBake,
  b as premiumCorridorProject,
  K as resolveQuality,
  re as resolveTextureFamily,
  W as selectTextureSource,
  o as validateGalleryProject
};
//# sourceMappingURL=index.js.map
