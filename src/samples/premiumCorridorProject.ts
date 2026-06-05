import type { GalleryProject } from "../types/GalleryProject";

export const premiumCorridorProject: GalleryProject = {
  theme: {
    quality: "auto",
    atmosphere: "calm",
    materials: {
      primary: "wood",
      accent: "metal",
    },
  },
  layout: {
    type: "infinite-corridor",
    spacing: 14,
    bounds: {
      width: 8,
      height: 4.2,
      depth: 360,
    },
  },
  journey: {
    mode: "scroll",
    loop: true,
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
      lookAhead: 3.2,
    },
  },
  items: [
    {
      id: "station-intro",
      type: "statement",
      placement: {
        side: "center",
      },
      appearance: {
        size: "large",
        material: "concrete",
        lighting: "featured",
      },
      content: {
        eyebrow: "1/8 Station Template",
        title: "Creative Direction",
        description: "Template intro generated from a single GalleryProject.",
      },
    },
    {
      id: "portfolio-left",
      type: "artwork",
      placement: {
        side: "left",
      },
      appearance: {
        size: "medium",
        material: "metal",
      },
      content: {
        eyebrow: "Portfolio",
        title: "Campaign System",
        description: "Wall items pull the camera toward the surface instead of blocking the corridor.",
      },
    },
    {
      id: "launch-right",
      type: "quote",
      placement: {
        side: "right",
      },
      appearance: {
        size: "medium",
        material: "wood",
      },
      content: {
        eyebrow: "Statement",
        title: "Make the space tell the story before the UI does.",
        description: "The content layer stays synchronized with the camera journey.",
      },
    },
    {
      id: "station-services",
      type: "statement",
      placement: {
        side: "center",
      },
      appearance: {
        size: "large",
        lighting: "featured",
      },
      content: {
        eyebrow: "4/8 Station Template",
        title: "Brand Experience",
        description: "Central stations are crossed by the camera instead of treated like wall cards.",
      },
    },
    {
      id: "profile-left",
      type: "profile",
      placement: {
        side: "left",
      },
      appearance: {
        size: "medium",
        material: "wood",
      },
      content: {
        eyebrow: "Profile",
        title: "Founder Spotlight",
        description: "Profiles, quotes, images, CTAs and video share the same item contract.",
      },
    },
    {
      id: "video-right",
      type: "video",
      placement: {
        side: "right",
      },
      appearance: {
        size: "medium",
        material: "metal",
      },
      content: {
        eyebrow: "Motion",
        title: "Launch Film",
        description: "Video is an item type, not a separate gallery subsystem.",
      },
    },
    {
      id: "case-left",
      type: "image",
      placement: {
        side: "left",
      },
      appearance: {
        size: "medium",
        material: "metal",
      },
      content: {
        eyebrow: "Case Study",
        title: "Spatial Narrative",
        description: "The same runtime can present portfolios, launches and personal stories.",
      },
    },
    {
      id: "station-outro",
      type: "cta",
      placement: {
        side: "center",
      },
      appearance: {
        size: "large",
        lighting: "featured",
      },
      content: {
        eyebrow: "8/8 Station Template",
        title: "Build The Next Room",
        description: "Runtime adapters consume the same project object.",
      },
    },
  ],
};
